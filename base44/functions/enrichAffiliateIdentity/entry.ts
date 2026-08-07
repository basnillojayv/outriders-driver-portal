import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function ghlGet(apiKey, locationId, path) {
  const url = `https://services.leadconnectorhq.com/affiliate-manager/${locationId}/${path}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28' },
  });
  const text = await res.text();
  console.log(`[GHL GET] ${path} → ${res.status}: ${text.slice(0, 600)}`);
  if (!res.ok) return null;
  return JSON.parse(text);
}

async function ghlGetAffiliateDetail(apiKey, locationId, affiliateId) {
  // Source of truth for referral links and public codes
  const url = `https://services.leadconnectorhq.com/affiliate-manager/affiliate-campaign/${locationId}/affiliates/${affiliateId}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28' },
  });
  const text = await res.text();
  console.log(`[GHL GET-DETAIL] ${url} → ${res.status}`);
  if (!res.ok) {
    console.log(`  Error: ${text.slice(0, 300)}`);
    return null;
  }
  const responseData = JSON.parse(text);
  
  // Response structure: { campaigns: [{...}], meta, traceId }
  // Extract the first campaign's affiliate data
  const campaigns = responseData.campaigns || [];
  if (campaigns.length > 0) {
    const campaignData = campaigns[0];
    console.log(`[GHL GET-DETAIL] Found ${campaigns.length} campaigns for affiliate ${affiliateId}`);
    console.log(`[GHL GET-DETAIL] campaigns[0] keys: ${Object.keys(campaignData).join(', ')}`);
    console.log(`[GHL GET-DETAIL] amId: ${campaignData.amId}, link: ${campaignData.link}`);
    return campaignData;
  }
  
  console.log(`[GHL GET-DETAIL] No campaigns found for affiliate ${affiliateId}`);
  return null;
}

async function ghlPost(apiKey, locationId, path, body) {
  const url = `https://services.leadconnectorhq.com/affiliate-manager/${locationId}/${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Version': '2021-07-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(`[GHL POST] ${path} → ${res.status}: ${text.slice(0, 600)}`);
  if (!res.ok) return null;
  return JSON.parse(text);
}

// Idempotency rule for RewardsTransaction:
//
// Unique event key:    member_id + balance_after (the resulting balance is the fingerprint)
// Duplicate check:    compare newCredits against the most recent transaction's balance_after
// Fields compared:    balance_after of the most recent transaction vs. incoming GHL total
//
// Scenarios:
//   GHL sends same total again  → lastBalance === newCredits → SKIP (no entry written)
//   GHL total increases         → delta > 0 → append event_type='earned', source='referral'
//   GHL total decreases         → delta < 0 → append event_type='adjusted', source='system'
//   No prior ledger entries     → lastBalance defaults to 0, delta = newCredits → first entry written
//
// Race condition note: if enrichAffiliateIdentity runs twice in parallel for the same member,
// both reads may see the same lastBalance before either write completes, producing two entries
// with the same balance_after. Acceptable at current low frequency (daily scheduled run).
// Mitigation: the daily automation runs as a single sequential job.
async function maybeAppendLedgerEntry(base44, member, newCredits) {
  const now = new Date().toISOString();

  // Fetch all transactions for this member, find the most recent balance_after
  const existing = await base44.asServiceRole.entities.RewardsTransaction.filter({ member_id: member.id });
  const lastBalance = existing && existing.length > 0
    ? existing.sort((a, b) => new Date(b.created_at || b.created_date) - new Date(a.created_at || a.created_date))[0].balance_after
    : 0;

  // Idempotency gate: same total = no new entry
  if (lastBalance === newCredits) {
    console.log(`[Ledger] No change for ${member.email} (balance=${newCredits}) — skipping`);
    return;
  }

  const delta = newCredits - lastBalance;
  // Positive delta = new referrals earned; negative delta = GHL reversal → adjusted
  const eventType = delta >= 0 ? 'earned' : 'adjusted';

  await base44.asServiceRole.entities.RewardsTransaction.create({
    member_id:     member.id,
    lhs_member_id: member.lhs_member_id || null,
    event_type:    eventType,
    source:        delta >= 0 ? 'referral' : 'system',
    credit_amount: delta,
    balance_after: newCredits,
    description:   `GHL sync: ${delta >= 0 ? '+' : ''}${delta} credits (${lastBalance} → ${newCredits})`,
    created_at:    now,
  });

  console.log(`[Ledger] Appended for ${member.email}: ${lastBalance} → ${newCredits} (delta=${delta}, type=${eventType})`);
}

async function audit(base44, fields) {
  try {
    await base44.asServiceRole.entities.AuditLog.create({
      actor: 'system',
      status: 'info',
      ...fields,
    });
  } catch (e) {
    console.warn('[AuditLog] Write failed (non-fatal):', e.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let isAuthorized = false;
    try {
      const user = await base44.auth.me();
      isAuthorized = user?.role === 'admin';
    } catch {
      isAuthorized = true;
    }
    if (!isAuthorized) return Response.json({ error: 'Admin only' }, { status: 403 });

    const apiKey = Deno.env.get('GHL_API_KEY');
    const locationId = Deno.env.get('GHL_LOCATION_ID');
    if (!apiKey || !locationId) return Response.json({ error: 'Missing secrets' }, { status: 500 });

    // Log sync started
    await audit(base44, {
      event_type: 'affiliate.sync_started',
      category: 'affiliate',
      status: 'info',
      message: 'Affiliate identity sync started',
    });

    // Fetch campaigns
    const campaignsData = await ghlGet(apiKey, locationId, 'campaigns?limit=50');
    const campaigns = campaignsData?.campaigns || campaignsData?.data || [];
    console.log(`[Affiliate] Campaigns found: ${campaigns.length}`);
    for (const c of campaigns) {
      console.log(`[Affiliate] Campaign: ${c._id || c.id} | ${c.name}`);
    }

    // Fetch all affiliates (top-level)
    const affiliatesData = await ghlGet(apiKey, locationId, 'affiliates?limit=100');
    const allAffiliates = affiliatesData?.affiliates || affiliatesData?.data || affiliatesData?.results || [];
    console.log(`[Affiliate] Top-level affiliates: ${allAffiliates.length}`);

    // POST /affiliates/search if GET returns nothing
    let searchAffiliates = [];
    if (allAffiliates.length === 0) {
      const searchData = await ghlPost(apiKey, locationId, 'affiliates/search', { limit: 100 });
      searchAffiliates = searchData?.affiliates || searchData?.data || [];
      console.log(`[Affiliate] Search affiliates: ${searchAffiliates.length}`);
    }

    // Fetch affiliates per campaign
    let campaignAffiliates = [];
    for (const campaign of campaigns) {
      const cid = campaign._id || campaign.id;
      const cdata = await ghlGet(apiKey, locationId, `campaigns/${cid}/affiliates?limit=100`);
      const caff = cdata?.affiliates || cdata?.data || [];
      console.log(`[Affiliate] Campaign ${campaign.name}: ${caff.length} affiliates`);
      campaignAffiliates.push(...caff);
    }

    const combined = [...allAffiliates, ...searchAffiliates, ...campaignAffiliates];
    const seen = new Set();
    const uniqueAffiliates = combined.filter(a => {
      const id = a._id || a.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    console.log(`[Affiliate] Unique affiliates total: ${uniqueAffiliates.length}`);
    if (uniqueAffiliates.length > 0) {
      console.log(`[Affiliate] Sample keys:`, Object.keys(uniqueAffiliates[0]).join(', '));
      console.log(`[Affiliate] Sample:`, JSON.stringify(uniqueAffiliates[0]).slice(0, 400));
    }

    // Build email map
    const affiliateByEmail = {};
    for (const aff of uniqueAffiliates) {
      const email = (aff.email || aff.contactEmail || '').toLowerCase().trim();
      if (email) affiliateByEmail[email] = aff;
    }

    // Process all active members:
    // - Members without affiliate_id: full lookup + metrics fetch
    // - Members with affiliate_id: metrics refresh + ledger delta check (idempotent)
    const allMembers = await base44.asServiceRole.entities.Member.list();
    const toEnrich = (allMembers || []).filter(m => m.membership_status === 'active');
    console.log(`[Affiliate] Active members to process: ${toEnrich.length}`);

    let matched = 0;
    let notFound = 0;
    const now = new Date().toISOString();

    for (const member of toEnrich) {
      const email = (member.email || '').toLowerCase().trim();
      const aff = affiliateByEmail[email];

      // Resolve affiliate record: use cached affiliate_id if already enriched,
      // otherwise look up from GHL by email
      const existingAffId = member.affiliate_id || null;
      const resolvedAff = aff || (existingAffId ? { _id: existingAffId, leads: member.affiliate_leads || 0, clicks: member.affiliate_clicks || 0, campaignIds: [member.affiliate_campaign_id] } : null);

      if (resolvedAff) {
        const affId = resolvedAff._id || resolvedAff.id || existingAffId;
        console.log(`[Affiliate] Processing ${member.email}, affiliateId=${affId}`);

        // Fetch affiliate detail from the canonical endpoint for referral link and public code
        const affiliateDetail = await ghlGetAffiliateDetail(apiKey, locationId, affId);

        // Tier 1: direct leads (from GHL affiliate record if available, else cached)
        // Note: GHL uses `lead` (singular) and `clickCount` not `leads`/`clicks`
        const tier1 = aff ? (aff.lead || 0) : (member.affiliate_leads || 0);

        // Tier 2: HYBRID HIERARCHY
        // Primary: GHL parentId endpoint (canonical for new signups auto-linked by GHL)
        // Secondary: Base44 members where affiliate_parent_id === affId (repaired historical/csv_import contacts)
        // De-dupe by affiliate_id so GHL and Base44 never double-count the same child.
        let tier2 = 0;
        let children = [];

        // Primary — GHL
        const childrenData = await ghlGet(apiKey, locationId, `affiliates?query=&limit=100&skip=0&parentId=${affId}&showSubAffiliateCount=true`);
        const ghlChildren = childrenData?.affiliates || childrenData?.data || [];

        // Secondary — Base44 repaired contacts
        const base44ChildMembers = (allMembers || []).filter(m => m.affiliate_parent_id === affId && m.affiliate_id);
        // Build lightweight child objects from Base44 members to merge with GHL children
        const base44Children = base44ChildMembers.map(m => ({
          _id: m.affiliate_id,
          lead: m.affiliate_leads || 0,
          _source: 'base44',
        }));

        // Merge and de-dupe by affiliate_id
        const seenChildIds = new Set();
        for (const child of [...ghlChildren, ...base44Children]) {
          const cid = child._id || child.id;
          if (cid && !seenChildIds.has(cid)) {
            seenChildIds.add(cid);
            children.push(child);
          }
        }

        console.log(`[Hybrid] ${member.email}: GHL children=${ghlChildren.length}, Base44 children=${base44Children.length}, merged=${children.length}`);
        for (const child of children) {
          tier2 += child.lead || 0;
        }

        // Tier 3: grandchildren's leads (same hybrid pattern per child)
        let tier3 = 0;
        for (const child of children) {
          const childId = child._id || child.id;

          // Primary — GHL grandchildren
          const grandchildData = await ghlGet(apiKey, locationId, `affiliates?query=&limit=100&skip=0&parentId=${childId}&showSubAffiliateCount=true`);
          const ghlGrandchildren = grandchildData?.affiliates || grandchildData?.data || [];

          // Secondary — Base44 grandchildren
          const base44GrandchildMembers = (allMembers || []).filter(m => m.affiliate_parent_id === childId && m.affiliate_id);
          const base44Grandchildren = base44GrandchildMembers.map(m => ({
            _id: m.affiliate_id,
            lead: m.affiliate_leads || 0,
            _source: 'base44',
          }));

          // Merge and de-dupe
          const seenGcIds = new Set();
          const grandchildren = [];
          for (const gc of [...ghlGrandchildren, ...base44Grandchildren]) {
            const gcId = gc._id || gc.id;
            if (gcId && !seenGcIds.has(gcId)) {
              seenGcIds.add(gcId);
              grandchildren.push(gc);
            }
          }

          for (const gc of grandchildren) {
            tier3 += gc.lead || 0;
          }
        }

        const totalCredits = tier1 + tier2 + tier3;
        console.log(`[Affiliate] ${member.email} T1:${tier1} T2:${tier2} T3:${tier3} total:${totalCredits}`);

        // Update Member cache fields (fast read path for UI)
        // NOTE: affiliate_parent_id is intentionally NOT overwritten here.
        // GHL affiliate records do not expose a parentAffiliateId field.
        // Parent links are set by: (a) ghlWebhook attribution capture at signup,
        // or (b) the one-time migrateAttributionParentLinks migration for csv_import contacts.
        // Overwriting here would erase those links on every sync.
        const ghlParentId = resolvedAff.parentAffiliateId || null;
        const updatePayload = {
          affiliate_leads:         tier1,
          affiliate_tier2_leads:   tier2,
          affiliate_tier3_leads:   tier3,
          affiliate_children_ids:  JSON.stringify(children.map(c => c._id || c.id)),
          affiliate_lookup_status: 'found',
          affiliate_enriched_at:   now,
          network_leads:           totalCredits,
          affiliate_credits:       totalCredits,
          affiliate_id:            affId,
          // Only write affiliate_parent_id if GHL explicitly provides one;
          // never null it out (preserves migration-set and webhook-set values).
          ...(ghlParentId ? { affiliate_parent_id: ghlParentId } : {}),
          affiliate_sub_count:     children.length,
        };
        // Set campaign ID only on first enrichment
        if (!existingAffId && aff) {
          updatePayload.affiliate_campaign_id = aff.campaignIds?.[0] || campaigns[0]?._id || null;
          updatePayload.affiliate_clicks = aff.clickCount || 0;
        }
        // Always fetch and store public code, referral link, and raw campaign data from canonical affiliate-campaign endpoint
        if (affiliateDetail) {
          // affiliateDetail is campaigns[0] from the response
          updatePayload.affiliate_public_code = affiliateDetail.amId || null;
          updatePayload.affiliate_public_codes = JSON.stringify(affiliateDetail.amIds || []);
          updatePayload.affiliate_referral_link = affiliateDetail.link || null;
          updatePayload.affiliate_campaign_data = JSON.stringify(affiliateDetail);
          console.log(`[Affiliate] ${member.email} → id: ${affId}, code: ${affiliateDetail.amId}, link: ${affiliateDetail.link}`);
        }
        // Store afCampaign array from affiliate record if present
        if (aff?.afCampaign) {
          updatePayload.affiliate_af_campaign = JSON.stringify(aff.afCampaign);
        }
        await base44.asServiceRole.entities.Member.update(member.id, updatePayload);

        // Append to ledger only if credit total changed — idempotent, append-only
        await maybeAppendLedgerEntry(base44, member, totalCredits);

        matched++;
        console.log(`[Affiliate] Processed: ${member.email} → ${affId} (${existingAffId ? 'refresh' : 'first-match'})`);
      } else {
        await base44.asServiceRole.entities.Member.update(member.id, {
          affiliate_lookup_status: 'not_found',
          affiliate_enriched_at:   now,
        });
        notFound++;
        console.log(`[Affiliate] No match: ${member.email}`);
      }
    }

    await audit(base44, {
      event_type: 'affiliate.sync_completed',
      category: 'affiliate',
      status: 'success',
      message: `Affiliate sync completed — ${matched} matched, ${notFound} not found, ${toEnrich.length} processed`,
      metadata_json: JSON.stringify({ members_processed: toEnrich.length, matched, not_found: notFound, campaigns_found: campaigns.length }),
    });

    return Response.json({
      success: true,
      campaigns_found: campaigns.length,
      ghl_affiliates_fetched: uniqueAffiliates.length,
      members_processed: toEnrich.length,
      matched,
      not_found: notFound,
    });

  } catch (err) {
    console.error('[enrichAffiliateIdentity] Error:', err.message);
    try {
      const base44Err = createClientFromRequest(req);
      await audit(base44Err, {
        event_type: 'affiliate.sync_failed',
        category: 'affiliate',
        status: 'failure',
        message: `Affiliate sync failed: ${err.message}`,
        metadata_json: JSON.stringify({ error: err.message }),
      });
    } catch {}
    return Response.json({ error: err.message }, { status: 500 });
  }
});
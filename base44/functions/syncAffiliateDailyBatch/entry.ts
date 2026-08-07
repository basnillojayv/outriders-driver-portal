import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Daily affiliate sync automation for all active members.
 * - Fetches GHL affiliate data once
 * - Processes all active members (new and existing)
 * - Appends idempotent ledger entries only if credits changed
 * - Logs comprehensive sync summary without exposing secrets
 * - Designed to run as a scheduled daily job
 */

async function ghlGet(apiKey: string, locationId: string, path: string) {
  const url = `https://services.leadconnectorhq.com/affiliate-manager/${locationId}/${path}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28' },
  });
  if (!res.ok) {
    console.log(`[GHL] GET ${path} → ${res.status}`);
    return null;
  }
  const data = await res.json();
  return data;
}

async function ghlGetSubAffiliates(apiKey: string, locationId: string, affId: string) {
  const data = await ghlGet(apiKey, locationId, `affiliates/${affId}/sub-affiliates?limit=100`);
  return data?.affiliates || data?.data || data?.subAffiliates || [];
}

interface SyncStats {
  members_processed: number;
  affiliates_matched: number;
  affiliates_not_found: number;
  credits_increased: number;
  credits_decreased: number;
  no_change: number;
  ledger_entries_created: number;
  errors: number;
  start_time: string;
  end_time: string;
  duration_seconds: number;
}

Deno.serve(async (req) => {
  const startTime = new Date();
  const stats: SyncStats = {
    members_processed: 0,
    affiliates_matched: 0,
    affiliates_not_found: 0,
    credits_increased: 0,
    credits_decreased: 0,
    no_change: 0,
    ledger_entries_created: 0,
    errors: 0,
    start_time: startTime.toISOString(),
    end_time: '',
    duration_seconds: 0,
  };

  try {
    const base44 = createClientFromRequest(req);

    // Verify admin or scheduled automation
    let isAuthorized = false;
    try {
      const user = await base44.auth.me();
      isAuthorized = user?.role === 'admin';
    } catch {
      // Automation runs without user context, so this is expected
      isAuthorized = true;
    }
    if (!isAuthorized) {
      return Response.json({ error: 'Admin only', stats }, { status: 403 });
    }

    const apiKey = Deno.env.get('GHL_API_KEY');
    const locationId = Deno.env.get('GHL_LOCATION_ID');
    if (!apiKey || !locationId) {
      stats.errors++;
      return Response.json({ error: 'Missing GHL secrets', stats }, { status: 500 });
    }

    console.log('[DailySync] Starting affiliate batch sync...');

    // Fetch campaigns once
    const campaignsData = await ghlGet(apiKey, locationId, 'campaigns?limit=50');
    const campaigns = campaignsData?.campaigns || campaignsData?.data || [];

    // Fetch all affiliates from multiple GHL endpoints
    const affiliatesData = await ghlGet(apiKey, locationId, 'affiliates?limit=100');
    const allAffiliates = affiliatesData?.affiliates || affiliatesData?.data || affiliatesData?.results || [];

    // Fallback: POST /affiliates/search
    let searchAffiliates = [];
    if (allAffiliates.length === 0) {
      const searchData = await ghlGet(apiKey, locationId, 'affiliates/search');
      searchAffiliates = searchData?.affiliates || searchData?.data || [];
    }

    // Fetch per-campaign affiliates
    let campaignAffiliates = [];
    for (const campaign of campaigns) {
      const cid = campaign._id || campaign.id;
      const cdata = await ghlGet(apiKey, locationId, `campaigns/${cid}/affiliates?limit=100`);
      const caff = cdata?.affiliates || cdata?.data || [];
      campaignAffiliates.push(...caff);
    }

    // Deduplicate
    const combined = [...allAffiliates, ...searchAffiliates, ...campaignAffiliates];
    const seen = new Set();
    const uniqueAffiliates = combined.filter(a => {
      const id = a._id || a.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    console.log(`[DailySync] GHL data loaded: ${campaigns.length} campaigns, ${uniqueAffiliates.length} unique affiliates`);

    // Build email → affiliate map
    const affiliateByEmail: Record<string, any> = {};
    for (const aff of uniqueAffiliates) {
      const email = (aff.email || aff.contactEmail || '').toLowerCase().trim();
      if (email) affiliateByEmail[email] = aff;
    }

    // Fetch all active members
    const allMembers = await base44.asServiceRole.entities.Member.list();
    const activeMembers = (allMembers || []).filter(m => m.membership_status === 'active');
    stats.members_processed = activeMembers.length;

    console.log(`[DailySync] Processing ${activeMembers.length} active members...`);

    // Process each active member
    for (const member of activeMembers) {
      try {
        const email = (member.email || '').toLowerCase().trim();
        const aff = affiliateByEmail[email];
        const existingAffId = member.affiliate_id || null;
        const resolvedAff = aff || (existingAffId ? { _id: existingAffId } : null);

        if (!resolvedAff) {
          stats.affiliates_not_found++;
          await base44.asServiceRole.entities.Member.update(member.id, {
            affiliate_lookup_status: 'not_found',
            affiliate_enriched_at: new Date().toISOString(),
          });
          continue;
        }

        stats.affiliates_matched++;
        const affId = resolvedAff._id || resolvedAff.id || existingAffId;

        // Calculate 3-tier network
        const tier1 = aff ? (aff.leads || 0) : (member.affiliate_leads || 0);
        let tier2 = 0;
        let tier3 = 0;

        const children = await ghlGetSubAffiliates(apiKey, locationId, affId);
        for (const child of children) {
          tier2 += child.leads || 0;

          const grandchildren = await ghlGetSubAffiliates(apiKey, locationId, child._id || child.id);
          for (const gc of grandchildren) {
            tier3 += gc.leads || 0;
          }
        }

        const totalCredits = tier1 + tier2 + tier3;

        // Fetch current ledger to check idempotency
        const existing = await base44.asServiceRole.entities.RewardsTransaction.filter({ member_id: member.id });
        const lastBalance = existing && existing.length > 0
          ? existing.sort((a: any, b: any) => new Date(b.created_at || b.created_date).getTime() - new Date(a.created_at || a.created_date).getTime())[0].balance_after
          : 0;

        // Update Member cache fields
        const now = new Date().toISOString();
        const updatePayload: any = {
          affiliate_leads: tier1,
          affiliate_tier2_leads: tier2,
          affiliate_tier3_leads: tier3,
          affiliate_children_ids: JSON.stringify(children.map(c => c._id || c.id)),
          affiliate_lookup_status: 'found',
          affiliate_enriched_at: now,
          network_leads: totalCredits,
          affiliate_credits: totalCredits,
        };

        // Only set identity fields on first enrichment
        if (!existingAffId && aff) {
          updatePayload.affiliate_id = affId;
          updatePayload.affiliate_referral_link = `https://membership.linehaulstation.com/join?am_id=${affId}`;
          updatePayload.affiliate_campaign_id = aff.campaignIds?.[0] || campaigns[0]?._id || null;
          updatePayload.affiliate_clicks = aff.clicks || 0;
        }

        await base44.asServiceRole.entities.Member.update(member.id, updatePayload);

        // Append ledger entry only if credits changed
        if (lastBalance === totalCredits) {
          stats.no_change++;
        } else {
          const delta = totalCredits - lastBalance;
          const eventType = delta > 0 ? 'earned' : 'adjusted';

          await base44.asServiceRole.entities.RewardsTransaction.create({
            member_id: member.id,
            lhs_member_id: member.lhs_member_id || null,
            event_type: eventType,
            source: delta > 0 ? 'referral' : 'system',
            credit_amount: delta,
            balance_after: totalCredits,
            description: `Daily sync: ${delta > 0 ? '+' : ''}${delta} credits (${lastBalance} → ${totalCredits})`,
            created_at: now,
          });

          stats.ledger_entries_created++;
          if (delta > 0) {
            stats.credits_increased++;
          } else {
            stats.credits_decreased++;
          }
        }
      } catch (memberErr) {
        stats.errors++;
        console.error(`[DailySync] Error processing member ${member.email}:`, memberErr.message);
      }
    }

    const endTime = new Date();
    stats.end_time = endTime.toISOString();
    stats.duration_seconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

    console.log(`[DailySync] ✓ Sync complete in ${stats.duration_seconds}s`);
    console.log(`[DailySync] Summary: ${stats.members_processed} members, ${stats.affiliates_matched} matched, ${stats.ledger_entries_created} ledger entries created`);

    // Alert if there were processing errors during the sync
    if (stats.errors > 0) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'karrie@linehaulstation.com',
        from_name: 'LineHaul Station System',
        subject: `⚠️ Daily GHL Sync Alert — ${stats.errors} error(s) encountered`,
        body: `The daily affiliate sync completed with ${stats.errors} error(s).\n\nSummary:\n• Members processed: ${stats.members_processed}\n• Matched to GHL: ${stats.affiliates_matched}\n• Not found in GHL: ${stats.affiliates_not_found}\n• Errors: ${stats.errors}\n• Duration: ${stats.duration_seconds}s\n\nPlease check the function logs for details on which members failed.`,
      });
      console.log(`[DailySync] Alert email sent for ${stats.errors} errors`);
    }

    return Response.json({ success: true, stats });
  } catch (err) {
    stats.errors++;
    stats.end_time = new Date().toISOString();
    stats.duration_seconds = Math.round((new Date().getTime() - startTime.getTime()) / 1000);

    console.error('[DailySync] Fatal error:', err.message);

    try {
      const base44Fatal = createClientFromRequest(req);
      await base44Fatal.asServiceRole.integrations.Core.SendEmail({
        to: 'karrie@linehaulstation.com',
        from_name: 'LineHaul Station System',
        subject: `🔴 Daily GHL Sync FAILED`,
        body: `The daily affiliate sync crashed with a fatal error.\n\nError: ${err.message}\n\nThe sync did not complete. Please check the system and retry manually.`,
      });
    } catch (_) { /* don't let email failure mask the original error */ }

    return Response.json({ error: err.message, stats }, { status: 500 });
  }
});
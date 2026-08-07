import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function memberLabel(m) {
  const name = `${m.first_name || ''} ${m.last_name || ''}`.trim();
  return { name: name || m.email, email: m.email, joined: m.agreement_signed_at || m.created_date };
}

function parseIds(jsonStr) {
  try { return JSON.parse(jsonStr || '[]'); } catch { return []; }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const members = await base44.asServiceRole.entities.Member.filter({ email: user.email });
    if (!members || members.length === 0) return Response.json({ error: 'Member record not found' }, { status: 404 });
    const member = members[0];

    if (!member.affiliate_id) return Response.json({ affiliate: null });

    // Credits: prefer ledger sum, fall back to GHL cache
    const transactions = await base44.asServiceRole.entities.RewardsTransaction.filter({ member_id: member.id });
    const ledgerActive = transactions && transactions.length > 0;
    let credits, creditSource;
    if (ledgerActive) {
      credits = transactions.reduce((sum, tx) => sum + (tx.credit_amount || 0), 0);
      creditSource = 'ledger';
    } else {
      credits = member.affiliate_credits || 0;
      creditSource = 'ghl_cache';
    }

    // Load all members and build affiliate_id → member map
    const allMembers = await base44.asServiceRole.entities.Member.list();
    const memberByAffId = {};
    for (const m of allMembers) {
      if (m.affiliate_id) memberByAffId[m.affiliate_id] = m;
    }

    // Tier 1: direct children from affiliate_children_ids
    const t1Ids = parseIds(member.affiliate_children_ids);
    const tier1Members = t1Ids
      .map(id => memberByAffId[id])
      .filter(Boolean)
      .map(memberLabel);

    // Tier 2: children of tier-1 members
    const t2Ids = [];
    for (const affId of t1Ids) {
      const t1Member = memberByAffId[affId];
      if (t1Member) {
        const children = parseIds(t1Member.affiliate_children_ids);
        t2Ids.push(...children);
      }
    }
    const tier2Members = t2Ids
      .map(id => memberByAffId[id])
      .filter(Boolean)
      .map(memberLabel);

    // Tier 3: children of tier-2 members
    const t3Ids = [];
    for (const affId of t2Ids) {
      const t2Member = memberByAffId[affId];
      if (t2Member) {
        const children = parseIds(t2Member.affiliate_children_ids);
        t3Ids.push(...children);
      }
    }
    const tier3Members = t3Ids
      .map(id => memberByAffId[id])
      .filter(Boolean)
      .map(memberLabel);

    return Response.json({
      affiliate: {
        id:           member.affiliate_id,
        referralLink: member.affiliate_referral_link || `https://membership.linehaulstation.com/join?am_id=${member.affiliate_id}`,
        campaignId:   member.affiliate_campaign_id || null,
        clicks:       member.affiliate_clicks || 0,
        leads:        member.affiliate_leads || 0,
        tier2Leads:   member.affiliate_tier2_leads || 0,
        tier3Leads:   member.affiliate_tier3_leads || 0,
        credits,
        creditSource,
        networkLeads: (member.affiliate_tier2_leads || 0) + (member.affiliate_tier3_leads || 0),
        enrichedAt:   member.affiliate_enriched_at || null,
        campaignName: 'Top 10 Truckers',
        tier1Members,
        tier2Members,
        tier3Members,
      },
    });
  } catch (err) {
    console.error('[getAffiliateCampaignData] Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ONE-TIME MIGRATION — HIGH CONFIDENCE ONLY
//
// Applies affiliate_parent_id to Members where:
//   - first_attribution_medium === 'csv_import'
//   - lastAttributionSource.url contains a valid am_id
//   - am_id resolves to a known Member.affiliate_public_code
//   - proposed parent is not the member themselves
//
// Writes ONLY affiliate_parent_id on the child Member record.
// Does NOT modify affiliate_children_ids (enrichAffiliateIdentity handles that).
// Logs every proposed write before executing it.
// After all writes, invokes enrichAffiliateIdentity to rebuild hierarchy metrics.

const WATCH_EMAILS = ['jj@linehaulstation.com', 'js@linehaulstation.com', 'trevor@linehaulstation.com'];

function extractAmId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get('am_id') || null;
  } catch {
    const match = url.match(/[?&]am_id=([^&]+)/);
    return match ? match[1] : null;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const apiKey = Deno.env.get('GHL_API_KEY');
    const locationId = Deno.env.get('GHL_LOCATION_ID');
    if (!apiKey || !locationId) return Response.json({ error: 'Missing secrets' }, { status: 500 });

    // Load all members
    const allMembers = await base44.asServiceRole.entities.Member.list();

    // Build public_code → member map
    const memberByPublicCode = {};
    for (const m of allMembers) {
      if (m.affiliate_public_code) {
        memberByPublicCode[m.affiliate_public_code.toLowerCase().trim()] = m;
      }
      if (m.affiliate_public_codes) {
        try {
          const codes = JSON.parse(m.affiliate_public_codes);
          for (const code of codes) {
            if (code) memberByPublicCode[code.toLowerCase().trim()] = m;
          }
        } catch {}
      }
    }

    // Snapshot WATCH_EMAILS before any writes
    const beforeSnapshot = {};
    for (const m of allMembers) {
      if (WATCH_EMAILS.includes(m.email?.toLowerCase())) {
        beforeSnapshot[m.email.toLowerCase()] = {
          id: m.id,
          lhs_member_id: m.lhs_member_id,
          affiliate_id: m.affiliate_id,
          affiliate_parent_id: m.affiliate_parent_id || null,
          affiliate_children_ids: m.affiliate_children_ids || null,
          affiliate_leads: m.affiliate_leads,
          affiliate_tier2_leads: m.affiliate_tier2_leads,
          affiliate_tier3_leads: m.affiliate_tier3_leads,
          affiliate_credits: m.affiliate_credits,
        };
      }
    }

    // Candidates: no parent, enrolled as affiliate, has GHL contact
    const candidates = allMembers.filter(m =>
      !m.affiliate_parent_id &&
      m.ghl_contact_id &&
      m.affiliate_id
    );

    console.log(`[Migration] Candidates: ${candidates.length}`);

    const migrationLog = [];
    let applied = 0;
    let skipped = 0;

    for (const member of candidates) {
      let lastAttributionUrl = null;
      let firstAttributionMedium = null;

      try {
        const res = await fetch(
          `https://services.leadconnectorhq.com/contacts/${member.ghl_contact_id}`,
          { headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28' } }
        );
        if (res.ok) {
          const json = await res.json();
          const contact = json.contact || json;
          lastAttributionUrl = contact.lastAttributionSource?.url || null;
          firstAttributionMedium = contact.attributionSource?.medium || null;
        } else {
          console.log(`[Migration] SKIP ${member.email} — GHL contact fetch failed: HTTP ${res.status}`);
          migrationLog.push({ email: member.email, action: 'skipped', reason: `GHL fetch HTTP ${res.status}` });
          skipped++;
          continue;
        }
      } catch (e) {
        console.log(`[Migration] SKIP ${member.email} — GHL contact fetch error: ${e.message}`);
        migrationLog.push({ email: member.email, action: 'skipped', reason: e.message });
        skipped++;
        continue;
      }

      // HIGH confidence gate — all rules must pass
      if (firstAttributionMedium !== 'csv_import') {
        console.log(`[Migration] SKIP ${member.email} — firstTouch is "${firstAttributionMedium}", not csv_import`);
        migrationLog.push({ email: member.email, action: 'skipped', reason: `firstTouch="${firstAttributionMedium}" — not csv_import` });
        skipped++;
        continue;
      }

      const amId = extractAmId(lastAttributionUrl);
      if (!amId) {
        console.log(`[Migration] SKIP ${member.email} — no am_id in lastAttributionSource.url`);
        migrationLog.push({ email: member.email, action: 'skipped', reason: 'no am_id in lastAttributionSource.url' });
        skipped++;
        continue;
      }

      const proposedParent = memberByPublicCode[amId.toLowerCase().trim()] || null;
      if (!proposedParent) {
        console.log(`[Migration] SKIP ${member.email} — am_id "${amId}" has no matching Member.affiliate_public_code`);
        migrationLog.push({ email: member.email, action: 'skipped', reason: `am_id "${amId}" not found in affiliate_public_code index` });
        skipped++;
        continue;
      }

      if (!proposedParent.affiliate_id) {
        console.log(`[Migration] SKIP ${member.email} — proposed parent ${proposedParent.email} has no affiliate_id`);
        migrationLog.push({ email: member.email, action: 'skipped', reason: `proposed parent ${proposedParent.email} has no affiliate_id` });
        skipped++;
        continue;
      }

      if (proposedParent.id === member.id) {
        console.log(`[Migration] SKIP ${member.email} — self-referral, skipping`);
        migrationLog.push({ email: member.email, action: 'skipped', reason: 'self-referral' });
        skipped++;
        continue;
      }

      // Pre-write log
      const logEntry = {
        email: member.email,
        lhs_member_id: member.lhs_member_id,
        member_id: member.id,
        action: 'write',
        before: { affiliate_parent_id: null },
        after: { affiliate_parent_id: proposedParent.affiliate_id },
        proposed_parent_email: proposedParent.email,
        proposed_parent_lhs_id: proposedParent.lhs_member_id,
        proposed_parent_affiliate_id: proposedParent.affiliate_id,
        first_attribution_medium: firstAttributionMedium,
        last_attribution_am_id: amId,
        confidence: 'high',
      };
      console.log(`[Migration] PRE-WRITE: ${member.email} → affiliate_parent_id = ${proposedParent.affiliate_id} (parent: ${proposedParent.email})`);

      // Write ONLY affiliate_parent_id
      await base44.asServiceRole.entities.Member.update(member.id, {
        affiliate_parent_id: proposedParent.affiliate_id,
      });

      logEntry.written_at = new Date().toISOString();
      console.log(`[Migration] WRITTEN: ${member.email}`);
      migrationLog.push(logEntry);
      applied++;
    }

    console.log(`[Migration] Done. Applied: ${applied}, Skipped: ${skipped}`);
    console.log(`[Migration] Invoking enrichAffiliateIdentity to rebuild hierarchy metrics...`);

    // Run enrichAffiliateIdentity to rebuild all hierarchy metrics
    let enrichResult = null;
    try {
      enrichResult = await base44.asServiceRole.functions.invoke('enrichAffiliateIdentity', {});
      console.log(`[Migration] enrichAffiliateIdentity complete: ${JSON.stringify(enrichResult).slice(0, 200)}`);
    } catch (e) {
      console.log(`[Migration] enrichAffiliateIdentity error: ${e.message}`);
      enrichResult = { error: e.message };
    }

    // Snapshot WATCH_EMAILS after writes + enrichment
    const allMembersAfter = await base44.asServiceRole.entities.Member.list();
    const afterSnapshot = {};
    for (const m of allMembersAfter) {
      if (WATCH_EMAILS.includes(m.email?.toLowerCase())) {
        afterSnapshot[m.email.toLowerCase()] = {
          id: m.id,
          lhs_member_id: m.lhs_member_id,
          affiliate_id: m.affiliate_id,
          affiliate_parent_id: m.affiliate_parent_id || null,
          affiliate_children_ids: m.affiliate_children_ids || null,
          affiliate_leads: m.affiliate_leads,
          affiliate_tier2_leads: m.affiliate_tier2_leads,
          affiliate_tier3_leads: m.affiliate_tier3_leads,
          affiliate_credits: m.affiliate_credits,
        };
      }
    }

    // Build before/after comparison for watched members
    const watchReport = WATCH_EMAILS.map(email => ({
      email,
      before: beforeSnapshot[email] || null,
      after: afterSnapshot[email] || null,
    }));

    return Response.json({
      migration: 'migrateAttributionParentLinks',
      confidence_applied: 'high_only',
      applied,
      skipped,
      enrich_result: enrichResult,
      migration_log: migrationLog,
      watch_report: watchReport,
    });

  } catch (err) {
    console.error('[migrateAttributionParentLinks] Fatal:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
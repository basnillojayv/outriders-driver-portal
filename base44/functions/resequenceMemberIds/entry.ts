import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ─── One-time Member ID resequencing ─────────────────────────────────────────
// Business rules:
//   • Jeff Swenson (js@linehaulstation.com) is manually pinned to 2201-00001.
//   • Every OTHER member gets a new YYMM-##### ID where:
//       YY/MM = two-digit year + month of the member's agreement_signed_at
//       #####  = 5-digit sequential number within that calendar month,
//                assigned in chronological order of agreement signing
//                (ties broken by Base44 created_date).
//   • The new ID overwrites lhs_member_id permanently and is written back to the
//     GHL custom field (GHL_MEMBER_ID_FIELD_ID).
//   • MemberIdCounter records are reconciled so future webhook generation
//     continues from the correct sequence.

const JEFF_EMAIL = 'js@linehaulstation.com';
const JEFF_OVERRIDE_ID = '2201-00001';

async function writeBackToGHL(ghlContactId, memberId, apiKey, fieldId) {
  if (!fieldId) {
    console.warn('[GHL Writeback] GHL_MEMBER_ID_FIELD_ID not set — skipping');
    return false;
  }
  const fieldKey = fieldId.startsWith('contact.') ? fieldId.slice('contact.'.length) : fieldId;
  const res = await fetch(`https://services.leadconnectorhq.com/contacts/${ghlContactId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify({ customFields: [{ key: fieldKey, value: memberId }] }),
  });
  if (!res.ok) {
    console.error(`[GHL Writeback] Failed for ${ghlContactId}: ${res.status} ${await res.text()}`);
    return false;
  }
  console.log(`[GHL Writeback] Wrote ${memberId} to contact ${ghlContactId}`);
  return true;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let payload = {};
    try { payload = await req.json(); } catch (_) { /* GET-style invocation */ }
    const dryRun = payload.dry_run !== false;

    const apiKey = Deno.env.get('GHL_API_KEY');
    const fieldId = Deno.env.get('GHL_MEMBER_ID_FIELD_ID');

    // 1. Load all members, sorted by agreement_signed_at then created_date
    const all = await base44.asServiceRole.entities.Member.list('-created_date', 500);
    const sorted = all
      .filter(m => m.agreement_signed_at)
      .sort((a, b) =>
        String(a.agreement_signed_at).localeCompare(String(b.agreement_signed_at)) ||
        String(a.created_date || '').localeCompare(String(b.created_date || '')));

    // 2. Compute new IDs
    const periodSeq = {};        // { "2606": 4, "2607": 5, ... } running max
    const assignments = [];     // { id, name, email, old_id, new_id, ghl_contact_id }

    for (const m of sorted) {
      let newId;
      if (m.email && m.email.toLowerCase() === JEFF_EMAIL) {
        newId = JEFF_OVERRIDE_ID;
      } else {
        const d = new Date(m.agreement_signed_at);
        const yy = String(d.getFullYear()).slice(-2);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const period = `${yy}${mm}`;
        periodSeq[period] = (periodSeq[period] || 0) + 1;
        newId = `${period}-${String(periodSeq[period]).padStart(5, '0')}`;
      }
      assignments.push({
        id: m.id,
        name: `${m.first_name || ''} ${m.last_name || ''}`.trim(),
        email: m.email,
        old_id: m.lhs_member_id,
        new_id: newId,
        ghl_contact_id: m.ghl_contact_id,
      });
    }

    if (dryRun) {
      return Response.json({
        dry_run: true,
        count: assignments.length,
        assignments: assignments.map(a => ({
          name: a.name, email: a.email, old_id: a.old_id, new_id: a.new_id,
        })),
        planned_counters: periodSeq,
      });
    }

    // 3. LIVE: apply updates + GHL writeback
    const now = new Date().toISOString();
    const results = [];

    for (const a of assignments) {
      // Update Base44 Member record
      await base44.asServiceRole.entities.Member.update(a.id, {
        lhs_member_id: a.new_id,
        ghl_writeback_status: 'pending',
      });

      // Write back to GHL
      const ok = await writeBackToGHL(a.ghl_contact_id, a.new_id, apiKey, fieldId);

      await base44.asServiceRole.entities.Member.update(a.id, {
        ghl_writeback_at: now,
        ghl_writeback_status: ok ? 'success' : 'failed',
      });

      results.push({
        name: a.name, email: a.email, old_id: a.old_id, new_id: a.new_id,
        ghl_writeback: ok ? 'success' : 'failed',
      });
    }

    // 4. Reconcile MemberIdCounter records so future webhook generation continues correctly
    for (const [period, seq] of Object.entries(periodSeq)) {
      const counters = await base44.asServiceRole.entities.MemberIdCounter.filter({ period });
      if (counters && counters.length > 0) {
        await base44.asServiceRole.entities.MemberIdCounter.update(counters[0].id, { current_seq: seq });
      } else {
        await base44.asServiceRole.entities.MemberIdCounter.create({ period, current_seq: seq });
      }
    }
    // Also ensure the Jeff override period (2201) has a counter at 1
    const jeffPeriod = JEFF_OVERRIDE_ID.split('-')[0];
    const jeffCounters = await base44.asServiceRole.entities.MemberIdCounter.filter({ period: jeffPeriod });
    if (jeffCounters && jeffCounters.length === 0) {
      await base44.asServiceRole.entities.MemberIdCounter.create({ period: jeffPeriod, current_seq: 1 });
    }

    // 5. Audit log
    try {
      await base44.asServiceRole.entities.AuditLog.create({
        event_type: 'member.activated',
        category: 'admin',
        actor: user.email || 'admin',
        status: 'success',
        message: `Member ID resequencing applied to ${results.length} members (Jeff pinned to ${JEFF_OVERRIDE_ID}).`,
        metadata_json: JSON.stringify({ results, counters: periodSeq }),
      });
    } catch (e) {
      console.warn('[AuditLog] Write failed (non-fatal):', e.message);
    }

    return Response.json({
      dry_run: false,
      count: results.length,
      results,
      reconciled_counters: periodSeq,
    });
  } catch (err) {
    console.error('[resequenceMemberIds] Unhandled error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
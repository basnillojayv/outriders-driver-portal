import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function writebackToGHL(apiKey, fieldId, ghlContactId, memberId) {
  const res = await fetch(`https://services.leadconnectorhq.com/contacts/${ghlContactId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify({
      customFields: [{ key: fieldId, field_value: memberId }]
    })
  });
  // Log status only — never log apiKey, fieldId value, or response body that may contain PII
  console.log(`[retryGHLWriteback] PUT contact ${ghlContactId} → HTTP ${res.status}`);
  return res.ok;
}

async function addGHLNote(apiKey, ghlContactId, memberId) {
  const res = await fetch(`https://services.leadconnectorhq.com/contacts/${ghlContactId}/notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify({ body: `[LHS Retry] Member ID assigned: ${memberId}` })
  });
  console.log(`[retryGHLWriteback] Note for ${ghlContactId} → HTTP ${res.status}`);
  return res.ok;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Admin-only: verify before touching any data
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Read secrets inside the handler — never at module level (avoids boot-time exposure)
    const apiKey = Deno.env.get('GHL_API_KEY');
    const fieldId = Deno.env.get('GHL_MEMBER_ID_FIELD_ID');
    if (!apiKey || !fieldId) {
      return Response.json({ error: 'Missing required secrets' }, { status: 500 });
    }

    // Find all members with failed writeback
    const failed = await base44.asServiceRole.entities.Member.filter({ ghl_writeback_status: 'failed' });
    if (!failed || failed.length === 0) {
      return Response.json({ message: 'No failed writebacks found', retried: 0 });
    }

    console.log(`[retryGHLWriteback] Found ${failed.length} failed member(s) to retry`);

    const results = [];
    for (const member of failed) {
      if (!member.ghl_contact_id || !member.lhs_member_id) {
        results.push({ id: member.id, status: 'skipped', reason: 'missing ghl_contact_id or lhs_member_id' });
        continue;
      }

      const success = await writebackToGHL(apiKey, fieldId, member.ghl_contact_id, member.lhs_member_id);

      if (success) {
        await base44.asServiceRole.entities.Member.update(member.id, {
          ghl_writeback_status: 'success',
          ghl_writeback_at: new Date().toISOString(),
        });
        results.push({ id: member.id, lhs_member_id: member.lhs_member_id, status: 'success' });
      } else {
        // Fallback: add a note to the GHL contact so the ID isn't lost
        const noteOk = await addGHLNote(apiKey, member.ghl_contact_id, member.lhs_member_id);
        results.push({
          id: member.id,
          lhs_member_id: member.lhs_member_id,
          status: 'still_failed',
          note_fallback: noteOk,
        });
      }
    }

    const recovered = results.filter(r => r.status === 'success').length;
    const stillFailed = results.filter(r => r.status === 'still_failed').length;
    console.log(`[retryGHLWriteback] Done — recovered: ${recovered}, still_failed: ${stillFailed}`);

    // Alert if any writebacks still failing after retry
    if (stillFailed > 0) {
      const failedDetails = results
        .filter(r => r.status === 'still_failed')
        .map(r => `• ${r.lhs_member_id || r.id} (note fallback: ${r.note_fallback ? 'yes' : 'no'})`)
        .join('\n');

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'karrie@linehaulstation.com',
        from_name: 'LineHaul Station System',
        subject: `⚠️ GHL Writeback Alert — ${stillFailed} member(s) still failing`,
        body: `The GHL writeback retry ran and ${stillFailed} member(s) could not be synced.\n\nMembers still failing:\n${failedDetails}\n\nRecovered: ${recovered}\nTotal retried: ${failed.length}\n\nPlease review the Member detail pages for these records.`,
      });
      console.log(`[retryGHLWriteback] Alert email sent for ${stillFailed} still-failed writebacks`);
    }

    return Response.json({
      retried: failed.length,
      recovered,
      still_failed: stillFailed,
      results,
    });

  } catch (error) {
    console.error('[retryGHLWriteback] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Shared audit log writer — called by other backend functions via:
//   await base44.functions.invoke('writeAuditLog', { event_type, category, message, actor, status, member_id, lhs_member_id, email, metadata_json })
//
// All fields except event_type/category/message/actor/status are optional.
// metadata_json should be a JSON string (JSON.stringify({ ... })) with technical detail.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const payload = await req.json();
    const {
      event_type,
      category,
      message,
      actor = 'system',
      status = 'info',
      member_id = null,
      lhs_member_id = null,
      email = null,
      metadata_json = null,
    } = payload;

    if (!event_type || !category || !message) {
      return Response.json({ error: 'event_type, category, and message are required' }, { status: 400 });
    }

    const entry = {
      event_type,
      category,
      message,
      actor,
      status,
      ...(member_id    ? { member_id }    : {}),
      ...(lhs_member_id ? { lhs_member_id } : {}),
      ...(email        ? { email }        : {}),
      ...(metadata_json ? { metadata_json } : {}),
    };

    const created = await base44.asServiceRole.entities.AuditLog.create(entry);

    console.log(`[AuditLog] ${status.toUpperCase()} ${event_type} — ${message}`);
    return Response.json({ success: true, id: created.id });

  } catch (err) {
    console.error('[writeAuditLog] Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
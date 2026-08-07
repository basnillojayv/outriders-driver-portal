import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ─── Audit log helper ────────────────────────────────────────────────────────
async function audit(base44, fields) {
  try {
    await base44.asServiceRole.entities.AuditLog.create({
      actor: 'admin',
      ...fields,
    });
  } catch (e) {
    console.warn('[AuditLog] Write failed (non-fatal):', e.message);
  }
}

// ─── Main handler ────────────────────────────────────────────────────────────
// Admin-only: invites all active members who haven't been invited yet.
// Returns { invited, skipped, failed, failedDetails }
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // 1. Admin guard — inviteUser() requires an authenticated user context
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Batch limit (default 25) — caps how many members are invited per run
    const body = await req.json().catch(() => ({}));
    const limit = Math.max(1, Math.min(500, parseInt(body.limit, 10) || 25));
    console.log(`[invitePendingMembers] Batch limit: ${limit}`);

    // 2. Fetch active members
    const activeMembers = await base44.entities.Member.filter({ membership_status: 'active' });
    console.log(`[invitePendingMembers] Found ${activeMembers.length} active members`);

    // 3. Build set of existing portal user emails (to skip already-provisioned)
    const existingEmails = new Set();
    try {
      const users = await base44.entities.User.list();
      users.forEach((u) => { if (u.email) existingEmails.add(u.email.toLowerCase()); });
      console.log(`[invitePendingMembers] ${existingEmails.size} existing portal users`);
    } catch (e) {
      console.warn('[invitePendingMembers] Could not list users:', e.message);
    }

    const now = new Date().toISOString();
    let invited = 0;
    let skipped = 0;
    const failedDetails = [];

    for (const m of activeMembers) {
      // Batch limit — defer remaining members beyond the cap (not invited this run)
      if (invited >= limit) {
        skipped++;
        continue;
      }

      const email = (m.email || '').trim();
      if (!email) {
        skipped++;
        continue;
      }

      // Skip already invited
      if (m.portal_invited_at) {
        skipped++;
        continue;
      }

      // Skip already has a portal user
      if (m.portal_user_id || existingEmails.has(email.toLowerCase())) {
        skipped++;
        continue;
      }

      const role = m.portal_role === 'admin' ? 'admin' : 'user';

      try {
        await base44.users.inviteUser(email, role);
        await base44.entities.Member.update(m.id, {
          portal_invited_at: now,
          portal_invite_status: 'invited',
        });
        await audit(base44, {
          event_type: 'member.invited',
          category: 'member',
          status: 'success',
          message: `Member ${m.lhs_member_id || email} invited to portal as ${role}`,
          lhs_member_id: m.lhs_member_id,
          email,
          metadata_json: JSON.stringify({ role, invited_by: user.email }),
        });
        invited++;
      } catch (err) {
        await base44.entities.Member.update(m.id, {
          portal_invite_status: 'failed',
        });
        await audit(base44, {
          event_type: 'member.invited',
          category: 'member',
          status: 'failure',
          message: `Invite failed for ${m.lhs_member_id || email}: ${err.message}`,
          lhs_member_id: m.lhs_member_id,
          email,
          metadata_json: JSON.stringify({ role, error: err.message, invited_by: user.email }),
        });
        failedDetails.push({ email, member_id: m.lhs_member_id, error: err.message });
      }
    }

    console.log(`[invitePendingMembers] done — invited=${invited} skipped=${skipped} failed=${failedDetails.length}`);

    return Response.json({
      success: true,
      invited,
      skipped,
      failed: failedDetails.length,
      failedDetails,
    });
  } catch (err) {
    console.error('[invitePendingMembers] Unhandled error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
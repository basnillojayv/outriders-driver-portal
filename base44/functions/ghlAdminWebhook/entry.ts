import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ─── Reserve next Member ID (per-month sequence, YYMM-##### format) ───────────
// YY = 2-digit year, MM = 2-digit month of creation.
// Sequence resets to 1 on the first member of each calendar month.

async function reserveNextMemberId(base44) {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const period = `${yy}${mm}`;

  const counters = await base44.asServiceRole.entities.MemberIdCounter.filter({ period });

  if (!counters || counters.length === 0) {
    // First member this month — start a fresh monthly counter at 1
    await base44.asServiceRole.entities.MemberIdCounter.create({ period, current_seq: 1 });
    console.log(`[MemberIdCounter] Initialized counter for period ${period} at 1`);
    return { period, seq: 1 };
  }

  const counter = counters[0];
  const nextSeq = (counter.current_seq || 0) + 1;
  await base44.asServiceRole.entities.MemberIdCounter.update(counter.id, { current_seq: nextSeq });
  console.log(`[MemberIdCounter] Reserved seq ${nextSeq} for period ${period} (was ${counter.current_seq})`);
  return { period, seq: nextSeq };
}

function formatMemberId(period, seq) {
  return `${period}-${String(seq).padStart(5, '0')}`;
}

// ─── Write LHS Member ID back to GHL ─────────────────────────────────────────

async function writeBackToGHL(ghlContactId, memberId) {
  const apiKey = Deno.env.get('GHL_API_KEY');
  const fieldId = Deno.env.get('GHL_MEMBER_ID_FIELD_ID');

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
    console.error('[GHL Writeback] Failed:', res.status, await res.text());
    return false;
  }

  console.log(`[GHL Writeback] Wrote ${memberId} to contact ${ghlContactId}`);
  return true;
}

// ─── Audit log helper ─────────────────────────────────────────────────────────

async function audit(base44, fields) {
  try {
    await base44.asServiceRole.entities.AuditLog.create({
      actor: 'webhook',
      status: 'info',
      ...fields,
    });
  } catch (e) {
    console.warn('[AuditLog] Write failed (non-fatal):', e.message);
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    // 1. Validate webhook secret (same secret as ghlWebhook)
    const secret = Deno.env.get('GHL_WEBHOOK_SECRET');
    const incomingSecret =
      req.headers.get('x-ghl-secret') ||
      new URL(req.url).searchParams.get('secret');

    if (secret && incomingSecret !== secret) {
      console.error('[Auth] Webhook secret mismatch — rejected');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();

    // 2. Extract contact fields
    const ghlContactId = payload.contact_id || payload.id || payload.contactId;
    const email     = payload.email;
    const firstName = payload.first_name || payload.firstName || '';
    const lastName  = payload.last_name  || payload.lastName  || '';
    const phone     = payload.phone      || '';

    if (!ghlContactId || !email) {
      console.error('[AdminWebhook] Missing required fields:', { ghlContactId, email });
      return Response.json({ error: 'Missing contact ID or email' }, { status: 400 });
    }

    console.log(`[AdminWebhook] Processing admin approval for: ${email} (GHL ID: ${ghlContactId})`);

    const base44 = createClientFromRequest(req);
    const now = new Date().toISOString();

    // Log webhook received
    await audit(base44, {
      event_type: 'ghl.webhook_received',
      category: 'ghl',
      status: 'info',
      message: `Admin approval webhook received for ${email}`,
      email,
      metadata_json: JSON.stringify({ ghl_contact_id: ghlContactId }),
    });

    // 3. Find existing Member — never create a duplicate
    let existing = null;
    const byGhlId = await base44.asServiceRole.entities.Member.filter({ ghl_contact_id: ghlContactId });
    if (byGhlId && byGhlId.length > 0) {
      existing = byGhlId[0];
      console.log(`[AdminWebhook] Found existing member by GHL ID: ${existing.lhs_member_id}`);
    } else {
      const byEmail = await base44.asServiceRole.entities.Member.filter({ email });
      if (byEmail && byEmail.length > 0) {
        existing = byEmail[0];
        console.log(`[AdminWebhook] Found existing member by email: ${existing.lhs_member_id}`);
      }
    }

    // 4. Reserve Member ID only for new members
    let memberId;
    if (existing?.lhs_member_id) {
      memberId = existing.lhs_member_id;
      console.log(`[AdminWebhook] Reusing existing Member ID: ${memberId}`);
    } else {
      const { period, seq } = await reserveNextMemberId(base44);
      memberId = formatMemberId(period, seq);
      console.log(`[AdminWebhook] Generated new Member ID: ${memberId}`);
    }

    // 5. Create or update Member record
    // CRITICAL: never overwrite affiliate_parent_id or any affiliate_* credit fields
    const memberData = {
      lhs_member_id:     memberId,
      ghl_contact_id:    ghlContactId,
      email,
      first_name:        firstName,
      last_name:         lastName,
      phone,
      membership_status: 'active',
      portal_role:       'admin',
      raw_ghl_payload:   JSON.stringify(payload),
    };

    // Only set agreement_signed_at if not already recorded (preserve original date)
    if (!existing?.agreement_signed_at) {
      memberData.agreement_signed_at = payload['Agreement Accepted Date'] || now;
    }

    let member;
    if (existing) {
      member = await base44.asServiceRole.entities.Member.update(existing.id, memberData);
      console.log(`[AdminWebhook] Updated member record for ${memberId}`);
    } else {
      memberData.ghl_writeback_status = 'pending';
      member = await base44.asServiceRole.entities.Member.create(memberData);
      console.log(`[AdminWebhook] Created member record for ${memberId}`);
      await audit(base44, {
        event_type: 'member.created',
        category: 'member',
        status: 'success',
        message: `Admin member created: ${email} (${memberId})`,
        lhs_member_id: memberId,
        email,
        metadata_json: JSON.stringify({ ghl_contact_id: ghlContactId, action: 'created', portal_role: 'admin' }),
      });
    }

    await audit(base44, {
      event_type: 'member.activated',
      category: 'member',
      status: 'success',
      message: `Admin member activated: ${email} (${memberId})`,
      lhs_member_id: memberId,
      email,
      metadata_json: JSON.stringify({ ghl_contact_id: ghlContactId, portal_role: 'admin' }),
    });

    // 6. Write LHS Member ID back to GHL (if not already done)
    let writebackOk = false;
    if (!existing?.lhs_member_id) {
      writebackOk = await writeBackToGHL(ghlContactId, memberId);
      await base44.asServiceRole.entities.Member.update(member.id, {
        ghl_writeback_at:     now,
        ghl_writeback_status: writebackOk ? 'success' : 'failed',
      });
      await audit(base44, {
        event_type: writebackOk ? 'ghl.writeback_success' : 'ghl.writeback_failed',
        category: 'ghl',
        status: writebackOk ? 'success' : 'failure',
        message: writebackOk
          ? `GHL custom field updated with Member ID ${memberId}`
          : `GHL writeback failed for ${memberId} — manual update needed`,
        lhs_member_id: memberId,
        email,
        metadata_json: JSON.stringify({ ghl_contact_id: ghlContactId }),
      });
    } else {
      console.log(`[AdminWebhook] Member ID already written to GHL — skipping writeback`);
      writebackOk = true;
    }

    // 7. Send Base44 portal invite as admin role
    // This is idempotent — if the user already exists, Base44 handles it gracefully
    let inviteResult = 'skipped';
    try {
      await base44.asServiceRole.users.inviteUser(email, 'admin');
      inviteResult = 'sent';
      console.log(`[AdminWebhook] Admin invite sent to ${email}`);
      await audit(base44, {
        event_type: 'member.invited',
        category: 'member',
        status: 'success',
        message: `Admin portal invite sent to ${email}`,
        lhs_member_id: memberId,
        email,
        metadata_json: JSON.stringify({ ghl_contact_id: ghlContactId, role: 'admin' }),
      });
    } catch (inviteErr) {
      // Non-fatal — they may already be a registered user
      inviteResult = `failed: ${inviteErr.message}`;
      console.warn(`[AdminWebhook] Invite failed (non-fatal): ${inviteErr.message}`);
    }

    // 8. Mark portal_invited_at (first time only)
    if (!existing?.portal_invited_at) {
      await base44.asServiceRole.entities.Member.update(member.id, { portal_invited_at: now });
    }

    console.log(`[AdminWebhook] Done — member_id=${memberId} action=${existing ? 'updated' : 'created'} invite=${inviteResult}`);

    return Response.json({
      success:    true,
      member_id:  memberId,
      action:     existing ? 'updated' : 'created',
      invite:     inviteResult,
      ghl_writeback: writebackOk ? 'success' : 'skipped',
    });

  } catch (err) {
    console.error('[ghlAdminWebhook] Unhandled error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
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
    console.warn('[GHL Writeback] GHL_MEMBER_ID_FIELD_ID not set — skipping write-back');
    return false;
  }

  const fieldKey = fieldId.startsWith('contact.') ? fieldId.slice('contact.'.length) : fieldId;
  const body = { customFields: [{ key: fieldKey, value: memberId }] };

  const res = await fetch(`https://services.leadconnectorhq.com/contacts/${ghlContactId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify(body),
  });

  const resText = await res.text();
  if (!res.ok) {
    console.error('[GHL Writeback] Failed:', res.status, resText);
    return false;
  }

  console.log(`[GHL Writeback] Successfully wrote ${memberId} to GHL contact ${ghlContactId}`);
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
    // 1. Validate webhook secret
    const secret = Deno.env.get('GHL_WEBHOOK_SECRET');
    const incomingSecret =
      req.headers.get('x-ghl-secret') ||
      new URL(req.url).searchParams.get('secret');

    if (secret && incomingSecret !== secret) {
      console.error('[Auth] Webhook secret mismatch — rejected');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    console.log('[Webhook] FULL RAW PAYLOAD:', JSON.stringify(payload));
    console.log('[Webhook] Keys at root:', Object.keys(payload).join(', '));
    console.log('[Webhook] contact field:', JSON.stringify(payload.contact));
    console.log('[Webhook] id/contactId:', payload.id, payload.contactId);
    console.log('[Webhook] email:', payload.email);

    // 2. Extract contact fields
    const ghlContactId = payload.contact_id || payload.id || payload.contactId;
    const email        = payload.email;
    const firstName    = payload.first_name || payload.firstName || '';
    const lastName     = payload.last_name  || payload.lastName  || '';
    const phone        = payload.phone      || '';
    const agreedAt     = payload['Agreement Accepted Date'] || payload.date_created || new Date().toISOString();

    if (!ghlContactId || !email) {
      console.error('[Webhook] Missing required fields:', { ghlContactId, email });
      return Response.json({ error: 'Missing contact ID or email in payload' }, { status: 400 });
    }

    console.log(`[Webhook] Processing contact: ${email} (GHL ID: ${ghlContactId})`);

    const base44 = createClientFromRequest(req);

    // 3. Check for existing member — never regenerate an existing Member ID
    let existing = null;

    const byGhlId = await base44.asServiceRole.entities.Member.filter({ ghl_contact_id: ghlContactId });
    if (byGhlId && byGhlId.length > 0) {
      existing = byGhlId[0];
      console.log(`[Member] Found existing member by GHL ID: ${existing.lhs_member_id}`);
    } else {
      const byEmail = await base44.asServiceRole.entities.Member.filter({ email });
      if (byEmail && byEmail.length > 0) {
        existing = byEmail[0];
        console.log(`[Member] Found existing member by email: ${existing.lhs_member_id}`);
      }
    }

    const now = new Date().toISOString();

    // 4. Reserve Member ID only for new members
    let memberId;
    if (existing?.lhs_member_id) {
      memberId = existing.lhs_member_id;
      console.log(`[Member] Reusing existing Member ID: ${memberId}`);
    } else {
      const { period, seq } = await reserveNextMemberId(base44);
      memberId = formatMemberId(period, seq);
      console.log(`[Member] Generated new Member ID: ${memberId}`);
    }

    // 5. Create or update member record
    const memberData = {
      lhs_member_id:       memberId,
      ghl_contact_id:      ghlContactId,
      email,
      first_name:          firstName,
      last_name:           lastName,
      phone,
      membership_status:   'active',
      agreement_signed_at: agreedAt,
      raw_ghl_payload:     JSON.stringify(payload),
    };

    let member;
    if (existing) {
      member = await base44.asServiceRole.entities.Member.update(existing.id, memberData);
      console.log(`[Member] Updated record for ${memberId} (record ID: ${existing.id})`);
    } else {
      memberData.ghl_writeback_status = 'pending';
      member = await base44.asServiceRole.entities.Member.create(memberData);
      console.log(`[Member] Created record for ${memberId} (record ID: ${member.id})`);
    }

    // Log webhook received
    await audit(base44, {
      event_type: 'ghl.webhook_received',
      category: 'ghl',
      message: `GHL webhook received for ${email} — ${existing ? 'existing' : 'new'} member`,
      lhs_member_id: memberId,
      email,
      metadata_json: JSON.stringify({ ghl_contact_id: ghlContactId, action: existing ? 'updated' : 'created' }),
    });

    // 6. IMMUTABLE REFERRAL ATTRIBUTION
    // Business rule: first successful signup wins. affiliate_parent_id is NEVER overwritten.
    // Only assign when it is NULL (i.e., this is the first time a referrer is known).
    const firstTouchUrl = payload.contact?.attributionSource?.url || '';
    const lastTouchUrl  = payload.contact?.lastAttributionSource?.url || '';
    const attributionUrl = firstTouchUrl || lastTouchUrl;
    const amIdMatch = attributionUrl.match(/am_id=([^&]+)/) || lastTouchUrl.match(/am_id=([^&]+)/);
    const incomingReferrerId = amIdMatch ? amIdMatch[1] : null;

    console.log(`[Affiliate] firstTouchUrl=${firstTouchUrl} lastTouchUrl=${lastTouchUrl} resolved am_id=${incomingReferrerId}`);

    const existingParentId = existing?.affiliate_parent_id || null;

    if (incomingReferrerId) {
      if (!existingParentId) {
        // ── FIRST TOUCH: assign and lock ──────────────────────────────────────
        await base44.asServiceRole.entities.Member.update(member.id, {
          affiliate_parent_id:     incomingReferrerId,
          affiliate_lookup_status: 'found',
          affiliate_enriched_at:   now,
        });
        console.log(`[Affiliate] Referral ASSIGNED: ${email} → parent ${incomingReferrerId}`);
        await audit(base44, {
          event_type: 'referral.assigned',
          category: 'referral',
          status: 'success',
          message: `Referral assigned. ${email} credited to affiliate ${incomingReferrerId}.`,
          lhs_member_id: memberId,
          email,
          metadata_json: JSON.stringify({ affiliate_parent_id: incomingReferrerId, ghl_contact_id: ghlContactId }),
        });
      } else if (existingParentId !== incomingReferrerId) {
        // ── DUPLICATE ATTEMPT: log and ignore ────────────────────────────────
        console.log(`[Affiliate] Referral DUPLICATE IGNORED: existing=${existingParentId}, attempted=${incomingReferrerId}`);
        await audit(base44, {
          event_type: 'referral.duplicate_attempt',
          category: 'referral',
          status: 'warning',
          message: `Referral ignored. Existing referral owner preserved. (${email} already credited to affiliate ${existingParentId})`,
          lhs_member_id: memberId,
          email,
          metadata_json: JSON.stringify({
            existing_parent_affiliate_id: existingParentId,
            attempted_referral_am_id:     incomingReferrerId,
            contact_id:                   ghlContactId,
            email,
          }),
        });
      } else {
        // Same referrer re-firing — no action needed
        console.log(`[Affiliate] Referral re-fired by same parent (${existingParentId}) — no-op`);
      }
    } else {
      if (!existingParentId) {
        await base44.asServiceRole.entities.Member.update(member.id, { affiliate_lookup_status: 'not_found' });
      }
      console.log(`[Affiliate] No referral source detected — affiliate_parent_id unchanged`);
    }

    // 7. Write Member ID back to GHL
    const writebackOk = await writeBackToGHL(ghlContactId, memberId);
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

    // 8. Add GHL note as fallback only if writeback failed (only once)
    if (!existing?.portal_invited_at) {
      if (!writebackOk) {
        try {
          const noteRes = await fetch(`https://services.leadconnectorhq.com/contacts/${ghlContactId}/notes`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('GHL_API_KEY')}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28',
            },
            body: JSON.stringify({ body: `LHS Member ID assigned: ${memberId} (custom field writeback failed — manual update needed)` }),
          });
          if (!noteRes.ok) console.warn('[GHL Note] Fallback note failed:', await noteRes.text());
          else console.log(`[GHL Note] Fallback note added to contact ${ghlContactId}`);
        } catch (noteErr) {
          console.error('[GHL Note] Failed (non-fatal):', noteErr.message);
        }
      }
      await base44.asServiceRole.entities.Member.update(member.id, { portal_invited_at: now });
    } else {
      console.log(`[GHL] Already processed on ${existing.portal_invited_at} — skipping`);
    }

    console.log(`[Done] member_id=${memberId} action=${existing ? 'updated' : 'created'} writeback=${writebackOk ? 'success' : 'skipped'}`);

    return Response.json({
      success:       true,
      member_id:     memberId,
      action:        existing ? 'updated' : 'created',
      ghl_writeback: writebackOk ? 'success' : 'skipped',
    });

  } catch (err) {
    console.error('[ghlWebhook] Unhandled error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
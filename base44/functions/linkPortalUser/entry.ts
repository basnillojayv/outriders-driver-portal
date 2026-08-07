import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ── GHL lifecycle sync: move opportunity to "6 - First Portal Login" ─────────
const GHL_PIPELINE_NAME = 'Outriders Membership Pipeline';
const GHL_STAGE_NAME = '6-First Portal Login';

function ghlHeaders() {
  return {
    'Authorization': `Bearer ${Deno.env.get('GHL_API_KEY')}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Version': 'v3',
  };
}

// Returns { ok, skipped?, reason?, message, opportunityId?, stageId? }.
// Idempotent: resolves pipeline/stage by name, finds the contact's opportunity
// in that pipeline, and only PUTs when the opportunity isn't already there.
async function moveOpportunityToFirstLogin(member, opts = {}) {
  const dryRun = !!opts.dryRun;
  const locationId = Deno.env.get('GHL_LOCATION_ID');
  const apiKey = Deno.env.get('GHL_API_KEY');
  const ghlContactId = member.ghl_contact_id;

  if (!locationId || !apiKey) {
    return { ok: false, reason: 'missing_config', message: 'GHL_LOCATION_ID or GHL_API_KEY not set' };
  }
  if (!ghlContactId) {
    return { ok: false, reason: 'no_contact_id', message: 'Member has no ghl_contact_id — cannot find GHL opportunity' };
  }

  const headers = ghlHeaders();

  // 1. Resolve pipeline + stage by name
  const pipesRes = await fetch(
    `https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${encodeURIComponent(locationId)}`,
    { headers }
  );
  if (!pipesRes.ok) {
    const t = await pipesRes.text().catch(() => '');
    return { ok: false, reason: 'pipelines_fetch_failed', message: `Pipelines fetch failed: ${pipesRes.status} ${t.slice(0, 200)}` };
  }
  const pipesData = await pipesRes.json();
  const pipeline = (pipesData.pipelines || []).find(
    p => (p.name || '').trim().toLowerCase() === GHL_PIPELINE_NAME.toLowerCase()
  );
  if (!pipeline) {
    return { ok: false, reason: 'pipeline_not_found', message: `Pipeline "${GHL_PIPELINE_NAME}" not found in location` };
  }
  const stage = (pipeline.stages || []).find(
    s => (s.name || '').trim().toLowerCase() === GHL_STAGE_NAME.toLowerCase()
  );
  if (!stage) {
    const availableStages = (pipeline.stages || []).map(s => ({ id: s.id, name: (s.name || '').trim() }));
    return {
      ok: false,
      reason: 'stage_not_found',
      message: `Stage "${GHL_STAGE_NAME}" not found in pipeline "${GHL_PIPELINE_NAME}"`,
      pipelineId: pipeline.id,
      availableStages,
    };
  }

  // 2. Find the contact's opportunity in this pipeline
  const searchRes = await fetch(
    `https://services.leadconnectorhq.com/opportunities/search?locationId=${encodeURIComponent(locationId)}&contactId=${encodeURIComponent(ghlContactId)}&pipelineId=${encodeURIComponent(pipeline.id)}`,
    { headers }
  );
  if (!searchRes.ok) {
    const t = await searchRes.text().catch(() => '');
    return { ok: false, reason: 'search_failed', message: `Opportunity search failed: ${searchRes.status} ${t.slice(0, 200)}` };
  }
  const searchData = await searchRes.json();
  const opportunities = searchData.opportunities || [];
  if (opportunities.length === 0) {
    return { ok: false, reason: 'no_opportunity', message: `No opportunity found for contact ${ghlContactId} in "${GHL_PIPELINE_NAME}"` };
  }
  const opp = opportunities[0];

  // 3. Idempotency — already at target stage
  if (opp.pipelineStageId === stage.id) {
    return { ok: true, skipped: true, reason: 'already_at_stage', opportunityId: opp.id, currentStageId: opp.pipelineStageId, targetStageId: stage.id, message: `Opportunity ${opp.id} already at "${GHL_STAGE_NAME}"` };
  }

  // Dry run: report what would happen, perform NO write
  if (dryRun) {
    return {
      ok: true,
      dryRun: true,
      wouldMove: true,
      opportunityId: opp.id,
      currentStageId: opp.pipelineStageId,
      targetStageId: stage.id,
      pipelineId: pipeline.id,
      opportunityStatus: opp.status || 'open',
      message: `Would move opportunity ${opp.id} → "${GHL_STAGE_NAME}" (dry run, no write performed)`,
    };
  }

  // 4. Move the opportunity
  const updateRes = await fetch(`https://services.leadconnectorhq.com/opportunities/${opp.id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ pipelineId: pipeline.id, pipelineStageId: stage.id, status: opp.status || 'open' }),
  });
  if (!updateRes.ok) {
    const t = await updateRes.text().catch(() => '');
    return { ok: false, reason: 'update_failed', opportunityId: opp.id, message: `Opportunity update failed: ${updateRes.status} ${t.slice(0, 200)}` };
  }
  return { ok: true, skipped: false, opportunityId: opp.id, stageId: stage.id, pipelineId: pipeline.id, message: `Opportunity ${opp.id} moved to "${GHL_STAGE_NAME}"` };
}

Deno.serve(async (req) => {
  try {
    // ── DRY RUN: verify the GHL lookup chain without any mutation ───────────
    // Admin-only. Performs read-only GHL calls and reports what would happen.
    // Never touches Member records and never moves the opportunity.
    let body = {};
    try { body = await req.json(); } catch {}
    const base44 = createClientFromRequest(req);

    if (body.dry_run === true) {
      const dryUser = await base44.auth.me().catch(() => null);
      if (!dryUser || dryUser.role !== 'admin') {
        return Response.json({ error: 'Admin access required for dry run' }, { status: 403 });
      }
      const ghlContactId = body.ghl_contact_id;
      if (!ghlContactId) {
        return Response.json({ error: 'ghl_contact_id required for dry run' }, { status: 400 });
      }
      const lookup = await moveOpportunityToFirstLogin({ ghl_contact_id: ghlContactId }, { dryRun: true });
      return Response.json({
        dry_run: true,
        ghl_contact_id: ghlContactId,
        pipeline_name: GHL_PIPELINE_NAME,
        stage_name: GHL_STAGE_NAME,
        lookup,
      });
    }

    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Find the member by email (case-insensitive match against the auth user's email)
    const members = await base44.asServiceRole.entities.Member.filter({ email: user.email });
    const activeMember = members?.find(m => m.membership_status === 'active') || null;

    if (!activeMember) {
      await base44.asServiceRole.entities.AuditLog.create({
        event_type: "member.login",
        category: "auth",
        message: `Login blocked — no active membership for ${user.email}`,
        actor: "system",
        status: "warning",
        email: user.email,
        metadata_json: JSON.stringify({ reason: "no_active_membership", user_id: user.id }),
      }).catch(() => {});
      return Response.json({ hasActiveMembership: false, member: null, linked: false });
    }

    let member = activeMember;
    let linked = false;

    // Idempotent link: only write the fields that are still blank, and only
    // touch the record at all if at least one of them needs setting. This
    // keeps repeated logins cheap and avoids needless overwrites.
    const now = new Date().toISOString();
    const update = {};
    if (!activeMember.portal_user_id) update.portal_user_id = user.id;
    if (!activeMember.first_login_at) update.first_login_at = now;
    linked = !!update.portal_user_id;

    if (Object.keys(update).length > 0) {
      member = await base44.asServiceRole.entities.Member.update(activeMember.id, update);

      await base44.asServiceRole.entities.AuditLog.create({
        event_type: "member.login",
        category: "auth",
        message: linked
          ? `Portal user linked: ${user.email} → ${activeMember.lhs_member_id || activeMember.id}`
          : `First login recorded: ${user.email} → ${activeMember.lhs_member_id || activeMember.id}`,
        actor: "system",
        status: "success",
        member_id: activeMember.id,
        lhs_member_id: activeMember.lhs_member_id,
        email: user.email,
        metadata_json: JSON.stringify({
          user_id: user.id,
          member_id: activeMember.id,
          lhs_member_id: activeMember.lhs_member_id,
          fields_set: Object.keys(update),
        }),
      }).catch(() => {});

      // Lifecycle sync: when first_login_at was newly set, move the GHL
      // opportunity to stage "6-First Portal Login". Idempotent + logged.
      if (update.first_login_at) {
        let oppResult = null;
        try {
          oppResult = await moveOpportunityToFirstLogin(member);
        } catch (e) {
          oppResult = { ok: false, reason: 'exception', message: e.message };
        }
        await base44.asServiceRole.entities.AuditLog.create({
          event_type: oppResult.ok ? "ghl.writeback_success" : "ghl.writeback_failed",
          category: "ghl",
          status: oppResult.ok ? "success" : "failure",
          message: oppResult.ok
            ? `GHL opportunity → "${GHL_STAGE_NAME}": ${oppResult.message}`
            : `GHL opportunity move failed (${oppResult.reason || 'unknown'}): ${oppResult.message}`,
          actor: "system",
          member_id: activeMember.id,
          lhs_member_id: activeMember.lhs_member_id,
          email: user.email,
          metadata_json: JSON.stringify({
            ghl_contact_id: member.ghl_contact_id,
            opportunity_id: oppResult.opportunityId || null,
            stage_id: oppResult.stageId || null,
            skipped: !!oppResult.skipped,
            reason: oppResult.reason || null,
          }),
        }).catch(() => {});
      }
    }

    return Response.json({
      hasActiveMembership: true,
      member: {
        id: member.id,
        lhs_member_id: member.lhs_member_id,
        portal_role: member.portal_role,
        portal_user_id: member.portal_user_id,
      },
      linked,
      userId: user.id,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
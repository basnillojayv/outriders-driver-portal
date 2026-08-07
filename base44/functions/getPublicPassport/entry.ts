import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const userId = body.userId;

    if (!userId) return Response.json({ error: 'userId required' }, { status: 400 });

    // Public endpoint — use service role to fetch user passport data
    let user;
    try {
      user = await base44.asServiceRole.entities.User.get(userId);
    } catch {
      return Response.json({ error: 'Passport not found' }, { status: 200 });
    }
    if (!user) return Response.json({ error: 'Passport not found' }, { status: 200 });

    // Look up member record for lhs_member_id
    let lhsMemberId = null;
    try {
      const members = await base44.asServiceRole.entities.Member.filter({ portal_user_id: userId });
      lhsMemberId = members?.[0]?.lhs_member_id || null;
    } catch {}

    // Return only passport display fields
    return Response.json({
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      full_name: user.full_name || null,
      email: user.email || null,
      phone: user.phone || null,
      city: user.city || null,
      state: user.state || null,
      headline: user.headline || null,
      username: user.username || null,
      summary: user.summary || null,
      cdl_number: user.cdl_number || null,
      cdl_state: user.cdl_state || null,
      endorsements: user.endorsements || null,
      medical_card_expiry: user.medical_card_expiry || null,
      profile_photo_url: user.profile_photo_url || null,
      tractor_types: user.tractor_types || null,
      trailer_types: user.trailer_types || null,
      freight_types: user.freight_types || null,
      passport_documents: user.passport_documents || null,
      references: user.references || null,
      experience: user.experience || null,
      lhs_member_id: lhsMemberId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
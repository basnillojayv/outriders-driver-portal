/**
 * buildPassportData — converts a User entity (and optional memberId)
 * into the standardized data shape consumed by PassportBooklet / PassportPreview.
 */
export function buildPassportData(user, memberId) {
  let tractorTypes = [], trailerTypes = [], freightTypes = [], documents = [], references = [], experiences = [];
  try { tractorTypes = user.tractor_types ? JSON.parse(user.tractor_types) : []; } catch {}
  try { trailerTypes = user.trailer_types ? JSON.parse(user.trailer_types) : []; } catch {}
  try { freightTypes = user.freight_types ? JSON.parse(user.freight_types) : []; } catch {}
  try { documents = user.passport_documents ? JSON.parse(user.passport_documents) : []; } catch {}
  try { references = user.references ? JSON.parse(user.references) : []; } catch {}
  try { experiences = user.experience ? JSON.parse(user.experience) : []; } catch {}

  const form = {
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    phone: user.phone || "",
    email: user.email || "",
    city: user.city || "",
    state: user.state || "",
    headline: user.headline || "",
    username: user.username || "",
    summary: user.summary || "",
    cdl_number: user.cdl_number || "",
    cdl_state: user.cdl_state || "",
    endorsements: user.endorsements || "",
    medical_card_expiry: user.medical_card_expiry || "",
  };

  const memberName = [form.first_name, form.last_name].filter(Boolean).join(" ") || user.full_name || "—";

  const fieldChecks = [
    form.first_name, form.last_name, form.phone, form.city, form.state,
    form.headline, form.summary, form.cdl_number, form.cdl_state,
    form.endorsements, form.medical_card_expiry,
    user.profile_photo_url,
    tractorTypes.length > 0, trailerTypes.length > 0, freightTypes.length > 0,
  ];
  const filled = fieldChecks.filter(f => typeof f === "boolean" ? f : (f && String(f).trim().length > 0)).length;
  const completion = Math.round((filled / fieldChecks.length) * 100);

  return {
    form,
    photoUrl: user.profile_photo_url || null,
    memberId: memberId || "Not assigned",
    completion,
    memberName,
    tractorTypes,
    trailerTypes,
    freightTypes,
    documents,
    references,
    experiences,
  };
}
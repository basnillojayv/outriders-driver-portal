/**
 * Active Top Ten Participants Definition
 * 
 * Members who are enrolled in, provisioned for, or actively participating in Top 10 Truckers.
 * 
 * A member counts as an Active Top Ten Participant if ANY of these are true:
 * 1. affiliate_id exists (provisioned in GHL affiliate system)
 * 2. affiliate_referral_link exists (link generated and ready to share)
 * 3. affiliate_leads > 0 (has direct referrals)
 * 4. affiliate_credits > 0 (has earned credits from network)
 * 5. Has at least one RewardsTransaction record (has ledger activity)
 * 
 * This MVP logic counts members even with zero referrals, because a newly enrolled
 * member may have the referral link but haven't generated leads yet.
 */
export function isActiveTopTenParticipant(member, rewardsTransactionMap = {}) {
  if (!member) return false;

  // Check direct member fields
  if (member.affiliate_id) return true;
  if (member.affiliate_referral_link) return true;
  if ((member.affiliate_leads || 0) > 0) return true;
  if ((member.affiliate_credits || 0) > 0) return true;

  // Check if member has any RewardsTransaction
  if (rewardsTransactionMap[member.id] && rewardsTransactionMap[member.id].length > 0) {
    return true;
  }

  return false;
}

/**
 * Debug output when no active participants are found
 */
export function getDebugOutput(members) {
  if (members.length === 0) return "No members in database.";

  const sample = members[0];
  const missingFields = [];

  if (!sample.affiliate_id) missingFields.push("affiliate_id");
  if (!sample.affiliate_referral_link) missingFields.push("affiliate_referral_link");
  if ((sample.affiliate_leads || 0) === 0) missingFields.push("affiliate_leads");
  if ((sample.affiliate_credits || 0) === 0) missingFields.push("affiliate_credits");

  return `No active Top Ten participants found. Sample member missing: ${missingFields.join(", ")}. Check if enrichAffiliateIdentity sync has run.`;
}
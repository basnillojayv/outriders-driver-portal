const GITHUB = "https://raw.githubusercontent.com/LineHaulStation/app/main/images";

export const BADGES = [
  { name: "New",      img: `${GITHUB}/Badge-New.png`,      directReq: 0,  networkReq: 0,    desc: "Joined the platform" },
  { name: "Leader",   img: "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/7dd590bf7_lead_icon.svg", directReq: 10, networkReq: 0,    desc: "10 direct referrals — Top 10 complete" },
  { name: "Guide",    img: "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/cd2d234c3_guide_icon.svg", directReq: 10, networkReq: 100,  desc: "100 total network referrals" },
  { name: "Protector",img: "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/b605699c9_protect_icon.svg", directReq: 10, networkReq: 1000, desc: "1,000 total network referrals" },
  { name: "Founder",  img: "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/7f9899bf9_founder_icon.svg", directReq: 10, networkReq: 100,  desc: "Each of your 10 has 10 — full network effect" },
];

export function getBadgeForCounts(directCount = 0, networkCount = 0) {
  let current = BADGES[0];
  for (const badge of BADGES) {
    if (directCount >= badge.directReq && networkCount >= badge.networkReq) {
      current = badge;
    }
  }
  return current;
}

// Display badge: new members show "Lead" (the level they're on).
// Once a tier is completed, that tier shows.
export function getDisplayBadge(directCount = 0, networkCount = 0) {
  const earned = getBadgeForCounts(directCount, networkCount);
  if (earned.name === "New") return BADGES[1]; // Lead
  return earned;
}

// ── Founders Program rank progression ──
// Ranks auto-update based on cumulative TOTAL referrals (direct + network) from GHL.
// 0: Outrider (no referrals yet)
// 1–99: Leader
// 100–999: Guide
// 1,000+: Protector
// Founder only when a separate Founder qualification is met (not automatic).
export function getTotalReferrals(directCount = 0, networkCount = 0) {
  return (directCount || 0) + (networkCount || 0);
}

export function getRankForTotal(total = 0, isFounder = false) {
  if (isFounder) return "Founder";
  if (total >= 1000) return "Protector";
  if (total >= 100) return "Guide";
  if (total >= 1) return "Leader";
  return "Outrider";
}

export function getRankBadgeForTotal(total = 0, isFounder = false) {
  const name = getRankForTotal(total, isFounder);
  if (name === "Outrider") return { name: "Outrider", img: BADGES[0].img };
  return BADGES.find((b) => b.name === name) || BADGES[1];
}
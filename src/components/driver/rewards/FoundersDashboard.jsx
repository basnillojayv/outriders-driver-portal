/**
 * FoundersDashboard — the three Founders Circle tiers.
 *
 * Replaces the previous "Rev Up Your Engine" odometers. Tier thresholds match
 * the badge artwork (10 / 100 / 1,000 members); Inner Circle tracks direct
 * referrals, the wider circles track the whole downstream network.
 */
import React from "react";
import { T } from "../v3/v3tokens";
import { TIER_PALETTE } from "./tierPalette";
import CircleTierCard from "./CircleTierCard";

import innerBadge from "@/assets/founders/inner-circle.png";
import convoyBadge from "@/assets/founders/convoy-circle.png";
import foundersBadge from "@/assets/founders/founders-circle.png";

export const TIERS = [
  {
    key: "inner",
    name: "Inner Circle",
    badge: innerBadge,
    // Two explicit lines so the copy always breaks the way the mock-up shows.
    tagline: ["Build your foundation.", "Unlock the next level."],
    max: 10,
    source: "direct",   // generation 1 — people you signed up yourself
    accent: TIER_PALETTE.inner.base,
    accentBright: TIER_PALETTE.inner.bright,
    accentSoft: TIER_PALETTE.inner.rim,
  },
  {
    key: "convoy",
    name: "Convoy Circle",
    badge: convoyBadge,
    tagline: ["Grow your convoy.", "Stronger together."],
    max: 100,
    source: "tier2",    // generation 2 — their referrals
    accent: TIER_PALETTE.convoy.base,
    accentBright: TIER_PALETTE.convoy.bright,
    accentSoft: TIER_PALETTE.convoy.rim,
  },
  {
    key: "founders",
    name: "Founders Circle",
    badge: foundersBadge,
    tagline: ["Lead the movement.", "Leave your legacy."],
    max: 1000,
    source: "tier3",    // generation 3
    accent: TIER_PALETTE.founders.base,
    accentBright: TIER_PALETTE.founders.bright,
    accentSoft: TIER_PALETTE.founders.rim,
  },
];

export default function FoundersDashboard({ directCount = 0, tier2Count = 0, tier3Count = 0 }) {
  const bySource = { direct: directCount, tier2: tier2Count, tier3: tier3Count };
  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 13,
          fontWeight: 700,
          color: T.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Founders Dashboard
      </h2>

      <div className="space-y-3">
        {TIERS.map((tier) => (
          <CircleTierCard
            key={tier.key}
            tier={tier}
            value={bySource[tier.source] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}

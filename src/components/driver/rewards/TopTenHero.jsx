import React from "react";
import { T } from "@/components/driver/v3/v3tokens";
import { getRankBadgeForTotal, getTotalReferrals } from "@/lib/badges";

export default function TopTenHero({
  memberName,
  directCount = 0,
  networkCount = 0,
}) {
  const total = getTotalReferrals(directCount, networkCount);
  const badge = getRankBadgeForTotal(total);
  const rankLabel =
    badge.name === "Founder" ? "Founder – Circle of Trust" : badge.name;

  return (
    <div
      style={{
        padding: "24px",
        borderRadius: T.radius,
        background: "#1f1611",
        border: "1px solid rgba(255,106,0,0.22)",
        boxShadow: "0 10px 44px rgba(0,0,0,0.52), 0 1px 0 rgba(255,255,255,0.04) inset",
        isolation: "isolate",
      }}
      className="space-y-2"
    >
      {/* ── Member full name ── */}
      <div className="text-center">
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.28em",
            color: T.textMuted,
            textTransform: "uppercase",
          }}
        >
          Outriders Member
        </p>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 24,
            fontWeight: 700,
            color: T.textPrimary,
            marginTop: 6,
          }}
        >
          {memberName || "Outrider"}
        </h1>
      </div>

      {/* ── Current rank badge + label ── */}
      <div className="flex flex-col items-center gap-1">
        {badge.img && (
          <img
            src={badge.img}
            alt={badge.name}
            style={{ width: 132, height: 132, objectFit: "contain" }}
          />
        )}
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 18,
            fontWeight: 700,
            color: T.orange,
          }}
        >
          {rankLabel}
        </p>
      </div>
    </div>
  );
}
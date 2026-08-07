import React from "react";
import { T } from "@/components/driver/v3/v3tokens";

// Milestone thresholds, each tracking its own referral total.
// Leader tracks direct referrals; Guide & Protector track network referrals.
// Founder is gated by a separate Founder qualification, not a referral count.
const MILESTONES = [
  { name: "Leader", threshold: 10, label: "of 10", source: "direct" },
  { name: "Guide", threshold: 100, label: "of 100", source: "network" },
  { name: "Protector", threshold: 1000, label: "of 1,000", source: "network" },
  { name: "Founder", special: true, label: "Circle of Trust" },
];

function Eyebrow({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 10,
        fontWeight: 700,
        color: T.orange,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

function MilestoneBar({ milestone, directCount, networkCount, founderQualified }) {
  const isFounder = !!milestone.special;

  let value = 0;
  let complete = false;
  let progressText;
  let pct = 0; // 0..100

  if (isFounder) {
    complete = !!founderQualified;
    progressText = complete ? "Achieved" : "Locked — Circle of Trust";
    pct = complete ? 100 : 0;
  } else {
    value = milestone.source === "direct" ? directCount : networkCount;
    complete = value >= milestone.threshold;
    pct = Math.min(100, Math.round((value / milestone.threshold) * 100));
    progressText = complete
      ? "Achieved"
      : `${value.toLocaleString()} ${milestone.label}`;
  }

  const barColor = complete ? T.orange : T.textMuted;

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 14,
            fontWeight: 700,
            color: T.textPrimary,
          }}
        >
          {milestone.name}
        </p>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: complete ? T.orange : T.textSecondary,
            letterSpacing: "0.02em",
          }}
        >
          {progressText}
        </p>
      </div>
      <div
        style={{
          width: "100%",
          height: 8,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 999,
            background: barColor,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function TopTenRankSection({
  directCount = 0,
  networkCount = 0,
  founderQualified = false,
}) {
  return (
    <div className="space-y-4">
      <Eyebrow>Founders Program Status</Eyebrow>
      <div className="space-y-5">
        {MILESTONES.map((m) => (
          <MilestoneBar
            key={m.name}
            milestone={m}
            directCount={directCount}
            networkCount={networkCount}
            founderQualified={founderQualified}
          />
        ))}
      </div>
    </div>
  );
}
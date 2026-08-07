/**
 * MembershipSnapshot — tier, top 10, credits, referral count.
 * Supporting module below the credential card.
 */
import React from "react";
import { Award, Trophy, Star, Users } from "lucide-react";
import { T, steelCard } from "../v3/v3tokens";

function SnapshotTile({ icon: Icon, label, value, accent }) {
  return (
    <div style={{ textAlign: "center" }}>
      <Icon size={16} style={{ color: accent, marginBottom: 10 }} />
      <p
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 20,
          fontWeight: 700,
          color: T.textPrimary,
          lineHeight: 1,
          marginBottom: 5,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 9,
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </div>
  );
}

export default function MembershipSnapshot({ isFounder, hasTopTen, directCount, credits }) {
  const topTenValue = hasTopTen ? "Achieved" : `${directCount || 0}/10`;

  return (
    <div style={steelCard}>
      {/* Header */}
      <div className="flex items-center gap-2.5" style={{ marginBottom: 18 }}>
        <Award size={16} style={{ color: T.orange }} />
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 700,
            color: T.textSecondary,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Membership Snapshot
        </p>
      </div>

      <div style={{ height: 1, background: T.borderAlt, marginBottom: 24 }} />

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-8">
        <SnapshotTile
          icon={Award}
          label="Current Tier"
          value={isFounder ? "Founder" : "Member"}
          accent={T.orange}
        />
        <SnapshotTile
          icon={Trophy}
          label="Founders Status"
          value={topTenValue}
          accent={hasTopTen ? T.green : T.textMuted}
        />
        <SnapshotTile
          icon={Star}
          label="Credits"
          value={credits || 0}
          accent={T.orange}
        />
        <SnapshotTile
          icon={Users}
          label="Referral Count"
          value={directCount || 0}
          accent={T.blue}
        />
      </div>
    </div>
  );
}
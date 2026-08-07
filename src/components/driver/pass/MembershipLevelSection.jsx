/**
 * MembershipLevelSection — Founders Dashboard placeholder (coming soon).
 */
import React from "react";
import { Award, Lock } from "lucide-react";
import { T } from "../v3/v3tokens";

export default function MembershipLevelSection() {
  return (
    <div
      style={{
        padding: T.cardPad,
        borderRadius: T.radius,
        background: "#1f1611",
        border: "1px solid rgba(255,106,0,0.22)",
        boxShadow: "0 10px 44px rgba(0,0,0,0.52), 0 1px 0 rgba(255,255,255,0.04) inset",
        isolation: "isolate",
        opacity: 0.5,
        cursor: "not-allowed",
      }}
    >
      <div className="flex items-center gap-2.5" style={{ marginBottom: 18 }}>
        <Award size={16} style={{ color: T.textMuted }} />
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 700,
            color: T.textMuted,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Membership Level
        </p>
      </div>

      <div style={{ height: 1, background: T.borderAlt, marginBottom: 20 }} />

      <div
        className="flex flex-col items-center justify-center"
        style={{
          padding: "28px 16px",
          borderRadius: T.radiusSm,
          background: T.cardAlt,
          border: `1px dashed ${T.borderAlt}`,
        }}
      >
        <Lock size={22} style={{ color: T.textMuted, marginBottom: 12 }} />
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 15,
            fontWeight: 700,
            color: T.textMuted,
            marginBottom: 4,
          }}
        >
          Founders Dashboard
        </p>
        <p style={{ fontSize: 12, color: T.textMuted, textAlign: "center" }}>
          Coming soon
        </p>
      </div>
    </div>
  );
}
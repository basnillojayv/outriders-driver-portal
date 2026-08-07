/**
 * FutureSection — placeholder for upcoming member pass modules.
 * Reusable "Coming Soon" card with an icon, title, and description.
 */
import React from "react";
import { T, steelCard } from "../v3/v3tokens";

export default function FutureSection({ icon: Icon, title, description }) {
  return (
    <div style={steelCard}>
      <div className="flex items-center gap-2.5" style={{ marginBottom: 18 }}>
        <Icon size={16} style={{ color: T.textMuted }} />
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
          {title}
        </p>
      </div>

      <div style={{ height: 1, background: T.borderAlt, marginBottom: 18 }} />

      <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, marginBottom: 18 }}>
        {description}
      </p>

      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontFamily: "var(--font-heading)",
          fontSize: 10,
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${T.borderAlt}`,
          borderRadius: 999,
          padding: "5px 12px",
        }}
      >
        Coming Soon
      </span>
    </div>
  );
}
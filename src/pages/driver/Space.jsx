import React from "react";

export default function Space() {
  // FUTURE FEATURE: Reserved for proprietary space memberships and ONE★HOME program
  // Currently hidden (MVP). When enabled, this will allow members to:
  // - Browse LineHaul Station hub locations
  // - Purchase proprietary space memberships with tiered pricing
  // - Manage access QR codes and facility check-ins
  // - Explore ONE★HOME residential community options
  // See: OPEN_ITEMS.md under "Hide 'Career Center' and 'ONE★HOME Program' from navigation"

  return (
    <div style={{ padding: "40px 24px", maxWidth: 480, margin: "0 auto", textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 900, color: "var(--text-primary)", marginBottom: 12 }}>
          SPACE
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Proprietary space memberships and exclusive facilities are coming soon.
        </p>
      </div>

      <button
        disabled
        style={{
          padding: "16px 32px",
          background: "rgba(204,91,48,0.1)",
          border: "1px solid rgba(204,91,48,0.2)",
          borderRadius: 12,
          color: "var(--text-muted)",
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: 14,
          cursor: "not-allowed",
          opacity: 0.5,
        }}
      >
        Coming Soon
      </button>
    </div>
  );
}
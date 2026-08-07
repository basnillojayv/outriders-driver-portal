import React from "react";
import { T, btnSecondary } from "@/components/driver/v3/v3tokens";

/**
 * AmenitySection — reusable card for a single reservable amenity.
 * Props: icon (lucide component), title, description, features (string[]), ctaLabel
 */
export default function AmenitySection({ icon: Icon, title, description, features, ctaLabel = "Reserve" }) {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: 20,
      }}
    >
      <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: T.blueDim,
            border: `1px solid rgba(124,146,181,0.35)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={22} style={{ color: T.blue }} />
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 15,
              fontWeight: 700,
              color: T.textPrimary,
              letterSpacing: "0.01em",
            }}
          >
            {title}
          </p>
        </div>
      </div>

      {description && (
        <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, marginBottom: 14 }}>
          {description}
        </p>
      )}

      {features && features.length > 0 && (
        <div className="space-y-2" style={{ marginBottom: 16 }}>
          {features.map((f) => (
            <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span
                style={{
                  flexShrink: 0, width: 18, height: 18, borderRadius: "50%",
                  background: T.blueDim, border: `1px solid rgba(124,146,181,0.3)`,
                  color: T.blue, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 800,
                  marginTop: 1,
                }}
              >
                ✓
              </span>
              <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{f}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          disabled
          style={{
            ...btnSecondary,
            flex: 1,
            opacity: 0.5,
            cursor: "not-allowed",
            color: T.textMuted,
            borderColor: T.borderAlt,
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
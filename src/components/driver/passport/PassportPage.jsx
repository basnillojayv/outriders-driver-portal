import React from "react";
import { T } from "@/components/driver/v3/v3tokens";

export default function PassportPage({ pageNumber, title, icon: Icon, children, isComingSoon, comingSoonDescription }) {
  return (
    <div style={{
      borderRadius: "14px",
      overflow: "hidden",
      border: `1px solid ${T.border}`,
      boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      background: T.card,
      position: "relative",
    }}>
      {/* Binding spine */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: "linear-gradient(90deg, rgba(0,0,0,0.45), transparent)",
        pointerEvents: "none", zIndex: 2,
      }} />

      {/* Page header */}
      <div className="flex items-center justify-between" style={{
        padding: "14px 18px 14px 22px",
        borderBottom: `1px solid ${T.borderAlt}`,
        background: "rgba(0,0,0,0.12)",
      }}>
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} style={{ color: T.orange }} />}
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700,
            color: T.textPrimary, letterSpacing: "0.04em",
          }}>
            {title}
          </p>
        </div>
        <span style={{
          fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
          color: T.textMuted, letterSpacing: "0.18em",
        }}>
          {pageNumber}
        </span>
      </div>

      {/* Page body */}
      <div style={{ padding: 18, paddingLeft: 22, position: "relative" }}>
        {isComingSoon ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <span style={{
              display: "inline-block", fontFamily: "var(--font-heading)", fontSize: 10,
              fontWeight: 700, color: T.textMuted, letterSpacing: "0.18em",
              textTransform: "uppercase", border: `1px solid ${T.borderAlt}`,
              borderRadius: 999, padding: "4px 14px", marginBottom: 12,
            }}>
              Coming Soon
            </span>
            <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.55 }}>
              {comingSoonDescription}
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { T } from "@/components/driver/v3/v3tokens";

export default function PassportSection({ pageNumber, title, icon: Icon, children, isComingSoon, comingSoonDescription, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  // Coming Soon sections are not expandable
  if (isComingSoon) {
    return (
      <div style={{
        borderRadius: "14px", overflow: "hidden",
        border: `1px solid ${T.borderAlt}`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
        background: T.card, position: "relative", opacity: 0.75,
      }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
          background: "linear-gradient(90deg, rgba(0,0,0,0.45), transparent)",
          pointerEvents: "none", zIndex: 2,
        }} />
        <div className="flex items-center justify-between" style={{
          padding: "14px 18px 14px 22px",
          borderBottom: `1px solid ${T.borderAlt}`,
          background: "rgba(0,0,0,0.12)",
        }}>
          <div className="flex items-center gap-2">
            {Icon && <Icon size={14} style={{ color: T.textMuted }} />}
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700,
              color: T.textSecondary, letterSpacing: "0.04em",
            }}>
              {title}
            </p>
          </div>
          <span style={{
            fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
            color: T.textMuted, letterSpacing: "0.18em",
          }}>
            PAGE {pageNumber}
          </span>
        </div>
        <div style={{ padding: 18, paddingLeft: 22, textAlign: "center" }}>
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
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: "14px", overflow: "hidden",
      border: `1px solid ${open ? T.border : T.borderAlt}`,
      boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      background: T.card, position: "relative",
      transition: "border-color 0.15s",
    }}>
      {/* Binding spine */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: "linear-gradient(90deg, rgba(0,0,0,0.45), transparent)",
        pointerEvents: "none", zIndex: 2,
      }} />

      {/* Clickable header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px 14px 22px",
          borderBottom: open ? `1px solid ${T.borderAlt}` : "none",
          background: "rgba(0,0,0,0.12)", cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} style={{ color: T.orange }} />}
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700,
            color: T.textPrimary, letterSpacing: "0.04em",
          }}>
            {title}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span style={{
            fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
            color: T.textMuted, letterSpacing: "0.18em",
          }}>
            PAGE {pageNumber}
          </span>
          <ChevronDown size={15} style={{
            color: T.textMuted, transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }} />
        </div>
      </button>

      {/* Expandable body */}
      {open && (
        <div style={{ padding: 18, paddingLeft: 22, position: "relative" }}>
          {children}
        </div>
      )}
    </div>
  );
}
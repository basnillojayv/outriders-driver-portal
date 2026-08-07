/**
 * PassportPreview — modal wrapper around PassportBooklet.
 * Full-screen overlay for viewing the passport in FlippingBook mode.
 */
import React from "react";
import { X } from "lucide-react";
import { T } from "@/components/driver/v3/v3tokens";
import PassportBooklet from "./PassportBooklet";

export default function PassportPreview({ open, onClose, data }) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.92)",
      display: "flex", flexDirection: "column",
      backdropFilter: "blur(6px)",
    }}>
      {/* Top bar */}
      <div className="flex items-center justify-between" style={{
        padding: "14px 18px",
        borderBottom: `1px solid ${T.borderAlt}`,
        background: "#0a0a0a",
        flexShrink: 0,
      }}>
        <p style={{
          fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
          color: T.textPrimary, letterSpacing: "0.08em",
        }}>
          Passport Preview
        </p>
        <button onClick={onClose} style={{
          background: "transparent", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 36, height: 36, borderRadius: 10, color: T.textSecondary,
        }}>
          <X size={20} />
        </button>
      </div>

      {/* Booklet */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <PassportBooklet data={data} />
      </div>
    </div>
  );
}
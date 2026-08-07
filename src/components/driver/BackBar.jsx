import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function BackBar({ homePath = "/" }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on the section's home — nothing to go back to
  if (location.pathname === homePath) return null;

  return (
    <div
      className="sticky top-0 z-30"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 16px",
        background: "rgba(26,26,26,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 rounded-full transition-all active:scale-95"
        style={{
          padding: "6px 14px 6px 8px",
          border: "none",
          background: "#FF6A00",
          color: "#0A0A0A",
          fontFamily: "var(--font-heading)",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.02em",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(255,106,0,0.35)",
        }}
        aria-label="Go back"
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
        <span>Back</span>
      </button>
    </div>
  );
}
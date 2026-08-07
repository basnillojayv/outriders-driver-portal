import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, FileText, Briefcase, MapPin, Settings } from "lucide-react";
import { T } from "./v3tokens";

const ACTIVE = [
  { label: "Member Pass",      icon: CreditCard, path: "/member-card", color: T.orange, bg: T.card, border: "rgba(255,106,0,0.35)" },
  { label: "Terminal Network", icon: MapPin,     path: "/locations",   color: T.blue,   bg: T.card, border: "rgba(124,146,181,0.35)" },
  { label: "Account",          icon: Settings,   path: "/settings",    color: T.orange, bg: T.card, border: "rgba(255,106,0,0.25)" },
];

const COMING_SOON = [
  { label: "Resume Builder", icon: FileText  },
  { label: "Career Center",  icon: Briefcase },
];

const label = (text) =>
  <p style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 12 }}>
    {text}
  </p>;

function TileLabel({ text, muted }) {
  return (
    <span style={{ fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700, color: muted ? T.textMuted : T.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.35 }}>
      {text.split(" ").map((w, i) => <span key={i} style={{ display: "block" }}>{w}</span>)}
    </span>
  );
}

const tileBase = {
  borderRadius: 12,
  padding: "16px 10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
};

export default function V3QuickActions() {
  return (
    <div className="space-y-5">
      {/* Active tools */}
      <div>
        {label("Member Tools")}
        <div className="grid grid-cols-3 gap-3">
          {ACTIVE.map((a) => (
            <Link
              key={a.label}
              to={a.path}
              className="transition-all active:scale-95"
              style={{ ...tileBase, background: a.bg, border: `1px solid ${a.border}`, textDecoration: "none" }}
            >
              <a.icon size={19} style={{ color: a.color }} />
              <TileLabel text={a.label} />
            </Link>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div>
        {label("Coming Soon")}
        <div className="grid grid-cols-2 gap-3">
          {COMING_SOON.map((a) => (
            <div
              key={a.label}
              style={{ ...tileBase, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.borderAlt}`, opacity: 0.5, cursor: "not-allowed" }}
              aria-disabled="true"
            >
              <a.icon size={19} style={{ color: T.textMuted }} />
              <TileLabel text={a.label} muted />
              <span style={{ fontSize: 8, fontWeight: 600, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
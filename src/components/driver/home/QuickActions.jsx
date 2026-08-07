import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, FileText, Briefcase, MapPin, Settings } from "lucide-react";

const ACTIONS = [
  { label: "Member Pass", icon: CreditCard, path: "/member-card", color: "var(--fuel-300)", bg: "rgba(232,161,75,0.08)", border: "rgba(232,161,75,0.18)" },
  { label: "Resume Builder", icon: FileText, comingSoon: true, color: "var(--text-muted)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)" },
  { label: "Career Center", icon: Briefcase, comingSoon: true, color: "var(--text-muted)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)" },
  { label: "Terminal Network", icon: MapPin, path: "/locations", color: "#5b9bd5", bg: "rgba(91,155,213,0.08)", border: "rgba(91,155,213,0.18)" },
  { label: "Account", icon: Settings, path: "/settings", color: "var(--fuel-500)", bg: "rgba(204,91,48,0.08)", border: "rgba(204,91,48,0.18)" },
];

const TILE_BASE = "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl";

export default function QuickActions() {
  return (
    <div className="space-y-2.5">
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Member Tools
      </p>
      <div className="grid grid-cols-3 gap-2">
        {ACTIONS.map((action) => {
          const content = (
            <>
              <action.icon className="w-5 h-5 flex-shrink-0" style={{ color: action.color }} />
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 9,
                  fontWeight: 800,
                  color: action.comingSoon ? "var(--text-muted)" : "var(--text-secondary)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {action.label.split(" ").map((word, i) => (
                  <span key={i} style={{ display: "block" }}>
                    {word}
                  </span>
                ))}
              </span>
              {action.comingSoon && (
                <span
                  style={{
                    fontSize: 7,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    opacity: 0.85,
                  }}
                >
                  Coming Soon
                </span>
              )}
            </>
          );

          if (action.comingSoon) {
            return (
              <div
                key={action.label}
                className={TILE_BASE}
                style={{
                  background: action.bg,
                  border: `1px solid ${action.border}`,
                  opacity: 0.6,
                  cursor: "not-allowed",
                }}
                aria-disabled="true"
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={action.label}
              to={action.path}
              className={`${TILE_BASE} transition-all active:scale-95`}
              style={{
                background: action.bg,
                border: `1px solid ${action.border}`,
                textDecoration: "none",
              }}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
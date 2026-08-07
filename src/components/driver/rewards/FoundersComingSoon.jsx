/**
 * FoundersComingSoon — placeholder "Coming Soon" section for the Founders page.
 * Inactive cards for Leaderboards, Rewards, and Advisory Boards.
 */
import React from "react";
import { T, steelCard } from "../v3/v3tokens";
import { Trophy, Gift, Users } from "lucide-react";

const ITEMS = [
  { icon: Trophy, title: "Leaderboards" },
  { icon: Gift, title: "Rewards" },
  { icon: Users, title: "Advisory Boards" },
];

export default function FoundersComingSoon() {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 13,
          fontWeight: 700,
          color: T.textSecondary,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Coming Soon
      </p>

      <div className="space-y-3">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              style={{
                ...steelCard,
                opacity: 0.6,
                background: T.cardAlt,
                border: `1px solid ${T.borderAlt}`,
              }}
            >
              <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${T.borderAlt}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} style={{ color: T.textMuted }} />
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.textSecondary,
                  }}
                >
                  {item.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
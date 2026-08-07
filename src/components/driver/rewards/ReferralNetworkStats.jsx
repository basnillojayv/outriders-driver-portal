import React from "react";
import { Users, Zap, Trophy, Coins } from "lucide-react";

const STATS = [
  {
    label: "Direct Referrals",
    key: "direct",
    icon: Users,
    color: "#18a06b",
  },
  {
    label: "Tier 2 Referrals",
    key: "tier2",
    icon: Zap,
    color: "var(--fuel-500)",
  },
  {
    label: "Tier 3 Referrals",
    key: "tier3",
    icon: Trophy,
    color: "var(--accent)",
  },
  {
    label: "Total Credits",
    key: "credits",
    icon: Coins,
    color: "var(--accent)",
  },
];

export default function ReferralNetworkStats({ directCount, networkCount, tier2, tier3, credits }) {
  const stats = [
    { ...STATS[0], value: directCount },
    { ...STATS[1], value: tier2 || 0 },
    { ...STATS[2], value: tier3 || 0 },
    { ...STATS[3], value: credits || 0 },
  ];

  return (
    <div className="space-y-3">
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Referral Network
      </p>

      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              className="rounded-xl p-4"
              style={{
                background: "var(--carbon-800)",
                border: "1px solid var(--carbon-500)",
              }}
            >
              <div className="flex items-start gap-2 mb-3">
                <Icon size={16} style={{ color: stat.color, marginTop: 1 }} />
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </p>
              </div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 900, color: "var(--text-primary)" }}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
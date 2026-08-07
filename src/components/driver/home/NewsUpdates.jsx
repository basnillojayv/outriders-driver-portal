import React from "react";
import { MapPin, Megaphone } from "lucide-react";

const ITEMS = [
  {
    icon: MapPin,
    tag: "Terminal",
    title: "West Memphis, AR — Opening 2026",
    desc: "America's first LineHaul Station terminal. Construction is underway.",
    date: "Jun 2026",
  },
  {
    icon: Megaphone,
    tag: "Member News",
    title: "Top 10 Truckers program is live",
    desc: "Invite 10 drivers and earn your Lead badge. Rewards launching soon.",
    date: "Jun 2026",
  },
];

export default function NewsUpdates() {
  return (
    <div className="space-y-2.5">
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        News & Updates
      </p>
      <div className="space-y-2">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex gap-3 px-4 py-3 rounded-xl"
            style={{ background: "var(--carbon-800)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
              style={{ background: "rgba(204,91,48,0.08)", border: "1px solid rgba(204,91,48,0.15)" }}
            >
              <item.icon className="w-4 h-4" style={{ color: "var(--fuel-500)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 8, fontWeight: 800, color: "var(--fuel-300)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  {item.tag}
                </span>
                <span style={{ fontSize: 8, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{item.date}</span>
              </div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.3 }}>{item.title}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
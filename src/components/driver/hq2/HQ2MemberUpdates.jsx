import React from "react";
import { Link } from "react-router-dom";
import { Trophy, MapPin, ArrowRight } from "lucide-react";

const UPDATES = [
  {
    id: "founders",
    icon: Trophy,
    eyebrow: "Founders Program • Top 10 Truckers",
    title: "Now Live",
    description: "Refer the 10 best truckers you know.",
    buttonLabel: "View Program",
    to: "/rewards",
    accent: "#FF6600",
    bg: "rgba(255,102,0,0.08)",
    buttonText: "#0A0A0A",
  },
  {
    id: "memphis",
    icon: MapPin,
    title: "West Memphis Terminal",
    subtitle: "Opening August 2026",
    description:
      "Stay up to date on terminal opening announcements and operational updates.",
    buttonLabel: "Learn More",
    to: "/locations",
    accent: "#4A6FA3",
    bg: "rgba(74,111,163,0.12)",
    buttonText: "#FFFFFF",
  },
];

function UpdateCard({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  description,
  buttonLabel,
  to,
  accent,
  bg,
  buttonText,
}) {
  return (
    <div className="rounded-xl p-4" style={{ background: bg, border: `1px solid ${accent}22` }}>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
        style={{ background: `${accent}22` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>

      {eyebrow && (
        <p
          className="font-v2-sub uppercase"
          style={{ fontSize: 9, fontWeight: 700, color: accent, letterSpacing: "0.12em", marginBottom: 4 }}
        >
          {eyebrow}
        </p>
      )}

      <h3
        className="font-v2-sub text-v2-text"
        style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}
      >
        {title}
      </h3>

      {subtitle && (
        <p className="font-v2-sub" style={{ fontSize: 12, fontWeight: 700, color: accent, marginTop: 2 }}>
          {subtitle}
        </p>
      )}

      <p className="font-v2-body" style={{ fontSize: 13, color: "#AEB7C0", lineHeight: 1.5, marginTop: 8 }}>
        {description}
      </p>

      <Link
        to={to}
        className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-2 rounded-lg transition-all active:scale-95"
        style={{
          background: accent,
          color: buttonText,
          fontFamily: "Oswald, sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.02em",
          textDecoration: "none",
        }}
      >
        {buttonLabel}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default function HQ2MemberUpdates() {
  return (
    <div className="space-y-2">
      <p
        className="font-v2-sub uppercase"
        style={{ fontSize: 10, fontWeight: 700, color: "#6B7480", letterSpacing: "0.2em", marginBottom: 3 }}
      >
        Member Updates
      </p>
      {UPDATES.map((u) => (
        <UpdateCard key={u.id} {...u} />
      ))}
    </div>
  );
}
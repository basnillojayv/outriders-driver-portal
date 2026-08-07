import React from "react";
import { Link } from "react-router-dom";
import { Trophy, MapPin, ArrowRight } from "lucide-react";

const UPDATES = [
  {
    id: "founders",
    icon: Trophy,
    eyebrow: "Founders Program • Top 10 Truckers",
    title: "NOW LIVE",
    description: "Refer the 10 best truckers you know.",
    buttonLabel: "View Program",
    to: "/rewards",
    accent: "var(--fuel-300)",
    bg: "rgba(232,161,75,0.08)",
    buttonBg: "linear-gradient(135deg, var(--fuel-500), var(--fuel-400))",
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
    accent: "#5b9bd5",
    bg: "rgba(91,155,213,0.08)",
    buttonBg: "#5b9bd5",
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
  buttonBg,
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: bg, border: `1px solid ${accent}22` }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
        style={{ background: `${accent}22` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>

      {eyebrow && (
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 9,
            fontWeight: 800,
            color: accent,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {eyebrow}
        </p>
      )}

      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 17,
          fontWeight: 900,
          color: "var(--text-primary)",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>

      {subtitle && (
        <p style={{ fontSize: 12, fontWeight: 700, color: accent, marginTop: 2 }}>
          {subtitle}
        </p>
      )}

      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
          marginTop: 8,
        }}
      >
        {description}
      </p>

      <Link
        to={to}
        className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-2 rounded-lg transition-all active:scale-95"
        style={{
          background: buttonBg,
          color: "#fff",
          fontFamily: "var(--font-heading)",
          fontSize: 12,
          fontWeight: 800,
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

export default function MemberUpdates() {
  return (
    <div className="space-y-2">
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 10,
          fontWeight: 800,
          color: "var(--text-muted)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 3,
        }}
      >
        Member Updates
      </p>
      {UPDATES.map((u) => (
        <UpdateCard key={u.id} {...u} />
      ))}
    </div>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { Trophy, MapPin, ArrowRight } from "lucide-react";
import { T, steelCard, btnAccent } from "./v3tokens";

const UPDATES = [
  {
    id: "founders",
    icon: Trophy,
    eyebrow: "Founders Program • Top 10 Truckers",
    title: "Now Live",
    description: "Refer the 10 best truckers you know.",
    buttonLabel: "View Program",
    to: "/rewards",
    accent: T.orange,
    accentDim: T.orangeDim,
  },
  {
    id: "memphis",
    icon: MapPin,
    title: "West Memphis Terminal",
    subtitle: "Opening August 2026",
    description: "Stay up to date on terminal opening announcements and operational updates.",
    buttonLabel: "Learn More",
    to: "/locations",
    accent: T.blue,
    accentDim: T.blueDim,
  },
];

function UpdateCard({ icon: Icon, eyebrow, title, subtitle, description, buttonLabel, to, accent, accentDim }) {
  return (
    <div
      style={{
        ...steelCard,
        borderColor: `${accent}22`,
        padding: "22px",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: accentDim,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <Icon size={17} style={{ color: accent }} />
      </div>

      {eyebrow && (
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 9,
            fontWeight: 700,
            color: accent,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {eyebrow}
        </p>
      )}

      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 18,
          fontWeight: 700,
          color: T.textPrimary,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>

      {subtitle && (
        <p style={{ fontSize: 13, fontWeight: 600, color: accent, marginTop: 4 }}>
          {subtitle}
        </p>
      )}

      <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.6, marginTop: 12, marginBottom: 18 }}>
        {description}
      </p>

      <Link
        to={to}
        className="inline-flex items-center gap-2 transition-all active:scale-95"
        style={{ ...btnAccent, borderColor: `${accent}40`, color: accent, background: accentDim, width: "auto", display: "inline-flex" }}
      >
        {buttonLabel}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default function V3MemberUpdates() {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 11,
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Member Updates
      </p>
      <div className="space-y-4">
        {UPDATES.map((u) => <UpdateCard key={u.id} {...u} />)}
      </div>
    </div>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { T } from "../v3tokens";

const FOUNDERS_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/29e4c6607_founders_program.svg";
const LOCATION_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/ead1d468e_network.svg";

const NEWS = [
  {
    id: "founders",
    image: FOUNDERS_ICON,
    title: "Founders Program: Now Live",
    sub: "Refer the ten best truckers you know.",
    to: "/rewards",
    accent: T.orange,
    accentDim: T.orangeDim,
  },
  {
    id: "memphis",
    image: LOCATION_ICON,
    title: "West Memphis: Opening Soon",
    sub: "August 1, 2026",
    to: "/locations",
    accent: T.blue,
    accentDim: T.blueDim,
  },
];

function NewsRow({ image, title, sub, to, accent, accentDim }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 transition-all active:scale-[0.98]"
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          width: 44, height: 44, borderRadius: 10,
          background: accentDim, border: `1px solid ${accent}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <img src={image} alt={title} style={{ width: 34, height: 34, objectFit: "contain" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 13,
            fontWeight: 700,
            color: T.textPrimary,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{sub}</p>
      </div>
      <ChevronRight size={18} style={{ color: T.textMuted, flexShrink: 0 }} />
    </Link>
  );
}

function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 11,
        fontWeight: 700,
        color: T.orange,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  );
}

export default function HomeBreakingNews() {
  return (
    <div>
      <SectionLabel>Club Updates</SectionLabel>
      <div
        style={{
          backgroundColor: "#0C1422",
          backgroundImage:
            "radial-gradient(circle at 20% 18%, rgba(50,74,112,0.55) 0%, transparent 48%)," +
            "radial-gradient(circle at 80% 82%, rgba(36,56,88,0.50) 0%, transparent 52%)," +
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 4px)",
          border: "1px solid #2E4A78",
          borderRadius: T.radius,
          overflow: "hidden",
          boxShadow:
            "inset 0 1px 0 rgba(124,146,181,0.22), inset 0 0 16px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.4)",
        }}
      >
        {NEWS.map((n, i) => (
          <React.Fragment key={n.id}>
            <div style={{ padding: "14px 16px" }}>
              <NewsRow {...n} />
            </div>
            {i < NEWS.length - 1 && (
              <div style={{ height: 1, background: "rgba(124,146,181,0.18)", marginLeft: 70 }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
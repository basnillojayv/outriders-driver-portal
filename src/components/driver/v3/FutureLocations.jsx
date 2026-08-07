/**
 * FutureLocations — placeholder section for upcoming hubs + member poll.
 * Poll is a placeholder (coming soon) per current MVP scope.
 */
import React from "react";
import { MapPin, Vote, Lock } from "lucide-react";
import { T, steelCard } from "./v3tokens";

const CANDIDATES = [
  { city: "Atlanta, GA",     region: "Southeast",  eta: "TBD" },
  { city: "Dallas, TX",      region: "Southwest",  eta: "TBD" },
  { city: "Indianapolis, IN", region: "Midwest",   eta: "TBD" },
];

function CandidateRow({ city, region, eta }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "14px 0",
        borderBottom: `1px solid ${T.borderAlt}`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 34, height: 34, borderRadius: 9,
            background: T.orangeDim,
            border: `1px solid rgba(255,106,0,0.28)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <MapPin size={16} style={{ color: T.orange }} />
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, color: T.textPrimary }}>
            {city}
          </p>
          <p style={{ fontSize: 11, color: T.textMuted, letterSpacing: "0.04em" }}>
            {region}
          </p>
        </div>
      </div>
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 11,
          color: T.textMuted,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {eta}
      </span>
    </div>
  );
}

export default function FutureLocations() {
  return (
    <div className="space-y-3">
      <SectionLabel>Future Locations</SectionLabel>

      {/* Video */}
      <a
        href="https://youtu.be/-VpedfMmwyI"
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-all active:scale-95"
        style={{
          position: "relative",
          display: "block",
          borderRadius: T.radius,
          overflow: "hidden",
          border: `1px solid ${T.border}`,
          textDecoration: "none",
        }}
      >
        <img
          src="https://img.youtube.com/vi/-VpedfMmwyI/hqdefault.jpg"
          alt="Outriders Future Locations"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)",
          }}
        >
          <div
            style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(255,106,0,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(255,106,0,0.5)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A0A0A">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </a>

      {/* Candidate list */}
      <div style={steelCard}>
        <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, marginBottom: 8 }}>
          We're scouting the next Outriders hubs. Here are a few regions under consideration.
        </p>
        {CANDIDATES.map((c, i) => (
          <div key={c.city}>
            <CandidateRow {...c} />
            {i === CANDIDATES.length - 1 && (
              <div style={{ height: 1, background: T.borderAlt }} />
            )}
          </div>
        ))}
      </div>

      {/* Poll placeholder */}
      <div
        style={{
          ...steelCard,
          background: T.cardAlt,
          border: `1px dashed ${T.border}`,
          opacity: 0.85,
        }}
      >
        <div className="flex items-center gap-2.5" style={{ marginBottom: 14 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 9,
              background: T.orangeDim,
              border: `1px solid rgba(255,106,0,0.28)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Vote size={16} style={{ color: T.orange }} />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, color: T.textPrimary }}>
              Vote: Next Hub City
            </p>
            <p style={{ fontSize: 11, color: T.textMuted, letterSpacing: "0.04em" }}>
              Member poll
            </p>
          </div>
        </div>

        <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, marginBottom: 16 }}>
          Help decide where Outriders opens its next hub. Cast your vote and see live results from the community.
        </p>

        <div
          className="flex items-center justify-center gap-2"
          style={{
            padding: "12px 16px",
            borderRadius: T.radiusSm,
            background: T.card,
            border: `1px solid ${T.borderAlt}`,
          }}
        >
          <Lock size={14} style={{ color: T.textMuted }} />
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: T.textMuted,
            }}
          >
            Polling Opens Soon
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 11,
        fontWeight: 700,
        color: T.textMuted,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}
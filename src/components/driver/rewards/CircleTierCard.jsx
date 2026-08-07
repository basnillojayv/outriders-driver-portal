/**
 * CircleTierCard — one Founders Circle: badge, name, and its instrument.
 *
 * Both halves come from the asset sheet. The badge is artwork and ships as a
 * PNG; the gauge is rebuilt live (see TierGaugeUnit) because the artwork's
 * needle and readout are baked at fixed values. The gauge carries its own
 * count and "members to go" line, so the card adds no duplicate readout.
 */
import React from "react";
import { T } from "../v3/v3tokens";
import TierGaugeUnit from "./TierGaugeUnit";
import { TIER_GAUGE } from "./tierPalette";

export default function CircleTierCard({ tier, value = 0 }) {
  const { key, name, badge, tagline, max, accentBright, accentSoft } = tier;
  const complete = value >= max;

  return (
    <section
      className="tier-card"
      style={{
        background: T.card,
        border: `1px solid ${complete ? accentBright : accentSoft}`,
        borderRadius: T.radius,
        padding: "16px 16px 14px",
        boxShadow: complete
          ? `0 0 0 1px ${accentSoft}, 0 6px 24px -14px ${accentBright}`
          : "0 6px 22px -16px rgba(0,0,0,0.9)",
        isolation: "isolate",
      }}
    >
      {/* Badge + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <img
          src={badge}
          alt=""
          width={395}
          height={395}
          loading="lazy"
          style={{
            width: "clamp(62px, 17vw, 82px)",
            height: "auto",
            flexShrink: 0,
            filter: complete ? `drop-shadow(0 0 12px ${accentSoft})` : "saturate(0.94) brightness(0.96)",
          }}
        />
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(17px, 4.6vw, 20px)",
              color: T.textPrimary,
              lineHeight: 1.15,
              textTransform: "uppercase",
              letterSpacing: "0.01em",
            }}
          >
            {name}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(14px, 3.6vw, 15px)",
              color: T.textMuted,
              lineHeight: 1.4,
              marginTop: 3,
            }}
          >
            {tagline.map((line, i) => (
              <React.Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* Instrument */}
      <div style={{ marginTop: 14 }}>
        <TierGaugeUnit value={value} max={max} tone={TIER_GAUGE[key]} uid={`tier-${key}`} />
      </div>
    </section>
  );
}

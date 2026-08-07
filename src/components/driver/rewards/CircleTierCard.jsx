/**
 * CircleTierCard — one Founders Circle tier: badge, copy, live count and dial.
 *
 * The mock-up puts badge, copy and dial on a single row. At phone widths that
 * leaves the copy under ~100px, which wraps every title onto two lines, so the
 * card reflows to two rows — badge + copy, then count + dial — and returns to
 * the mock-up's single row once there is room for it.
 */
import React from "react";
import { Users, Check } from "lucide-react";
import { T } from "../v3/v3tokens";
import CircleTierGauge from "./CircleTierGauge";
import { TIER_GAUGE } from "./tierPalette";

export default function CircleTierCard({ tier, value = 0 }) {
  const { key, name, badge, tagline, max, accent, accentBright, accentSoft } = tier;
  const capped = Math.min(value, max);
  const remaining = Math.max(0, max - value);
  const complete = value >= max;

  return (
    <section
      className="tier-card"
      style={{
        background: T.card,
        border: `1px solid ${complete ? accent : accentSoft}`,
        borderRadius: T.radius,
        padding: "15px 16px 12px",
        boxShadow: complete
          ? `0 0 0 1px ${accentSoft}, 0 6px 22px -12px ${accent}`
          : "0 6px 22px -16px rgba(0,0,0,0.9)",
        isolation: "isolate",
      }}
    >
      <div className="tier-card__body">
        {/* Badge */}
        <img
          className="tier-card__badge"
          src={badge}
          alt=""
          width={200}
          height={200}
          loading="lazy"
          style={{
            filter: complete
              ? `drop-shadow(0 0 10px ${accentSoft})`
              : "saturate(0.9) brightness(0.94)",
          }}
        />

        {/* Title + tagline */}
        <div className="tier-card__copy">
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

        {/* Count */}
        <div className="tier-card__count">
          <p style={{ whiteSpace: "nowrap" }}>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "clamp(30px, 8.4vw, 36px)",
                color: accentBright,
                letterSpacing: "-0.01em",
              }}
            >
              {capped.toLocaleString()}
            </span>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(16px, 4.4vw, 19px)",
                color: T.textMuted,
                marginLeft: 5,
              }}
            >
              / {max.toLocaleString()}
            </span>
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(14px, 3.6vw, 15px)",
              color: T.textMuted,
              marginTop: 1,
            }}
          >
            Members
          </p>
        </div>

        {/* Dial */}
        <div className="tier-card__gauge">
          <CircleTierGauge
            value={value}
            max={max}
            accent={accent}
            accentBright={accentBright}
            tone={TIER_GAUGE[key]}
            uid={`tier-${key}`}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginTop: 11,
          paddingTop: 10,
          borderTop: `1px solid ${T.borderAlt}`,
        }}
      >
        {complete ? (
          <Check size={14} strokeWidth={2.5} style={{ color: accentBright, flexShrink: 0 }} />
        ) : (
          <Users size={14} strokeWidth={2.2} style={{ color: accentBright, flexShrink: 0 }} />
        )}
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: 13.5,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: complete ? accentBright : T.textSecondary,
          }}
        >
          {complete ? (
            "Circle complete"
          ) : (
            <>
              <span style={{ color: accentBright }}>{remaining.toLocaleString()}</span> members to go
            </>
          )}
        </span>
      </div>
    </section>
  );
}

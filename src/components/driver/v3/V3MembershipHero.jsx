/**
 * V3MembershipHero — Premium membership credential hero.
 * Emotional direction: AmEx Platinum card. Not a dashboard.
 * The member should feel: "I belong here."
 */
import React from "react";
import { T } from "./v3tokens";

const OUTRIDERS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/6cb494d67_lhs_outriders_logo_circle.png";

export default function V3MembershipHero({ firstName, memberID, memberSince, status = "Active" }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
  const sinceYear = memberSince ? new Date(memberSince).getFullYear() : null;

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 22,
        overflow: "hidden",
        padding: "38px 30px 42px",
        background: "#141414",
        border: "1px solid rgba(255,106,0,0.22)",
        boxShadow: "0 10px 44px rgba(0,0,0,0.52), 0 1px 0 rgba(255,255,255,0.04) inset",
        isolation: "isolate",
        minHeight: 268,
      }}
    >
      {/* Carbon fiber texture — hero only */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.03) 0px,
              rgba(255,255,255,0.03) 1px,
              transparent 1px,
              transparent 6px
            )
          `,
          pointerEvents: "none",
        }}
      />

      {/* Top orange accent bar */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${T.orange} 25%, ${T.orange} 75%, transparent 100%)`,
          zIndex: 1,
        }}
      />

      {/* Oversized Outriders watermark — deep background, 6% opacity */}
      <img
        src={OUTRIDERS_LOGO}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          bottom: -34,
          right: -34,
          width: 220,
          height: 220,
          objectFit: "contain",
          opacity: 0.06,
          zIndex: 0,
          pointerEvents: "none",
          filter: "grayscale(100%)",
        }}
      />

      {/* Content layer */}
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* Row 1: Greeting + Outriders focal logo */}
        <div className="flex items-start justify-between" style={{ marginBottom: 24 }}>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 11,
              fontWeight: 600,
              color: T.textMuted,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            Good {greeting}
          </p>

          {/* Outriders logo — premium focal element, upper right (restrained glow) */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(255,106,0,0.10) 0%, transparent 70%)`,
                filter: "blur(8px)",
              }}
            />
            <img
              src={OUTRIDERS_LOGO}
              alt="Outriders"
              style={{
                width: 54,
                height: 54,
                objectFit: "contain",
                position: "relative",
                zIndex: 1,
                filter: "drop-shadow(0 2px 8px rgba(255,106,0,0.18))",
              }}
            />
          </div>
        </div>

        {/* Row 2: Member name — largest text (Display) */}
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 44,
            fontWeight: 900,
            color: T.textPrimary,
            lineHeight: 1.0,
            letterSpacing: "0.01em",
            marginBottom: 30,
          }}
        >
          {firstName}
        </h1>

        {/* Row 3: Status badges */}
        <div className="flex items-center gap-2.5" style={{ marginBottom: 28 }}>
          {/* Active badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(24,195,126,0.1)",
              border: "1px solid rgba(24,195,126,0.28)",
              borderRadius: 20,
              padding: "5px 12px",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 11,
                fontWeight: 700,
                color: T.green,
                letterSpacing: "0.02em",
              }}
            >
              {status}
            </span>
          </span>

          {/* Founding Member badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "rgba(255,106,0,0.1)",
              border: "1px solid rgba(255,106,0,0.28)",
              borderRadius: 20,
              padding: "5px 12px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 11,
                fontWeight: 700,
                color: T.orange,
                letterSpacing: "0.02em",
              }}
            >
              Founding Member
            </span>
          </span>
        </div>

        {/* Thin divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 22 }} />

        {/* Row 4: Member Since + Member ID */}
        <div className="flex items-end justify-between">
          {sinceYear && (
            <div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 9,
                  fontWeight: 700,
                  color: T.textMuted,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                Member Since
              </p>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 16,
                  fontWeight: 600,
                  color: T.textSecondary,
                }}
              >
                {sinceYear}
              </p>
            </div>
          )}

          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 9,
                fontWeight: 700,
                color: T.textMuted,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 5,
              }}
            >
              Member ID
            </p>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 15,
                fontWeight: 700,
                color: T.orange,
                letterSpacing: "0.1em",
              }}
            >
              {memberID || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
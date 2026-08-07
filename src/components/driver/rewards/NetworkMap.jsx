/**
 * NetworkMap — the three referral generations as concentric machined rings.
 *
 * Drawn rather than shipped as artwork so it reports the driver's actual
 * standing: each ring holds ten seats, and a seat lights as that generation
 * fills. One seat is one member on the inner ring, ten on the middle, a hundred
 * on the outer — the 10 → 100 → 1,000 shape of the programme, to scale.
 *
 * Display-only. Every value it encodes is restated in the legend beneath, so
 * nothing depends on reading colour or on seeing the graphic at all.
 */
import React, { useEffect, useRef, useState } from "react";
import { T } from "../v3/v3tokens";
import NetworkNode from "./NetworkNode";
import { TIER_PALETTE, TIER_OFF } from "./tierPalette";
import innerBadge from "@/assets/founders/inner-circle.png";
import convoyBadge from "@/assets/founders/convoy-circle.png";
import foundersBadge from "@/assets/founders/founders-circle.png";

const VB = 460;
const C = VB / 2;
const SEATS = 10;

const BADGE = 52;          // identical for all three Circles

const RINGS = [
  { key: "inner",    r: 66,  node: 14, seatOffset: 0,  total: 10,    badge: innerBadge,    atCentre: true },
  { key: "convoy",   r: 135, node: 16, seatOffset: 18, total: 100,   badge: convoyBadge },
  { key: "founders", r: 191, node: 17, seatOffset: 18, total: 1000,  badge: foundersBadge },
];

const polar = (r, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
};

function useSettle(target, duration = 1100) {
  const [v, setV] = useState(0);
  const raf = useRef();
  useEffect(() => {
    // rAF never fires while the tab is hidden, and motion must never be the only
    // path to the true value — jump straight to it when animation can't run.
    const skip =
      (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) ||
      (typeof document !== "undefined" && document.visibilityState === "hidden");
    if (skip) { setV(target); return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return v;
}

const LEGEND = {
  inner:    ["Inner Circle", "One seat = one member"],
  convoy:   ["Convoy Circle", "One seat = ten members"],
  founders: ["Founders Circle", "One seat = one hundred members"],
};

export default function NetworkMap({ directCount = 0, tier2Count = 0, tier3Count = 0 }) {
  const counts = { inner: directCount, convoy: tier2Count, founders: tier3Count };
  const progress = useSettle(1);
  const total = directCount + tier2Count + tier3Count;

  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 13,
          fontWeight: 700,
          color: T.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Your Network
      </h2>

      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: T.radius,
          padding: "16px 14px 16px",
          isolation: "isolate",
        }}
      >
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          style={{ width: "100%", height: "auto", display: "block", maxWidth: 460, margin: "0 auto" }}
          role="img"
          aria-label={
            `Referral network. Inner Circle ${directCount} of 10 direct members. ` +
            `Convoy Circle ${tier2Count} of 100. Founders Circle ${tier3Count} of 1,000.`
          }
        >
          <defs>
            {/* Brushed steel — softer stop ramp than mirror chrome, which the
                design system reads as gaming UI rather than equipment. */}
            <linearGradient id="nm-steel" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#C9CED3" />
              <stop offset="26%" stopColor="#7E858C" />
              <stop offset="50%" stopColor="#AEB4BA" />
              <stop offset="74%" stopColor="#666D74" />
              <stop offset="100%" stopColor="#9AA1A8" />
            </linearGradient>
            <linearGradient id="nm-bezel" x1="0.15" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stopColor="#B9C0C7" />
              <stop offset="34%" stopColor="#6E757C" />
              <stop offset="62%" stopColor="#A2A9B0" />
              <stop offset="100%" stopColor="#454B51" />
            </linearGradient>

            {/* Recessed dial face — solid fill; carbon texture is reserved for
                the hero and page background. */}
            <radialGradient id="nm-face" cx="42%" cy="34%" r="80%">
              <stop offset="0%" stopColor="#1B1E21" />
              <stop offset="62%" stopColor="#131517" />
              <stop offset="100%" stopColor="#0A0B0C" />
            </radialGradient>

            {/* Matte shading on a seat face: light falls off downward. */}
            <radialGradient id="nm-face-shade" cx="38%" cy="26%" r="86%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.20)" />
              <stop offset="46%" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.52)" />
            </radialGradient>
            <linearGradient id="nm-lip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.34)" />
              <stop offset="52%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
            </linearGradient>
            <linearGradient id="nm-mark" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="62%" stopColor="#DFE4E8" />
              <stop offset="100%" stopColor="#A6ACB2" />
            </linearGradient>

            <filter id="nm-drop" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.7" />
            </filter>
          </defs>

          {/* ── dial body ── */}
          <circle cx={C} cy={C} r="222" fill="#0A0B0C" />
          <circle cx={C} cy={C} r="217" fill="none" stroke="url(#nm-steel)" strokeWidth="8" />
          <circle cx={C} cy={C} r="221" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1" />
          <circle cx={C} cy={C} r="212" fill="none" stroke="rgba(0,0,0,0.8)" strokeWidth="2" />
          <circle cx={C} cy={C} r="208" fill="url(#nm-face)" />
          <circle cx={C} cy={C} r="208" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {/* compass points on the outer band */}
          {[0, 90, 180, 270].map((deg) => {
            const p = polar(217, deg);
            return (
              <path
                key={deg}
                d="M0 -10 2.6 -2.6 10 0 2.6 2.6 0 10 -2.6 2.6 -10 0 -2.6 -2.6Z"
                transform={`translate(${p.x} ${p.y})`}
                fill="url(#nm-steel)"
                filter="url(#nm-drop)"
              />
            );
          })}

          {/* ── orbits ── */}
          {RINGS.map((ring) => {
            const value = counts[ring.key];
            const active = value > 0;
            return (
              <g key={`orbit-${ring.key}`}>
                <circle
                  cx={C} cy={C} r={ring.r}
                  fill="none"
                  stroke={active ? TIER_PALETTE[ring.key].base : "rgba(255,255,255,0.10)"}
                  strokeWidth="2"
                  opacity={active ? 0.75 : 1}
                />
                <circle
                  cx={C} cy={C} r={ring.r - 24}
                  fill="none"
                  stroke={active ? TIER_PALETTE[ring.key].base : "rgba(255,255,255,0.07)"}
                  strokeWidth="1.2"
                  strokeDasharray="6 9"
                  opacity={active ? 0.45 : 1}
                />
              </g>
            );
          })}

          {/* ── seats ── */}
          {RINGS.map((ring) => {
            const value = counts[ring.key];
            const litSeats = Math.min(
              SEATS,
              Math.floor((value / ring.total) * SEATS + 1e-9)
            );
            return (
              <g key={`seats-${ring.key}`}>
                {Array.from({ length: SEATS }, (_, i) => {
                  const deg = ring.seatOffset + (i / SEATS) * 360;
                  const p = polar(ring.r, deg);
                  const lit = i < litSeats;
                  const appear = Math.max(0, Math.min(1, progress * 1.45 - i * 0.045));
                  return (
                    <g key={i} opacity={0.35 + 0.65 * appear}>
                      <NetworkNode
                        x={p.x}
                        y={p.y}
                        r={ring.node * (0.9 + 0.1 * appear)}
                        kind={ring.key}
                        lit={lit}
                        tone={lit ? TIER_PALETTE[ring.key] : TIER_OFF}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* ── Circle badges — identical size; Inner at the hub, the other
                 two at the head of their own orbit ── */}
          {RINGS.map((ring) => {
            const p = ring.atCentre ? { x: C, y: C } : polar(ring.r, 0);
            const h = BADGE / 2;
            return (
              <g key={`badge-${ring.key}`} filter="url(#nm-drop)">
                <circle cx={p.x} cy={p.y} r={h + 4} fill="#0A0B0C" />
                <circle cx={p.x} cy={p.y} r={h + 2.5} fill="none" stroke="url(#nm-steel)" strokeWidth="2.5" />
                <image href={ring.badge} x={p.x - h} y={p.y - h} width={BADGE} height={BADGE} />
              </g>
            );
          })}
        </svg>

        {/* Legend — every value above, restated in text */}
        <ul style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {RINGS.map((ring) => (
            <li key={ring.key} style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span
                aria-hidden
                style={{
                  width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                  background: counts[ring.key] > 0
                    ? `radial-gradient(circle at 34% 26%, ${TIER_PALETTE[ring.key].bright}, ${TIER_PALETTE[ring.key].base} 55%, ${TIER_PALETTE[ring.key].rim})`
                    : TIER_OFF.base,
                  border: `2px solid ${counts[ring.key] > 0 ? "#C9CED3" : "rgba(255,255,255,0.25)"}`,
                }}
              />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-heading)",
                    fontSize: 15,
                    fontWeight: 700,
                    color: T.textPrimary,
                  }}
                >
                  {LEGEND[ring.key][0]}
                </span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: T.textMuted,
                  }}
                >
                  {LEGEND[ring.key][1]}
                </span>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: T.textSecondary,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "#FFFFFF" }}>{counts[ring.key].toLocaleString()}</span>
                {" / "}
                {ring.total.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>

        <p
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: `1px solid ${T.borderAlt}`,
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: T.textSecondary,
          }}
        >
          {total > 0 ? (
            <>Your network stands at{" "}
              <strong style={{ color: T.textPrimary, fontWeight: 700 }}>{total.toLocaleString()}</strong>{" "}
              {total === 1 ? "driver" : "drivers"}.</>
          ) : (
            "Refer your first driver to light up the Inner Circle."
          )}
        </p>
      </div>
    </div>
  );
}

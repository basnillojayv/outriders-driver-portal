/**
 * CircleTierGauge — automotive half-sweep gauge for a Founders Circle tier.
 *
 * Drawn as SVG rather than a bitmap so the needle tracks live referral counts
 * and the dial stays crisp at any size. Geometry mirrors the Founders Program
 * mock-up: 180° sweep, coloured progress band, knurled chrome hub, six labels.
 */
import React, { useEffect, useRef, useState } from "react";

const VB_W = 300;
const VB_H = 150;
const CX = 150;
const CY = 126;
const R = 88;          // band centreline
const BAND = 15;       // band thickness
const LABEL_R = R + 26;

const NEEDLE_W = 11;

const polar = (r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) };
};

const arcPath = (r, fromDeg, toDeg) => {
  const a = polar(r, fromDeg);
  const b = polar(r, toDeg);
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
};

const fmt = (n) => Math.round(n).toLocaleString();

/** Animates from 0 to `value`, respecting reduced-motion. */
function useSweep(value, duration = 1400) {
  const [shown, setShown] = useState(0);
  const raf = useRef();

  useEffect(() => {
    // rAF never fires while the tab is hidden (background load, headless render),
    // which would leave the dial reading zero instead of the real value. Motion is
    // an enhancement; the correct value is the default.
    const skip =
      (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) ||
      (typeof document !== "undefined" && document.visibilityState === "hidden");
    if (skip) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutBack-lite: needles overshoot slightly then settle, like a real dial
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(from + (value - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return shown;
}

export default function CircleTierGauge({
  value = 0,
  max = 10,
  accent = "#C9CDD2",
  accentBright = "#FFFFFF",
  tone,
  uid = "g",
}) {
  // Instrument tones from the Founders asset sheet; fall back to the flat
  // accents if a caller hasn't supplied them.
  const t = tone || { base: accent, glow: accentBright, deep: accent };
  const shown = useSweep(Math.min(value, max));
  const pct = max > 0 ? Math.min(1, shown / max) : 0;
  const angle = 180 - pct * 180;

  const trackId = `${uid}-track`;
  const fillId = `${uid}-fill`;
  const needleId = `${uid}-needle`;
  const hubId = `${uid}-hub`;
  const glowId = `${uid}-glow`;

  // Three anchors only (0 / half / max). Six labels render around 9px at phone
  // width — below the legibility floor for this audience — and the precise value
  // is already carried by the numeric readout beside the dial.
  const labels = Array.from({ length: 3 }, (_, i) => {
    const frac = i / 2;
    const deg = 180 - frac * 180;
    const p = polar(LABEL_R, deg);
    return { key: i, text: fmt(max * frac), ...p, deg };
  });

  // Major ticks sit on the six label positions; minors halve each segment.
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const frac = i / 10;
    const deg = 180 - frac * 180;
    const major = i % 2 === 0;
    const outer = polar(R + BAND / 2, deg);
    const inner = polar(R - BAND / 2 + (major ? 0 : 4), deg);
    ticks.push(
      <line
        key={`t${i}`}
        x1={inner.x}
        y1={inner.y}
        x2={outer.x}
        y2={outer.y}
        stroke="rgba(0,0,0,0.55)"
        strokeWidth={major ? 2 : 1}
      />
    );
  }

  // Knurled "redline" ribs across the last 15% of the dial.
  const ribs = [];
  for (let i = 0; i <= 12; i++) {
    const frac = 0.85 + (i / 12) * 0.15;
    const deg = 180 - frac * 180;
    const outer = polar(R + BAND / 2 - 1, deg);
    const inner = polar(R - BAND / 2 + 1, deg);
    ribs.push(
      <line
        key={`r${i}`}
        x1={inner.x}
        y1={inner.y}
        x2={outer.x}
        y2={outer.y}
        stroke={pct >= 0.85 ? "rgba(0,0,0,0.5)" : t.base}
        opacity={pct >= 0.85 ? 1 : 0.45}
        strokeWidth={1.4}
      />
    );
  }

  const needleTip = polar(R - 6, angle);
  const needleTail = polar(-16, angle); // small counterweight past the hub
  const needleL = polar(NEEDLE_W, angle - 90);
  const needleR = polar(NEEDLE_W, angle + 90);

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label={`${fmt(value)} of ${fmt(max)} members`}
    >
      <defs>
        <linearGradient id={trackId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B2B2B" />
          <stop offset="100%" stopColor="#141414" />
        </linearGradient>

        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.deep} />
          <stop offset="38%" stopColor={t.glow} />
          <stop offset="54%" stopColor={t.base} />
          <stop offset="100%" stopColor={t.deep} />
        </linearGradient>

        <linearGradient id={needleId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#C8C8C8" />
          <stop offset="100%" stopColor="#6E6E6E" />
        </linearGradient>

        <radialGradient id={hubId} cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#F2F2F2" />
          <stop offset="45%" stopColor="#9A9A9A" />
          <stop offset="100%" stopColor="#3A3A3A" />
        </radialGradient>

        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Unfilled remainder */}
      <path
        d={arcPath(R, 180, 0)}
        fill="none"
        stroke={`url(#${trackId})`}
        strokeWidth={BAND}
        strokeLinecap="butt"
      />
      {ribs}

      {/* Filled progress */}
      {pct > 0.001 && (
        <path
          d={arcPath(R, 180, angle)}
          fill="none"
          stroke={`url(#${fillId})`}
          strokeWidth={BAND}
          strokeLinecap="butt"
          filter={`url(#${glowId})`}
        />
      )}

      {/* Band edges + ticks */}
      <path d={arcPath(R + BAND / 2, 180, 0)} fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="1.2" />
      <path d={arcPath(R - BAND / 2, 180, 0)} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
      {ticks}

      {/* Scale labels */}
      {labels.map((l) => (
        <text
          key={l.key}
          x={l.x}
          y={l.y + 7}
          textAnchor="middle"
          fill="#E8E8E8"
          fontFamily="var(--font-heading)"
          fontSize="22"
          fontWeight="700"
        >
          {l.text}
        </text>
      ))}

      {/* Needle */}
      <g style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.65))" }}>
        <polygon
          points={`${needleTip.x},${needleTip.y} ${needleR.x},${needleR.y} ${needleTail.x},${needleTail.y} ${needleL.x},${needleL.y}`}
          fill={`url(#${needleId})`}
        />
      </g>

      {/* Knurled hub */}
      <circle cx={CX} cy={CY} r="18" fill="#0A0B0C" />
      <circle cx={CX} cy={CY} r="16" fill={`url(#${hubId})`} />
      {Array.from({ length: 24 }, (_, i) => {
        const a = polar(16, i * 15), b = polar(11, i * 15);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(0,0,0,0.3)" strokeWidth="1.1" />;
      })}
      <circle cx={CX} cy={CY} r="16" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1.4" />
      <circle cx={CX} cy={CY} r="5.5" fill="#8E959C" />
      <circle cx={CX} cy={CY} r="5.5" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="0.9" />
    </svg>
  );
}

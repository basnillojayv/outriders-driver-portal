/**
 * TierGaugeUnit — the instrument from the Founders asset sheet, rebuilt live.
 *
 * Geometry is measured off the artwork (503×386 housing, hub at 252/240, band
 * r=165–182, scale labels at r=207) so it matches the reference, but the
 * needle, the readout and the "to go" line are driven by real referral counts.
 * Shipping the artwork flat would freeze every driver's dial at 7/10, 64/100
 * and 742/1,000.
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const W = 503, H = 386;
const HX = 252, HY = 240;      // hub
const R_IN = 165, R_OUT = 182; // coloured band
const R_MID = (R_IN + R_OUT) / 2;
const R_LABEL = 207;
const DIAL_BOTTOM = 277;
const ROW_1 = 312;             // readout baseline
const ROW_2 = 361;             // "to go" baseline
const ICON_W = 28, ICON_GAP = 11;

const polar = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: HX + r * Math.cos(a), y: HY - r * Math.sin(a) };
};

const arc = (r, from, to) => {
  const a = polar(r, from), b = polar(r, to);
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${Math.abs(to - from) > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
};

const fmt = (n) => Math.round(n).toLocaleString();

function useSweep(value, duration = 1500) {
  const [v, setV] = useState(0);
  const raf = useRef();
  useEffect(() => {
    // rAF is frozen on hidden tabs; motion must never be the only route to the
    // real reading, so jump straight to it when animation can't run.
    const skip =
      (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) ||
      (typeof document !== "undefined" && document.visibilityState === "hidden");
    if (skip) { setV(value); return; }
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setV(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return v;
}

export default function TierGaugeUnit({ value = 0, max = 10, tone, uid = "g" }) {
  const shown = useSweep(Math.min(value, max));
  const pct = max > 0 ? Math.min(1, shown / max) : 0;
  const angle = 180 - pct * 180;
  const remaining = Math.max(0, max - value);
  const complete = value >= max;

  const id = (k) => `${uid}-${k}`;

  const footLabel = complete ? "CIRCLE COMPLETE" : `${fmt(remaining)} MEMBERS TO GO`;
  const footRef = useRef(null);
  // Estimate first so nothing jumps, then correct from the real advance width.
  const [footW, setFootW] = useState(footLabel.length * 16.2);
  useLayoutEffect(() => {
    const w = footRef.current?.getComputedTextLength?.();
    if (w) setFootW(w);
  }, [footLabel]);
  const pairX = W / 2 - (ICON_W + ICON_GAP + footW) / 2;

  // Five scale labels at 0 / ¼ / ½ / ¾ / max, as on the sheet.
  const labels = [0, 0.2, 0.4, 0.6, 0.8, 1].map((f) => {
    const deg = 180 - f * 180;
    const p = polar(R_LABEL, deg);
    return { f, deg, text: fmt(max * f), ...p };
  });

  const ticks = [];
  for (let i = 0; i <= 20; i++) {
    const f = i / 20;
    const deg = 180 - f * 180;
    const major = i % 4 === 0;
    const a = polar(R_OUT + 2, deg);
    const b = polar(R_OUT + (major ? 14 : 8), deg);
    ticks.push(
      <line key={`t${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke={major ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.28)"}
        strokeWidth={major ? 3 : 1.6} strokeLinecap="round" />
    );
    if (major && i > 0 && i < 20) {
      const c = polar(R_IN, deg), d = polar(R_OUT, deg);
      ticks.push(<line key={`s${i}`} x1={c.x} y1={c.y} x2={d.x} y2={d.y} stroke="rgba(0,0,0,0.8)" strokeWidth="3" />);
    }
  }

  // Fine ribs across the unfilled remainder, as on the artwork.
  const ribs = [];
  for (let f = 0.02; f < 1; f += 0.022) {
    if (f < pct) continue;
    const deg = 180 - f * 180;
    const a = polar(R_IN + 1, deg), b = polar(R_OUT - 1, deg);
    ribs.push(<line key={`r${f}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={tone.base} strokeWidth="2.4" opacity="0.5" />);
  }

  const tip = polar(R_IN - 8, angle);
  const tail = polar(-34, angle);
  const l = polar(9, angle - 90), r = polar(9, angle + 90);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}
      role="img" aria-label={`${fmt(value)} of ${fmt(max)} members. ${complete ? "Circle complete." : `${fmt(remaining)} to go.`}`}>
      <defs>
        <linearGradient id={id("chrome")} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#F2F4F6" />
          <stop offset="22%" stopColor="#8C939A" />
          <stop offset="46%" stopColor="#E4E8EB" />
          <stop offset="70%" stopColor="#5E656C" />
          <stop offset="100%" stopColor="#B6BDC4" />
        </linearGradient>
        <radialGradient id={id("dial")} cx="50%" cy="46%" r="72%">
          <stop offset="0%" stopColor="#1A1C1E" />
          <stop offset="68%" stopColor="#101214" />
          <stop offset="100%" stopColor="#050607" />
        </radialGradient>
        <linearGradient id={id("band")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone.deep} />
          <stop offset="38%" stopColor={tone.glow} />
          <stop offset="52%" stopColor={tone.base} />
          <stop offset="100%" stopColor={tone.deep} />
        </linearGradient>
        <linearGradient id={id("needle")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#D2D7DC" />
          <stop offset="100%" stopColor="#767D84" />
        </linearGradient>
        <radialGradient id={id("hub")} cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#F6F8FA" />
          <stop offset="46%" stopColor="#9BA2A9" />
          <stop offset="100%" stopColor="#3F454B" />
        </radialGradient>
        <filter id={id("glow")} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── housing: arched dome with a double bezel ── */}
      <path d="M6 366 L6 252 A 246 246 0 0 1 497 252 L497 366 Q497 380 483 380 L20 380 Q6 380 6 366 Z"
        fill="#0B0C0D" stroke={`url(#${id("chrome")})`} strokeWidth="7" />
      <path d="M20 360 L20 252 A 232 232 0 0 1 483 252 L483 360 Q483 366 477 366 L26 366 Q20 366 20 360 Z"
        fill="none" stroke={`url(#${id("chrome")})`} strokeWidth="3.5" opacity="0.85" />
      <path d="M27 356 L27 252 A 225 225 0 0 1 476 252 L476 356 Q476 359 473 359 L30 359 Q27 359 27 356 Z"
        fill={`url(#${id("dial")})`} />

      {/* ── band ── */}
      <path d={arc(R_MID, 180, 0)} fill="none" stroke="#0A0B0C" strokeWidth={R_OUT - R_IN} />
      {ribs}
      {pct > 0.004 && (
        <path d={arc(R_MID, 180, angle)} fill="none" stroke={`url(#${id("band")})`}
          strokeWidth={R_OUT - R_IN} filter={`url(#${id("glow")})`} />
      )}
      <path d={arc(R_OUT, 180, 0)} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
      <path d={arc(R_IN, 180, 0)} fill="none" stroke="rgba(0,0,0,0.75)" strokeWidth="1.5" />
      {ticks}

      {/* ── scale ── */}
      {labels.map((l2) => (
        <text key={l2.f} x={l2.x} y={l2.y + 11} textAnchor="middle" fill="#F0F2F4"
          fontFamily="var(--font-heading)" fontSize="33" fontWeight="700">{l2.text}</text>
      ))}

      {/* ── needle + knurled hub ── */}
      <g style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.7))" }}>
        <polygon points={`${tip.x},${tip.y} ${r.x},${r.y} ${tail.x},${tail.y} ${l.x},${l.y}`}
          fill={`url(#${id("needle")})`} />
      </g>
      <circle cx={HX} cy={HY} r="40" fill="#0A0B0C" />
      <circle cx={HX} cy={HY} r="37" fill={`url(#${id("hub")})`} />
      {Array.from({ length: 24 }, (_, i) => {
        const a = polar(37, i * 15), b = polar(26, i * 15);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(0,0,0,0.28)" strokeWidth="2" />;
      })}
      <circle cx={HX} cy={HY} r="37" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2" />
      <circle cx={HX} cy={HY} r="13" fill="#8E959C" />
      <circle cx={HX} cy={HY} r="13" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

      {/* ── readout ── */}
      <line x1="40" y1={DIAL_BOTTOM} x2="463" y2={DIAL_BOTTOM} stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
      <text x={W / 2} y={ROW_1} textAnchor="middle" fontFamily="var(--font-heading)" fontWeight="800" fontSize="42">
        <tspan fill={tone.text}>{fmt(Math.min(value, max))}</tspan>
        <tspan fill="#8B9198"> / </tspan>
        <tspan fill="#FFFFFF">{fmt(max)}</tspan>
        <tspan fill="#9AA0A7" fontSize="30"> MEMBERS</tspan>
      </text>

      <line x1="96" y1={ROW_2 - 27} x2="407" y2={ROW_2 - 27} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
      <g transform={`translate(${pairX} 0)`}>
        <g fill={tone.text} transform={`translate(0 ${ROW_2 - 20})`}>
          <circle cx="9" cy="4" r="5" />
          <path d="M0 17c0-5 4-8.5 9-8.5s9 3.5 9 8.5z" />
          <circle cx="21" cy="6" r="4" opacity="0.85" />
          <path d="M14 17c0-4 3.2-6.8 7-6.8s7 2.8 7 6.8z" opacity="0.85" />
        </g>
        <text ref={footRef} x={ICON_W + ICON_GAP} y={ROW_2} textAnchor="start"
          fontFamily="var(--font-heading)" fontWeight="700" fontSize="27"
          fill={tone.text} letterSpacing="0.5">
          {footLabel}
        </text>
      </g>
    </svg>
  );
}

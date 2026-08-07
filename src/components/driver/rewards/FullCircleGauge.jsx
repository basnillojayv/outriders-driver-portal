/**
 * FullCircleGauge — 270° circular tachometer styled after a MaxTow boost gauge.
 * Black face, accent backlight glow matching the badge color, red needle,
 * digital readout of current progress in the bottom gap.
 */
import React, { useState, useEffect, useRef } from "react";
import { T, steelCard } from "@/components/driver/v3/v3tokens";

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

// Arc from startAngle to endAngle (both in our polar convention).
// We always sweep clockwise on screen (decreasing angle), so sweep-flag = 1.
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export default function FullCircleGauge({ gauge, directCount, networkCount }) {
  const { name, max, source, accent, accentLight, icon, unitLabel } = gauge;
  const value = source === "direct" ? directCount : networkCount;
  const [displayValue, setDisplayValue] = useState(0);
  const [wobbleDeg, setWobbleDeg] = useState(0);
  const [armed, setArmed] = useState(false);
  const containerRef = useRef(null);

  // Trigger the sweep only when the gauge scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!armed) return;
    const duration = 1400;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const elapsed = now - start;
      if (elapsed < duration) {
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(value * eased);
        setWobbleDeg(0);
      } else {
        // Continuous needle tremor — fixed angular oscillation in degrees
        const t = (elapsed - duration) / 1000;
        const wobble = Math.sin(t * 2.4) * 2.2 + Math.sin(t * 0.9) * 1.1;
        setDisplayValue(value);
        setWobbleDeg(wobble);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, value]);

  const pct = Math.min(1, Math.max(0, displayValue / max));
  const startAngle = 225;
  const sweep = 270;
  const needleAngle = startAngle - pct * sweep + wobbleDeg;
  const remaining = Math.max(0, max - Math.round(displayValue));
  const complete = displayValue >= max;

  const cx = 100;
  const cy = 100;
  const r = 70;
  const rInner = 56;
  const needleLen = r + 6;
  const ringR = (r + rInner) / 2;

  // Major markers — labeled every `labelStep` (e.g. 0,1,2…10 when labelStep=1)
  const labelStep = gauge.labelStep || max / 5;
  const markerCount = Math.round(max / labelStep) + 1;
  const markers = [];
  for (let i = 0; i < markerCount; i++) {
    const mPct = i / (markerCount - 1);
    const mAngle = startAngle - mPct * sweep;
    const labelPos = polarToCartesian(cx, cy, r + 2, mAngle);
    const tickOuter = polarToCartesian(cx, cy, r + 20, mAngle);
    const tickInner = polarToCartesian(cx, cy, r + 13, mAngle);
    markers.push(
      <g key={`m${i}`}>
        <line x1={tickInner.x} y1={tickInner.y} x2={tickOuter.x} y2={tickOuter.y} stroke={accent} strokeWidth={1.8} />
        <text x={labelPos.x} y={labelPos.y + 3} textAnchor="middle" fill={accent} fontSize={labelStep <= 1 ? "8" : "10"} fontFamily="var(--font-heading)" fontWeight="800" filter={`url(#glow-num-${name})`}>
          {Math.round(mPct * max)}
        </text>
      </g>
    );
  }

  // Minor ticks — 4 between each major (skip when every integer is already labeled)
  const minorTicks = [];
  if (labelStep > 1) {
    const totalMinor = (markerCount - 1) * 5;
    for (let i = 1; i < totalMinor; i++) {
      if (i % 5 === 0) continue;
      const tPct = i / totalMinor;
      const tAngle = startAngle - tPct * sweep;
      const tickOuter = polarToCartesian(cx, cy, r + 2, tAngle);
      const tickInner = polarToCartesian(cx, cy, r - 1, tAngle);
      minorTicks.push(
        <line key={`t${i}`} x1={tickInner.x} y1={tickInner.y} x2={tickOuter.x} y2={tickOuter.y} stroke={accent} strokeWidth={0.8} opacity={0.45} />
      );
    }
  }

  const needleEnd = polarToCartesian(cx, cy, needleLen, needleAngle);
  const perpRad = ((needleAngle + 90) * Math.PI) / 180;
  const baseHalf = 7;
  const tipHalf = 1.5;
  const baseLeft = { x: cx + baseHalf * Math.cos(perpRad), y: cy - baseHalf * Math.sin(perpRad) };
  const baseRight = { x: cx - baseHalf * Math.cos(perpRad), y: cy + baseHalf * Math.sin(perpRad) };
  const tipLeft = { x: needleEnd.x + tipHalf * Math.cos(perpRad), y: needleEnd.y - tipHalf * Math.sin(perpRad) };
  const tipRight = { x: needleEnd.x - tipHalf * Math.cos(perpRad), y: needleEnd.y + tipHalf * Math.sin(perpRad) };
  const needlePath = `M ${baseLeft.x} ${baseLeft.y} L ${tipLeft.x} ${tipLeft.y} L ${tipRight.x} ${tipRight.y} L ${baseRight.x} ${baseRight.y} Z`;
  const needleGradId = `needle-fc-${name}`;
  const glowGradId = `glow-fc-${name}`;
  const chromeGradId = `chrome-fc-${name}`;

  const trackPath = describeArc(cx, cy, ringR, startAngle, startAngle - sweep);
  const progPath = describeArc(cx, cy, ringR, startAngle, needleAngle);

  return (
    <div ref={containerRef} style={{ ...steelCard, padding: 0, overflow: "hidden" }}>
      <div style={{ position: "relative", padding: "14px 14px 4px" }}>
        <svg viewBox="0 0 200 200" style={{ width: "100%", height: "auto", display: "block" }}>
          <defs>
            <linearGradient id={needleGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff5555" />
              <stop offset="50%" stopColor="#ff0000" />
              <stop offset="100%" stopColor="#aa0000" />
            </linearGradient>
            <radialGradient id={glowGradId} cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="transparent" />
              <stop offset="100%" stopColor={accent} stopOpacity="0.35" />
            </radialGradient>
            <linearGradient id={chromeGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F8F8F8" />
              <stop offset="50%" stopColor={accentLight} />
              <stop offset="100%" stopColor="#9a9a9a" />
            </linearGradient>
            <filter id={`glow-needle-${name}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={`glow-num-${name}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer bezel */}
          <circle cx={cx} cy={cy} r={r + 22} fill="#050505" stroke={accent} strokeWidth={2} />
          <circle cx={cx} cy={cy} r={r + 19} fill="none" stroke={accent} strokeWidth={1} opacity={0.5} />

          {/* Accent backlight glow */}
          <circle cx={cx} cy={cy} r={r + 18} fill={`url(#${glowGradId})`} />

          {/* Ticks */}
          {minorTicks}
          {markers}

          {/* Needle head — tapered, thicker at center */}
          <path d={needlePath} fill={`url(#${needleGradId})`} filter={`url(#glow-needle-${name})`} />

          {/* Hub */}
          <circle cx={cx} cy={cy} r={42} fill="#050505" />
          <image href={icon} x={cx - 36} y={cy - 36} width={72} height={72} />

          {/* Digital display at bottom gap */}
          <rect x={cx - (unitLabel ? 24 : 26)} y={cy + rInner - 6} width={unitLabel ? 48 : 52} height={20} rx={3} fill="#000" stroke={accent} strokeWidth={0.8} />
          <text x={unitLabel ? cx : cx + 22} y={cy + rInner + 8} textAnchor={unitLabel ? "middle" : "end"} fill={accent} fontSize="14" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontStyle="italic">
            {Math.round(displayValue)}
          </text>
          {unitLabel && (
            <text x={cx} y={cy + rInner + 22} textAnchor="middle" fill={T.textMuted} fontSize="8" fontFamily="var(--font-heading)" fontWeight="700" letterSpacing="0.08em">
              {unitLabel.toUpperCase()}
            </text>
          )}


        </svg>
      </div>

      {/* Stats below gauge */}
      <div style={{ padding: "4px 16px 14px" }}>
        {unitLabel ? (
          <div style={{ textAlign: "center" }}>
            {complete ? (
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: T.green }}>Completed</p>
            ) : (
              <>
                <p style={{ fontSize: 9, color: T.textMuted, fontFamily: "var(--font-heading)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>Remaining</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: "#FF3B30" }}>
                  {remaining.toLocaleString()}
                </p>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <p style={{ fontSize: 9, color: T.textMuted, fontFamily: "var(--font-heading)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>Current Progress</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: T.textPrimary }}>
                {Math.round(displayValue).toLocaleString()} <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>/ {max.toLocaleString()}</span>
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 9, color: T.textMuted, fontFamily: "var(--font-heading)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>Remaining</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: complete ? T.textMuted : T.textSecondary }}>
                {complete ? "Achieved" : `${remaining.toLocaleString()} to go`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
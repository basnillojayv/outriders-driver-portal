/**
 * RevUpEngine — "Rev Up Your Engine" dashboard for the Founders Program page.
 * Three automotive-style tachometer gauges: Leader, Guide, Protector.
 * Placeholder values; metallic / carbon-fiber styling.
 */
import React, { useState, useEffect } from "react";
import { T, steelCard } from "@/components/driver/v3/v3tokens";
import FullCircleGauge from "./FullCircleGauge";

const GAUGES = [
  { name: "Leader", max: 10, source: "direct", accent: "#E0E0E0", accentLight: "#FFFFFF", icon: "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/7dd590bf7_lead_icon.svg", fullCircle: true, labelStep: 1, unitLabel: "New Members" },
  { name: "Guide", max: 100, source: "network", accent: "#4A90D9", accentLight: "#7AB5F0", icon: "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/cd2d234c3_guide_icon.svg", fullCircle: true, labelStep: 10, unitLabel: "New Members" },
  { name: "Protector", max: 1000, source: "network", accent: "#D94040", accentLight: "#FF6B6B", icon: "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/b605699c9_protect_icon.svg", fullCircle: true, labelStep: 100, unitLabel: "New Members" },
];

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function TachometerGauge({ gauge, directCount, networkCount }) {
  const { name, max, source, accent, accentLight } = gauge;
  const value = source === "direct" ? directCount : networkCount;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const pct = Math.min(1, displayValue / max);
  const angle = 180 - pct * 180;
  const remaining = Math.max(0, max - Math.round(displayValue));
  const complete = displayValue >= max;

  const cx = 100;
  const cy = 100;
  const r = 80;
  const rInner = 64;
  const needleLen = r - 16;
  const gradId = `grad-${name}`;
  const needleGradId = `needle-${name}`;

  const arcStart = polarToCartesian(cx, cy, r, 180);
  const arcEnd = polarToCartesian(cx, cy, r, 0);
  const progEnd = polarToCartesian(cx, cy, r, angle);
  const needleEnd = polarToCartesian(cx, cy, needleLen, angle);

  const bgArc = `M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 0 1 ${arcEnd.x} ${arcEnd.y}`;
  const progArc = `M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 0 1 ${progEnd.x} ${progEnd.y}`;

  // Tick marks
  const tickCount = 11;
  const ticks = [];
  for (let i = 0; i < tickCount; i++) {
    const tickAngle = 180 - (i / (tickCount - 1)) * 180;
    const isMajor = i % 5 === 0;
    const tickOuter = polarToCartesian(cx, cy, r + (isMajor ? 9 : 6), tickAngle);
    const tickInner = polarToCartesian(cx, cy, r + 2, tickAngle);
    ticks.push(
      <line
        key={i}
        x1={tickInner.x}
        y1={tickInner.y}
        x2={tickOuter.x}
        y2={tickOuter.y}
        stroke={isMajor ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)"}
        strokeWidth={isMajor ? 1.5 : 1}
      />
    );
  }

  return (
    <div style={{ ...steelCard, padding: 0, overflow: "hidden" }}>
      <div className="flex" style={{ alignItems: "stretch" }}>
        {/* Gauge */}
        <div
          style={{
            flex: "0 0 165px",
            padding: "10px 8px 6px",
            position: "relative",
            background: "radial-gradient(circle at 50% 90%, #1f1f1f 0%, #141414 100%)",
            borderRight: `1px solid ${T.borderAlt}`,
          }}
        >
          <svg viewBox="0 0 200 115" style={{ width: "100%", height: "auto", display: "block" }}>
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={accent} />
                <stop offset="100%" stopColor={accentLight} />
              </linearGradient>
              <linearGradient id={needleGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e0e0e0" />
                <stop offset="50%" stopColor="#a0a0a0" />
                <stop offset="100%" stopColor="#606060" />
              </linearGradient>
            </defs>

            {/* Track */}
            <path d={bgArc} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={r - rInner} strokeLinecap="round" />

            {/* Progress arc */}
            <path d={progArc} fill="none" stroke={`url(#${gradId})`} strokeWidth={r - rInner} strokeLinecap="round" />

            {/* Ticks */}
            {ticks}

            {/* Min/max labels */}
            <text x={arcStart.x - 2} y={cy + 12} textAnchor="middle" fill={T.textMuted} fontSize="8" fontFamily="var(--font-heading)" fontWeight="700">0</text>
            <text x={arcEnd.x + 2} y={cy + 12} textAnchor="middle" fill={T.textMuted} fontSize="8" fontFamily="var(--font-heading)" fontWeight="700">{max.toLocaleString()}</text>

            {/* Needle */}
            <line
              x1={cx}
              y1={cy}
              x2={needleEnd.x}
              y2={needleEnd.y}
              stroke={`url(#${needleGradId})`}
              strokeWidth={2.5}
              strokeLinecap="round"
            />

            {/* Hub ring */}
            <circle cx={cx} cy={cy} r={20} fill="#141414" stroke={accent} strokeWidth={1.5} opacity={0.9} />

            {/* Badge icon in center */}
            <image href={gauge.icon} x={cx - 16} y={cy - 16} width={32} height={32} />

            {/* Center value */}
            <text x={cx} y={cy - 30} textAnchor="middle" fill={T.textPrimary} fontFamily="var(--font-heading)" fontSize="20" fontWeight="800">
              {Math.round(displayValue).toLocaleString()}
            </text>
          </svg>
        </div>

        {/* Stats + Badge */}
        <div style={{ flex: 1, padding: "14px 14px 12px" }}>
          {/* Badge */}
          <div style={{ marginBottom: 14 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontFamily: "var(--font-heading)",
                fontSize: 10,
                fontWeight: 700,
                color: accentLight,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                background: `${accent}18`,
                border: `1px solid ${accent}50`,
                borderRadius: 999,
                padding: "5px 12px",
              }}
            >
              {name}
            </span>
          </div>

          {/* Current progress */}
          <div style={{ marginBottom: 10 }}>
            <p
              style={{
                fontSize: 9,
                color: T.textMuted,
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              Current Progress
            </p>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: T.textPrimary }}>
              {Math.round(displayValue).toLocaleString()}{" "}
              <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>
                / {max.toLocaleString()}
              </span>
            </p>
          </div>

          {/* Remaining */}
          <div>
            <p
              style={{
                fontSize: 9,
                color: T.textMuted,
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              Remaining Referrals
            </p>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 15,
                fontWeight: 700,
                color: complete ? T.textMuted : T.textSecondary,
              }}
            >
              {complete ? "Achieved" : `${remaining.toLocaleString()} to go`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RevUpEngine({ directCount = 0, networkCount = 0 }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 11,
          fontWeight: 700,
          color: T.orange,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Founder Dashboard
      </p>
      <div className="space-y-3">
        {GAUGES.map((g) =>
          g.fullCircle ? (
            <FullCircleGauge key={g.name} gauge={g} directCount={directCount} networkCount={networkCount} />
          ) : (
            <TachometerGauge key={g.name} gauge={g} directCount={directCount} networkCount={networkCount} />
          )
        )}
      </div>
    </div>
  );
}
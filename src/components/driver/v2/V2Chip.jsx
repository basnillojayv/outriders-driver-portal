import React from "react";

const TONES = {
  success: { bg: "rgba(16,185,129,0.12)", color: "#10B981", border: "rgba(16,185,129,0.35)" },
  warning: { bg: "rgba(239,68,68,0.12)", color: "#EF4444", border: "rgba(239,68,68,0.35)" },
  fuel: { bg: "rgba(255,102,0,0.12)", color: "#FF6600", border: "rgba(255,102,0,0.35)" },
  cobalt: { bg: "rgba(74,111,163,0.16)", color: "#7B9AD1", border: "rgba(74,111,163,0.4)" },
};

export default function V2Chip({ tone = "success", children }) {
  const t = TONES[tone] || TONES.success;
  return (
    <span
      className="font-v2-sub uppercase tracking-[0.12em] text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}` }}
    >
      {children}
    </span>
  );
}
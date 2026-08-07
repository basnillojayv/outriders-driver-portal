import React from "react";

const TYPE_CONFIG = {
  in_person:  { label: "IN-PERSON", emoji: "🏢", color: "#cc5b30", bg: "rgba(204,91,48,0.15)", border: "#cc5b30" },
  virtual:    { label: "VIRTUAL",   emoji: "📺", color: "#18a06b", bg: "rgba(24,160,107,0.12)", border: "#18a06b" },
  fb_live:    { label: "FB LIVE",   emoji: "📱", color: "#2c5f8a", bg: "rgba(44,95,138,0.15)", border: "#2c5f8a" },
  recurring:  { label: "RECURRING", emoji: "🔁", color: "#8a8a8a", bg: "rgba(138,138,138,0.12)", border: "#5a5a5a" },
  milestone:  { label: "MILESTONE", emoji: "🏆", color: "#e8a14b", bg: "rgba(232,161,75,0.15)", border: "#de9142" },
};

export default function EventTypeBadge({ type, size = "sm" }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.in_person;
  const fontSize = size === "lg" ? 13 : 11;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: size === "lg" ? "5px 12px" : "3px 10px",
      borderRadius: 20,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      color: cfg.color,
      fontFamily: "var(--font-heading)",
      fontSize,
      fontWeight: 800,
      letterSpacing: "0.5px",
      whiteSpace: "nowrap",
    }}>
      {cfg.emoji} {cfg.label}
    </span>
  );
}
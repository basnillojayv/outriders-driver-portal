import React from "react";
import { T } from "./v3tokens";

export default function V3Welcome({ firstName }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";

  return (
    <div style={{ paddingTop: 8, paddingBottom: 4 }}>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 11,
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        Good {greeting}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 32,
          fontWeight: 900,
          color: T.textPrimary,
          lineHeight: 1.05,
          letterSpacing: "0.01em",
        }}
      >
        {firstName}
      </h1>
    </div>
  );
}
import React from "react";
import { T, steelCard } from "./v3tokens";

export default function V3MemberDetails({ memberID }) {
  return (
    <div style={steelCard}>
      <div className="flex items-center justify-between">
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 10,
            fontWeight: 700,
            color: T.textMuted,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
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
            letterSpacing: "0.06em",
          }}
        >
          {memberID || "—"}
        </p>
      </div>
    </div>
  );
}
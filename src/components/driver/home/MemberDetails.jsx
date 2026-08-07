import React from "react";

export default function MemberDetails({ memberID }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--carbon-800)",
        border: "1px solid var(--carbon-500)",
      }}
    >
      {/* Member ID — label + value on one line, left-justified */}
      <div className="flex items-baseline gap-2">
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Member ID
        </p>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 16,
            fontWeight: 800,
            color: "var(--fuel-300)",
          }}
        >
          {memberID || "—"}
        </p>
      </div>
    </div>
  );
}
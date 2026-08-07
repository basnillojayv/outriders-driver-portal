import React from "react";

export default function HQ2MemberDetails({ memberID }) {
  return (
    <div className="rounded-xl p-4 bg-v2-surface border border-v2-border">
      <div className="flex items-baseline gap-2">
        <p
          className="font-v2-sub uppercase tracking-[0.12em]"
          style={{ fontSize: 10, fontWeight: 700, color: "#6B7480" }}
        >
          Member ID
        </p>
        <p className="font-v2-mono" style={{ fontSize: 16, fontWeight: 700, color: "#FF6600" }}>
          {memberID || "—"}
        </p>
      </div>
    </div>
  );
}
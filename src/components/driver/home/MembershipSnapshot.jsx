import React from "react";

function SnapItem({ label, value, accent }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 8, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 900, color: accent || "var(--text-primary)", lineHeight: 1 }}>
        {value || "—"}
      </p>
    </div>
  );
}

export default function MembershipSnapshot({ member, directCount, networkCount, credits }) {
  const status = member?.membership_status || "pending";
  const memberType = member?.member_type || "Standard";
  const sinceYear = member?.agreement_signed_at || member?.created_date
    ? new Date(member?.agreement_signed_at || member?.created_date).getFullYear()
    : "—";

  const rank = directCount >= 10 && networkCount >= 100
    ? "Founder"
    : directCount >= 10
    ? "Lead"
    : "New";

  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: "var(--carbon-800)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
        Membership Snapshot
      </p>
      <div className="grid grid-cols-4 gap-3">
        <SnapItem
          label="Status"
          value={status.charAt(0).toUpperCase() + status.slice(1)}
          accent={status === "active" ? "var(--success)" : undefined}
        />
        <SnapItem label="Type" value={memberType} />
        <SnapItem label="Rank" value={rank} accent="var(--fuel-300)" />
        <SnapItem label="Credits" value={credits ?? "—"} accent="var(--fuel-300)" />
      </div>
    </div>
  );
}
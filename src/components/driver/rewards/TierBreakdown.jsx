import React, { useState } from "react";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { T } from "@/components/driver/v3/v3tokens";

function MemberList({ members }) {
  return (
    <div style={{ borderTop: `1px solid ${T.borderAlt}` }}>
      {members.map((m, i) => (
        <div
          key={i}
          style={{
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: i < members.length - 1 ? `1px solid ${T.borderAlt}` : "none",
            gap: 8,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.textPrimary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {m.name || m.email}
            </div>
            {m.email && (
              <div
                style={{
                  fontSize: 11,
                  color: T.textMuted,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {m.email}
              </div>
            )}
          </div>
          {m.joined && (
            <div style={{ fontSize: 11, color: T.textMuted, flexShrink: 0 }}>
              {new Date(m.joined).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NetworkSection({ label, color, members, count }) {
  const [open, setOpen] = useState(false);
  const hasDetail = members.length > 0;

  return (
    <div
      className="rounded-[10px] overflow-hidden mb-2.5"
      style={{ border: `1px solid ${T.borderAlt}`, background: T.card, backgroundImage: "none" }}
    >
      <button
        onClick={() => hasDetail ? setOpen(v => !v) : undefined}
        style={{
          width: "100%",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
          border: "none",
          cursor: hasDetail ? "pointer" : "default",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "var(--font-heading)", letterSpacing: "0.02em" }}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "var(--font-heading)" }}>
            {members.length > 0 ? members.length : count}
          </span>
          {hasDetail && (open
            ? <ChevronUp size={13} style={{ color: T.textMuted }} />
            : <ChevronDown size={13} style={{ color: T.textMuted }} />
          )}
        </div>
      </button>
      {open && hasDetail && <MemberList members={members} />}
    </div>
  );
}

export default function TierBreakdown({
  tier1Members = [],
  tier2Members = [],
  tier3Members = [],
  tier1Count = 0,
  tier2Count = 0,
  tier3Count = 0,
  directLeads = 0,
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 mb-1">
        <Users size={13} style={{ color: T.orange }} />
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 10,
            fontWeight: 700,
            color: T.orange,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          Members in Your Convoy
        </p>
      </div>
      <NetworkSection label="Tier 1 — Direct Members" color={T.green} members={tier1Members} count={tier1Count} />
      <NetworkSection label="Tier 2 — Their Members" color={T.textMuted} members={tier2Members} count={tier2Count} />
      <NetworkSection label="Tier 3 — Extended Network" color={T.textMuted} members={tier3Members} count={tier3Count} />

      <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6, marginTop: 10, paddingLeft: 2 }}>
        Some referrals take time to make it through the system. New members may not appear here right away — check back within 24–48 hours.
      </p>
    </div>
  );
}
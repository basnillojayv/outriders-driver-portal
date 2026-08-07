import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Wallet, Copy, Check } from "lucide-react";

function PassAction({ icon: Icon, label, onClick, disabled, comingSoon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1.5 flex-1 py-3 rounded-xl transition-all active:scale-95 relative"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: disabled ? "var(--text-disabled)" : "var(--text-secondary)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <Icon className="w-4 h-4" />
      <span style={{ fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>{label}</span>
      {comingSoon && (
        <span
          className="absolute -top-1.5 right-1 px-1.5 py-0.5 rounded-full"
          style={{ fontFamily: "var(--font-heading)", fontSize: 7, fontWeight: 800, letterSpacing: "0.1em", background: "var(--carbon-500)", color: "var(--text-muted)" }}
        >
          SOON
        </span>
      )}
    </button>
  );
}

function StatusDot({ status }) {
  const map = {
    active:    { color: "#18a06b", bg: "rgba(24,160,107,0.14)",  border: "rgba(24,160,107,0.35)",  label: "Active"    },
    pending:   { color: "#e8a14b", bg: "rgba(232,161,75,0.14)",  border: "rgba(232,161,75,0.35)",  label: "Pending"   },
    suspended: { color: "#c0392b", bg: "rgba(192,57,43,0.14)",   border: "rgba(192,57,43,0.35)",   label: "Suspended" },
    cancelled: { color: "#c0392b", bg: "rgba(192,57,43,0.14)",   border: "rgba(192,57,43,0.35)",   label: "Inactive"  },
  };
  const s = map[status] || map.pending;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      <span style={{ fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: s.color, textTransform: "uppercase" }}>{s.label}</span>
    </div>
  );
}

/* ── Front face ── */
function PassFront({ member, user, affiliateLink, directCount, networkCount, onClick }) {
  const fullName = member?.first_name && member?.last_name
    ? `${member.first_name} ${member.last_name}`
    : user?.full_name || "—";

  const memberId    = member?.lhs_member_id || "—";
  const status      = member?.membership_status || "pending";
  const memberSince = member?.agreement_signed_at || user?.created_date;
  const sinceYear   = memberSince ? new Date(memberSince).getFullYear() : null;
  const memberType  = member?.member_type || null;
  const isFounder   = sinceYear && sinceYear <= 2025;
  const hasTopTen   = (directCount || 0) >= 10;

  return (
    /* CR80 wallet aspect ratio: width / height = 1.586 → use padding-top trick */
    <div
      className="relative w-full overflow-hidden rounded-2xl cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={onClick}
      style={{
        aspectRatio: "1.586 / 1",
        background: "linear-gradient(135deg, #2e2e2e 0%, #1c1c1c 45%, #111 100%)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 16px 56px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      {/* Brushed-metal texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: [
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px)",
          "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 6px)",
        ].join(", "),
      }} />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{
        background: "linear-gradient(90deg, transparent 0%, var(--fuel-400) 20%, var(--fuel-300) 50%, var(--fuel-500) 80%, transparent 100%)"
      }} />

      {/* Layout: left content + right QR */}
      <div className="absolute inset-0 flex">

        {/* LEFT — branding + identity */}
        <div className="flex flex-col justify-between flex-1 px-4 py-4 min-w-0">
          {/* Brand */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 900, color: "var(--fuel-300)", letterSpacing: "0.22em", textTransform: "uppercase", lineHeight: 1 }}>
                  LineHaul Station
                </p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 8, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 3 }}>
                  Outriders Club
                </p>
              </div>
              <StatusDot status={status} />
            </div>
          </div>

          {/* Name + ID */}
          <div>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
              {fullName}
            </p>
            {memberType && (
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>
                {memberType} Member
              </p>
            )}

            {/* Badges */}
            {(isFounder || hasTopTen) && (
              <div className="flex gap-1.5 mt-2">
                {isFounder && (
                  <span style={{
                    fontFamily: "var(--font-heading)", fontSize: 8, fontWeight: 900, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "var(--fuel-300)",
                    background: "rgba(232,161,75,0.12)", border: "1px solid rgba(232,161,75,0.28)",
                    borderRadius: 4, padding: "2px 6px",
                  }}>★ Founder</span>
                )}
                {hasTopTen && (
                  <span style={{
                    fontFamily: "var(--font-heading)", fontSize: 8, fontWeight: 900, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "#18a06b",
                    background: "rgba(24,160,107,0.12)", border: "1px solid rgba(24,160,107,0.28)",
                    borderRadius: 4, padding: "2px 6px",
                  }}>✓ Top Ten</span>
                )}
              </div>
            )}
          </div>

          {/* ID + Since row */}
          <div className="flex items-center gap-3">
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 7, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Member ID</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 900, color: "var(--fuel-300)", letterSpacing: "0.06em", marginTop: 1 }}>{memberId}</p>
            </div>
            {sinceYear && (
              <>
                <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.08)" }} />
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: 7, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Since</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 900, color: "var(--text-secondary)", marginTop: 1 }}>{sinceYear}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, background: "rgba(255,255,255,0.06)", margin: "12px 0" }} />

        {/* RIGHT — Member ID */}
        <div className="flex flex-col items-center justify-center px-4 flex-shrink-0" style={{ width: "32%" }}>
          <div
            className="flex flex-col items-center justify-center rounded-xl w-full py-3 px-2"
            style={{ background: "rgba(232,161,75,0.07)", border: "1px solid rgba(232,161,75,0.2)" }}
          >
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 7, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>ID</p>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 900, color: "var(--fuel-300)", letterSpacing: "0.06em", textAlign: "center", lineHeight: 1.3 }}>{memberId}</p>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 py-1.5 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.35)", borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <p style={{ fontFamily: "var(--font-heading)", fontSize: 7, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          OFFICIAL MEMBER PASS
        </p>
      </div>
    </div>
  );
}

/* ── Main export ── */
export default function HeroMemberPass({ member, user, affiliateLink, directCount, networkCount }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Member Pass
      </p>

      <PassFront
        member={member}
        user={user}
        affiliateLink={affiliateLink}
        directCount={directCount}
        networkCount={networkCount}
        onClick={() => navigate("/member-card")}
      />

      {/* Actions */}
      <div className="flex gap-2">
        <PassAction icon={Wallet}   label="Apple Wallet" disabled comingSoon />
        <PassAction icon={Download} label="Download"     disabled comingSoon />
      </div>
    </div>
  );
}
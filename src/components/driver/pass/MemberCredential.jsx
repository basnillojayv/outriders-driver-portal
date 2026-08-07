/**
 * MemberCredential — Premium membership credential card.
 * Feels like an AmEx Platinum card, not an app screen.
 * This is the hero of the Member Pass page (~75-80% viewport).
 */
import React from "react";
import { T, heroCarbonTexture } from "../v3/v3tokens";
import { getDisplayBadge } from "@/lib/badges";

const OUTRIDERS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/6cb494d67_lhs_outriders_logo_circle.png";

function CredentialField({ label, value, mono }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 9,
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 5,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: mono ? "JetBrains Mono, monospace" : "var(--font-heading)",
          fontSize: mono ? 13 : 14,
          fontWeight: 700,
          color: mono ? T.orange : T.textSecondary,
          letterSpacing: mono ? "0.08em" : "0.01em",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default function MemberCredential({ member, user, directCount, networkCount = 0, tierName }) {
  const fullName = member?.first_name && member?.last_name
    ? `${member.first_name} ${member.last_name}`
    : user?.full_name || "—";

  const memberId = member?.lhs_member_id || "—";
  const status = member?.membership_status || "pending";
  const isActive = status === "active";
  const memberSince = member?.agreement_signed_at || member?.created_date || user?.created_date;
  const sinceYear = memberSince ? new Date(memberSince).getFullYear() : null;
  const isFounder = sinceYear && sinceYear <= 2025;
  const tierLabel = tierName || "Lead";
  const rankBadge = getDisplayBadge(directCount, networkCount);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        minHeight: "auto",
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow:
          "0 14px 64px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.4)",
        isolation: "isolate",
      }}
    >
      {/* Carbon fiber texture — inside card only */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: heroCarbonTexture,
          pointerEvents: "none",
        }}
      />

      {/* Metallic edge treatment — thin inner border */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 6,
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.04)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Top Fuel Orange accent line */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${T.orange} 20%, ${T.orange} 80%, transparent 100%)`,
          zIndex: 2,
        }}
      />

      {/* Oversized Outriders watermark — embossed, 6% opacity */}
      <img
        src={OUTRIDERS_LOGO}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 340,
          height: 340,
          objectFit: "contain",
          opacity: 0.06,
          zIndex: 0,
          pointerEvents: "none",
          filter: "grayscale(100%)",
        }}
      />

      {/* Content layer */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: "auto",
          padding: "36px 30px",
        }}
      >
        {/* ── Top-right rank badge ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <img
            src={rankBadge.img}
            alt={rankBadge.name}
            style={{ width: 150, height: 150, objectFit: "contain" }}
          />
        </div>

        {/* ── Section 2: Identity — name is the largest element (Display) ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 44,
              fontWeight: 900,
              color: T.textPrimary,
              lineHeight: 1.05,
              letterSpacing: "0.005em",
              wordBreak: "break-word",
            }}
          >
            {fullName}
          </h1>
        </div>

        {/* ── Section 3: Credentials — clean balanced grid ── */}
        <div style={{ marginTop: 18 }}>
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 18 }} />

          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: T.textMuted, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Member ID:
              </p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: T.textSecondary, letterSpacing: "0.01em" }}>
                {memberId}
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: T.textMuted, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Member Since:
              </p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: T.textSecondary, letterSpacing: "0.01em" }}>
                {sinceYear || "—"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
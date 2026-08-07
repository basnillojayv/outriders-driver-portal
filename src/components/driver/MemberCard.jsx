import React, { useState } from "react";
import { Copy, Check, Shield, Award, Users } from "lucide-react";

function StatusPill({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold tracking-widest uppercase ${
        active
          ? "bg-lhs-green/15 text-lhs-green border border-lhs-green/30"
          : "bg-carbon-600 text-text-muted border border-carbon-500"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-lhs-green" : "bg-text-muted"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function MetaBadge({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-1.5 bg-carbon-700/60 border border-carbon-500/40 rounded-lg px-2.5 py-1.5">
      <Icon className="w-3 h-3 text-fuel-300 flex-shrink-0" />
      <span className="font-heading font-bold text-[10px] tracking-wide text-text-secondary uppercase">{label}</span>
    </div>
  );
}

export default function MemberCard({ member, user, affiliateLink, directCount }) {
  const [copied, setCopied] = useState(false);

  const fullName = member?.first_name && member?.last_name
    ? `${member.first_name} ${member.last_name}`
    : user?.full_name || "—";

  const memberId = member?.lhs_member_id || "—";
  const status = member?.membership_status || "pending";
  const isActive = status === "active";
  const memberSince = member?.agreement_signed_at || member?.created_date || user?.created_date;
  const sinceYear = memberSince ? new Date(memberSince).getFullYear() : null;
  const sinceDate = memberSince
    ? new Date(memberSince).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;
  const memberType = member?.member_type || null;
  const isFounder = sinceYear && sinceYear <= 2025;
  const hasTopTen = (directCount || 0) >= 10;
  const referralLink = affiliateLink || null;

  const qrUrl = referralLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=140x140&bgcolor=1a1a1a&color=e8a14b&qzone=1&data=${encodeURIComponent(referralLink)}`
    : null;

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      {/* Card body */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(145deg, var(--carbon-700) 0%, var(--carbon-900) 55%, #0e0e0e 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Subtle carbon weave texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 4px)",
            borderRadius: "inherit",
          }}
        />

        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: "linear-gradient(90deg, transparent, var(--fuel-300) 30%, var(--fuel-500) 70%, transparent)" }}
        />

        {/* Header row */}
        <div className="relative px-5 pt-5 pb-4 flex items-start justify-between">
          <div>
            <p
              className="font-heading font-black tracking-widest uppercase"
              style={{ fontSize: 9, color: "var(--fuel-300)", letterSpacing: "0.2em" }}
            >
              LineHaul Station
            </p>
            <p
              className="font-heading font-black tracking-wider mt-0.5"
              style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.12em" }}
            >
              Outriders Club
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img
              src="https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/6cb494d67_lhs_outriders_logo_circle.png"
              alt="Outriders Logo"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <StatusPill active={isActive} />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Member identity */}
        <div className="relative px-5 pt-4 pb-3">
          <p
            className="font-heading font-black leading-tight"
            style={{ fontSize: 22, color: "var(--text-primary)", letterSpacing: "0.01em" }}
          >
            {fullName}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <div>
              <p style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-heading)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Member ID
              </p>
              <p
                className="font-heading font-black mt-0.5"
                style={{ fontSize: 14, color: "var(--fuel-300)", letterSpacing: "0.08em" }}
              >
                {memberId}
              </p>
            </div>
            {sinceYear && (
              <>
                <div className="w-px h-8 bg-carbon-500" />
                <div>
                  <p style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-heading)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    Member Since
                  </p>
                  <p
                    className="font-heading font-black mt-0.5"
                    style={{ fontSize: 12, color: "var(--text-secondary)", letterSpacing: "0.02em" }}
                  >
                    {sinceDate}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Meta badges */}
        {(memberType || isFounder || hasTopTen) && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {memberType && <MetaBadge icon={Shield} label={memberType} />}
            {isFounder && <MetaBadge icon={Award} label="Founder" />}
            {hasTopTen && <MetaBadge icon={Users} label="Top Ten" />}
          </div>
        )}

        {/* Divider */}
        <div className="mx-5 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* QR + referral row */}
        <div className="px-5 py-4 flex items-end gap-4">
          {qrUrl ? (
            <div
              className="flex-shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 80,
                height: 80,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "var(--carbon-900)",
              }}
            >
              <img
                src={qrUrl}
                alt="Referral QR"
                width={80}
                height={80}
                style={{ display: "block" }}
              />
            </div>
          ) : (
            <div
              className="flex-shrink-0 rounded-xl flex items-center justify-center"
              style={{
                width: 80,
                height: 80,
                border: "1px dashed rgba(255,255,255,0.1)",
                background: "var(--carbon-800)",
              }}
            >
              <p className="font-heading text-[9px] text-text-muted text-center leading-tight px-2">
                No link yet
              </p>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p
              className="font-heading font-bold uppercase"
              style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.18em" }}
            >
              Referral Link
            </p>
            {referralLink ? (
              <>
                <p
                  className="mt-1 truncate"
                  style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                >
                  {referralLink}
                </p>
                <button
                  onClick={handleCopy}
                  className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: copied ? "rgba(24,160,107,0.15)" : "rgba(204,91,48,0.12)",
                    border: `1px solid ${copied ? "rgba(24,160,107,0.3)" : "rgba(204,91,48,0.25)"}`,
                    color: copied ? "var(--success)" : "var(--fuel-300)",
                  }}
                >
                  {copied
                    ? <Check className="w-3 h-3" />
                    : <Copy className="w-3 h-3" />}
                  <span className="font-heading font-bold text-[10px] tracking-wide">
                    {copied ? "Copied!" : "Copy Link"}
                  </span>
                </button>
              </>
            ) : (
              <p className="mt-1" style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                Referral link assigned after first sync
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="px-5 py-2.5 flex items-center justify-between"
          style={{ background: "rgba(0,0,0,0.25)", borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p className="font-heading font-bold text-[9px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
            linehaulstation.com
          </p>
          <p className="font-heading font-bold text-[9px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
            Member Credential
          </p>
        </div>
      </div>
    </div>
  );
}
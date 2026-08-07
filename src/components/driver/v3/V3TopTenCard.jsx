import React, { useState } from "react";
import { Copy, Check, Share2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { BADGES, getDisplayBadge } from "@/lib/badges";
import { T, steelCard, btnPrimary, btnSecondary } from "./v3tokens";

export default function V3TopTenCard({ directCount = 0, networkCount = 0, referralLink }) {
  const [copied, setCopied] = useState(false);

  const currentBadge = getDisplayBadge(directCount, networkCount);
  const currentIndex = BADGES.findIndex((b) => b.name === currentBadge.name);
  const nextBadge = BADGES[currentIndex + 1] || currentBadge;

  const progress = Math.min(100, (directCount / 10) * 100);
  const remaining = Math.max(0, 10 - directCount);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Outriders — Top 10 Truckers", text: "Join me on Outriders:", url: referralLink });
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(referralLink);
      toast.success("Link copied!");
    }
  };

  return (
    <div style={{ ...steelCard, borderColor: "rgba(255,106,0,0.18)" }}>
      {/* Header */}
      <div className="flex items-center gap-2.5" style={{ marginBottom: 24 }}>
        <Trophy size={16} style={{ color: T.orange }} />
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 700,
            color: T.textSecondary,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Top 10 Truckers
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: T.borderAlt, marginBottom: 24 }} />

      {/* Current Status */}
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 11,
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Current Status
      </p>
      <div className="flex items-center gap-3" style={{ marginBottom: 28 }}>
        <img
          src={currentBadge.img}
          alt={currentBadge.name}
          className="w-7 h-7 object-contain"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 22,
            fontWeight: 700,
            color: T.orange,
            letterSpacing: "0.02em",
          }}
        >
          {currentBadge.name}
        </p>
      </div>

      {/* Progress */}
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 11,
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Progress to {nextBadge.name}
      </p>
      <div className="flex items-baseline gap-1.5" style={{ marginBottom: 12 }}>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 28,
            fontWeight: 700,
            color: T.textPrimary,
            lineHeight: 1,
          }}
        >
          {directCount}
        </span>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 13,
            color: T.textMuted,
            fontWeight: 600,
          }}
        >
          / 10 Drivers Referred
        </span>
      </div>

      {/* Progress bar — matte, no glow */}
      <div
        style={{
          width: "100%",
          height: 3,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: progress >= 100 ? T.green : T.orange,
            borderRadius: 3,
            transition: "width 0.7s ease",
          }}
        />
      </div>
      <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 28 }}>
        {remaining > 0
          ? `${remaining} more referral${remaining !== 1 ? "s" : ""} until ${nextBadge.name}.`
          : "Top 10 complete!"}
      </p>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          disabled={!referralLink}
          className="flex-1 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
          style={{ ...btnPrimary, cursor: referralLink ? "pointer" : "not-allowed" }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy Referral Link"}
        </button>
        <button
          onClick={handleShare}
          disabled={!referralLink}
          className="flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
          style={{ ...btnSecondary, cursor: referralLink ? "pointer" : "not-allowed" }}
        >
          <Share2 size={15} />
          Share
        </button>
      </div>
    </div>
  );
}
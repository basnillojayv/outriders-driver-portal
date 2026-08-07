import React, { useState } from "react";
import { Copy, Check, Share2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { BADGES, getDisplayBadge } from "@/lib/badges";

export default function TopTenCard({ directCount = 0, networkCount = 0, referralLink }) {
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
        await navigator.share({
          title: "Outriders — Top 10 Truckers",
          text: "Join me on Outriders and start building your network:",
          url: referralLink,
        });
      } catch {
        /* share cancelled */
      }
    } else {
      navigator.clipboard.writeText(referralLink);
      toast.success("Link copied!");
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--carbon-800)",
        border: "1px solid rgba(232,161,75,0.22)",
        boxShadow: "0 2px 12px rgba(204,91,48,0.12)",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2">
        <Trophy size={16} style={{ color: "var(--fuel-300)" }} />
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 13,
            fontWeight: 900,
            color: "var(--text-primary)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Top 10 Truckers
        </p>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 16px" }} />

      {/* Body */}
      <div className="px-4 py-4 space-y-4">
        {/* Current Status */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 9,
              fontWeight: 700,
              color: "var(--text-muted)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Current Status
          </p>
          <div className="flex items-center gap-2 mt-1">
            <img
              src={currentBadge.img}
              alt={currentBadge.name}
              className="w-6 h-6 object-contain"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 18,
                fontWeight: 900,
                color: "var(--fuel-300)",
              }}
            >
              {currentBadge.name}
            </p>
          </div>
        </div>

        {/* Progress to next rank */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 11,
              fontWeight: 800,
              color: "var(--text-secondary)",
              marginBottom: 6,
            }}
          >
            Progress to {nextBadge.name}
          </p>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 16,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            {directCount}{" "}
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
              / 10 Drivers Referred
            </span>
          </p>

          {/* Progress bar */}
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: "var(--carbon-700)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background:
                  progress >= 100
                    ? "var(--success)"
                    : "linear-gradient(90deg, var(--fuel-500), var(--fuel-300))",
              }}
            />
          </div>

          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
            {remaining > 0
              ? `${remaining} more referral${remaining !== 1 ? "s" : ""} until ${nextBadge.name}.`
              : "Top 10 complete!"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={!referralLink}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all active:scale-95 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, var(--fuel-500), var(--fuel-400))",
              color: "#fff",
              fontFamily: "var(--font-heading)",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.04em",
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy Referral Link"}
          </button>
          <button
            onClick={handleShare}
            disabled={!referralLink}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all active:scale-95 disabled:opacity-50"
            style={{
              background: "transparent",
              border: "1px solid var(--carbon-500)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-heading)",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.04em",
            }}
          >
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
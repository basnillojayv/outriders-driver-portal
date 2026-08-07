import React, { useState } from "react";
import { Copy, Check, Share2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { BADGES, getDisplayBadge } from "@/lib/badges";

export default function HQ2TopTen({ directCount = 0, networkCount = 0, referralLink }) {
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
      className="rounded-xl overflow-hidden bg-v2-surface"
      style={{ border: "1px solid rgba(255,102,0,0.25)" }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2">
        <Trophy size={16} style={{ color: "#FF6600" }} />
        <p
          className="font-v2-sub text-v2-text"
          style={{ fontSize: 13, letterSpacing: "0.08em", fontWeight: 700 }}
        >
          Top 10 Truckers
        </p>
      </div>

      <div style={{ height: 1, background: "#1E252D", margin: "0 16px" }} />

      {/* Body */}
      <div className="px-4 py-4 space-y-4">
        {/* Current Status */}
        <div>
          <p
            className="font-v2-sub uppercase"
            style={{ fontSize: 9, fontWeight: 700, color: "#6B7480", letterSpacing: "0.18em" }}
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
              className="font-v2-sub"
              style={{ fontSize: 18, fontWeight: 700, color: "#FF6600" }}
            >
              {currentBadge.name}
            </p>
          </div>
        </div>

        {/* Progress to next rank */}
        <div>
          <p
            className="font-v2-sub uppercase"
            style={{ fontSize: 11, fontWeight: 700, color: "#AEB7C0", letterSpacing: "0.1em", marginBottom: 6 }}
          >
            Progress to {nextBadge.name}
          </p>
          <p className="font-v2-mono text-v2-text" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            {directCount}{" "}
            <span className="font-v2-sub" style={{ fontSize: 12, color: "#6B7480", fontWeight: 500 }}>
              / 10 Drivers Referred
            </span>
          </p>

          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "#1E252D" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: progress >= 100 ? "#10B981" : "#FF6600" }}
            />
          </div>

          <p className="font-v2-body" style={{ fontSize: 12, color: "#6B7480", marginTop: 8 }}>
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
              background: "#FF6600",
              color: "#0A0A0A",
              fontFamily: "Oswald, sans-serif",
              fontSize: 12,
              fontWeight: 700,
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
              border: "1px solid #1E252D",
              color: "#AEB7C0",
              fontFamily: "Oswald, sans-serif",
              fontSize: 12,
              fontWeight: 700,
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
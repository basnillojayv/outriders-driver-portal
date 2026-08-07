/**
 * ReferralSection — personal referral link + copy/share.
 * Supporting module below the credential card.
 */
import React, { useState } from "react";
import { Copy, Check, Share2, Link2 } from "lucide-react";
import { toast } from "sonner";
import { T, steelCard, btnPrimary, btnSecondary } from "../v3/v3tokens";

export default function ReferralSection({ referralLink }) {
  const [copied, setCopied] = useState(false);

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
        await navigator.share({ title: "Outriders — LineHaul Station", text: "Join me on Outriders:", url: referralLink });
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(referralLink);
      toast.success("Link copied!");
    }
  };

  return (
    <div style={steelCard}>
      {/* Header */}
      <div className="flex items-center gap-2.5" style={{ marginBottom: 18 }}>
        <Link2 size={16} style={{ color: T.orange }} />
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
          Referral
        </p>
      </div>

      <div style={{ height: 1, background: T.borderAlt, marginBottom: 20 }} />

      {/* Link display */}
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 9,
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: 7,
        }}
      >
        Personal Referral Link
      </p>
      {referralLink ? (
        <p
          className="truncate"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            color: T.textSecondary,
            marginBottom: 18,
            letterSpacing: "0.02em",
          }}
        >
          {referralLink}
        </p>
      ) : (
        <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 18 }}>
          Referral link assigned after first sync
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleShare}
          disabled={!referralLink}
          className="flex-1 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
          style={{ ...btnPrimary, cursor: referralLink ? "pointer" : "not-allowed" }}
        >
          <Share2 size={15} />
          Share
        </button>
        <button
          onClick={handleCopy}
          disabled={!referralLink}
          className="flex-1 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
          style={{ ...btnSecondary, cursor: referralLink ? "pointer" : "not-allowed", background: copied ? T.greenDim : "transparent", borderColor: copied ? "rgba(24,195,126,0.28)" : T.border, color: copied ? T.green : T.textSecondary }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
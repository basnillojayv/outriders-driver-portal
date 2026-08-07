/**
 * CreditsAndSharing — bottom section of the Founders Program page.
 * 1. Credits Earned card (current credit balance)
 * 2. Share with Fellow Driver (Share orange + Copy Link gray)
 * Gray "Copy Link" buttons match the Command Center tile styling.
 */
import React, { useState } from "react";
import { Share2, Copy, Check, Coins } from "lucide-react";
import { toast } from "sonner";
import { T, steelCard, btnPrimary } from "@/components/driver/v3/v3tokens";

const JOIN_FALLBACK = "https://membership.linehaulstation.com/join";

// Command Center-style gray steel button
const btnGray = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontFamily: "var(--font-heading)",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.01em",
  borderRadius: 12,
  padding: "13px 18px",
  minHeight: 48,
  cursor: "pointer",
  textDecoration: "none",
  transition: "all 0.15s ease",
  color: T.textPrimary,
  background: "rgba(42,44,48,0.6)",
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
  border: "1px solid rgba(180,188,200,0.55)",
  boxShadow: "inset 0 1px 0 rgba(220,226,234,0.25)",
};

function SectionHeader({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5" style={{ marginBottom: 14 }}>
      <Icon size={16} style={{ color: T.orange }} />
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 13,
          fontWeight: 700,
          color: T.orange,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </p>
    </div>
  );
}

function ShareRow({ link, shareText, copied, onCopy }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: shareText, url: link });
    } else {
      navigator.clipboard.writeText(link);
      toast.success("Link copied!");
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleShare}
        className="flex-1 flex items-center justify-center gap-2 transition-all active:scale-95"
        style={btnPrimary}
      >
        <Share2 size={15} /> Share
      </button>
      <button
        onClick={onCopy}
        className="flex-1 flex items-center justify-center gap-2 transition-all active:scale-95"
        style={btnGray}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}

export default function CreditsAndSharing({ credits = 0, referralLink }) {
  const [copiedFellow, setCopiedFellow] = useState(false);

  const link = referralLink || JOIN_FALLBACK;

  const copyLink = (setCopied) => {
    if (!referralLink) {
      toast.error(
        "Your referral link is not set up yet. Check back after your affiliate account is activated."
      );
      return;
    }
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* ── Credits Earned ── */}
      <div style={steelCard}>
        <SectionHeader icon={Coins}>Credits Earned</SectionHeader>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 32,
            fontWeight: 800,
            color: T.textPrimary,
            lineHeight: 1.1,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 28 }}>⭐</span>
          {credits} Credits
        </p>
        <p style={{ fontSize: 13, color: T.textMuted, marginTop: 8 }}>
          Earn credits once you reach Founder status.
        </p>
      </div>

      {/* ── Section 1: Share with Fellow Driver ── */}
      <div style={steelCard}>
        <SectionHeader icon={Share2}>Share with Fellow Driver</SectionHeader>
        <p
          style={{
            fontSize: 13,
            color: T.textMuted,
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          Invite a fellow driver to join the Outriders network.
        </p>
        <ShareRow
          link={link}
          shareText="Join me on the Outriders network at LineHaul Station."
          copied={copiedFellow}
          onCopy={() => copyLink(setCopiedFellow)}
        />
      </div>

    </div>
  );
}
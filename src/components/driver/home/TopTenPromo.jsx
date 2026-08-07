import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, ArrowRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function TopTenPromo({ referralLink }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = () => {
    navigate("/rewards");
  };

  return (
    <div
      onClick={handleCardClick}
      className="block bg-gradient-to-r from-fuel-600 to-fuel-700 rounded-xl overflow-hidden hover:shadow-fuel-glow-lg transition-all active:scale-95 cursor-pointer"
      style={{
        background: "linear-gradient(135deg, rgba(184,74,40,0.9), rgba(160,61,32,0.9))",
        border: "1px solid rgba(232,161,75,0.3)",
      }}
    >
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={18} style={{ color: "var(--fuel-300)" }} />
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 800, color: "var(--fuel-200)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Top Ten Program
              </span>
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 900, color: "var(--fuel-100)", marginBottom: 6, lineHeight: 1.3 }}>
              Earn Rewards for Growing Your Network
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
              Build your network, climb the ranks, and unlock exclusive member benefits.
            </p>
          </div>
          <ArrowRight size={20} style={{ color: "var(--fuel-100)", flexShrink: 0, marginTop: 2 }} />
        </div>

        {referralLink && (
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            <span style={{ fontSize: 12, fontFamily: "var(--font-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>
              {referralLink?.replace?.(/^https?:\/\//, "") || "Copy your referral link"}
            </span>
            {copied ? (
              <Check size={16} style={{ flexShrink: 0, color: "var(--success)" }} />
            ) : (
              <Copy size={16} style={{ flexShrink: 0 }} />
            )}
          </button>
        )}

        {!referralLink && (
          <div style={{ fontSize: 12, fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.6)", padding: "8px 12px", textAlign: "center" }}>
            Loading your referral link...
          </div>
        )}
      </div>
    </div>
  );
}
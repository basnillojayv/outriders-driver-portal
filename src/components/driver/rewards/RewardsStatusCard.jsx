import React, { useState } from "react";
import { Copy, Check, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getBadgeForCounts } from "@/lib/badges";

export default function RewardsStatusCard({ user, directCount, networkCount, freeNights, affiliate, referralLink, affiliateLoading, username }) {
  const [copied, setCopied] = useState(false);
  const badge = getBadgeForCounts(directCount, networkCount);
  const memberSince = user?.created_date ? new Date(user.created_date).getFullYear() : null;
  const credits = affiliate?.credits ?? freeNights;

  const link = referralLink || `https://linehaulstation.com/member/${username || "driver"}`;
  const isGhlLink = !!referralLink;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral link copied!");
  };

  const handleShare = () => {
    const shareText = `I'm an Outrider at LineHaul Station — the first resort-quality community network built for American truckers. Check it out: ${link}`;
    if (navigator.share) {
      navigator.share({ text: shareText, url: link });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-carbon-700 flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
            <img src={badge.img} alt={badge.name} className="w-full h-full object-contain" onError={(e) => { e.target.style.display = "none"; }} />
          </div>
          <div>
            <p className="font-heading font-bold text-fuel-orange text-sm leading-none">
              {memberSince ? `OUTRIDER MEMBER SINCE ${memberSince}` : badge.name.toUpperCase()}
            </p>
            {affiliate && <span className="text-[10px] font-heading font-bold text-lhs-green">● LIVE</span>}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <p className="font-heading font-bold text-xs text-muted-foreground tracking-widest uppercase">My Top Ten</p>
        <div className="flex items-end gap-2">
          <span className="font-heading font-bold text-5xl leading-none">{directCount}</span>
          <span className="font-heading font-bold text-2xl text-muted-foreground leading-none mb-1">/ 10</span>
        </div>
        <div className="w-full h-2 bg-carbon-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-fuel-500 transition-all duration-500"
            style={{ width: `${Math.min(100, (directCount / 10) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {directCount >= 10 ? "Top 10 complete 🎉" : `${10 - directCount} more driver${10 - directCount !== 1 ? "s" : ""} to complete your Top 10`}
        </p>
      </div>

      {/* Referral link */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-carbon-700 rounded-xl px-3 py-2.5 min-h-[40px]">
          {affiliateLoading ? (
            <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
          ) : (
            <span className="flex-1 text-xs text-muted-foreground truncate">{link}</span>
          )}
          {isGhlLink && !affiliateLoading && (
            <span className="text-[10px] text-lhs-green font-heading font-bold shrink-0">LIVE</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={affiliateLoading}
            className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-sm font-heading font-semibold hover:bg-muted transition-colors disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4 text-lhs-green" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={handleShare}
            disabled={affiliateLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-fuel-500 text-white rounded-xl py-3 text-sm font-heading font-semibold hover:bg-fuel-600 transition-colors disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
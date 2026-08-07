import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function InviteCard({ username, referralLink, affiliateLoading }) {
  const [copied, setCopied] = useState(false);

  // Use GHL affiliate referral link if available, fall back to username-based link
  const link = referralLink || `https://linehaulstation.com/member/${username || "driver"}`;
  const isGhlLink = !!referralLink;
  const shareText = `I'm an Outrider at LineHaul Station — the first resort-quality community network built for American truckers. Check it out: ${link}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral link copied!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: shareText, url: link });
    } else {
      handleCopy();
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="font-heading font-bold text-sm">INVITE A DRIVER</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Share your personal link and start building your Top 10 network.
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Your referral link:</p>
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5 min-h-[40px]">
            {affiliateLoading ? (
              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
            ) : (
              <span className="flex-1 text-xs text-foreground truncate font-medium">{link}</span>
            )}
            {isGhlLink && !affiliateLoading && (
              <span className="text-[10px] text-lhs-green font-heading font-bold shrink-0">LIVE</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={affiliateLoading}
            className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl py-2.5 text-sm font-heading font-semibold hover:bg-muted transition-colors disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4 text-lhs-green" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={handleShare}
            disabled={affiliateLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-fuel-orange text-white rounded-xl py-2.5 text-sm font-heading font-semibold hover:bg-fuel-orange/90 transition-colors disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Every driver who joins through your link counts toward your network.
        </p>
      </CardContent>
    </Card>
  );
}
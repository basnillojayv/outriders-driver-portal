import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Check, Save, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="flex-shrink-0 w-10 h-6 rounded-full transition-all duration-200 relative"
        style={{ background: checked ? "var(--fuel-500)" : "var(--carbon-500)" }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200"
          style={{ left: checked ? "22px" : "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
        />
      </button>
    </div>
  );
}

export default function ReferralTab({ user }) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const referralLink = user?.affiliate_referral_link || null;

  // Read prefs
  const prefs = user?.referral_prefs ? JSON.parse(user.referral_prefs) : {};
  const [autoShare, setAutoShare] = useState(prefs.auto_share_on_milestone ?? false);
  const [showOnProfile, setShowOnProfile] = useState(prefs.show_on_profile ?? true);

  const handleCopy = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      await navigator.share({ title: "Join the Outriders!", url: referralLink });
    } else {
      handleCopy();
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await base44.auth.updateMe({
        referral_prefs: JSON.stringify({
          auto_share_on_milestone: autoShare,
          show_on_profile: showOnProfile,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Referral preferences saved");
    },
  });

  return (
    <div className="space-y-4">
      {/* Referral Link */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-heading text-sm font-semibold">Your Referral Link</h3>
          {referralLink ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/20 overflow-hidden">
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground flex-1 truncate font-mono">{referralLink}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleCopy}>
                  {copied ? <Check className="w-3.5 h-3.5 text-lhs-green" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button size="sm" className="flex-1 gap-1.5" onClick={handleShare}>
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Your referral link will appear here once your affiliate account is active. Contact LineHaul Station Member Support if you believe this is an error.</p>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-heading text-sm font-semibold mb-3">Sharing Preferences</h3>
          <Toggle checked={showOnProfile} onChange={setShowOnProfile}
            label="Show referral link on my profile"
            description="Other members can see and use your referral link from your public profile." />
          <Toggle checked={autoShare} onChange={setAutoShare}
            label="Prompt to share when I hit a milestone"
            description="Get a reminder to share your link when you unlock a new badge." />
        </CardContent>
      </Card>

      <Button className="w-full h-12 font-heading font-semibold" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Referral Preferences
      </Button>
    </div>
  );
}
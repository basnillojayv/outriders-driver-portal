import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Star, Users, Trophy, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const BADGES = [
  { name: "New", desc: "Just joined", threshold: 0 },
  { name: "Start", desc: "1 referral", threshold: 1 },
  { name: "Lead", desc: "3 referrals", threshold: 3 },
  { name: "Guide", desc: "5 referrals", threshold: 5 },
  { name: "Protect", desc: "8 referrals", threshold: 8 },
  { name: "Outrider", desc: "10 referrals", threshold: 10 },
];

export default function Earn() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const [copied, setCopied] = React.useState(false);

  const username = user?.username || user?.full_name?.toLowerCase().replace(/\s+/g, "") || "driver";
  const referralLink = `https://linehaulstation.com/member/${username}`;
  const referralCount = user?.referral_count || 0;

  const currentBadge = [...BADGES].reverse().find((b) => referralCount >= b.threshold) || BADGES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral link copied");
  };

  return (
    <div className="px-4 pt-6 space-y-4">
      <h1 className="font-heading text-xl font-bold">Earn</h1>
      <p className="text-sm text-muted-foreground">Top 10 Truckers & rewards</p>

      {/* Points / Status */}
      <Card className="bg-carbon text-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Your Badge</p>
              <p className="font-heading text-xl font-bold text-fuel-orange mt-0.5">{currentBadge.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">Referrals</p>
              <p className="font-heading text-2xl font-bold">{referralCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral link */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-heading text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Invite a Friend
          </h3>
          <p className="text-xs text-muted-foreground">Share your link. When they join, you both win.</p>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-xs text-muted-foreground truncate">
              {referralLink}
            </div>
            <Button size="sm" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Badge progression */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-heading text-sm font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" />
            Badge Progression
          </h3>
          <div className="space-y-2">
            {BADGES.map((badge) => {
              const earned = referralCount >= badge.threshold;
              return (
                <div key={badge.name} className={`flex items-center gap-3 p-2 rounded-lg ${earned ? "bg-lhs-green/10" : "bg-muted/50"}`}>
                  <Star className={`w-4 h-4 ${earned ? "text-lhs-green" : "text-muted-foreground"}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${earned ? "" : "text-muted-foreground"}`}>{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.desc}</p>
                  </div>
                  {earned && <Check className="w-4 h-4 text-lhs-green" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rewards placeholder */}
      <Card>
        <CardContent className="p-5 text-center">
          <Gift className="w-10 h-10 text-accent mx-auto mb-2" />
          <p className="font-heading font-semibold text-sm">Rewards Catalog</p>
          <p className="text-xs text-muted-foreground mt-1">Earn free passes and exclusive rewards — coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
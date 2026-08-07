import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Truck, Gift, Fuel, Target, MapPin, Newspaper, Activity, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import BottomNav from "@/components/driver/BottomNav";
import V2TopBar from "@/components/driver/v2/V2TopBar";
import V2Hero from "@/components/driver/v2/V2Hero";
import V2ModuleCard from "@/components/driver/v2/V2ModuleCard";

export default function HomeV2() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: members } = useQuery({
    queryKey: ["myMember", user?.email],
    queryFn: () => base44.entities.Member.filter({ email: user.email }),
    enabled: !!user?.email,
  });

  const { data: affiliateRes } = useQuery({
    queryKey: ["affiliateCampaignData"],
    queryFn: () => base44.functions.invoke("getAffiliateCampaignData", {}),
    enabled: !!user,
  });

  const { data: updates } = useQuery({
    queryKey: ["v2News"],
    queryFn: () => base44.entities.MemberUpdate.filter({ published: true }, "-publish_date", 5),
    enabled: !!user,
  });

  const member = members?.[0] || null;

  const { data: activities } = useQuery({
    queryKey: ["v2Activity", member?.id],
    queryFn: () => base44.entities.MemberActivity.filter({ member_id: member.id }, "-created_date", 5),
    enabled: !!member?.id,
  });

  if (userLoading) {
    return (
      <div className="h-screen bg-v2-bg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#FF6600" }} />
      </div>
    );
  }

  const affiliate = affiliateRes?.data?.affiliate || null;
  const directCount = affiliate?.tier1Members?.length ?? member?.affiliate_leads ?? 0;
  const networkCount =
    (affiliate?.tier2Members?.length ?? member?.affiliate_tier2_leads ?? 0) +
    (affiliate?.tier3Members?.length ?? member?.affiliate_tier3_leads ?? 0);
  const credits = member?.affiliate_credits ?? 0;
  const progress = Math.min(100, (directCount / 10) * 100);
  const toGo = Math.max(0, 10 - directCount);

  const firstName = member?.first_name || user?.full_name?.split(" ")[0] || "Driver";
  const status = member?.membership_status || "pending";
  const memberId = member?.lhs_member_id || "";

  const latestUpdate = updates?.[0];
  const newsCount = updates?.length ?? 0;
  const newsTo = latestUpdate?.cta_destination?.startsWith("/")
    ? latestUpdate.cta_destination
    : undefined;

  const latestActivity = activities?.[0];
  const activityCount = activities?.length ?? 0;

  const summary = `${directCount} direct · ${networkCount} network · ${credits} credits`;

  return (
    <div className="h-screen bg-v2-bg flex flex-col font-v2-body">
      <V2TopBar title="Home" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-8 space-y-3">
          <V2Hero firstName={firstName} status={status} memberId={memberId} summary={summary} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <V2ModuleCard
              icon={Truck}
              label="Current Trip"
              accent="cobalt"
              chip="Idle"
              chipTone="cobalt"
              metric="—"
              sub="No active route. Start a trip to see live telemetry."
            />
            <V2ModuleCard
              icon={Gift}
              label="Rewards"
              accent="fuel"
              metric={String(credits)}
              unit="cr"
              sub="Lifetime credits earned."
              actionLabel="View rewards"
              to="/rewards"
            />
            <V2ModuleCard
              icon={Target}
              label="Top 10 Progress"
              accent="fuel"
              metric={String(directCount)}
              unit="/ 10"
              sub={toGo > 0 ? `${toGo} to go to reach Top 10.` : "Top 10 reached. Outstanding."}
              progress={progress}
              actionLabel="View Top 10"
              to="/rewards"
            />
            <V2ModuleCard
              icon={Fuel}
              label="Fuel Savings"
              accent="success"
              chip="Soon"
              chipTone="success"
              metric="—"
              sub="Fuel savings tracking coming soon."
            />
            <V2ModuleCard
              icon={MapPin}
              label="Nearby Terminal"
              accent="cobalt"
              headline="West Memphis"
              sub="Opening August 2026."
              actionLabel="View terminals"
              to="/locations"
            />
            <V2ModuleCard
              icon={Newspaper}
              label="News"
              accent="cobalt"
              headline={latestUpdate?.title || "No updates yet"}
              chip={newsCount ? `${newsCount} new` : undefined}
              actionLabel={latestUpdate?.cta_text}
              to={newsTo}
            />
            <V2ModuleCard
              icon={Activity}
              label="Recent Activity"
              accent="cobalt"
              headline={latestActivity?.title || "No recent activity"}
              chip={activityCount ? `${activityCount} items` : undefined}
            />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
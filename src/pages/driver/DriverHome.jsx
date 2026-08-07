import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

import HeroMemberPass from "@/components/driver/home/HeroMemberPass";
import WelcomeMessage from "@/components/driver/home/WelcomeMessage";
import TopTenCard from "@/components/driver/home/TopTenCard";
import MemberDetails from "@/components/driver/home/MemberDetails";
import MemberUpdates from "@/components/driver/home/MemberUpdates";
import QuickActions from "@/components/driver/home/QuickActions";
import NeedHelp from "@/components/driver/home/NeedHelp";

export default function DriverHome() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: members, isLoading: memberLoading } = useQuery({
    queryKey: ["myMember", user?.email],
    queryFn: () => base44.entities.Member.filter({ email: user.email }),
    enabled: !!user?.email,
  });

  const { data: affiliateData, isLoading: affiliateLoading } = useQuery({
    queryKey: ["affiliateCampaignData"],
    queryFn: async () => {
      const res = await base44.functions.invoke("getAffiliateCampaignData", {});
      return res.data;
    },
    enabled: !!user,
  });

  const isLoading = userLoading || memberLoading;

  const member = members?.[0] || null;
  const affiliate = affiliateData?.affiliate || null;
  const referralLink = affiliate?.referralLink || member?.affiliate_referral_link || null;
  const tier1Members = affiliate?.tier1Members || [];
  const tier2Members = affiliate?.tier2Members || [];
  const tier3Members = affiliate?.tier3Members || [];
  // Count only actual enrolled members (form submitters), not raw GHL lead counts
  const directCount = tier1Members.length;
  const networkCount = tier2Members.length + tier3Members.length;

  const firstName = member?.first_name || user?.full_name?.split(" ")[0] || "Member";
  const isActive = member?.membership_status === "active";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-16 space-y-5 max-w-2xl mx-auto lg:max-w-6xl">

      {/* 1 — Welcome Message */}
      <WelcomeMessage firstName={firstName} />

      {/* 2 — Member Details */}
      <MemberDetails memberID={member?.lhs_member_id} />

      {/* 3 — Top 10 Truckers (primary dashboard card) */}
      <TopTenCard
        directCount={directCount}
        networkCount={networkCount}
        referralLink={referralLink}
      />

      {/* 3 — Member Updates */}
      <MemberUpdates />

      <div className="lg:hidden">
        <Divider />
        {/* 5 — Quick Actions (mobile only — sidebar handles nav on desktop) */}
        <QuickActions />
        <Divider />
      </div>

      {/* 6 — Need Help */}
      <NeedHelp />

    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />;
}
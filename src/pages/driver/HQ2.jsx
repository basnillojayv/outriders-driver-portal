import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

import BottomNav from "@/components/driver/BottomNav";
import HQ2TopBar from "@/components/driver/hq2/HQ2TopBar";
import HQ2Welcome from "@/components/driver/hq2/HQ2Welcome";
import HQ2MemberDetails from "@/components/driver/hq2/HQ2MemberDetails";
import HQ2TopTen from "@/components/driver/hq2/HQ2TopTen";
import HQ2MemberUpdates from "@/components/driver/hq2/HQ2MemberUpdates";
import HQ2QuickActions from "@/components/driver/hq2/HQ2QuickActions";
import HQ2NeedHelp from "@/components/driver/hq2/HQ2NeedHelp";

export default function HQ2() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: members, isLoading: memberLoading } = useQuery({
    queryKey: ["myMember", user?.email],
    queryFn: () => base44.entities.Member.filter({ email: user.email }),
    enabled: !!user?.email,
  });

  const { data: affiliateData } = useQuery({
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
  const directCount = tier1Members.length;
  const networkCount = tier2Members.length + tier3Members.length;

  const firstName = member?.first_name || user?.full_name?.split(" ")[0] || "Member";

  if (isLoading) {
    return (
      <div className="h-screen bg-v2-bg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#FF6600" }} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-v2-bg flex flex-col font-v2-body">
      <HQ2TopBar title="HQ - 2" homeTo="/hq-2" />

      <main className="flex-1 overflow-y-auto">
        <div className="px-4 pt-6 pb-16 space-y-5 max-w-2xl mx-auto lg:max-w-6xl">
          <HQ2Welcome firstName={firstName} />
          <HQ2MemberDetails memberID={member?.lhs_member_id} />
          <HQ2TopTen
            directCount={directCount}
            networkCount={networkCount}
            referralLink={referralLink}
          />
          <HQ2MemberUpdates />

          <div className="lg:hidden">
            <Divider />
            <HQ2QuickActions />
            <Divider />
          </div>

          <HQ2NeedHelp />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#1E252D" }} />;
}
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MemberCredential from "@/components/driver/pass/MemberCredential";
import DigitalAccessSection from "@/components/driver/pass/DigitalAccessSection";
import PassesSection from "@/components/driver/pass/PassesSection";
import ServicesAmenitiesSection from "@/components/driver/pass/ServicesAmenitiesSection";
import MembershipOptionsSection from "@/components/driver/pass/MembershipOptionsSection";
import MembershipLevelSection from "@/components/driver/pass/MembershipLevelSection";
import AmenityTokensSection from "@/components/driver/pass/AmenityTokensSection";
import LHSWebsite from "@/components/driver/pass/LHSWebsite";
import ShareWithCompany from "@/components/driver/referral/ShareWithCompany";
import V3LoadingScreen from "@/components/driver/v3/V3LoadingScreen";
import V3Shell from "@/components/driver/v3/V3Shell";

export default function MemberCardPage() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: members, isLoading: memberLoading } = useQuery({
    queryKey: ["myMember", user?.email],
    queryFn: () => base44.asServiceRole
      ? base44.entities.Member.filter({ email: user.email })
      : Promise.resolve([]),
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

  const isLoading = userLoading || memberLoading || affiliateLoading;
  const member = members?.[0] || null;
  const affiliate = affiliateData?.affiliate || null;
  const referralLink = affiliate?.referralLink || member?.affiliate_referral_link || null;
  const tier1Members = affiliate?.tier1Members || [];
  const tier2Members = affiliate?.tier2Members || [];
  const tier3Members = affiliate?.tier3Members || [];
  const directCount = tier1Members.length;
  const networkCount = tier2Members.length + tier3Members.length;
  const credits = affiliate?.credits || member?.affiliate_credits || 0;

  // Founders Program tier — first rank not yet achieved (Lead → Guide → Protect → Founder)
  const foundersTier = (() => {
    const ranks = [
      { name: "Lead",    d: 10, n: 0 },
      { name: "Guide",   d: 10, n: 100 },
      { name: "Protect", d: 10, n: 1000 },
    ];
    for (const r of ranks) {
      if (!(directCount >= r.d && networkCount >= r.n)) return r.name;
    }
    return "Founder";
  })();

  const memberSince = member?.agreement_signed_at || member?.created_date || user?.created_date;
  const sinceYear = memberSince ? new Date(memberSince).getFullYear() : null;
  const isFounder = sinceYear && sinceYear <= 2025;
  const hasTopTen = (directCount || 0) >= 10;

  if (isLoading) return <V3LoadingScreen />;

  return (
    <V3Shell>
      <div className="space-y-4 max-w-md mx-auto">
        {/* ── Member Card ── */}
        <MemberCredential member={member} user={user} directCount={directCount} networkCount={networkCount} tierName={foundersTier} />

        {/* ── Digital Access ── */}
        <DigitalAccessSection referralLink={referralLink} />

        {/* ── Passes ── */}
        <PassesSection />

        {/* ── Services & Amenities ── */}
        <ServicesAmenitiesSection />

        {/* ── Membership Options ── */}
        <MembershipOptionsSection />

        {/* ── Founders Dashboard (placeholder) ── */}
        <MembershipLevelSection />

        {/* ── Amenity Credits ── */}
        <AmenityTokensSection availableCredits={0} />

        {/* ── Share Brochures ── */}
        <ShareWithCompany referralLink={referralLink} memberName={member?.first_name || user?.full_name?.split(" ")[0]} />

        {/* ── LHS Website ── */}
        <LHSWebsite />
      </div>
    </V3Shell>
  );
}
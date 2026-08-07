import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import V3Shell from "@/components/driver/v3/V3Shell";
import V3LoadingScreen from "@/components/driver/v3/V3LoadingScreen";
import { T } from "@/components/driver/v3/v3tokens";
import TopTenHero from "@/components/driver/rewards/TopTenHero";
import CreditsAndSharing from "@/components/driver/rewards/CreditsAndSharing";
import FoundersDashboard from "@/components/driver/rewards/FoundersDashboard";
import NetworkMap from "@/components/driver/rewards/NetworkMap";
import FoundersComingSoon from "@/components/driver/rewards/FoundersComingSoon";

const BADGE_THRESHOLDS = [
  { name: "New", directReq: 0, networkReq: 0 },
  { name: "Start", directReq: 1, networkReq: 0 },
  { name: "Lead", directReq: 10, networkReq: 0 },
  { name: "Guide", directReq: 10, networkReq: 100 },
  { name: "Protect", directReq: 10, networkReq: 1000 },
  { name: "Outrider", directReq: 10, networkReq: 100 },
];

function computeBadgeNames(directCount, networkCount) {
  return BADGE_THRESHOLDS
    .filter(b => directCount >= b.directReq && networkCount >= b.networkReq)
    .map(b => b.name);
}

function computeCurrentBadge(directCount, networkCount) {
  const earned = computeBadgeNames(directCount, networkCount);
  const current = earned[earned.length - 1] || "New";
  if (current === "New" || current === "Start") return "Lead";
  return current;
}

function Divider() {
  return <div aria-hidden style={{ height: 1, background: T.borderAlt }} />;
}

export default function Rewards() {
  const { data: user, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: affiliateData, isLoading: affiliateLoading } = useQuery({
    queryKey: ["affiliateCampaignData"],
    queryFn: async () => {
      const res = await base44.functions.invoke("getAffiliateCampaignData", {});
      return res.data;
    },
    enabled: !!user,
  });

  if (isLoading || affiliateLoading) return <V3LoadingScreen />;

  const affiliate = affiliateData?.affiliate || null;
  const referralLink = affiliate?.referralLink || null;
  // Source counts from GHL (affiliate_leads + tier2/tier3) so the Founders
  // Program status matches the GHL totals rather than the resolved Base44 chain.
  const directCount = affiliate?.leads || 0;
  const networkCount = affiliate?.networkLeads || 0;
  // The three Circles are the three referral generations, per the network map:
  // your 10 direct → each brings 10 (100) → each of those brings 10 (1,000).
  const tier2Count = affiliate?.tier2Leads || 0;
  const tier3Count = affiliate?.tier3Leads || 0;
  const currentBadge = computeCurrentBadge(directCount, networkCount);


  return (
    <V3Shell>
      <header style={{ textAlign: "center", marginBottom: 18 }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "clamp(24px, 7vw, 30px)",
            color: T.textPrimary,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          Founders Program
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: T.textSecondary,
            marginTop: 5,
          }}
        >
          Track your referral progress.
        </p>
      </header>

      <TopTenHero referralLink={referralLink} memberName={user?.full_name} directCount={directCount} networkCount={networkCount} />

      <Divider />

      <CreditsAndSharing credits={(directCount + networkCount) >= 1001 ? (affiliate?.credits ?? 0) : 0} referralLink={referralLink} />

      <Divider />

      <FoundersDashboard directCount={directCount} tier2Count={tier2Count} tier3Count={tier3Count} />

      <Divider />

      <NetworkMap directCount={directCount} tier2Count={tier2Count} tier3Count={tier3Count} />

      <Divider />

      <FoundersComingSoon />
    </V3Shell>
  );
}
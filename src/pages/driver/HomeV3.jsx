import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import V3LoadingScreen from "@/components/driver/v3/V3LoadingScreen";
import V3Shell from "@/components/driver/v3/V3Shell";
import HomeGreeting from "@/components/driver/v3/home/HomeGreeting";
import HomeStatsPanel from "@/components/driver/v3/home/HomeStatsPanel";
import HomeBreakingNews from "@/components/driver/v3/home/HomeBreakingNews";
import HomeQuickActions from "@/components/driver/v3/home/HomeQuickActions";

export default function HomeV3() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: members, isLoading: memberLoading } = useQuery({
    queryKey: ["myMember", user?.email],
    queryFn: () => base44.entities.Member.filter({ email: user.email }),
    enabled: !!user?.email,
  });

  const isLoading = userLoading || memberLoading;

  const member = members?.[0] || null;
  const firstName = member?.first_name || user?.full_name?.split(" ")[0] || "Member";

  if (isLoading) return <V3LoadingScreen />;

  return (
    <V3Shell>
      <HomeGreeting firstName={firstName} />
      <HomeStatsPanel />
      <HomeBreakingNews />
      <HomeQuickActions />
    </V3Shell>
  );
}
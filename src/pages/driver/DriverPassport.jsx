import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  Share2, Eye, Pencil,
} from "lucide-react";
import { toast } from "sonner";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import V3LoadingScreen from "@/components/driver/v3/V3LoadingScreen";
import { T, btnPrimary, btnSecondary } from "@/components/driver/v3/v3tokens";
import PassportDashboardCover from "@/components/driver/passport/PassportDashboardCover";
import PassportPreview from "@/components/driver/passport/PassportPreview";
import { buildPassportData } from "@/lib/passportData";

export default function DriverPassport() {
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data: user, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: memberData } = useQuery({
    queryKey: ["member", user?.id],
    queryFn: () => base44.entities.Member.filter({ portal_user_id: user.id }),
    enabled: !!user,
  });
  const member = memberData?.[0];
  const memberId = member?.lhs_member_id || "Not assigned";

  if (isLoading) return <V3LoadingScreen />;

  const memberName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.full_name || "—";
  const headline = user?.headline || "Professional Driver";

  const passportData = buildPassportData(user || {}, memberId);

  const shareUrl = `${window.location.origin}/passport/${user?.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(shareUrl)}`;
  const memberHandle = user?.username || "";
  const memberSince = member?.agreement_signed_at || member?.created_date || user?.created_date;

  const onShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "My Digital Passport", url: shareUrl }); } catch {}
    } else {
      navigator.clipboard?.writeText(shareUrl);
      toast.success("Public passport link copied.");
    }
  };

  return (
    <>
    <V3Shell>
      <BackBar />
      <div className="space-y-4 max-w-md mx-auto">
        {/* ── Passport Cover ── */}
        <PassportDashboardCover
          memberName={memberName}
          memberHandle={memberHandle}
          headline={headline}
          memberId={memberId}
          memberSince={memberSince}
          photoUrl={user?.profile_photo_url}
          qrUrl={qrUrl}
        />

        {/* ── Action buttons ── */}
        <div className="space-y-2.5">
          <button onClick={() => navigate("/digital-passport/edit")} className="flex items-center justify-center gap-2" style={{ ...btnPrimary, width: "100%" }}>
            <Pencil size={16} />
            Create / Edit Passport
          </button>
          <button onClick={() => setPreviewOpen(true)} className="flex items-center justify-center gap-2" style={{ ...btnSecondary, width: "100%" }}>
            <Eye size={15} />
            View Passport
          </button>
          <button onClick={onShare} className="flex items-center justify-center gap-2" style={{ ...btnSecondary, width: "100%" }}>
            <Share2 size={15} />
            Share Passport
          </button>
        </div>

      </div>
    </V3Shell>

    <PassportPreview
      open={previewOpen}
      onClose={() => setPreviewOpen(false)}
      data={passportData}
    />
    </>
  );
}
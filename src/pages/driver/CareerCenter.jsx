import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  ShieldCheck, Cpu, MapPin,
  Share2, ArrowRight, Calculator, Pencil, Eye,
} from "lucide-react";
import { toast } from "sonner";
import V3Shell from "@/components/driver/v3/V3Shell";
import V3LoadingScreen from "@/components/driver/v3/V3LoadingScreen";
import { T, carbonBg, btnPrimary, btnSecondary } from "@/components/driver/v3/v3tokens";
import PassportPreview from "@/components/driver/passport/PassportPreview";
import { buildPassportData } from "@/lib/passportData";

const RUST = "#B5471D";
const COBALT = "#4A6FA3";

function Eyebrow({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
      color: T.orange, letterSpacing: "0.28em", textTransform: "uppercase",
    }}>
      {children}
    </p>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
      color: T.textPrimary, letterSpacing: "0.22em", textTransform: "uppercase",
      marginBottom: 12,
    }}>
      {children}
    </p>
  );
}

function SteelCard({ children, style }) {
  return (
    <div className="rounded-[14px]" style={{
      background: T.card, backgroundImage: "none",
      border: `1px solid ${T.border}`, borderRadius: T.radius,
      padding: 20, isolation: "isolate",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// Button built on the existing btnPrimary style, only swapping color.
function Btn({ color, textColor, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 w-full"
      style={{ ...btnPrimary, background: color, color: textColor, width: "100%" }}
    >
      {Icon && <Icon size={16} style={{ flexShrink: 0 }} />}
      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
    </button>
  );
}

export default function CareerCenter() {
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data: user, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: memberData } = useQuery({
    queryKey: ["member", user?.id],
    queryFn: () => base44.entities.Member.filter({ portal_user_id: user.id }),
    enabled: !!user,
  });

  if (isLoading) return <V3LoadingScreen />;

  const member = memberData?.[0];
  const memberId = member?.lhs_member_id || "Not assigned";
  const memberName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.full_name || "Driver";
  const location = [user?.city, user?.state].filter(Boolean).join(", ");
  const username = user?.username || "";
  const initials = memberName
    ? memberName.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase()
    : "D";

  const passportData = buildPassportData(user || {}, memberId);
  const shareUrl = `${window.location.origin}/passport/${user?.id}`;
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
      <div className="space-y-5 max-w-md mx-auto">
        {/* Hero */}
        <div>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontSize: 32, fontWeight: 700,
            color: T.textPrimary, lineHeight: 1.1, marginTop: 8,
          }}>
            Career Center
          </h1>
          <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.6, marginTop: 10 }}>
            Create, manage, and share your Driver Passport with carriers, brokers, and LineHaul Station corporate members.
          </p>
        </div>

        {/* Digital Passport Card */}
        <div
          className="relative overflow-hidden"
          style={{
            ...carbonBg,
            borderRadius: T.radius,
            border: `1px solid ${T.heroBorder}`,
            boxShadow: "0 6px 28px rgba(255,106,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ height: 3, background: `linear-gradient(90deg, ${T.orange} 0%, transparent 100%)` }} />
          <div style={{ padding: "22px 20px 20px" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} style={{ color: T.orange }} />
                <p style={{
                  fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700,
                  color: T.orange, letterSpacing: "0.22em", textTransform: "uppercase",
                }}>
                  Digital Passport
                </p>
              </div>
              <Cpu size={16} style={{ color: T.textMuted }} />
            </div>

            <div className="flex items-center gap-4">
              <div
                className="flex-shrink-0 flex items-center justify-center overflow-hidden"
                style={{
                  width: 64, height: 64, borderRadius: 12,
                  border: `1px solid ${T.border}`, background: T.cardAlt,
                }}
              >
                {user?.profile_photo_url
                  ? <img src={user.profile_photo_url} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: T.textSecondary }}>{initials}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: T.textPrimary, lineHeight: 1.15 }}>
                  {memberName}
                </p>
                {username && (
                  <p style={{ fontSize: 12, color: T.orange, marginTop: 3, fontStyle: "italic" }}>
                    "{username}"
                  </p>
                )}
                {location && (
                  <div className="flex items-center gap-1" style={{ marginTop: 6 }}>
                    <MapPin size={11} style={{ color: T.textMuted }} />
                    <span style={{ fontSize: 12, color: T.textMuted }}>{location}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Action buttons */}
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

        {/* Search: Carrier Members */}
        <div>
          <SectionLabel>Search: Carrier Members</SectionLabel>
          <Btn color={T.orange} textColor="#0A0A0A" label="Search Carriers" icon={ArrowRight}
            onClick={() => navigate("/find-members?type=carriers")} />
        </div>

        {/* Search: Broker Members */}
        <div>
          <SectionLabel>Search: Broker Members</SectionLabel>
          <Btn color={RUST} textColor="#FFFFFF" label="Search Brokers" icon={ArrowRight}
            onClick={() => navigate("/find-members?type=brokers")} />
        </div>

        {/* Calculator - Cost of Trucking */}
        <div>
          <SectionLabel>Calculator - Cost of Trucking</SectionLabel>
          <div
            className="relative overflow-hidden"
            style={{
              background: T.cardAlt,
              border: `1px solid ${T.borderAlt}`,
              borderRadius: T.radius,
              padding: 20,
              opacity: 0.85,
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
              <Calculator size={16} style={{ color: T.textMuted }} />
              <p style={{
                fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700,
                color: T.textMuted, letterSpacing: "0.28em", textTransform: "uppercase",
              }}>
                Coming Soon
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-[10px]"
                style={{
                  width: 40, height: 40, background: T.orangeDim,
                  border: `1px solid ${T.heroBorder}`,
                }}
              >
                <Calculator size={18} style={{ color: T.orange, opacity: 0.7 }} />
              </div>
              <div className="flex-1">
                <p style={{
                  fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700,
                  color: T.textPrimary, lineHeight: 1.2,
                }}>
                  Cost of Trucking Calculator
                </p>
                <p style={{ fontSize: 12, color: T.textMuted, marginTop: 6, lineHeight: 1.6 }}>
                  Estimate your true cost per mile — fuel, maintenance, insurance, and overhead — to negotiate better rates and run smarter.
                </p>
              </div>
            </div>
          </div>
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
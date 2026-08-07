import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Share, Copy, Check, ExternalLink, QrCode, UserPlus, Truck, Building2, Link2 } from "lucide-react";
import { toast } from "sonner";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import V3LoadingScreen from "@/components/driver/v3/V3LoadingScreen";
import { T } from "@/components/driver/v3/v3tokens";

// ── Editable external URLs ──
const CARRIER_DECK_URL = "https://linehaulstation.com/carrier-deck";
const BROKER_DECK_URL = "https://linehaulstation.com/broker-deck";

function Eyebrow({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
      color: T.orange, letterSpacing: "0.22em", textTransform: "uppercase",
    }}>
      {children}
    </p>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
      color: T.textMuted, letterSpacing: "0.22em", textTransform: "uppercase",
      marginBottom: 12,
    }}>
      {children}
    </p>
  );
}

const ICONS = {
  driver: UserPlus,
  carrier: Truck,
  broker: Building2,
};

export default function SharePage() {
  const { data: user, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: affiliateData } = useQuery({
    queryKey: ["affiliateCampaignData"],
    queryFn: async () => {
      const res = await base44.functions.invoke("getAffiliateCampaignData", {});
      return res.data;
    },
    enabled: !!user,
  });

  const referralLink = affiliateData?.affiliate?.referralLink || null;

  const items = useMemo(() => ([
    { id: "invite-driver",  label: "Invite Driver",  icon: "driver",  url: referralLink,      buttons: ["share", "copy"], referral: true, description: "Share your personal referral link to invite a driver to Outriders." },
    { id: "invite-carrier", label: "Invite Carrier", icon: "carrier", url: CARRIER_DECK_URL,  buttons: ["share", "copy"], external: true, description: "Send info about LineHaul Station to a carrier partner.", comingSoon: true },
    { id: "invite-broker",  label: "Invite Broker",  icon: "broker",  url: BROKER_DECK_URL,   buttons: ["share", "copy"], external: true, description: "Send info about LineHaul Station to a broker partner.", comingSoon: true },
  ]), [referralLink]);

  if (isLoading) return <V3LoadingScreen />;

  return (
    <V3Shell>
      <BackBar />
      <div className="space-y-5 max-w-md mx-auto">
        {/* Hero */}
        <div>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontSize: 32, fontWeight: 700,
            color: T.textPrimary, lineHeight: 1.1,
          }}>
            Invite New Members
          </h1>
          <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.6, marginTop: 10 }}>
            Send Outriders links, invite drivers and partners, and spread the word about LineHaul Station.
          </p>
        </div>

        {/* Shareable links */}
        <div>
          <SectionLabel>Links</SectionLabel>
          <div className="space-y-2.5">
            {items.map((item) => (
              <ShareRow key={item.id} item={item} referralLink={referralLink} />
            ))}
          </div>
        </div>

        {/* Invite QR */}
        <div>
          <SectionLabel>Invite New Drivers</SectionLabel>
          <ReferralQR referralLink={referralLink} />
        </div>
      </div>
    </V3Shell>
  );
}

function ShareRow({ item, referralLink }) {
  const [copied, setCopied] = useState(false);
  const Icon = ICONS[item.icon] || Link2;
  const url = item.url;
  const disabled = item.referral && !referralLink;
  const comingSoon = item.comingSoon;

  const handleShare = async () => {
    if (disabled || comingSoon || !url) {
      toast.error("This link isn't ready yet — check back shortly.");
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({ title: "Outriders — LineHaul Station", text: "Join me on Outriders:", url });
        return;
      } catch { /* cancelled */ }
    }
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const handleCopy = () => {
    if (disabled || comingSoon || !url) {
      toast.error("This link isn't ready yet — check back shortly.");
      return;
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: T.radiusSm,
        padding: "14px 16px",
        opacity: comingSoon ? 0.5 : 1,
      }}
    >
      <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 9,
            background: T.orangeDim,
            border: `1px solid ${T.heroBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} style={{ color: T.orange }} />
        </div>
        {comingSoon && (
          <span style={{
            marginLeft: "auto",
            fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
            color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase",
            border: `1px solid ${T.borderAlt}`, borderRadius: 6, padding: "3px 8px",
            flexShrink: 0,
          }}>
            Soon
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
            color: T.textPrimary, lineHeight: 1.2,
          }}>
            {item.label}
          </p>
          {item.description ? (
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 4, lineHeight: 1.5 }}>
              {item.description}
            </p>
          ) : url && !disabled && !item.internal ? (
            <p
              className="truncate"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10, color: T.textMuted, marginTop: 3, letterSpacing: "0.02em",
              }}
            >
              {url}
            </p>
          ) : item.referral ? (
            <p style={{ fontSize: 10, color: T.textMuted, marginTop: 3 }}>
              {disabled ? "Referral link assigned after first sync" : "Personal referral link"}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2.5">
        {item.buttons.map((btn) => {
          if (btn === "open") {
            return (
              <button
                key="open"
                onClick={handleOpen}
                className="flex-1 flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
                  background: T.orange, color: "#0A0A0A", border: "none",
                  borderRadius: T.radiusSm, padding: "11px 14px", minHeight: 44,
                  cursor: "pointer",
                }}
              >
                <ExternalLink size={15} />
                Open
              </button>
            );
          }
          if (btn === "share") {
            return (
              <button
                key="share"
                onClick={handleShare}
                disabled={disabled || comingSoon}
                className="flex-1 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
                style={{
                  fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
                  background: T.orange, color: "#0A0A0A", border: "none",
                  borderRadius: T.radiusSm, padding: "11px 14px", minHeight: 44,
                  cursor: (disabled || comingSoon) ? "not-allowed" : "pointer",
                }}
              >
                <Share size={15} />
                Share
              </button>
            );
          }
          // copy
          return (
            <button
              key="copy"
              onClick={handleCopy}
              disabled={disabled || comingSoon}
              className="flex-1 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
              style={{
                fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
                background: copied ? T.greenDim : "transparent",
                color: copied ? T.green : T.textSecondary,
                border: `1px solid ${copied ? "rgba(24,195,126,0.28)" : T.border}`,
                borderRadius: T.radiusSm, padding: "11px 14px", minHeight: 44,
                cursor: (disabled || comingSoon) ? "not-allowed" : "pointer",
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy Link"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReferralQR({ referralLink }) {
  const qrUrl = referralLink
    ? `https://quickchart.io/qr?text=${encodeURIComponent(referralLink)}&size=220&dark=ffffff&light=1c1c1c`
    : null;

  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: 22,
        textAlign: "center",
      }}
    >
      <div className="flex items-center justify-center gap-2" style={{ marginBottom: 16 }}>
        <QrCode size={16} style={{ color: T.orange }} />
        <p style={{
          fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
          color: T.textSecondary, letterSpacing: "0.22em", textTransform: "uppercase",
        }}>
          {referralLink ? "Your Invite QR" : "Invite QR"}
        </p>
      </div>

      {qrUrl ? (
        <div
          style={{
            display: "inline-block",
            padding: 12,
            background: T.cardAlt,
            border: `1px solid ${T.borderAlt}`,
            borderRadius: T.radiusSm,
          }}
        >
          <img
            src={qrUrl}
            alt="Referral QR code"
            style={{ width: 200, height: 200, display: "block" }}
          />
        </div>
      ) : (
        <div
          style={{
            width: 200, height: 200, margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: T.cardAlt,
            border: `1px solid ${T.borderAlt}`,
            borderRadius: T.radiusSm,
          }}
        >
          <QrCode size={48} style={{ color: T.textMuted, opacity: 0.4 }} />
        </div>
      )}

      <p style={{ fontSize: 12, color: T.textMuted, marginTop: 16, lineHeight: 1.55 }}>
        {referralLink
          ? "Have other drivers scan this QR code to sign up for Outriders."
          : "Your invite QR will appear here once your referral link is assigned."}
      </p>
    </div>
  );
}
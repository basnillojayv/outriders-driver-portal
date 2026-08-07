import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { User, Lock, Bell, FileText, CheckCircle2, LogOut, Smartphone } from "lucide-react";
import { format } from "date-fns";
import V3Shell from "@/components/driver/v3/V3Shell";
import V3LoadingScreen from "@/components/driver/v3/V3LoadingScreen";
import { T, btnSecondary } from "@/components/driver/v3/v3tokens";
import NotificationsTab from "@/components/driver/settings/NotificationsTab";

const TABS = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "account",       label: "Account",       icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "legal",         label: "Legal",         icon: FileText },
];

function Eyebrow({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 11,
        fontWeight: 700,
        color: T.textMuted,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

function SteelCard({ children, style }) {
  return (
    <div
      className="rounded-[14px]"
      style={{
        background: T.card,
        backgroundImage: "none",
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: 20,
        isolation: "isolate",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: user, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  if (isLoading) return <V3LoadingScreen />;

  return (
    <V3Shell>
      <div className="space-y-5">
        <div>
          <Eyebrow>Membership Account</Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 24,
              fontWeight: 700,
              color: T.textPrimary,
              marginTop: 6,
            }}
          >
            Account
          </h1>
          <p style={{ fontSize: 13, color: T.textSecondary, marginTop: 6 }}>
            Manage your account and preferences.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] transition-all"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.02em",
                  background: active ? T.orangeDim : T.card,
                  backgroundImage: "none",
                  color: active ? T.orange : T.textSecondary,
                  border: `1px solid ${active ? T.heroBorder : T.borderAlt}`,
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "profile"       && <ProfileSection user={user} />}
        {activeTab === "account"        && <AccountSection user={user} />}
        {activeTab === "notifications"  && <NotificationsTab user={user} />}
        {activeTab === "legal"          && <LegalSection user={user} />}
      </div>
    </V3Shell>
  );
}

// ── Profile (read-only) ──────────────────────────────────────────────────────
function ProfileSection({ user }) {
  const { data: members } = useQuery({
    queryKey: ["my-member"],
    queryFn: () => base44.entities.Member.filter({ portal_user_id: user?.id }),
    enabled: !!user?.id,
  });
  const member = members?.[0];

  const rows = [
    { label: "Email", value: user?.email || "—" },
    { label: "Member ID", value: member?.lhs_member_id || "—" },
    {
      label: "Member Since",
      value: member?.agreement_signed_at
        ? format(new Date(member.agreement_signed_at), "MMMM d, yyyy")
        : (user?.created_date ? format(new Date(user.created_date), "MMMM d, yyyy") : "—"),
    },
  ];

  return (
    <div className="space-y-3">
      <SteelCard style={{ padding: 0 }}>
        <div>
          {rows.map(({ label, value }, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: i < rows.length - 1 ? `1px solid ${T.borderAlt}` : "none",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.14em" }}>
                {label}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: T.textPrimary, textAlign: "right", wordBreak: "break-word" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </SteelCard>
      <p style={{ fontSize: 13, color: T.textMuted, textAlign: "center" }}>
        Need to update your membership? Contact LineHaul Station Member Support.
      </p>
    </div>
  );
}

// ── Account (login email + change password) ──────────────────────────────────
function AccountSection({ user }) {
  const handleChangePassword = async () => {
    await base44.auth.logout("/");
  };

  return (
    <div className="space-y-3">
      <SteelCard>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: T.textPrimary, letterSpacing: "0.02em" }}>
          Login Email
        </h3>
        <div
          className="flex items-center gap-2 rounded-[10px] mt-3"
          style={{ padding: "11px 13px", background: T.cardAlt, border: `1px solid ${T.borderAlt}` }}
        >
          <span style={{ fontSize: 14, color: T.textPrimary, flex: 1, wordBreak: "break-all" }}>
            {user?.email || "—"}
          </span>
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: 999,
              background: T.blueDim,
              color: T.blue,
              border: `1px solid ${T.blue}`,
            }}
          >
            Verified
          </span>
        </div>
        <p style={{ fontSize: 13, color: T.textMuted, marginTop: 12 }}>
          To change your email address, contact LineHaul Station Member Support.
        </p>
      </SteelCard>

      <SteelCard>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: T.textPrimary, letterSpacing: "0.02em" }}>
          Change Password
        </h3>
        <p style={{ fontSize: 13, color: T.textSecondary, marginTop: 8, lineHeight: 1.6 }}>
          To change your password, sign out and use the "Forgot Password" link on the login page.
        </p>
        <button
          className="w-full flex items-center justify-center gap-2 transition-all active:scale-95 mt-4"
          style={btnSecondary}
          onClick={handleChangePassword}
        >
          <LogOut size={15} />
          Sign Out to Reset Password
        </button>
      </SteelCard>

      <SteelCard>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: T.textPrimary, letterSpacing: "0.02em" }}>
          Install App
        </h3>
        <p style={{ fontSize: 13, color: T.textSecondary, marginTop: 8, lineHeight: 1.6 }}>
          Add Outriders HQ to your Home Screen for fast, one-tap access.
        </p>
        <button
          className="w-full flex items-center justify-center gap-2 transition-all active:scale-95 mt-4"
          style={btnSecondary}
          onClick={() => window.dispatchEvent(new CustomEvent("outriders-aths-reopen"))}
        >
          <Smartphone size={15} />
          Show Install Prompt
        </button>
      </SteelCard>
    </div>
  );
}

// ── Legal ────────────────────────────────────────────────────────────────────
function LegalSection({ user }) {
  const { data: members } = useQuery({
    queryKey: ["my-member"],
    queryFn: () => base44.entities.Member.filter({ portal_user_id: user?.id }),
    enabled: !!user?.id,
  });
  const member = members?.[0];
  const agreementDate = member?.agreement_signed_at
    ? format(new Date(member.agreement_signed_at), "MMMM d, yyyy")
    : null;

  const docs = [
    { label: "Privacy Policy",   href: "https://www.linehaulstation.com/privacy-policy" },
    { label: "Terms of Service", href: "https://www.linehaulstation.com/terms-of-service" },
  ];

  return (
    <div className="space-y-3">
      <SteelCard style={{ padding: 0 }}>
        <div>
          {docs.map(({ label, href }, i) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: i < docs.length - 1 ? `1px solid ${T.borderAlt}` : "none",
                fontSize: 14,
                fontWeight: 500,
                color: T.textPrimary,
                textDecoration: "none",
              }}
            >
              {label}
              <FileText size={14} style={{ color: T.textMuted, flexShrink: 0 }} />
            </a>
          ))}
        </div>
      </SteelCard>

      {agreementDate && (
        <div
          className="flex items-center gap-2 rounded-[12px]"
          style={{ padding: "13px 15px", fontSize: 13, background: T.greenDim, border: `1px solid ${T.green}`, color: T.green }}
        >
          <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
          Membership Agreement accepted on {agreementDate}
        </div>
      )}
      {!agreementDate && (
        <p style={{ fontSize: 13, color: T.textMuted, textAlign: "center" }}>
          Agreement date will appear once your membership is activated.
        </p>
      )}
    </div>
  );
}
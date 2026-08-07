import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, RefreshCw, ChevronDown, Copy, ExternalLink, Mail } from "lucide-react";
import ActivityTimeline from "@/components/admin/ActivityTimeline";
import { isActiveTopTenParticipant } from "@/lib/topTenLogic";
import TierBreakdown from "@/components/driver/rewards/TierBreakdown";

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSystem, setShowSystem] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(null);

  const { data: member, isLoading } = useQuery({
    queryKey: ["member", id],
    queryFn: () => base44.entities.Member.get(id),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["memberTransactions", id],
    queryFn: () => base44.asServiceRole.entities.RewardsTransaction.filter({ member_id: id }),
    enabled: !!id,
  });

  const { data: allMembers = [] } = useQuery({
    queryKey: ["allMembersForTier"],
    queryFn: () => base44.asServiceRole.entities.Member.list("-created_date", 1000),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground">Member not found</p>
      </div>
    );
  }

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleResendInvite = async () => {
    if (!member?.email) return;
    try {
      await base44.users.inviteUser(member.email, "user");
      alert("Invite resent to " + member.email);
    } catch (err) {
      alert("Failed to resend invite: " + err.message);
    }
  };

  const handleSyncAffiliate = async () => {
    setSyncing(true);
    try {
      await base44.functions.invoke("enrichAffiliateIdentity", { member_id: id });
      await queryClient.invalidateQueries({ queryKey: ["member", id] });
      await queryClient.invalidateQueries({ queryKey: ["memberTransactions", id] });
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setSyncing(false);
    }
  };

  const txnsByMember = { [id]: transactions };
  const isTopTen = isActiveTopTenParticipant(member, txnsByMember);

  // Build tier member lists by walking affiliate_children_ids (same as getAffiliateCampaignData)
  // This avoids the ambiguity of affiliate_parent_id which can be either an internal GHL _id
  // or a public am_id string depending on enrollment path (webhook vs migration).
  const memberByAffId = {};
  for (const m of allMembers) {
    if (m.affiliate_id) memberByAffId[m.affiliate_id] = m;
  }
  function parseChildIds(jsonStr) {
    try { return JSON.parse(jsonStr || '[]'); } catch { return []; }
  }
  function toLabel(m) {
    return { name: `${m.first_name || ''} ${m.last_name || ''}`.trim() || m.email, email: m.email, joined: m.agreement_signed_at || m.created_date };
  }

  const t1Ids = parseChildIds(member?.affiliate_children_ids);
  const tier1Members = t1Ids.map(id => memberByAffId[id]).filter(Boolean).map(toLabel);

  const t2Ids = t1Ids.flatMap(id => parseChildIds(memberByAffId[id]?.affiliate_children_ids));
  const tier2Members = t2Ids.map(id => memberByAffId[id]).filter(Boolean).map(toLabel);

  const t3Ids = t2Ids.flatMap(id => parseChildIds(memberByAffId[id]?.affiliate_children_ids));
  const tier3Members = t3Ids.map(id => memberByAffId[id]).filter(Boolean).map(toLabel);
  const creditBalance = transactions.length > 0
    ? transactions.reduce((sum, tx) => sum + (tx.credit_amount || 0), 0)
    : member.affiliate_credits || 0;

  const totalLeads = (member.affiliate_leads || 0) + (member.affiliate_tier2_leads || 0) + (member.affiliate_tier3_leads || 0);

  const SectionCard = ({ title, children, action }) => (
    <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", padding: 20, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 900, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );

  const Row = ({ label, value, accent }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 12 }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0, minWidth: 130 }}>{label}</span>
      <span style={{ fontSize: 13, color: accent || "var(--text-secondary)", textAlign: "right", wordBreak: "break-all", overflowWrap: "anywhere" }}>
        {value ?? "—"}
      </span>
    </div>
  );

  // Membership lifecycle status
  const getMembershipStatus = () => {
    if (member.membership_status === "active" && member.portal_user_id) return { label: "Active", color: "var(--success)", bg: "rgba(24,160,107,0.12)" };
    if (member.membership_status === "active") return { label: "Active · Not Logged In", color: "var(--success)", bg: "rgba(24,160,107,0.08)" };
    if (member.portal_invited_at && !member.portal_user_id) return { label: "Invited · Pending Login", color: "#e8a14b", bg: "rgba(232,161,75,0.12)" };
    if (member.membership_status === "pending") return { label: "Pending Activation", color: "#e8a14b", bg: "rgba(232,161,75,0.12)" };
    if (member.membership_status === "suspended") return { label: "Suspended", color: "var(--danger)", bg: "rgba(192,57,43,0.12)" };
    if (member.membership_status === "cancelled") return { label: "Cancelled", color: "var(--text-muted)", bg: "rgba(255,255,255,0.05)" };
    return { label: "Unknown", color: "var(--text-muted)", bg: "rgba(255,255,255,0.05)" };
  };

  const statusInfo = getMembershipStatus();
  const rawPayload = member.raw_ghl_payload ? (() => { try { return JSON.parse(member.raw_ghl_payload); } catch { return null; } })() : null;

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-3xl">
      {/* Back */}
      <button
        onClick={() => navigate("/admin/members")}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "var(--text-secondary)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
      >
        <ArrowLeft size={13} />
        Back to Members
      </button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
            {member.first_name} {member.last_name}
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{member.email}</p>
        </div>
        <span style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 800, fontFamily: "var(--font-heading)", color: statusInfo.color, background: statusInfo.bg, flexShrink: 0 }}>
          {statusInfo.label}
        </span>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[
          {
            key: "member_id",
            label: copied === "member_id" ? "Copied!" : "Copy Member ID",
            icon: <Copy size={13} />,
            onClick: () => handleCopy(member.lhs_member_id, "member_id"),
            disabled: !member.lhs_member_id,
          },
          {
            key: "referral_link",
            label: copied === "referral_link" ? "Copied!" : "Copy Referral Link",
            icon: <Copy size={13} />,
            onClick: () => handleCopy(member.affiliate_referral_link, "referral_link"),
            disabled: !member.affiliate_referral_link,
          },
          {
            key: "ghl",
            label: "Open GHL Contact",
            icon: <ExternalLink size={13} />,
            onClick: () => member.ghl_contact_id && window.open(`https://app.gohighlevel.com/contacts/${member.ghl_contact_id}`, "_blank"),
            disabled: !member.ghl_contact_id,
          },
          {
            key: "invite",
            label: "Resend Invite",
            icon: <Mail size={13} />,
            onClick: handleResendInvite,
            disabled: !member.email,
          },
        ].map(({ key, label, icon, onClick, disabled }) => (
          <button
            key={key}
            onClick={onClick}
            disabled={disabled}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 12px", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: disabled ? "var(--text-disabled)" : "var(--text-secondary)",
              cursor: disabled ? "not-allowed" : "pointer",
              fontSize: 12, fontWeight: 600,
              opacity: disabled ? 0.5 : 1,
              transition: "all 0.15s",
            }}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Overview */}
      <SectionCard title="Overview">
        <Row label="Member ID" value={member.lhs_member_id || "—"} accent="var(--fuel-300)" />
        <Row label="Phone" value={member.phone} />
        <Row label="Joined" value={member.agreement_signed_at ? new Date(member.agreement_signed_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"} />
        <Row label="Portal Access" value={member.portal_user_id ? "Activated" : member.portal_invited_at ? `Invited ${new Date(member.portal_invited_at).toLocaleDateString()}` : "Not yet invited"} />
      </SectionCard>

      {/* Top Ten Referral Program */}
      <SectionCard
        title="Top Ten Referral Program"
        action={
          <button
            onClick={handleSyncAffiliate}
            disabled={syncing}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(204,91,48,0.1)", color: "var(--fuel-300)", cursor: syncing ? "not-allowed" : "pointer", fontSize: 11, fontWeight: 600, opacity: syncing ? 0.6 : 1 }}
          >
            <RefreshCw size={12} style={{ animation: syncing ? "spin 1s linear infinite" : "none" }} />
            {syncing ? "Syncing…" : "Sync GHL"}
          </button>
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Tier 1", value: member.affiliate_leads || 0 },
            { label: "Tier 2", value: member.affiliate_tier2_leads || 0 },
            { label: "Tier 3", value: member.affiliate_tier3_leads || 0 },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center", padding: "12px 8px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "var(--font-heading)", color: value > 0 ? "var(--fuel-300)" : "var(--text-muted)" }}>{value}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
            </div>
          ))}
        </div>
        <Row label="Network Total" value={totalLeads} />
        <Row label="Clicks" value={member.affiliate_clicks || 0} />
        <Row label="Participant Status" value={isTopTen ? "✓ Top Ten Participant" : "Not yet qualifying"} accent={isTopTen ? "var(--success)" : undefined} />
        {member.affiliate_referral_link && (
          <Row label="Referral Link" value={member.affiliate_referral_link} />
        )}
      </SectionCard>

      {/* Tier Breakdown */}
      {(tier1Members.length > 0 || tier2Members.length > 0 || tier3Members.length > 0) && (
        <SectionCard title="Network Members by Tier">
          <TierBreakdown tier1Members={tier1Members} tier2Members={tier2Members} tier3Members={tier3Members} />
        </SectionCard>
      )}

      {/* Rewards */}
      <SectionCard title="Rewards">
        <Row label="Credit Balance" value={creditBalance} accent={creditBalance > 0 ? "var(--accent)" : undefined} />
        <Row label="Source" value={transactions.length > 0 ? "Ledger (authoritative)" : "GHL cache"} />
        {transactions.length > 0 && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Recent Transactions</p>
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span>{tx.source} · {new Date(tx.created_at || tx.created_date).toLocaleDateString()}</span>
                <span style={{ fontWeight: 700, flexShrink: 0, color: tx.credit_amount > 0 ? "var(--success)" : "var(--danger)" }}>
                  {tx.credit_amount > 0 ? "+" : ""}{tx.credit_amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Activity */}
      <ActivityTimeline memberId={id} />

      {/* System — collapsed by default */}
      <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <button
          onClick={() => setShowSystem(!showSystem)}
          style={{
            width: "100%", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
            fontSize: 12, fontWeight: 900, fontFamily: "var(--font-heading)", color: "var(--text-muted)",
            background: "rgba(255,255,255,0.01)", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.06em",
          }}
        >
          System & Debug
          <ChevronDown size={15} style={{ transform: showSystem ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </button>

        {showSystem && (
          <div style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ paddingTop: 16, marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>GHL Identifiers</p>
              <Row label="GHL Contact ID" value={member.ghl_contact_id} />
              <Row label="Affiliate ID" value={member.affiliate_id} />
              <Row label="Campaign ID" value={member.affiliate_campaign_id} />
              <Row label="Referral Parent ID" value={member.affiliate_parent_id} />
              <Row label="Public Code" value={member.affiliate_public_code} />
            </div>
            <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)", marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Sync Status</p>
              <Row label="Lookup Status" value={member.affiliate_lookup_status?.toUpperCase()} />
              <Row label="Last Enriched" value={member.affiliate_enriched_at ? new Date(member.affiliate_enriched_at).toLocaleString() : "—"} />
              <Row label="GHL Writeback" value={member.ghl_writeback_status?.toUpperCase()} />
              <Row label="Writeback At" value={member.ghl_writeback_at ? new Date(member.ghl_writeback_at).toLocaleString() : "—"} />
              <Row label="Agreement Date" value={member.agreement_signed_at ? new Date(member.agreement_signed_at).toLocaleString() : "—"} />
            </div>
            {rawPayload && (
              <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Raw GHL Payload</p>
                <pre style={{ padding: 12, background: "rgba(0,0,0,0.3)", fontSize: 11, color: "var(--text-secondary)", overflow: "auto", maxHeight: 300, fontFamily: "monospace", lineHeight: 1.4, borderRadius: 8 }}>
                  {JSON.stringify(rawPayload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
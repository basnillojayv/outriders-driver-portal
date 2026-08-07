import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Users, Clock, Trophy, Link2, AlertTriangle, ChevronRight } from "lucide-react";
import { isActiveTopTenParticipant } from "@/lib/topTenLogic";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: members = [] } = useQuery({
    queryKey: ["allMembers"],
    queryFn: () => base44.entities.Member.list("-created_date", 1000),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["allTransactions"],
    queryFn: () => base44.asServiceRole.entities.RewardsTransaction.list(),
  });

  // --- Stats ---
  const totalMembers = members.length;

  // Invited = portal_invited_at set but no portal_user_id yet
  const invitedPendingLogin = members.filter(
    (m) => m.portal_invited_at && !m.portal_user_id
  ).length;

  const txnsByMember = {};
  transactions.forEach((tx) => {
    if (!txnsByMember[tx.member_id]) txnsByMember[tx.member_id] = [];
    txnsByMember[tx.member_id].push(tx);
  });

  const topTenCount = members.filter((m) =>
    isActiveTopTenParticipant(m, txnsByMember)
  ).length;

  const totalLeads = members.reduce(
    (sum, m) => sum + (m.affiliate_leads || 0) + (m.affiliate_tier2_leads || 0) + (m.affiliate_tier3_leads || 0),
    0
  );

  // --- Issues: stuck members ---
  const stuckMembers = members.filter((m) => {
    const isStuck =
      // Invited but never logged in (>7 days)
      (m.portal_invited_at &&
        !m.portal_user_id &&
        new Date() - new Date(m.portal_invited_at) > 7 * 24 * 60 * 60 * 1000) ||
      // GHL writeback failed
      m.ghl_writeback_status === "failed" ||
      // Affiliate lookup failed/retry
      m.affiliate_lookup_status === "retry" ||
      // Active member with no affiliate ID
      (m.membership_status === "active" && !m.affiliate_id);
    return isStuck;
  });

  const getIssueReason = (m) => {
    const reasons = [];
    if (
      m.portal_invited_at &&
      !m.portal_user_id &&
      new Date() - new Date(m.portal_invited_at) > 7 * 24 * 60 * 60 * 1000
    )
      reasons.push("Invite expired / not logged in");
    if (m.ghl_writeback_status === "failed") reasons.push("GHL writeback failed");
    if (m.affiliate_lookup_status === "retry") reasons.push("Affiliate lookup needs retry");
    if (m.membership_status === "active" && !m.affiliate_id)
      reasons.push("Active — no affiliate linked");
    return reasons.join(" · ");
  };

  const STATS = [
    {
      label: "Members",
      value: totalMembers,
      icon: Users,
      color: "var(--fuel-300)",
      onClick: () => navigate("/admin/members"),
    },
    {
      label: "Invited · Pending Login",
      value: invitedPendingLogin,
      icon: Clock,
      color: "var(--warning)",
      onClick: () => navigate("/admin/members?status=pending"),
    },
    {
      label: "Top Ten Participants",
      value: topTenCount,
      icon: Trophy,
      color: "var(--fuel-500)",
      onClick: () => navigate("/admin/members?view=topten"),
    },
    {
      label: "Total Leads Generated",
      value: totalLeads,
      icon: Link2,
      color: "var(--success)",
      onClick: () => navigate("/admin/members"),
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Outriders Member Overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map(({ label, value, icon: Icon, color, onClick }) => (
          <div
            key={label}
            onClick={onClick}
            className="rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              background: "var(--carbon-800)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {label}
              </p>
              <Icon size={16} style={{ color }} />
            </div>
            <p
              style={{
                fontSize: 32,
                fontWeight: 900,
                fontFamily: "var(--font-heading)",
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Issues Panel */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} style={{ color: "var(--warning)" }} />
          <h2 className="font-heading text-base font-bold">
            Members Needing Attention
          </h2>
          {stuckMembers.length > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "var(--warning)",
                background: "rgba(232,161,75,0.15)",
                padding: "2px 8px",
                borderRadius: 20,
              }}
            >
              {stuckMembers.length}
            </span>
          )}
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {stuckMembers.length === 0 ? (
            <div
              style={{
                padding: "32px 20px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              No issues detected — all members look good.
            </div>
          ) : (
            stuckMembers.map((m, i) => (
              <div
                key={m.id}
                onClick={() => navigate(`/admin/members/${m.id}`)}
                className="cursor-pointer hover:bg-white/[0.03] transition-colors"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom:
                    i < stuckMembers.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                {/* Avatar placeholder */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading)",
                    fontSize: 13,
                    fontWeight: 800,
                    color: "var(--text-secondary)",
                    flexShrink: 0,
                  }}
                >
                  {(m.first_name?.[0] || m.email?.[0] || "?").toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {m.first_name && m.last_name
                      ? `${m.first_name} ${m.last_name}`
                      : m.email}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--warning)",
                      marginTop: 1,
                    }}
                  >
                    {getIssueReason(m)}
                  </p>
                </div>

                <div style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, marginRight: 4 }}>
                  {m.lhs_member_id || ""}
                </div>

                <ChevronRight size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
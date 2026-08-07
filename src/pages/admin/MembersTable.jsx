import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search, Loader2, ChevronUp, ChevronDown, ChevronsUpDown, X, Mail } from "lucide-react";
import { isActiveTopTenParticipant } from "@/lib/topTenLogic";
import InvitePendingDialog from "@/components/admin/InvitePendingDialog";

const FILTERS = [
  { label: "All Members", value: "all" },
  { label: "Pending Login", value: "pending" },
  { label: "Top Ten", value: "top_ten" },
  { label: "Needs Attention", value: "needs_attention" },
];

// A member "needs attention" if they have an operational issue worth surfacing
function needsAttention(m) {
  const invitedTooLong = m.portal_invited_at && !m.portal_user_id
    && (Date.now() - new Date(m.portal_invited_at).getTime()) > 7 * 24 * 60 * 60 * 1000;
  const writebackFailed = m.ghl_writeback_status === "failed";
  const suspended = m.membership_status === "suspended";
  return invitedTooLong || writebackFailed || suspended;
}

function getMembershipBadge(m) {
  if (m.membership_status === "active") return { label: "Active", color: "var(--success)", bg: "rgba(24,160,107,0.12)" };
  if (m.membership_status === "suspended" || m.membership_status === "cancelled") return { label: "Inactive", color: "var(--danger)", bg: "rgba(192,57,43,0.12)" };
  return { label: "Pending", color: "#e8a14b", bg: "rgba(232,161,75,0.12)" };
}

function getPortalBadge(m) {
  if (m.portal_user_id) return { label: "Logged In", color: "var(--success)", bg: "rgba(24,160,107,0.10)" };
  if (m.portal_invited_at) return { label: "Invited", color: "#e8a14b", bg: "rgba(232,161,75,0.10)" };
  return { label: "Not Invited", color: "var(--text-muted)", bg: "rgba(255,255,255,0.05)" };
}

function Pill({ color, bg, label, small }) {
  return (
    <span style={{
      display: "inline-block",
      padding: small ? "2px 8px" : "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      fontFamily: "var(--font-heading)",
      letterSpacing: "0.03em",
      color,
      background: bg,
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

const MEMBERSHIP_STATUSES = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "cancelled", label: "Cancelled" },
];

export default function MembersTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sort, setSort] = useState({ col: null, dir: "asc" });
  const [selected, setSelected] = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null); // { success, failed }
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [inviteAllLoading, setInviteAllLoading] = useState(false);
  const [inviteAllResult, setInviteAllResult] = useState(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  useEffect(() => {
    const statusParam = searchParams.get("status");
    const viewParam = searchParams.get("view");
    if (statusParam === "pending") setActiveFilter("pending");
    else if (viewParam === "topten") setActiveFilter("top_ten");
  }, [searchParams]);

  const handleSort = (col) => {
    setSort(prev => prev.col === col ? { col, dir: prev.dir === "asc" ? "desc" : "asc" } : { col, dir: "asc" });
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(m => m.id)));
    }
  };

  const clearSelection = () => {
    setSelected(new Set());
    setBulkResult(null);
    setShowStatusMenu(false);
  };

  const handleBulkResendInvite = async () => {
    setBulkLoading(true);
    setBulkResult(null);
    const targets = members.filter(m => selected.has(m.id) && m.email);
    let success = 0, failed = 0;
    for (const m of targets) {
      try {
        await base44.users.inviteUser(m.email, "user");
        success++;
      } catch {
        failed++;
      }
    }
    setBulkLoading(false);
    setBulkResult({ success, failed });
  };

  const handleBulkStatusChange = async (newStatus) => {
    setShowStatusMenu(false);
    setBulkLoading(true);
    setBulkResult(null);
    const ids = [...selected];
    let success = 0, failed = 0;
    for (const id of ids) {
      try {
        await base44.entities.Member.update(id, { membership_status: newStatus });
        success++;
      } catch {
        failed++;
      }
    }
    await queryClient.invalidateQueries({ queryKey: ["allMembers"] });
    setBulkLoading(false);
    setBulkResult({ success, failed });
  };

  const handleInvitePending = async (limit) => {
    setInviteAllLoading(true);
    setInviteAllResult(null);
    try {
      const res = await base44.functions.invoke("invitePendingMembers", { limit });
      setInviteAllResult(res.data);
      await queryClient.invalidateQueries({ queryKey: ["allMembers"] });
    } catch (err) {
      setInviteAllResult({ error: err.message });
    }
    setInviteAllLoading(false);
  };

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["allMembers"],
    queryFn: () => base44.entities.Member.list("-agreement_signed_at", 1000),
  });

  const inviteCandidates = useMemo(
    () => members.filter(m =>
      m.membership_status === "active" &&
      !m.portal_invited_at &&
      !m.portal_user_id &&
      m.email
    ),
    [members]
  );

  const { data: transactions = [] } = useQuery({
    queryKey: ["allTransactions"],
    queryFn: () => base44.asServiceRole.entities.RewardsTransaction.list(),
  });

  const txnsByMember = useMemo(() => {
    const map = {};
    transactions.forEach(tx => {
      if (!map[tx.member_id]) map[tx.member_id] = [];
      map[tx.member_id].push(tx);
    });
    return map;
  }, [transactions]);

  const filtered = useMemo(() => {
    let result = members;

    if (activeFilter === "pending") {
      // "Pending Login" — invited to portal but not yet logged in.
      // Aligns with the dashboard "Invited · Pending Login" stat card (?status=pending).
      result = result.filter(m => m.portal_invited_at && !m.portal_user_id);
    } else if (activeFilter === "top_ten") {
      result = result.filter(m => isActiveTopTenParticipant(m, txnsByMember));
    } else if (activeFilter === "needs_attention") {
      result = result.filter(m => needsAttention(m));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m =>
        ["first_name", "last_name", "email", "phone", "lhs_member_id"].some(field => {
          const val = m[field];
          return val && String(val).toLowerCase().includes(term);
        })
      );
    }

    if (sort.col) {
      result = [...result].sort((a, b) => {
        let aVal, bVal;
        if (sort.col === "member") {
          aVal = `${a.first_name || ""} ${a.last_name || ""}`.toLowerCase();
          bVal = `${b.first_name || ""} ${b.last_name || ""}`.toLowerCase();
        } else if (sort.col === "membership") {
          aVal = getMembershipBadge(a).label;
          bVal = getMembershipBadge(b).label;
        } else if (sort.col === "portal") {
          const order = { "Logged In": 0, "Invited": 1, "Not Invited": 2 };
          aVal = order[getPortalBadge(a).label] ?? 3;
          bVal = order[getPortalBadge(b).label] ?? 3;
        } else if (sort.col === "topten") {
          aVal = isActiveTopTenParticipant(a, txnsByMember) ? 0 : 1;
          bVal = isActiveTopTenParticipant(b, txnsByMember) ? 0 : 1;
        } else if (sort.col === "network") {
          aVal = getTotalLeads(a);
          bVal = getTotalLeads(b);
        } else if (sort.col === "credits") {
          aVal = a.affiliate_credits || 0;
          bVal = b.affiliate_credits || 0;
        }
        if (aVal < bVal) return sort.dir === "asc" ? -1 : 1;
        if (aVal > bVal) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [members, activeFilter, searchTerm, txnsByMember, sort]);

  // Totals per filter — computed from the full member set, not affected by search/sort.
  const filterCounts = useMemo(() => ({
    all: members.length,
    pending: members.filter(m => m.portal_invited_at && !m.portal_user_id).length,
    top_ten: members.filter(m => isActiveTopTenParticipant(m, txnsByMember)).length,
    needs_attention: members.filter(m => needsAttention(m)).length,
  }), [members, txnsByMember]);

  const getJoined = (m) => {
    const d = m.agreement_signed_at || m.created_date;
    return d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
  };

  const getTotalLeads = (m) =>
    (m.affiliate_leads || 0) + (m.affiliate_tier2_leads || 0) + (m.affiliate_tier3_leads || 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 900, color: "var(--text-primary)" }}>
            Members
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            {filtered.length} of {members.length} members
          </p>
        </div>
        <div className="flex items-center gap-3">
          {inviteCandidates.length > 0 && (
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
              {inviteCandidates.length} pending
            </span>
          )}
          <button
            onClick={() => setShowInviteDialog(true)}
            style={{
              padding: "9px 16px",
              borderRadius: 9,
              border: "1px solid var(--fuel-500)",
              background: "linear-gradient(135deg, #e8a14b, #cc5b30)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 800,
              fontFamily: "var(--font-heading)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Mail size={14} />
            Invite Pending Members
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        <input
          type="text"
          placeholder="Search name, email, or member ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            paddingLeft: 38,
            paddingRight: 16,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "var(--carbon-800)",
            color: "var(--text-primary)",
            fontSize: 14,
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              border: activeFilter === opt.value ? "1px solid var(--fuel-500)" : "1px solid rgba(255,255,255,0.08)",
              background: activeFilter === opt.value ? "rgba(204,91,48,0.15)" : "rgba(255,255,255,0.03)",
              color: activeFilter === opt.value ? "var(--fuel-300)" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {opt.label} ({filterCounts[opt.value] ?? 0})
          </button>
        ))}
      </div>

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          padding: "10px 16px", borderRadius: 10,
          background: "rgba(204,91,48,0.12)", border: "1px solid rgba(204,91,48,0.3)",
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fuel-300)" }}>
            {selected.size} selected
          </span>
          <div style={{ flex: 1 }} />
          {bulkResult && (
            <span style={{ fontSize: 12, color: bulkResult.failed > 0 ? "#e8a14b" : "var(--success)" }}>
              {bulkResult.success} done{bulkResult.failed > 0 ? `, ${bulkResult.failed} failed` : ""}
            </span>
          )}
          <button
            onClick={handleBulkResendInvite}
            disabled={bulkLoading}
            style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, cursor: bulkLoading ? "not-allowed" : "pointer", opacity: bulkLoading ? 0.6 : 1 }}
          >
            {bulkLoading ? "Working…" : "Resend Invite"}
          </button>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowStatusMenu(v => !v)}
              disabled={bulkLoading}
              style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, cursor: bulkLoading ? "not-allowed" : "pointer", opacity: bulkLoading ? 0.6 : 1 }}
            >
              Set Status ▾
            </button>
            {showStatusMenu && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 50, background: "var(--carbon-700)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, minWidth: 160, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                {MEMBERSHIP_STATUSES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => handleBulkStatusChange(s.value)}
                    style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", background: "transparent", border: "none", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={clearSelection} style={{ padding: 6, borderRadius: 7, border: "none", background: "transparent", color: "var(--text-muted)", cursor: "pointer" }}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* Table — desktop */}
      <div className="hidden md:block" style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
              {/* Select all */}
              <th style={{ padding: "10px 14px 10px 16px", width: 36 }}>
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  ref={el => { if (el) el.indeterminate = selected.size > 0 && selected.size < filtered.length; }}
                  onChange={toggleSelectAll}
                  style={{ cursor: "pointer", accentColor: "var(--fuel-500)", width: 15, height: 15 }}
                />
              </th>
              {[
                { label: "Member", col: "member" },
                { label: "Membership", col: "membership" },
                { label: "Portal", col: "portal" },
                { label: "Top Ten", col: "topten" },
                { label: "Network", col: "network" },
                { label: "Credits", col: "credits" },
                { label: "", col: null },
              ].map(({ label, col }) => (
                <th
                  key={label}
                  onClick={col ? () => handleSort(col) : undefined}
                  style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: sort.col === col ? "var(--fuel-300)" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", cursor: col ? "pointer" : "default", userSelect: "none" }}
                >
                  {label && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {label}
                      {col && (sort.col === col
                        ? sort.dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        : <ChevronsUpDown size={11} style={{ opacity: 0.4 }} />
                      )}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map((m) => {
              const membership = getMembershipBadge(m);
              const portal = getPortalBadge(m);
              const topTen = isActiveTopTenParticipant(m, txnsByMember);
              const leads = getTotalLeads(m);
              const isSelected = selected.has(m.id);
              return (
                <tr
                  key={m.id}
                  onClick={() => navigate(`/admin/members/${m.id}`)}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", transition: "background 0.12s", background: isSelected ? "rgba(204,91,48,0.07)" : "transparent" }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isSelected ? "rgba(204,91,48,0.07)" : "transparent"; }}
                >
                  {/* Checkbox */}
                  <td style={{ padding: "14px 14px 14px 16px" }} onClick={e => toggleSelect(m.id, e)}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ cursor: "pointer", accentColor: "var(--fuel-500)", width: 15, height: 15 }}
                    />
                  </td>
                  {/* Member */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                      {m.first_name} {m.last_name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{m.email}</div>
                  </td>
                  {/* Membership */}
                  <td style={{ padding: "14px 16px" }}>
                    <Pill color={membership.color} bg={membership.bg} label={membership.label} />
                  </td>
                  {/* Portal */}
                  <td style={{ padding: "14px 16px" }}>
                    <Pill color={portal.color} bg={portal.bg} label={portal.label} />
                  </td>
                  {/* Top Ten */}
                  <td style={{ padding: "14px 16px", fontSize: 13, color: topTen ? "#7cb3f5" : "var(--text-muted)", fontWeight: topTen ? 700 : 400 }}>
                    {topTen ? "Enrolled" : "—"}
                  </td>
                  {/* Network */}
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: leads > 0 ? "var(--fuel-300)" : "var(--text-muted)" }}>
                    {leads}
                  </td>
                  {/* Credits */}
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: (m.affiliate_credits || 0) > 0 ? "var(--accent)" : "var(--text-muted)" }}>
                    {m.affiliate_credits || 0}
                  </td>
                  {/* Action */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 12, color: "var(--fuel-400)", fontWeight: 600 }}>View →</span>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="8" style={{ padding: "48px 16px", textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card list — mobile */}
      <div className="md:hidden space-y-2">
        {filtered.length > 0 ? filtered.map((m) => {
          const membership = getMembershipBadge(m);
          const portal = getPortalBadge(m);
          const leads = getTotalLeads(m);
          const isSelected = selected.has(m.id);
          return (
            <div
              key={m.id}
              onClick={() => navigate(`/admin/members/${m.id}`)}
              style={{ padding: "14px 16px", borderRadius: 10, border: isSelected ? "1px solid rgba(204,91,48,0.4)" : "1px solid rgba(255,255,255,0.08)", background: isSelected ? "rgba(204,91,48,0.07)" : "rgba(255,255,255,0.02)", cursor: "pointer" }}
            >
              <div className="flex items-start gap-3">
                <div onClick={e => toggleSelect(m.id, e)} style={{ paddingTop: 2, flexShrink: 0 }}>
                  <input type="checkbox" checked={isSelected} onChange={() => {}} style={{ cursor: "pointer", accentColor: "var(--fuel-500)", width: 15, height: 15 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                        {m.first_name} {m.last_name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{m.email}</div>
                    </div>
                    <Pill color={membership.color} bg={membership.bg} label={membership.label} />
                  </div>
                  <div className="flex gap-3 mt-2 flex-wrap" style={{ fontSize: 12 }}>
                    <Pill color={portal.color} bg={portal.bg} label={portal.label} small />
                    {leads > 0 && <span style={{ color: "var(--fuel-300)", fontWeight: 700 }}>{leads} network</span>}
                    {(m.affiliate_credits || 0) > 0 && <span style={{ color: "var(--accent)", fontWeight: 700 }}>{m.affiliate_credits} credits</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div style={{ padding: "40px 16px", textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
            No members found
          </div>
        )}
      </div>

      {showInviteDialog && (
        <InvitePendingDialog
          candidates={inviteCandidates}
          loading={inviteAllLoading}
          result={inviteAllResult}
          onClose={() => { setShowInviteDialog(false); setInviteAllResult(null); }}
          onConfirm={(limit) => handleInvitePending(limit)}
        />
      )}
    </div>
  );
}
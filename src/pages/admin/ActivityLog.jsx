import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { RefreshCw, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

const CATEGORY_FILTERS = ["all", "member", "affiliate", "referral", "ghl", "auth", "admin"];

const STATUS_STYLES = {
  success: { color: "var(--success)",  bg: "rgba(24,160,107,0.1)",  icon: CheckCircle },
  failure: { color: "var(--danger)",   bg: "rgba(192,57,43,0.1)",   icon: XCircle },
  warning: { color: "var(--warning)",  bg: "rgba(232,161,75,0.1)",  icon: AlertTriangle },
  info:    { color: "var(--text-muted)", bg: "rgba(255,255,255,0.04)", icon: Info },
};

const CATEGORY_COLORS = {
  member:    "var(--fuel-300)",
  affiliate: "var(--success)",
  referral:  "#a78bfa",
  ghl:       "#2c5f8a",
  auth:      "var(--warning)",
  admin:     "var(--text-secondary)",
};

function LogRow({ log }) {
  const [expanded, setExpanded] = useState(false);
  const s = STATUS_STYLES[log.status] || STATUS_STYLES.info;
  const Icon = s.icon;

  const hasMeta = !!log.metadata_json;
  let parsed = null;
  if (hasMeta) {
    try { parsed = JSON.parse(log.metadata_json); } catch { parsed = log.metadata_json; }
  }

  const ts = log.created_date
    ? new Date(log.created_date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : "—";

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div
        style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "11px 16px",
          background: expanded ? "rgba(255,255,255,0.02)" : "transparent",
          cursor: hasMeta ? "pointer" : "default",
        }}
        onClick={() => hasMeta && setExpanded(v => !v)}
      >
        {/* Status icon */}
        <Icon size={14} style={{ color: s.color, flexShrink: 0, marginTop: 2 }} />

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {/* Category pill */}
            <span style={{
              fontSize: 10, fontWeight: 800, fontFamily: "var(--font-heading)",
              color: CATEGORY_COLORS[log.category] || "var(--text-muted)",
              background: "rgba(255,255,255,0.06)",
              padding: "1px 7px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0,
            }}>
              {log.category}
            </span>
            {/* event_type */}
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace", flexShrink: 0 }}>
              {log.event_type}
            </span>
          </div>

          {/* Human message */}
          <p style={{ fontSize: 13, color: "var(--text-primary)", marginTop: 3, lineHeight: 1.4 }}>
            {log.message}
          </p>

          {/* Actor + LHS ID + timestamp */}
          <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
            {log.lhs_member_id && (
              <span style={{ fontSize: 11, color: "var(--fuel-300)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>
                {log.lhs_member_id}
              </span>
            )}
            {log.email && (
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{log.email}</span>
            )}
            <span style={{ fontSize: 11, color: "var(--text-disabled)" }}>via {log.actor}</span>
            <span style={{ fontSize: 11, color: "var(--text-disabled)" }}>{ts}</span>
          </div>
        </div>

        {/* Expand toggle */}
        {hasMeta && (
          <div style={{ flexShrink: 0, color: "var(--text-muted)", marginTop: 2 }}>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>
        )}
      </div>

      {/* Metadata drawer */}
      {expanded && parsed && (
        <div style={{ padding: "0 16px 12px 42px" }}>
          <pre style={{
            fontSize: 11, color: "var(--text-secondary)", background: "rgba(0,0,0,0.3)",
            padding: "10px 12px", borderRadius: 8, overflow: "auto", maxHeight: 240,
            fontFamily: "monospace", lineHeight: 1.5,
          }}>
            {typeof parsed === "string" ? parsed : JSON.stringify(parsed, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function ActivityLog() {
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: logs = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["auditLogs", category, statusFilter],
    queryFn: async () => {
      const filter = {};
      if (category !== "all") filter.category = category;
      if (statusFilter !== "all") filter.status = statusFilter;
      const result = Object.keys(filter).length > 0
        ? await base44.asServiceRole.entities.AuditLog.filter(filter, "-created_date", 200)
        : await base44.asServiceRole.entities.AuditLog.list("-created_date", 200);
      return result || [];
    },
    staleTime: 30_000,
  });

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 900, color: "var(--text-primary)" }}>
            Activity Log
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            System events, webhook activity, and admin actions
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "var(--text-secondary)", cursor: isFetching ? "default" : "pointer",
            fontSize: 12, fontWeight: 600, opacity: isFetching ? 0.6 : 1,
          }}
        >
          <RefreshCw size={13} style={{ animation: isFetching ? "spin 1s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {/* Category */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {CATEGORY_FILTERS.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                fontFamily: "var(--font-heading)", textTransform: "uppercase", letterSpacing: "0.04em",
                border: category === c ? "1px solid var(--fuel-500)" : "1px solid rgba(255,255,255,0.1)",
                background: category === c ? "rgba(204,91,48,0.15)" : "rgba(255,255,255,0.03)",
                color: category === c ? "var(--fuel-300)" : "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Status */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginLeft: "auto" }}>
          {["all", "success", "failure", "warning", "info"].map(s => {
            const st = STATUS_STYLES[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  fontFamily: "var(--font-heading)", textTransform: "uppercase", letterSpacing: "0.04em",
                  border: statusFilter === s ? `1px solid ${st?.color || "var(--fuel-500)"}` : "1px solid rgba(255,255,255,0.1)",
                  background: statusFilter === s ? (st?.bg || "rgba(204,91,48,0.15)") : "rgba(255,255,255,0.03)",
                  color: statusFilter === s ? (st?.color || "var(--fuel-300)") : "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Log list */}
      <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
        {isLoading && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Loading...
          </div>
        )}

        {!isLoading && logs.length === 0 && (
          <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            No log entries yet. Events will appear here as the system runs.
          </div>
        )}

        {logs.map(log => <LogRow key={log.id} log={log} />)}
      </div>

      {logs.length > 0 && (
        <p style={{ fontSize: 11, color: "var(--text-disabled)", textAlign: "center" }}>
          Showing {logs.length} most recent entries
        </p>
      )}
    </div>
  );
}
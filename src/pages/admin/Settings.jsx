import React, { useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, UserPlus, Shield, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const ADMIN_ACTIONS = [
  {
    label: "Invite Admin",
    description: "Grant admin access to a team member",
    icon: UserPlus,
  },
  {
    label: "Manage Roles",
    description: "Configure role permissions across the portal",
    icon: Shield,
  },
];

function StatusIcon({ status }) {
  if (status === "active") return <CheckCircle size={16} style={{ color: "var(--success)", flexShrink: 0 }} />;
  if (status === "warning") return <AlertTriangle size={16} style={{ color: "var(--warning)", flexShrink: 0 }} />;
  if (status === "error") return <XCircle size={16} style={{ color: "var(--danger)", flexShrink: 0 }} />;
  return <div style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--carbon-500)", flexShrink: 0 }} />;
}

function StatusBadge({ status }) {
  const map = {
    active:  { label: "Active",  color: "var(--success)", bg: "rgba(24,160,107,0.12)" },
    warning: { label: "Warning", color: "var(--warning)", bg: "rgba(232,161,75,0.12)" },
    error:   { label: "Error",   color: "var(--danger)",  bg: "rgba(192,57,43,0.12)"  },
  };
  const s = map[status] || { label: "Unknown", color: "var(--text-muted)", bg: "rgba(255,255,255,0.05)" };
  return (
    <span style={{
      fontSize: 11, fontWeight: 800, fontFamily: "var(--font-heading)",
      color: s.color, background: s.bg,
      padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

function SectionHeader({ title }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase",
      color: "var(--text-muted)", fontFamily: "var(--font-heading)", marginBottom: 10,
    }}>
      {title}
    </p>
  );
}

export default function Settings() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["integrationHealth"],
    queryFn: async () => {
      const res = await base44.functions.invoke("checkIntegrationHealth", {});
      return res.data;
    },
    staleTime: 60_000,
    retry: false,
  });

  const checks = data?.results || [];
  const checkedAt = data?.checked_at ? new Date(data.checked_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : null;

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-xl">
      <div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 900, color: "var(--text-primary)" }}>
          System
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
          Integration status and admin controls
        </p>
      </div>

      {/* Integrations */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <SectionHeader title="Integrations" />
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
              background: "none", border: "none", cursor: isFetching ? "default" : "pointer",
              opacity: isFetching ? 0.5 : 1,
            }}
          >
            <RefreshCw size={12} style={{ animation: isFetching ? "spin 1s linear infinite" : "none" }} />
            {checkedAt ? `Checked ${checkedAt}` : "Refresh"}
          </button>
        </div>

        <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
          {isLoading && (
            <div style={{ padding: "24px 18px", display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)" }}>
              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 13 }}>Checking integrations...</span>
            </div>
          )}

          {error && !isLoading && (
            <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 10 }}>
              <XCircle size={16} style={{ color: "var(--danger)", flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "var(--danger)" }}>Failed to load integration status — {error.message}</p>
            </div>
          )}

          {checks.map((item, i) => {
            const isGHL = item.key === "ghl_api";
            const ok = item.status === "active";
            return (
              <div
                key={item.key}
                style={{
                  padding: isGHL ? "16px 18px" : "14px 18px",
                  borderBottom: i < checks.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: item.status === "error" ? "rgba(192,57,43,0.04)" : item.status === "warning" ? "rgba(232,161,75,0.03)" : "rgba(255,255,255,0.01)",
                }}
              >
                {isGHL ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <StatusIcon status={item.status} />
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", flex: 1 }}>GoHighLevel</p>
                      <StatusBadge status={item.status} />
                    </div>
                    {ok ? (
                      <div style={{ paddingLeft: 26, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Last successful API call</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{checkedAt}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Authentication</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--success)" }}>Valid</span>
                        </div>
                      </div>
                    ) : (
                      <p style={{ paddingLeft: 26, fontSize: 12, color: "var(--danger)", fontWeight: 600 }}>
                        Authentication Failed — Please update the GHL API key.
                      </p>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <StatusIcon status={item.status} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{item.label}</p>
                      <p style={{ fontSize: 12, color: item.status === "error" ? "var(--danger)" : "var(--text-muted)", marginTop: 2 }}>
                        {item.description}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {data?.overall === "error" && (
          <div style={{
            marginTop: 10, padding: "10px 14px", borderRadius: 8,
            background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.25)",
          }}>
            <p style={{ fontSize: 12, color: "var(--danger)", fontWeight: 600, lineHeight: 1.5 }}>
              ⚠ One or more integrations are failing. If GHL API Key shows an error, generate a new key in GoHighLevel → Settings → API Keys, then update the <strong>GHL_API_KEY</strong> secret in Base44 → Settings → Environment Variables.
            </p>
          </div>
        )}
      </div>

      {/* Admin */}
      <div>
        <SectionHeader title="Admin" />
        <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
          {ADMIN_ACTIONS.map((item, i) => (
            <div
              key={item.label}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px",
                borderBottom: i < ADMIN_ACTIONS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                background: "rgba(255,255,255,0.01)",
                opacity: 0.5,
              }}
            >
              <item.icon size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{item.label}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{item.description}</p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 800, fontFamily: "var(--font-heading)",
                color: "var(--text-muted)", background: "rgba(255,255,255,0.05)",
                padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
              }}>
                Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, HelpCircle, LogOut, Home, ScrollText } from "lucide-react";
import BackBar from "@/components/driver/BackBar";
import { base44 } from "@/api/base44Client";

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/admin/members", label: "Members", icon: Users },
  { path: "/admin/member-updates", label: "Communication", icon: FileText },
  { path: "/admin/activity-log", label: "Activity Log", icon: ScrollText },
  { path: "/admin/support", label: "System", icon: HelpCircle },
];

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="h-screen carbon-texture relative flex" style={{ background: "var(--carbon-900)" }}>
      {/* ── Sidebar (always visible) ── */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col"
        style={{
          background: "linear-gradient(180deg, var(--carbon-700), var(--carbon-900))",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Brand area */}
        <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.02em" }}>
              Outriders HQ
            </p>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.32em", textTransform: "uppercase", marginTop: -2 }}>
              Admin
            </p>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px", flex: 1, overflowY: "auto" }}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 14px",
                  borderRadius: 10,
                  marginBottom: 6,
                  fontFamily: "var(--font-heading)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: active ? "var(--fuel-300)" : "var(--text-secondary)",
                  background: active ? "rgba(204,91,48,0.12)" : "transparent",
                  borderLeft: active ? "3px solid var(--fuel-500)" : "3px solid transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  minHeight: 48,
                }}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link
            to="/"
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 14px", borderRadius: 10, marginBottom: 6,
              fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
              color: "var(--text-secondary)", textDecoration: "none", minHeight: 48,
            }}
          >
            <Home size={16} />
            Member Portal
          </Link>
          <button
            onClick={() => base44.auth.logout()}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 14px", borderRadius: 10, width: "100%",
              fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
              color: "var(--text-muted)", background: "transparent",
              border: "none", cursor: "pointer", textAlign: "left", minHeight: 48,
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden ml-64">
        <main className="flex-1 overflow-y-auto fade-up">
          <BackBar homePath="/admin" />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
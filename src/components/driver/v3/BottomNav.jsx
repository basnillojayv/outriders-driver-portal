/**
 * BottomNav — floating bottom navigation dock shared across standalone V3 pages.
 * Self-contained: fetches the current user for the Account tab initials.
 */
import React from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Truck, Wallet, Star, Briefcase } from "lucide-react";
import { T } from "./v3tokens";

const TABS = [
  { path: "/", label: "Home", icon: Truck, end: true },
  { path: "/member-card", label: "Wallet", icon: Wallet },
  { path: "/rewards", label: "Founders", icon: Star },
  { path: "/career-center", label: "Career", icon: Briefcase },
  { path: "/settings", label: "Account", isAccount: true },
];

export default function BottomNav() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const initials = (() => {
    const name = user?.full_name || user?.email || "D";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  })();

  return (
    <nav
      aria-label="Primary navigation"
      className="flex-shrink-0 relative z-10"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
        paddingTop: 12,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div
        className="max-w-sm mx-auto flex rounded-2xl overflow-hidden"
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
        }}
      >
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          return (
            <React.Fragment key={tab.path}>
              <NavLink
                to={tab.path}
                end={tab.end}
                className="relative flex-1 flex flex-col items-center justify-center py-3"
                style={{ textDecoration: "none", WebkitTapHighlightColor: "transparent", textAlign: "center" }}
              >
                {({ isActive }) => (
                  <>
                    {tab.isAccount ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          height: 20,
                          color: isActive ? T.orange : T.textMuted,
                          fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17,
                          lineHeight: 1,
                          letterSpacing: "0.04em",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {initials}
                      </span>
                    ) : (
                      <Icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 1.8}
                        style={{
                          color: isActive ? T.orange : T.textMuted,
                          transition: "color 0.2s ease",
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        marginTop: 4,
                        color: T.textPrimary,
                        transition: "color 0.2s ease",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        lineHeight: 1,
                        display: "block",
                      }}
                    >
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
              {idx < TABS.length - 1 && (
                <div aria-hidden style={{ width: 1, background: T.borderAlt, alignSelf: "stretch" }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
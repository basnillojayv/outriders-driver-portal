import React from "react";
import { NavLink } from "react-router-dom";
import { Home, IdCard, Trophy, MapPin, User } from "lucide-react";

const TABS = [
  { path: "/", label: "Home", icon: Home, end: true },
  { path: "/member-card", label: "Pass", icon: IdCard },
  { path: "/rewards", label: "Top 10", icon: Trophy },
  { path: "/locations", label: "Terminals", icon: MapPin },
  { path: "/settings", label: "Account", icon: User },
];

export default function BottomNav() {
  return (
    <nav
      aria-label="Primary navigation"
      className="flex-shrink-0"
      style={{
        background: "linear-gradient(180deg, var(--carbon-800), var(--carbon-900))",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.55)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="max-w-2xl lg:max-w-3xl mx-auto flex">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className="relative flex-1 flex flex-col items-center justify-center"
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                minHeight: 64,
                textDecoration: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {({ isActive }) => (
                <>
                  {/* LED indicator — illuminated dashboard light */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 6,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: isActive ? "var(--fuel-500)" : "transparent",
                      boxShadow: isActive
                        ? "0 0 7px rgba(204,91,48,0.95), 0 0 2px rgba(204,91,48,0.8)"
                        : "none",
                      transition: "all 0.2s ease",
                    }}
                  />

                  {/* Icon with subtle halo when active */}
                  <span
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      background: isActive ? "rgba(204,91,48,0.12)" : "transparent",
                      boxShadow: isActive ? "0 0 14px rgba(204,91,48,0.28)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Icon
                      size={21}
                      strokeWidth={isActive ? 2.4 : 2}
                      style={{
                        color: isActive ? "var(--fuel-300)" : "var(--text-muted)",
                        transition: "color 0.2s ease",
                      }}
                    />
                  </span>

                  {/* Label */}
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.03em",
                      lineHeight: 1,
                      marginTop: 4,
                      color: isActive ? "var(--fuel-300)" : "var(--text-muted)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
/**
 * V3Shell — page wrapper for Home v3 pilot.
 * Provides: carbon-fiber background, Outriders watermark,
 * top bar, scrollable content, and bottom nav dock.
 */
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Wallet, Star, Briefcase, Home } from "lucide-react";
import { T, carbonBg } from "./v3tokens";
import ShareMenu from "./ShareMenu";
import AddToHomeScreenPrompt from "./AddToHomeScreenPrompt";

const LHS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/58421c7bd_LHSLogo.jpg";
const OUTRIDERS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/6cb494d67_lhs_outriders_logo_circle.png";

const TABS = [
  { path: "/", label: "Home", icon: Home, end: true },
  { path: "/member-card", label: "Wallet", icon: Wallet },
  { path: "/rewards", label: "Founders", icon: Star },
  { path: "/career-center", label: "Career", icon: Briefcase },
  { path: "/settings", label: "Account", isAccount: true },
];

export default function V3Shell({ children }) {
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
    <div
      className="h-screen flex flex-col"
      style={{ ...carbonBg, fontFamily: "var(--font-body)" }}
    >
      {/* ── Top bar ── */}
      <header
        className="flex-shrink-0 relative z-30"
        style={{ background: "#000000" }}
      >
        {/* Thin orange top accent */}
        <div
          aria-hidden
          style={{
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${T.orange} 20%, ${T.orange} 80%, transparent 100%)`,
            opacity: 0.55,
          }}
        />
        <div
          className="relative flex items-center justify-between px-5"
          style={{ height: 64 }}
        >
          <div className="flex items-center gap-0 flex-shrink-0" style={{ marginLeft: -4 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <div className="h-[57px] w-[73px] overflow-hidden">
                <img src={LHS_LOGO} alt="LineHaul Station" className="h-full w-auto object-left" />
              </div>
            </Link>
            <Link
              to="/"
              aria-label="Home"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                flexShrink: 0,
                marginLeft: -12,
                background: T.orange,
                border: "none",
              }}
            >
              <Home size={18} strokeWidth={1.75} style={{ color: "#000000" }} />
            </Link>
          </div>
          <p
            className="flex-1 text-center"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.22em",
              color: T.orange,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Outriders HQ
          </p>
          <div className="flex items-center gap-2 flex-shrink-0 justify-end">
            <ShareMenu />
            <img
              src={OUTRIDERS_LOGO}
              alt="Outriders"
              style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
        </div>
        {/* Steel hairline divider */}
        <div aria-hidden style={{ height: 1, background: T.borderAlt }} />
      </header>

      {/* ── Scrollable content ── */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="px-4 pt-5 pb-16 space-y-5 max-w-2xl mx-auto lg:max-w-3xl">
          {children}
        </div>
      </main>

      {/* ── Bottom nav dock — embossed chrome buttons ── */}
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
          className="max-w-sm mx-auto flex rounded-2xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(200,200,200,0.42) 0%, rgba(138,138,138,0.38) 18%, rgba(90,90,90,0.34) 50%, rgba(58,58,58,0.32) 82%, rgba(42,42,42,0.30) 100%)",
            border: "1px solid rgba(0,0,0,0.45)",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: "10px 4px",
            gap: 2,
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.end}
                className="relative flex-1 flex flex-col items-center justify-center"
                style={{ textDecoration: "none", WebkitTapHighlightColor: "transparent", textAlign: "center", minWidth: 0 }}
              >
                {({ isActive }) => (
                  <>
                    {/* Embossed metallic button */}
                    <div
                      style={{
                        position: "relative",
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isActive
                          ? "radial-gradient(circle at 50% 40%, #1A1A1A 0%, #0E0E0E 70%, #050505 100%)"
                          : "radial-gradient(circle at 50% 35%, #4A4A4A 0%, #2E2E2E 60%, #1E1E1E 100%)",
                        border: "1px solid rgba(0,0,0,0.7)",
                        boxShadow: isActive
                          ? `0 0 12px rgba(255,106,0,0.7), 0 0 4px rgba(255,106,0,0.5), inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -2px 4px rgba(0,0,0,0.8)`
                          : "inset 0 1px 1px rgba(255,255,255,0.18), inset 0 -2px 3px rgba(0,0,0,0.5)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* Orange glow ring when active */}
                      {isActive && (
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            inset: 2,
                            borderRadius: 8,
                            border: "1.5px solid rgba(255,149,0,0.85)",
                            boxShadow: "0 0 6px rgba(255,149,0,0.7), inset 0 0 5px rgba(255,149,0,0.45)",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {/* Brushed-metal inner disc */}
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 5,
                          borderRadius: 6,
                          background:
                            "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.05) 0deg 2deg, rgba(0,0,0,0.05) 2deg 4deg)",
                          pointerEvents: "none",
                        }}
                      />
                      {tab.isAccount ? (
                        <span
                          style={{
                            position: "relative",
                            zIndex: 1,
                            fontFamily: "var(--font-heading)",
                            fontWeight: 800,
                            fontSize: 15,
                            lineHeight: 1,
                            letterSpacing: "0.04em",
                            color: isActive ? "#FF6A00" : "#5A5A5A",
                            filter: isActive
                              ? "drop-shadow(0 0 4px rgba(255,106,0,0.8))"
                              : "drop-shadow(0 1px 0 rgba(0,0,0,0.6))",
                            transition: "color 0.2s ease",
                          }}
                        >
                          {initials}
                        </span>
                      ) : (
                        <Icon
                          size={17}
                          strokeWidth={2.4}
                          style={{
                            position: "relative",
                            zIndex: 1,
                            color: isActive ? "#FF6A00" : "#5A5A5A",
                            filter: isActive
                              ? "drop-shadow(0 0 4px rgba(255,106,0,0.8))"
                              : "drop-shadow(0 1px 0 rgba(0,0,0,0.6))",
                            transition: "color 0.2s ease",
                          }}
                        />
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: "-0.01em",
                        marginTop: 5,
                        color: isActive ? T.orange : T.textPrimary,
                        transition: "color 0.2s ease",
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
            );
          })}
        </div>
      </nav>

      {/* First-time install prompt */}
      <AddToHomeScreenPrompt />
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import BackBar from "@/components/driver/BackBar";
import BottomNav from "@/components/driver/BottomNav";
import { ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";

const LHS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/58421c7bd_LHSLogo.jpg";
const OUTRIDERS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/6cb494d67_lhs_outriders_logo_circle.png";

export default function DriverLayout() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44
      .auth.me()
      .then((user) => {
        if (user?.role === "admin") setIsAdmin(true);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="h-screen carbon-texture flex flex-col">
      {/* ── Top Branding Bar ── */}
      <header
        className="flex-shrink-0 flex items-center justify-between"
        style={{
          height: 56,
          background: "#000000",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 14px",
          zIndex: 100,
        }}
      >
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <img
            src={LHS_LOGO}
            alt="LineHaul Station"
            className="h-9 w-auto object-contain flex-shrink-0"
          />
          <img
            src={OUTRIDERS_LOGO}
            alt="Outriders"
            className="h-8 w-auto object-contain flex-shrink-0"
          />
          <span
            className="font-heading font-bold tracking-wide truncate"
            style={{ color: "var(--fuel-300)", fontSize: 16 }}
          >
            Outriders HQ
          </span>
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg flex-shrink-0"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-secondary)",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              textDecoration: "none",
            }}
          >
            <ShieldCheck size={15} />
            Admin
          </Link>
        )}
      </header>

      {/* ── Page Content (scrollable) ── */}
      <main className="flex-1 overflow-y-auto fade-up">
        <BackBar />
        <Outlet />
      </main>

      {/* ── Persistent Bottom Navigation ── */}
      <BottomNav />
    </div>
  );
}
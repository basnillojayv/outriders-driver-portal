import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const LHS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/58421c7bd_LHSLogo.jpg";

export default function HQ2TopBar({ title, homeTo = "/hq-2" }) {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const initial = (user?.full_name || user?.email || "D").charAt(0).toUpperCase();

  return (
    <header className="flex-shrink-0 flex items-center justify-between h-14 px-4 bg-v2-bg border-b border-v2-border">
      <Link to={homeTo} className="flex items-center">
        <div className="h-10 w-12 overflow-hidden">
          <img src={LHS_LOGO} alt="LineHaul Station" className="h-full w-auto object-left" />
        </div>
      </Link>
      <h1 className="font-v2-head tracking-[0.18em] text-sm text-v2-text">
        {title}
      </h1>
      <Link
        to="/settings"
        aria-label="Account"
        className="flex items-center justify-center h-9 w-9 rounded-full border border-v2-border bg-v2-surface"
        style={{ color: "#FF6600", fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 14 }}
      >
        {initial}
      </Link>
    </header>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { T } from "../v3tokens";

const LULU_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/c883a6827_ask_lulu.svg";

export default function HomeNeedHelp() {
  return (
    <Link
      to="/lulu"
      className="flex items-center gap-3 transition-all active:scale-[0.98]"
      style={{
        textDecoration: "none",
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          width: 42, height: 42, borderRadius: 10,
          background: "transparent", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <img src={LULU_ICON} alt="Ask Lulu" style={{ width: 42, height: 42, objectFit: "contain" }} />
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 16,
            fontWeight: 700,
            color: T.textPrimary,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          Need Help?
        </p>
        <p style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>Ask Lulu anything</p>
      </div>
      <ChevronRight size={20} style={{ color: T.textMuted, flexShrink: 0 }} />
    </Link>
  );
}
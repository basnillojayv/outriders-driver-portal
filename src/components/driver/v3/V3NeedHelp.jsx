import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { T, steelCard, btnPrimary } from "./v3tokens";

export default function V3NeedHelp() {
  return (
    <div
      style={{
        ...steelCard,
        borderColor: "rgba(124,146,181,0.2)",
        background: T.card,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 11,
          fontWeight: 700,
          color: T.blue,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        LineHaul Station Member Support
      </p>
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 18,
          fontWeight: 700,
          color: T.textPrimary,
          marginBottom: 10,
        }}
      >
        Need Help?
      </h3>
      <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.6, marginBottom: 20 }}>
        Ask Lulu about your membership, Top 10 Truckers, terminal locations, or your account.
      </p>
      <Link
        to="/lulu"
        className="flex items-center justify-center gap-2 transition-all active:scale-95"
        style={btnPrimary}
      >
        <MessageCircle size={15} />
        Ask Lulu
      </Link>
    </div>
  );
}
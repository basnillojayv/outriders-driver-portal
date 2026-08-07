import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export default function HQ2NeedHelp() {
  return (
    <div
      className="px-4 py-4 rounded-xl"
      style={{
        background: "linear-gradient(135deg, rgba(74,111,163,0.14), rgba(74,111,163,0.06))",
        border: "1px solid rgba(74,111,163,0.3)",
      }}
    >
      <p
        className="font-v2-sub uppercase"
        style={{ fontSize: 9, fontWeight: 700, color: "#7B9AD1", letterSpacing: "0.14em" }}
      >
        LineHaul Station Member Support
      </p>
      <h3
        className="font-v2-sub text-v2-text"
        style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}
      >
        Need Help?
      </h3>
      <p className="font-v2-body" style={{ fontSize: 13, color: "#AEB7C0", lineHeight: 1.5, marginTop: 4 }}>
        Ask Lulu about your membership, Top 10 Truckers, terminal locations, or your account.
      </p>
      <Link
        to="/lulu"
        className="mt-3 flex items-center justify-center gap-2 rounded-lg transition-all active:scale-95"
        style={{
          background: "#FF6600",
          color: "#0A0A0A",
          fontFamily: "Oswald, sans-serif",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.03em",
          padding: "14px 20px",
          minHeight: 48,
          textDecoration: "none",
        }}
      >
        <MessageCircle size={16} />
        Ask Lulu
      </Link>
    </div>
  );
}
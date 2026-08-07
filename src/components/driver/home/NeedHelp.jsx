import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export default function NeedHelp() {
  return (
    <div
      className="px-4 py-4 rounded-xl"
      style={{
        background: "linear-gradient(135deg, rgba(44,95,138,0.12), rgba(91,155,213,0.08))",
        border: "1px solid rgba(91,155,213,0.25)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 9,
          fontWeight: 800,
          color: "#5b9bd5",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        LineHaul Station Member Support
      </p>
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 16,
          fontWeight: 900,
          color: "var(--text-primary)",
          marginTop: 4,
        }}
      >
        Need Help?
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
          marginTop: 4,
        }}
      >
        Ask Lulu about your membership, Top 10 Truckers, terminal locations, or your account.
      </p>
      <Link to="/lulu" className="btn-primary mt-3">
        <MessageCircle size={16} />
        Ask Lulu
      </Link>
    </div>
  );
}
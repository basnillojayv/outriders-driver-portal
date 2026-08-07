/**
 * PassesSection — Gate Passes count + purchase action.
 */
import React from "react";
import { Ticket, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { T, steelCard, btnPrimary } from "../v3/v3tokens";

function Eyebrow({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 11,
        fontWeight: 700,
        color: T.textSecondary,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

export default function PassesSection({ activePasses = [] }) {
  const total = activePasses.length;

  const openCart = () => {
    toast.info("Membership & Pass Cart coming soon.");
  };

  return (
    <div style={steelCard}>
      <div className="flex items-center gap-2.5" style={{ marginBottom: 18 }}>
        <Ticket size={16} style={{ color: T.orange }} />
        <Eyebrow>Gate Passes</Eyebrow>
      </div>

      <div style={{ height: 1, background: T.borderAlt, marginBottom: 20 }} />

      {/* Available count */}
      <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 14,
            fontWeight: 700,
            color: T.textPrimary,
          }}
        >
          Available:
        </p>
        <div
          style={{
            minWidth: 48,
            textAlign: "center",
            padding: "6px 14px",
            borderRadius: T.radiusSm,
            background: T.cardAlt,
            border: `1px solid ${T.border}`,
            fontFamily: "var(--font-heading)",
            fontSize: 18,
            fontWeight: 800,
            color: total > 0 ? T.orange : T.textMuted,
          }}
        >
          {total}
        </div>
      </div>

      <button
        onClick={openCart}
        className="w-full flex items-center justify-center gap-2 transition-all active:scale-95"
        style={btnPrimary}
      >
        <ShoppingBag size={15} />
        Purchase
      </button>
    </div>
  );
}
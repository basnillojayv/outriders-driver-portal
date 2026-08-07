/**
 * MembershipOptionsSection — purchasable membership options.
 * Each option has a Purchase button that opens the Membership / Pass Cart.
 */
import React from "react";
import { ShoppingBag, CalendarCheck, Home, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { T, steelCard, btnPrimary, btnSecondary } from "../v3/v3tokens";

const OPTIONS = [
  { key: "day", label: "Day Pass", icon: CalendarCheck },
  { key: "onehome", label: "OneHome", icon: Home },
  { key: "flexspace", label: "FlexSpace", icon: LayoutGrid },
];

function OptionRow({ icon: Icon, label }) {
  const openCart = () => toast.info("Membership & Pass Cart coming soon.");
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: T.orangeDim,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} style={{ color: T.orange }} />
        </div>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 14,
            fontWeight: 700,
            color: T.textPrimary,
          }}
        >
          {label}
        </p>
      </div>
      <button
        onClick={openCart}
        className="flex items-center justify-center gap-2 transition-all active:scale-95"
        style={{ ...btnSecondary, width: "auto", padding: "10px 16px", minHeight: 40, fontSize: 12 }}
      >
        <ShoppingBag size={14} />
        Purchase
      </button>
    </div>
  );
}

export default function MembershipOptionsSection() {
  return (
    <div style={steelCard}>
      <div className="flex items-center gap-2.5" style={{ marginBottom: 18 }}>
        <ShoppingBag size={16} style={{ color: T.orange }} />
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
          Membership Options
        </p>
      </div>

      <div style={{ height: 1, background: T.borderAlt, marginBottom: 6 }} />

      {OPTIONS.map((o, i) => (
        <React.Fragment key={o.key}>
          <OptionRow icon={o.icon} label={o.label} />
          {i < OPTIONS.length - 1 && (
            <div style={{ height: 1, background: T.borderAlt }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
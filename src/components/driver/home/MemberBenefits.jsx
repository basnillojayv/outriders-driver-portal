import React from "react";
import { Laptop, Users, Tag, Truck, Star } from "lucide-react";

const BENEFITS = [
  { icon: Laptop,  label: "Driver Portal",       desc: "Exclusive member dashboard",   active: true  },
  { icon: Users,   label: "Community Access",     desc: "Outriders Club network",       active: true  },
  { icon: Tag,     label: "Member Pricing",       desc: "Preferred rates at terminals", active: true  },
  { icon: Truck,   label: "Fleet Services",       desc: "Discounts & service access",   active: false },
  { icon: Star,    label: "Premium Benefits",     desc: "Coming with full launch",      active: false },
];

export default function MemberBenefits() {
  return (
    <div className="space-y-2.5">
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Member Benefits
      </p>
      <div className="space-y-1.5">
        {BENEFITS.map((b) => (
          <div
            key={b.label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "var(--carbon-800)",
              border: "1px solid rgba(255,255,255,0.05)",
              opacity: b.active ? 1 : 0.45,
            }}
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: b.active ? "rgba(232,161,75,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${b.active ? "rgba(232,161,75,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <b.icon className="w-4 h-4" style={{ color: b.active ? "var(--fuel-300)" : "var(--text-muted)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{b.label}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)" }}>{b.desc}</p>
            </div>
            {b.active ? (
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 8, fontWeight: 800, color: "var(--success)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Active</span>
            ) : (
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 8, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Soon</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
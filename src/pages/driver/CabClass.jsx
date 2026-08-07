import React, { useState } from "react";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import { T } from "@/components/driver/v3/v3tokens";
import { base44 } from "@/api/base44Client";
import { ShieldCheck, Truck, Headset, Timer, DollarSign, ClipboardCheck, FlaskConical, Gavel, GraduationCap } from "lucide-react";

const CAB_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/30ba4bf0a_cab_class.svg";

const MODULES = [
  { id: "safety-cdl",     icon: ShieldCheck,    label: "Safety / CDL Compliance",         sub: "Defensive driving & license compliance" },
  { id: "operations",     icon: Truck,          label: "Operations - Equipment",          sub: "Equipment operation & best practices" },
  { id: "customer-svc",   icon: Headset,        label: "Customer Service",                sub: "Professional communication & dispatch" },
  { id: "detention",      icon: Timer,          label: "Detention",                       sub: "Managing detention time & pay" },
  { id: "finance",        icon: DollarSign,     label: "Financial Literacy",              sub: "Money management for the road" },
  { id: "inspections",    icon: ClipboardCheck, label: "Inspections & Maintenance",       sub: "Pre-trip, post-trip & upkeep" },
  { id: "dot-fmcsa",      icon: FlaskConical,   label: "Drug & Alcohol / DOT / FMCSA",    sub: "Regulations & compliance training" },
  { id: "violations",     icon: Gavel,          label: "Violation Mitigation",            sub: "Preventing & resolving violations" },
  { id: "supply-chain",   icon: GraduationCap,  label: "Supply Chain University",        sub: "The business of freight & logistics" },
];

function Eyebrow({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 11,
        fontWeight: 700,
        color: T.orange,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  );
}

export default function CabClass() {
  return (
    <V3Shell>
      <BackBar />
      {/* ── Hero ── */}
      <div
        style={{
          backgroundColor: "#0E1418",
          backgroundImage:
            "radial-gradient(circle at 20% 18%, rgba(40,70,110,0.55) 0%, transparent 50%)," +
            "radial-gradient(circle at 80% 82%, rgba(30,55,90,0.50) 0%, transparent 54%)," +
            "repeating-linear-gradient(45deg, rgba(140,180,225,0.04) 0px, rgba(140,180,225,0.04) 1px, transparent 1px, transparent 4px)",
          border: `1px solid rgba(124,146,181,0.4)`,
          borderRadius: T.radius,
          padding: "28px 22px 24px",
          textAlign: "center",
          boxShadow: "inset 0 1px 0 rgba(140,180,225,0.18), inset 0 0 18px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            width: 84, height: 84, borderRadius: "50%",
            margin: "0 auto 18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: T.blueDim,
            border: `1px solid rgba(124,146,181,0.45)`,
            boxShadow: "0 0 18px 3px rgba(124,146,181,0.4), 0 0 6px rgba(124,146,181,0.4)",
          }}
        >
          <img src={CAB_ICON} alt="Cab Class" style={{ width: 72, height: 72, objectFit: "contain" }} />
        </div>

        <span
          style={{
            display: "inline-block",
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: T.orange,
            background: T.orangeDim,
            border: `1px solid rgba(255,106,0,0.35)`,
            borderRadius: 20,
            padding: "6px 16px",
            marginBottom: 16,
          }}
        >
          Coming Soon
        </span>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 28,
            fontWeight: 800,
            color: T.textPrimary,
            letterSpacing: "0.01em",
            marginBottom: 12,
          }}
        >
          CabClass Academy
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: T.textSecondary,
            lineHeight: 1.65,
            maxWidth: 340,
            margin: "0 auto",
          }}
        >
          Professional development for the American trucker. Short lessons,
          real-world drills, and credentials that travel with you. We're
          building the curriculum — check back soon for the launch.
        </p>
      </div>

      {/* ── Module teasers ── */}
      <div>
        <Eyebrow>Inside CabClass Academy</Eyebrow>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radiusSm,
                  padding: "16px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: T.blueDim,
                    border: `1px solid rgba(124,146,181,0.35)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon size={20} style={{ color: T.blue }} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: T.textPrimary,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {m.label}
                  </p>
                  <p style={{ fontSize: 12, color: T.textMuted, marginTop: 2, lineHeight: 1.4 }}>
                    {m.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </V3Shell>
  );
}
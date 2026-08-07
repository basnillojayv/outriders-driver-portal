/**
 * FindMembers — directory of active corporate members.
 * Two groups: Carriers and Brokers. Reached from Career Center.
 * Corporate member data is not populated yet, so each group shows
 * an empty state until corporate onboarding begins.
 */
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Truck, Building2, Users } from "lucide-react";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import { T } from "@/components/driver/v3/v3tokens";

function Eyebrow({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
      color: T.orange, letterSpacing: "0.28em", textTransform: "uppercase",
    }}>
      {children}
    </p>
  );
}

function SteelCard({ children, style }) {
  return (
    <div className="rounded-[14px]" style={{
      background: T.card, backgroundImage: "none",
      border: `1px solid ${T.border}`, borderRadius: T.radius,
      padding: 20, isolation: "isolate",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function FindMembers() {
  const [params] = useSearchParams();
  const type = params.get("type") === "brokers" ? "brokers" : "carriers";

  const isCarriers = type === "carriers";
  const label = isCarriers ? "Carriers" : "Brokers";
  const Icon = isCarriers ? Truck : Building2;

  return (
    <V3Shell>
      <BackBar />
      <div className="space-y-5 max-w-md mx-auto">
        {/* Hero */}
        <div>
          <Eyebrow>Corporate Directory</Eyebrow>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 700,
            color: T.textPrimary, lineHeight: 1.1, marginTop: 8,
          }}>
            Active {label}
          </h1>
          <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, marginTop: 8 }}>
            Browse verified corporate {label.toLowerCase()} in the Outriders network.
          </p>
        </div>

        {/* Empty state */}
        <SteelCard style={{ textAlign: "center", padding: 36 }}>
          <div
            className="flex items-center justify-center mx-auto"
            style={{
              width: 56, height: 56, borderRadius: 14,
              background: T.orangeDim, border: `1px solid ${T.heroBorder}`,
              marginBottom: 16,
            }}
          >
            <Icon size={26} style={{ color: T.orange, opacity: 0.85 }} />
          </div>
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700,
            color: T.textPrimary, lineHeight: 1.2,
          }}>
            No corporate {label.toLowerCase()} yet
          </p>
          <p style={{ fontSize: 13, color: T.textMuted, marginTop: 8, lineHeight: 1.6 }}>
            This directory will populate once corporate {label.toLowerCase()} are onboarded to the Outriders network.
          </p>
          <div className="flex items-center justify-center gap-2" style={{ marginTop: 18 }}>
            <Users size={12} style={{ color: T.textMuted }} />
            <span style={{
              fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700,
              color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase",
            }}>
              Coming Soon
            </span>
          </div>
        </SteelCard>
      </div>
    </V3Shell>
  );
}
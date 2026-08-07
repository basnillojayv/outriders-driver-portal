import React from "react";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import { T } from "@/components/driver/v3/v3tokens";
import { BedDouble, Calculator, FileBarChart, Building2, Scale, DollarSign } from "lucide-react";
import ShareCarrier from "@/components/driver/flexspace/ShareCarrier";
import ShareBroker from "@/components/driver/flexspace/ShareBroker";

function Eyebrow({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 11,
        fontWeight: 700,
        color: T.textMuted,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  );
}

function SectionCard({ children }) {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

function PlaceholderCard({ icon: Icon, title, description }) {
  return (
    <SectionCard>
      <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
        <Icon size={16} style={{ color: T.blue }} />
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 13,
            fontWeight: 700,
            color: T.textPrimary,
          }}
        >
          {title}
        </p>
      </div>
      <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>
        {description}
      </p>
      <div
        style={{
          marginTop: 14,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "var(--font-heading)",
          fontSize: 10,
          fontWeight: 700,
          color: T.blue,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          background: "rgba(74,111,163,0.12)",
          border: "1px solid rgba(74,111,163,0.3)",
          borderRadius: 999,
          padding: "5px 12px",
        }}
      >
        Coming Soon
      </div>
    </SectionCard>
  );
}

export default function FlexSpace() {
  return (
    <V3Shell>
      <BackBar />
      {/* ── Hero — $19/day ── */}
      <div
        style={{
          backgroundColor: "#0E1418",
          backgroundImage:
            "radial-gradient(circle at 20% 18%, rgba(74,111,163,0.45) 0%, transparent 52%)," +
            "radial-gradient(circle at 80% 82%, rgba(255,106,0,0.30) 0%, transparent 54%)," +
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px)",
          border: `1px solid rgba(74,111,163,0.45)`,
          borderRadius: T.radius,
          padding: "28px 22px 24px",
          textAlign: "center",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 18px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            width: 112, height: 112, borderRadius: "50%",
            margin: "0 auto 18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(74,111,163,0.18)",
            border: `1px solid rgba(74,111,163,0.45)`,
            boxShadow: "0 0 18px 3px rgba(74,111,163,0.35), 0 0 6px rgba(124,146,181,0.35)",
            overflow: "hidden",
          }}
        >
          <img
            src="https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/67f07b7a3_flex_space_icon.svg"
            alt="FlexSpace"
            style={{ width: 112, height: 112, objectFit: "cover" }}
          />
        </div>

        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 700,
            color: T.blue,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          On-Demand Terminal Access
        </p>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 30,
            fontWeight: 800,
            color: T.textPrimary,
            letterSpacing: "0.01em",
            marginBottom: 6,
          }}
        >
          FlexSpace
        </h1>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 22,
            fontWeight: 700,
            color: T.orange,
            letterSpacing: "0.01em",
            marginBottom: 10,
          }}
        >
          $19<span style={{ fontSize: 16, fontWeight: 600, color: T.textSecondary }}>/day</span>
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: T.textSecondary,
            lineHeight: 1.65,
            maxWidth: 340,
            margin: "0 auto 14px",
          }}
        >
          Invite your carrier or broker to secure fleet access at LineHaul Station.
          Membership available at our first location — West Memphis, AR.
        </p>
        <div
          style={{
            display: "inline-flex", flexWrap: "wrap", justifyContent: "center",
            gap: 8, maxWidth: 340,
          }}
        >
          {["Priority Space", "Reserved Access", "Guaranteed Availability"].map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700,
                color: T.blue, letterSpacing: "0.08em", textTransform: "uppercase",
                background: "rgba(74,111,163,0.12)", border: "1px solid rgba(74,111,163,0.3)",
                borderRadius: 999, padding: "5px 12px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Overview ── */}
      <div>
        <Eyebrow>Overview</Eyebrow>
        <div className="space-y-3">
          <SectionCard>
            <p
              style={{
                fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                color: T.textPrimary, marginBottom: 10,
              }}
            >
              Program Overview
            </p>
            <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.65 }}>
              America's first national, member-only, shared-use, flex-space, full-service truck terminal network.
              LineHaul Station builds first-class terminals in key markets and sells space in increments to carriers,
              fleets, and brokers of all sizes — premium parking, fleet services, and a private drivers club at
              roughly 1/3 the cost of building your own.
            </p>
          </SectionCard>

          {/* Membership Pricing */}
          <SectionCard>
            <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
              <DollarSign size={16} style={{ color: T.blue }} />
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: T.textPrimary }}>
                Membership Pricing
              </p>
            </div>

            {/* Priority Space — Reserved Membership */}
            <div style={{
              background: "rgba(74,111,163,0.10)", border: "1px solid rgba(74,111,163,0.35)",
              borderRadius: T.radiusSm, padding: "14px 16px", marginBottom: 10,
            }}>
              <p style={{
                fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700,
                color: T.blue, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6,
              }}>
                Priority Space — Reserved Membership
              </p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>
                100-Day Reserved Membership
              </p>
              <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, marginBottom: 12 }}>
                Reserve 100 days of fleet access at LineHaul Station's first location — West Memphis, AR.
                Reserved access. Guaranteed availability.
              </p>
              <div style={{
                background: "rgba(74,111,163,0.18)", border: "1px solid rgba(74,111,163,0.5)",
                borderRadius: T.radiusSm, padding: "12px", textAlign: "center", marginBottom: 10,
              }}>
                <p style={{ fontSize: 10, color: T.blue, fontFamily: "var(--font-heading)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Membership Fee</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, color: T.textPrimary }}>$19,500</p>
              </div>
              <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 8, fontFamily: "var(--font-heading)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Payment Options</p>
              <div className="flex gap-2">
                {[
                  { label: "Pay in Full", value: "$19,500", sub: "down" },
                  { label: "Finance 12 Mo", value: "$1,900", sub: "per month" },
                  { label: "Finance 24 Mo", value: "$1,050", sub: "per month" },
                ].map((opt) => (
                  <div key={opt.label} style={{
                    flex: 1, background: T.cardAlt, border: `1px solid ${T.borderAlt}`,
                    borderRadius: T.radiusSm, padding: "8px 6px", textAlign: "center",
                  }}>
                    <p style={{ fontSize: 9, color: T.textMuted, fontFamily: "var(--font-heading)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{opt.label}</p>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 800, color: T.textPrimary }}>{opt.value}</p>
                    <p style={{ fontSize: 10, color: T.textMuted }}>{opt.sub}</p>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 12, background: "rgba(74,111,163,0.15)", border: "1px solid rgba(74,111,163,0.4)",
                borderRadius: T.radiusSm, padding: "10px 14px", textAlign: "center",
              }}>
                <p style={{ fontSize: 10, color: T.blue, fontFamily: "var(--font-heading)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>After Securing Your Membership</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, color: T.textPrimary }}>
                  $19<span style={{ fontSize: 14, fontWeight: 600, color: T.textSecondary }}>/day</span>
                </p>
                <p style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>Priority Space · Reserved access · Guaranteed availability</p>
              </div>
            </div>

            {/* Space Available — Alternate Option */}
            <div style={{
              background: T.cardAlt, border: `1px solid ${T.borderAlt}`,
              borderRadius: T.radiusSm, padding: "14px 16px",
            }}>
              <p style={{
                fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700,
                color: T.textMuted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6,
              }}>
                Alternate Option
              </p>
              <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: T.textPrimary }}>Space Available</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 800, color: T.orange }}>$59<span style={{ fontSize: 12, fontWeight: 600, color: T.textMuted }}>/day</span></p>
              </div>
              <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
                Access the full network with no upfront commitment. $59/day when space is available. Not guaranteed. First-come, first-served.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── Invitations ── */}
      <div>
        <Eyebrow>Invitations</Eyebrow>
        <div className="space-y-3">
          <ShareCarrier />
          <ShareBroker />
        </div>
      </div>

      {/* ── Tools ── */}
      <div>
        <Eyebrow>Tools</Eyebrow>
        <div className="space-y-3">
          <PlaceholderCard
            icon={Calculator}
            title="FlexSpace Calculator"
            description="See how FlexSpace compares to your current on-the-road costs. This calculator is being finalized."
          />
          <PlaceholderCard
            icon={Building2}
            title="Cost of Terminals Calculator"
            description="Estimate the build and operate costs of a LineHaul Station terminal. This calculator is being finalized."
          />
          <PlaceholderCard
            icon={Scale}
            title="Build vs Operate Comparison"
            description="Compare the cost of building a new terminal versus operating within the FlexSpace network. This comparison is being finalized."
          />
        </div>
      </div>

      {/* ── Resources ── */}
      <div>
        <Eyebrow>Resources</Eyebrow>
        <PlaceholderCard
          icon={FileBarChart}
          title="U.S. Truck Terminal Resale Report"
          description="A market report on truck terminal resale values across the U.S. This report is being compiled."
        />
      </div>
    </V3Shell>
  );
}
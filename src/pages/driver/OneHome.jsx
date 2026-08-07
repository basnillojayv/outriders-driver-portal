import React from "react";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import { T } from "@/components/driver/v3/v3tokens";
import { MapPin } from "lucide-react";
import HomeHubServices from "@/components/driver/space/HomeHubServices";
import InlineCalculator from "@/components/onehome/InlineCalculator";
import ShareDriverFriends from "@/components/driver/onehome/ShareDriverFriends";

const OH_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/7e50f1ec3_one_home_icon.svg";

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

export default function OneHome() {
  return (
    <V3Shell>
      <BackBar />
      {/* ── Overview ── */}
      <div
        style={{
          backgroundColor: "#1A1208",
          backgroundImage:
            "radial-gradient(circle at 20% 18%, rgba(180,90,30,0.55) 0%, transparent 50%)," +
            "radial-gradient(circle at 80% 82%, rgba(140,60,20,0.50) 0%, transparent 54%)," +
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px)",
          border: `1px solid rgba(255,106,0,0.35)`,
          borderRadius: T.radius,
          padding: "24px 20px 20px",
          textAlign: "center",
          boxShadow: "inset 0 1px 0 rgba(255,170,90,0.18), inset 0 0 18px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 112, height: 112, borderRadius: "50%",
            margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,106,0,0.18)",
            border: `1px solid rgba(255,106,0,0.45)`,
            boxShadow: "0 0 18px 3px rgba(255,106,0,0.35), 0 0 6px rgba(255,170,90,0.35)",
            overflow: "hidden",
          }}
        >
          <img
            src={OH_LOGO}
            alt="OneHome"
            style={{ width: 112, height: 112, objectFit: "cover" }}
          />
        </div>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 700,
            color: T.orange,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Live Where You Drive
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
          $59<span style={{ fontSize: 18, fontWeight: 700, color: T.textSecondary }}>/day</span>
        </h1>
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
          Resort-quality amenities, secure truck parking, and a growing national network.
          No carrier membership or initiation fee required — only pay for the days you use.
        </p>
        <div
          style={{
            display: "inline-flex", flexWrap: "wrap", justifyContent: "center",
            gap: 8, maxWidth: 340,
          }}
        >
          {["No Membership", "No Initiation Fee", "No Commitment"].map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700,
                color: T.orange, letterSpacing: "0.08em", textTransform: "uppercase",
                background: "rgba(255,106,0,0.12)", border: "1px solid rgba(255,106,0,0.3)",
                borderRadius: 999, padding: "5px 12px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Program Description / Reasons / Benefits / Cost Comparisons ── */}
      <div>
        <Eyebrow>Program & Benefits</Eyebrow>
        <div className="space-y-4">
          <SectionCard>
            <p
              style={{
                fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                color: T.textPrimary, marginBottom: 10,
              }}
            >
              What is OneHome?
            </p>
            <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.65 }}>
              OneHome is a lifestyle program built for American truckers — a network of
              resort-quality truck terminals where you live when you're off the road.
              Secure parking, private suites, chef's kitchens, fitness rooms, and business
              lounges, all in one place. No carrier affiliation required.
            </p>
          </SectionCard>

          <SectionCard>
            <p
              style={{
                fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                color: T.textPrimary, marginBottom: 14,
              }}
            >
              Why Drivers Choose OneHome
            </p>
            <div className="space-y-3">
              {[
                { t: "Stop paying for an empty house", d: "Most drivers are home fewer than 100 days a year. OneHome lets you pay only for the days you use." },
                { t: "Resort-quality every night", d: "Private shower suites, real kitchens, fitness rooms, and quiet lounges — not a truck stop parking lot." },
                { t: "Secure truck parking included", d: "Your rig stays safe on-site while you rest. No off-site lots, no extra fees." },
                { t: "A national network", d: "One membership unlocks every LineHaul Station location as the network grows — home wherever the road takes you." },
              ].map((item) => (
                <div key={item.t} style={{ display: "flex", gap: 10 }}>
                  <span
                    style={{
                      flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
                      background: T.orangeDim, border: `1px solid ${T.heroBorder}`,
                      color: T.orange, display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 800,
                    }}
                  >
                    ✓
                  </span>
                  <div>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700, color: T.textPrimary, marginBottom: 2 }}>
                      {item.t}
                    </p>
                    <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.55 }}>
                      {item.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <HomeHubServices />
        </div>
      </div>

      {/* ── OneHome Calculator ── */}
      <div>
        <Eyebrow>OneHome Calculator</Eyebrow>
        <SectionCard>
          <p
            style={{
              fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
              color: T.textPrimary, marginBottom: 6,
            }}
          >
            See Your Savings
          </p>
          <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, marginBottom: 18 }}>
            Compare your current cost of living to OneHome. Drag the sliders to match your situation.
          </p>
          <InlineCalculator />
        </SectionCard>
      </div>

      {/* ── Share > Driver Friends ── */}
      <div>
        <Eyebrow>Share</Eyebrow>
        <ShareDriverFriends />
      </div>

      {/* ── Network preview ── */}
      <div>
        <Eyebrow>The Network</Eyebrow>
        <SectionCard>
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <MapPin size={16} style={{ color: T.orange }} />
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 13,
                fontWeight: 700,
                color: T.textPrimary,
              }}
            >
              West Memphis — Coming Soon
            </p>
          </div>
          <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>
            The first LineHaul Station location is in pre-launch. As new hubs open, your
            access expands — home wherever the road takes you.
          </p>
        </SectionCard>
      </div>
    </V3Shell>
  );
}
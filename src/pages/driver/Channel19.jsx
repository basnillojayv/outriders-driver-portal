import React from "react";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import { T } from "@/components/driver/v3/v3tokens";
import { Radio, Building2, Route, MapPinned, Briefcase } from "lucide-react";

const CHANNEL_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/cef18041c_channel_19.svg";

const SECTIONS = [
  {
    id: "live",
    label: "Live Channels",
    items: [
      {
        id: "live",
        icon: Radio,
        title: "Outriders LIVE",
        description: "Live, member-wide broadcasts — announcements, guest drivers, and real-time community talk.",
        tag: "Live",
      },
    ],
  },
  {
    id: "regional",
    label: "Regional Channels",
    items: [
      {
        id: "metro",
        icon: Building2,
        title: "Metro Area Channels",
        description: "City-specific channels for drivers running the same metro areas — local intel, stops, and meetups.",
        tag: "Local",
      },
      {
        id: "interstate",
        icon: Route,
        title: "Interstate Channels",
        description: "Channels grouped by interstate — connect with drivers on your route and corridor.",
        tag: "Route-Based",
      },
      {
        id: "radius",
        icon: MapPinned,
        title: "Radius Search",
        description: "Find and connect with drivers within a set radius of your current location.",
        tag: "Nearby",
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [
      {
        id: "industry",
        icon: Briefcase,
        title: "Industry Topic Channels",
        description: "Topic-driven channels by industry — flatbed, reefer, tanker, car haul, and more.",
        tag: "Topics",
      },
    ],
  },
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

export default function Channel19() {
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
            width: 96, height: 96, borderRadius: "50%",
            margin: "0 auto 18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: T.blueDim,
            border: `1px solid rgba(124,146,181,0.45)`,
            boxShadow: "0 0 18px 3px rgba(124,146,181,0.4), 0 0 6px rgba(124,146,181,0.4)",
          }}
        >
          <img src={CHANNEL_ICON} alt="Breaker One-Nine" style={{ width: 72, height: 72, objectFit: "contain" }} />
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
          Breaker One-Nine
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
          Connect with fellow drivers through live, metro, interstate, and
          industry topic channels across the LineHaul Station network.
        </p>
      </div>

      {/* ── Channel sections ── */}
      {SECTIONS.map((section) => (
        <div key={section.id}>
          <Eyebrow>{section.label}</Eyebrow>
          <div className="space-y-3">
            {section.items.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: T.radius,
                    padding: 18,
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: T.blueDim,
                      border: `1px solid rgba(124,146,181,0.35)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} style={{ color: T.blue }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 15,
                        fontWeight: 700,
                        color: T.textPrimary,
                        letterSpacing: "0.01em",
                        marginBottom: 6,
                      }}
                    >
                      {c.title}
                    </p>
                    <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.55, marginBottom: 10 }}>
                      {c.description}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        fontFamily: "var(--font-heading)",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: T.orange,
                        background: T.orangeDim,
                        border: `1px solid rgba(255,106,0,0.3)`,
                        borderRadius: 999,
                        padding: "4px 10px",
                      }}
                    >
                      {c.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </V3Shell>
  );
}
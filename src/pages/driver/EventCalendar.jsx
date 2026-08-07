import React from "react";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import { T } from "@/components/driver/v3/v3tokens";
import { Radio, Compass, Smartphone, Star, MapPin } from "lucide-react";

const EVENTS_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/b7fe50f9a_events_icon.svg";

const EVENTS = [
  {
    id: "channel-19",
    icon: Radio,
    title: "Breaker One-Nine LIVE",
    description: "Tune in to Outriders Breaker One-Nine — live driver conversations, route updates, and real-time community talk.",
    tag: "Live Series",
  },
  {
    id: "orientation",
    icon: Compass,
    title: "Outriders Orientation",
    description: "New member onboarding — learn how the portal, amenities, and membership benefits work.",
    tag: "Onboarding",
  },
  {
    id: "app-intro",
    icon: Smartphone,
    title: "Outriders App Introduction",
    description: "Walkthrough of the Outriders HQ app — navigation, wallet, passport, and member tools.",
    tag: "Workshop",
  },
  {
    id: "founders",
    icon: Star,
    title: "Founders Program Overview",
    description: "Everything you need to know about the Founders Program — ranks, credits, and rewards.",
    tag: "Program",
  },
  {
    id: "west-memphis",
    icon: MapPin,
    title: "West Memphis Opening",
    description: "Grand opening of the West Memphis LineHaul Station location — amenities, tours, and member kickoff.",
    tag: "Launch",
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

export default function EventCalendar() {
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
          <img src={EVENTS_ICON} alt="Event Calendar" style={{ width: 56, height: 56, objectFit: "contain" }} />
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
          Event Calendar
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
          Outriders events, live sessions, and program launches.
          Save your spot — dates and registration coming soon.
        </p>
      </div>

      {/* ── Event list ── */}
      <div>
        <Eyebrow>Events</Eyebrow>
        <div className="space-y-3">
          {EVENTS.map((e) => {
            const Icon = e.icon;
            return (
              <div
                key={e.id}
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
                  <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 15,
                        fontWeight: 700,
                        color: T.textPrimary,
                        letterSpacing: "0.01em",
                      }}
                    >
                      {e.title}
                    </p>
                  </div>
                  <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.55 }}>
                    {e.description}
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
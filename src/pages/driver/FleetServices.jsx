import React from "react";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import { T } from "@/components/driver/v3/v3tokens";
import { ListChecks, Wrench, CalendarClock, Phone } from "lucide-react";

const FLEET_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/7ae62e958_fleet_services.svg";

const SECTIONS = [
  {
    id: "maintenance",
    label: "Maintenance",
    items: [
      { id: "maintenance-menu", icon: ListChecks, label: "Routine Maintenance Menu", sub: "Scheduled & preventive care options" },
      { id: "repair",           icon: Wrench,     label: "Repair Services",          sub: "On-site mechanical repairs" },
    ],
  },
  {
    id: "scheduling",
    label: "Scheduling",
    items: [
      { id: "schedule", icon: CalendarClock, label: "Schedule Service",     sub: "Book a service appointment" },
      { id: "contact",  icon: Phone,         label: "Contact Information", sub: "Reach the Fleet Services team" },
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

export default function FleetServices() {
  return (
    <V3Shell>
      <BackBar />
      {/* ── Hero ── */}
      <div
        style={{
          backgroundColor: "#1A1208",
          backgroundImage:
            "radial-gradient(circle at 20% 18%, rgba(180,90,30,0.55) 0%, transparent 50%)," +
            "radial-gradient(circle at 80% 82%, rgba(140,60,20,0.50) 0%, transparent 54%)," +
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px)",
          border: `1px solid rgba(255,106,0,0.35)`,
          borderRadius: T.radius,
          padding: "28px 22px 24px",
          textAlign: "center",
          boxShadow: "inset 0 1px 0 rgba(255,170,90,0.18), inset 0 0 18px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            width: 112, height: 112, borderRadius: "50%",
            margin: "0 auto 18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: T.orangeDim,
            border: `1px solid rgba(255,106,0,0.4)`,
            boxShadow: "0 0 18px 3px rgba(255,106,0,0.45), 0 0 6px rgba(255,170,90,0.4)",
          }}
        >
          <img src={FLEET_ICON} alt="Fleet Services" style={{ width: 72, height: 72, objectFit: "contain" }} />
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
          Fleet Services
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
          Keep your rig road-ready without leaving the terminal. LineHaul Station
          brings the services you need on-site while you relax at your new home.
        </p>
      </div>

      {/* ── Service sections ── */}
      {SECTIONS.map((section) => (
        <div key={section.id}>
          <Eyebrow>{section.label}</Eyebrow>
          <div className="space-y-2.5">
            {section.items.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: T.radiusSm,
                    padding: "16px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: T.orangeDim,
                      border: `1px solid rgba(255,106,0,0.3)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} style={{ color: T.orange }} />
                  </div>
                  <div className="flex-1 min-w-0">
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
                      {s.label}
                    </p>
                    <p style={{ fontSize: 12, color: T.textMuted, marginTop: 2, lineHeight: 1.4 }}>
                      {s.sub}
                    </p>
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
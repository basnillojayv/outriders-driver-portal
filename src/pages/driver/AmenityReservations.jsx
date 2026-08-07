import React from "react";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import { T } from "@/components/driver/v3/v3tokens";
import {
  Droplets, UtensilsCrossed, Laptop, Gamepad2, Circle, Scissors, HeartPulse, WashingMachine, Stethoscope,
} from "lucide-react";
import AmenitySection from "@/components/driver/amenities/AmenitySection";

const AMENITY_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/dfafc063a_AmenityReservations1.svg";

const AMENITIES = [
  {
    id: "showers",
    icon: Droplets,
    title: "Shower Suites",
    description: "Private, resort-quality shower suites with fresh towels and premium toiletries. Reserve your slot so a suite is ready the moment you arrive.",
    features: [
      "Private suites with lockable doors",
      "Fresh towels, soap & toiletries included",
      "High-pressure hot water",
      "Reserve a 30-minute slot",
    ],
    ctaLabel: "Reserve a Suite",
  },
  {
    id: "grill",
    icon: UtensilsCrossed,
    title: "Members Grill",
    description: "Chef-prepared meals at the Member's Grill. Browse the menu, place a to-go order, or reserve a table to dine in.",
    features: [
      "Full menu with daily specials",
      "To-go orders ready when you arrive",
      "Reserve a table for dine-in",
      "Catch the game while you eat",
    ],
    ctaLabel: "View Menu & Reserve",
  },
  {
    id: "den",
    icon: Laptop,
    title: "Digital Den",
    description: "A quiet, connected workspace with high-speed Wi-Fi, charging stations, and comfortable seating for your downtime.",
    features: [
      "High-speed Wi-Fi throughout",
      "Power & USB charging at every seat",
      "Quiet zones for focus & calls",
      "Reserve a desk or pod",
    ],
    ctaLabel: "Reserve a Desk",
  },
  {
    id: "simulators",
    icon: Gamepad2,
    title: "Simulators",
    description: "Step into the latest gaming and training simulators — trap & skeet, NASCAR reality, and more. Reserve a session.",
    features: [
      "Trap & skeet simulators",
      "NASCAR & racing reality",
      "Latest gaming releases",
      "Reserve a 60-minute session",
    ],
    ctaLabel: "Reserve a Session",
  },
  {
    id: "billiards",
    icon: Circle,
    title: "Billiards",
    description: "Reserve a pool table for a game or a tournament with fellow members. Cues and chalk provided.",
    features: [
      "Professional-grade pool tables",
      "Cues, chalk & accessories provided",
      "Reserve a table for 1–2 hours",
      "Tournament nights for members",
    ],
    ctaLabel: "Reserve a Table",
  },
  {
    id: "barber",
    icon: Scissors,
    title: "Barber Shop",
    description: "On-site barber shop for haircuts, beard trims, and grooming. Book an appointment that fits your schedule.",
    features: [
      "Haircuts, fades & beard trims",
      "Walk-ins welcome when available",
      "Book an appointment to guarantee a chair",
      "Member pricing",
    ],
    ctaLabel: "Book an Appointment",
  },
  {
    id: "massage",
    icon: HeartPulse,
    title: "Massage",
    description: "Work out the miles with a professional massage therapy session. Reserve a 30- or 60-minute slot.",
    features: [
      "Licensed massage therapists",
      "30- and 60-minute sessions",
      "Deep tissue & relaxation options",
      "Reserve in advance to secure your time",
    ],
    ctaLabel: "Book a Session",
  },
  {
    id: "laundry",
    icon: WashingMachine,
    title: "Laundry",
    description: "Commercial-grade washers and dryers on-site. Reserve a machine so your laundry is done while you relax.",
    features: [
      "Commercial-grade washers & dryers",
      "Folding space & daily essentials",
      "Reserve a machine in advance",
      "Text alerts when your load is done",
    ],
    ctaLabel: "Reserve a Machine",
  },
  {
    id: "urgent-care",
    icon: Stethoscope,
    title: "Urgent Care",
    description: "On-site urgent care for minor illnesses, injuries, and DOT physicals. Book a visit or walk in when available.",
    features: [
      "Minor illness & injury treatment",
      "DOT physicals & health screenings",
      "Walk-ins welcome when available",
      "Book a visit to minimize wait",
    ],
    ctaLabel: "Book a Visit",
  },
];

function Eyebrow({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 11,
        fontWeight: 700,
        color: T.blue,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  );
}

export default function AmenityReservations() {
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
            width: 112, height: 112, borderRadius: "50%",
            margin: "0 auto 18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: T.blueDim,
            border: `1px solid rgba(124,146,181,0.45)`,
            boxShadow: "0 0 18px 3px rgba(124,146,181,0.4), 0 0 6px rgba(124,146,181,0.4)",
          }}
        >
          <img src={AMENITY_ICON} alt="Amenity Reservations" style={{ width: 72, height: 72, objectFit: "contain" }} />
        </div>

        <span
          style={{
            display: "inline-block",
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: T.blue,
            background: T.blueDim,
            border: `1px solid rgba(124,146,181,0.4)`,
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
          Amenity Reservations
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
          Reserve premium member amenities before you arrive at LineHaul Station.
        </p>
      </div>

      {/* ── Amenity sections ── */}
      <div>
        <Eyebrow>Reservable Amenities</Eyebrow>
        <div className="space-y-4">
          {AMENITIES.map((a) => (
            <AmenitySection key={a.id} {...a} />
          ))}
        </div>
      </div>
    </V3Shell>
  );
}
import React from "react";
import {
  MapPin, Clock, Phone, Mail, AlertCircle, Navigation,
  Fuel, ShieldCheck, Sofa, ShowerHead, Utensils, Wrench,
} from "lucide-react";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import FutureLocations from "@/components/driver/v3/FutureLocations";
import { T, btnAccent, btnSecondary } from "@/components/driver/v3/v3tokens";

// West Memphis location
const LOCATION = {
  name: "West Memphis Hub",
  address: "1212 Martin Luther King Jr Drive, West Memphis, AR 72301",
  phone: "(602) 428-2222",
  email: "member@linehaulstation.com",
  opening: "July 2026",
};

// Unified amenities list — status pill per item for easy scanning.
const AMENITIES = [
  { name: "Fuel",              status: "coming_soon", icon: Fuel },
  { name: "Secure Parking",    status: "available",  icon: ShieldCheck },
  { name: "Driver Lounge",     status: "available",  icon: Sofa },
  { name: "Showers",           status: "coming_soon", icon: ShowerHead },
  { name: "Restaurant / Food", status: "coming_soon", icon: Utensils },
  { name: "Maintenance",       status: "coming_soon", icon: Wrench },
];

function openMaps() {
  window.open(`https://www.google.com/maps/search/${encodeURIComponent(LOCATION.address)}`, "_blank");
}
function openNavigation() {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(LOCATION.address)}`, "_blank");
}

function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 11,
        fontWeight: 700,
        color: T.textMuted,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

function FieldLabel({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 9,
        fontWeight: 700,
        color: T.textMuted,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        marginBottom: 5,
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: T.borderAlt }} />;
}

function StatusPill({ status }) {
  const available = status === "available";
  return (
    <span
      style={{
        flexShrink: 0,
        fontFamily: "var(--font-heading)",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "4px 10px",
        borderRadius: 999,
        background: available ? T.greenDim : T.cardAlt,
        color: available ? T.green : T.textMuted,
        border: `1px solid ${available ? T.green : T.border}`,
      }}
    >
      {available ? "Available" : "Coming Soon"}
    </span>
  );
}

function AmenityRow({ name, status, icon: Icon }) {
  const available = status === "available";
  return (
    <div
      className="flex items-center gap-3 rounded-[12px]"
      style={{ padding: "13px 15px", background: T.cardAlt, border: `1px solid ${T.borderAlt}` }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-[9px]"
        style={{
          width: 34, height: 34,
          background: available ? T.greenDim : T.blueDim,
          border: `1px solid ${available ? T.green : T.blue}`,
          color: available ? T.green : T.blue,
        }}
      >
        <Icon size={16} />
      </div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.textPrimary }}>{name}</span>
      <StatusPill status={status} />
    </div>
  );
}

export default function Locations() {
  return (
    <V3Shell>
      <BackBar />
      <div className="space-y-5 max-w-md mx-auto">
        {/* Hero */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 11,
              fontWeight: 700,
              color: T.orange,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            LineHaul Station
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 32,
              fontWeight: 700,
              color: T.textPrimary,
              lineHeight: 1.1,
              marginBottom: 10,
            }}
          >
            Terminal Network
          </h1>
          <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.6 }}>
            Discover LineHaul Station hubs and member services.
          </p>
        </div>

        {/* West Memphis Location Image */}
        <div
          style={{ borderRadius: T.radius, overflow: "hidden", border: `1px solid ${T.border}`, height: 220 }}
        >
          <img
            src="https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/b13c23d35_Gemini_Generated_Image_l9ur37l9ur37l9ur.png"
            alt="West Memphis LineHaul Station"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* West Memphis Card */}
        <div
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: T.radius,
            overflow: "hidden",
            isolation: "isolate",
          }}
        >
          {/* Card header */}
          <div style={{ padding: "22px 22px 20px", borderBottom: `1px solid ${T.borderAlt}` }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
              <AlertCircle size={14} style={{ color: T.orange }} />
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.orange,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                }}
              >
                Launch Hub • Coming Soon
              </p>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 24,
                fontWeight: 700,
                color: T.textPrimary,
                lineHeight: 1.15,
              }}
            >
              West Memphis
            </h2>
          </div>

          {/* Card body */}
          <div style={{ padding: 22 }}>
            {/* Address */}
            <div style={{ marginBottom: 20 }}>
              <div className="flex items-start gap-3">
                <MapPin size={18} style={{ color: T.orange, marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <FieldLabel>Address</FieldLabel>
                  <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>
                    {LOCATION.address}
                  </p>
                  <div className="flex gap-2.5">
                    <button
                      onClick={openMaps}
                      className="flex-1 flex items-center justify-center gap-2 transition-all active:scale-95"
                      style={btnAccent}
                    >
                      <MapPin size={15} />
                      Maps
                    </button>
                    <button
                      onClick={openNavigation}
                      className="flex-1 flex items-center justify-center gap-2 transition-all active:scale-95"
                      style={btnSecondary}
                    >
                      <Navigation size={15} />
                      Navigate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            {/* Contact */}
            <div style={{ marginBottom: 20, marginTop: 20 }}>
              <FieldLabel>Contact</FieldLabel>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={16} style={{ color: T.orange, flexShrink: 0 }} />
                  <a href={`tel:${LOCATION.phone}`} style={{ fontSize: 14, color: T.textSecondary, textDecoration: "none" }}>
                    {LOCATION.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} style={{ color: T.orange, flexShrink: 0 }} />
                  <a href={`mailto:${LOCATION.email}`} style={{ fontSize: 14, color: T.textSecondary, textDecoration: "none" }}>
                    {LOCATION.email}
                  </a>
                </div>
              </div>
            </div>

            <Divider />

            {/* Opening Timeline */}
            <div style={{ marginTop: 20 }}>
              <div className="flex items-start gap-3">
                <Clock size={18} style={{ color: T.orange, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <FieldLabel>Opening</FieldLabel>
                  <p style={{ fontSize: 14, color: T.textSecondary }}>
                    Phase 1: {LOCATION.opening}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <SectionLabel>Amenities</SectionLabel>
          <div className="space-y-2.5">
            {AMENITIES.map((a) => (
              <AmenityRow key={a.name} {...a} />
            ))}
          </div>
        </div>

        {/* Future Locations + Poll */}
        <FutureLocations />

        {/* Note */}
        <div
          style={{
            background: T.cardAlt,
            border: `1px solid ${T.borderAlt}`,
            borderRadius: T.radius,
            padding: 18,
          }}
        >
          <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>
            More locations launching throughout 2026. Amenities phase in over time. Check back for updates on additional hubs and member services.
          </p>
        </div>
      </div>
    </V3Shell>
  );
}
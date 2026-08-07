/**
 * ServicesAmenitiesSection — header + Reserve button to booking page.
 */
import React from "react";
import { Link } from "react-router-dom";
import { Droplets, CalendarCheck } from "lucide-react";
import { T, steelCard, btnPrimary } from "../v3/v3tokens";

export default function ServicesAmenitiesSection() {
  return (
    <div style={steelCard}>
      <div className="flex items-center gap-2.5" style={{ marginBottom: 18 }}>
        <Droplets size={16} style={{ color: T.orange }} />
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 700,
            color: T.textSecondary,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Services & Amenities
        </p>
      </div>

      <div style={{ height: 1, background: T.borderAlt, marginBottom: 20 }} />

      <Link
        to="/amenity-reservations"
        className="w-full flex items-center justify-center gap-2 transition-all active:scale-95"
        style={{ ...btnPrimary, textDecoration: "none" }}
      >
        <CalendarCheck size={15} />
        Reserve
      </Link>
    </div>
  );
}
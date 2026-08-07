/**
 * ShareWithCompany — company-outreach actions integrated into the referral experience.
 * Three actions: Download Brochure, Email My Company, Visit Website.
 * Matches the existing referral card language (steelCard, section label, btn actions).
 */
import React from "react";
import { FileText, Truck, Building2, Briefcase } from "lucide-react";
import { T, steelCard } from "../v3/v3tokens";

// Brochure URLs per audience — swap with role-specific links when available.
const BROCHURE_DRIVER_URL = "https://online.flippingbook.com/view/388785983";
const BROCHURE_CARRIER_URL = "https://online.flippingbook.com/view/388785983";
const BROCHURE_BROKER_URL = "https://online.flippingbook.com/view/388785983";

function ActionRow({ icon: Icon, label, sublabel, href, onClick, external }) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-3 rounded-[12px] transition-all active:scale-[0.98]"
      style={{
        padding: "14px 16px",
        background: T.cardAlt,
        border: `1px solid ${T.borderAlt}`,
        textDecoration: "none",
        minHeight: 56,
      }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-[10px]"
        style={{
          width: 38,
          height: 38,
          background: T.orangeDim,
          border: `1px solid ${T.heroBorder}`,
          color: T.orange,
        }}
      >
        <Icon size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <p style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: T.textPrimary }}>
          {label}
        </p>
        {sublabel && (
          <p style={{ fontSize: 12, color: T.textMuted, marginTop: 2, lineHeight: 1.4 }}>
            {sublabel}
          </p>
        )}
      </div>
    </a>
  );
}

export default function ShareWithCompany({ referralLink, memberName }) {
  return (
    <div style={steelCard}>
      {/* Header */}
      <div className="flex items-center gap-2.5" style={{ marginBottom: 16 }}>
        <FileText size={16} style={{ color: T.orange }} />
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 700,
            color: T.orange,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Share Brochures
        </p>
      </div>

      <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, marginBottom: 18 }}>
        Share the right LineHaul Station overview with drivers, carriers, or brokers.
      </p>

      <div style={{ height: 1, background: T.borderAlt, marginBottom: 18 }} />

      <div className="space-y-3">
        <ActionRow
          icon={Truck}
          label="Driver Brochure"
          sublabel="Member benefits & amenities for drivers"
          href={BROCHURE_DRIVER_URL}
          external
        />
        <ActionRow
          icon={Building2}
          label="Carrier Brochure"
          sublabel="Fleet services & terminal network for carriers"
          href={BROCHURE_CARRIER_URL}
          external
        />
        <ActionRow
          icon={Briefcase}
          label="Broker Brochure"
          sublabel="Partnership & freight opportunities for brokers"
          href={BROCHURE_BROKER_URL}
          external
        />
      </div>
    </div>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { Home, UserPlus, Globe } from "lucide-react";
import { T } from "../v3tokens";

const FLEET_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/7ae62e958_fleet_services.svg";
const CHANNEL_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/cef18041c_channel_19.svg";
const NETWORK_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/ead1d468e_network.svg";
const CAB_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/30ba4bf0a_cab_class.svg";
const RESERVE_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/dfafc063a_AmenityReservations1.svg";
const LULU_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/c883a6827_ask_lulu.svg";
const CAREER_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/84667fd72_career_center.svg";
const FLEX_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/67f07b7a3_flex_space_icon.svg";
const EVENTS_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/b7fe50f9a_events_icon.svg";
const PASSPORT_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/e5331ae52_digital_passport_icon.svg";
const ONEHOME_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/7e50f1ec3_one_home_icon.svg";
const INVITE_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/05d0bfb1c_invite_drivers_icon.svg";
const LHS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/58421c7bd_LHSLogo.jpg";

const ACTIONS = [
  // Row 1
  { id: "onehome", label: "One★Home\nProgram",       image: ONEHOME_ICON, color: T.orange, to: "/onehome" },
  { id: "flex",    label: "Flex★Space\nProgram",     image: FLEX_ICON,   color: T.green,  to: "/flex-space" },
  { id: "amen",    label: "Amenity\nReservations",  image: RESERVE_ICON, color: T.blue,   to: "/amenity-reservations" },
  // Row 2
  { id: "fleet",   label: "Fleet\nServices",        image: FLEET_ICON,   color: T.green,  to: "/fleet-services" },
  { id: "career",  label: "Career\nCenter",         image: CAREER_ICON,  color: T.blue,   to: "/career-center" },
  { id: "radio",   label: "Breaker\nOne-Nine",       image: CHANNEL_ICON, color: T.green,  to: "/channel-19" },
  // Row 3
  { id: "cab",     label: "Cab Class\nAcademy",    image: CAB_ICON,     color: T.blue,   to: "/cab-class" },
  { id: "hub",     label: "Terminal\nNetwork",      image: NETWORK_ICON, color: T.orange, to: "/locations" },
  { id: "events",  label: "Event\nCalendar",        image: EVENTS_ICON, color: T.blue,   to: "/events" },
  // Row 4
  { id: "invite",  label: "Invite New\nMembers",    image: INVITE_ICON, color: T.orange, to: "/share" },
  { id: "lulu",    label: "Questions?\nAsk Lulu",               image: LULU_ICON,    color: T.blue,   to: "/lulu" },
  { id: "lhs",     label: "LHS\nWebsite",           image: LHS_LOGO,    color: T.blue,   href: "https://www.linehaulstation.com" },
];

function ActionTile({ label, icon: Icon, image, color, to, href, index = 0 }) {
  const tile = (
    <div
      className="transition-all active:scale-95"
      style={{
        background: "rgba(42,44,48,0.6)",
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
        border: `1px solid rgba(180,188,200,0.55)`,
        boxShadow: "inset 0 1px 0 rgba(220,226,234,0.25)",
        borderRadius: 12,
        padding: "14px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: "100%",
        cursor: to || href ? "pointer" : "default",
      }}
    >
      <div
        className="neon-ring"
        style={{
          width: 68, height: 68, borderRadius: "50%",
          background: image ? "transparent" : "rgba(255,255,255,0.04)",
          border: image ? "none" : `1px solid ${T.borderAlt}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          "--neon-delay": `${index * 0.35}s`,
          "--neon-color": "rgba(200,208,220,0.85)",
          "--neon-glow": "rgba(200,208,220,0.65)",
          "--neon-glow-soft": "rgba(200,208,220,0.4)",
        }}
      >
        {image ? (
          <img src={image} alt={label} style={{ width: 68, height: 68, objectFit: "cover" }} />
        ) : (
          <Icon size={32} strokeWidth={1.8} style={{ color }} />
        )}
      </div>
      <span
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 10,
          fontWeight: 700,
          color: T.textPrimary,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          textAlign: "center",
          lineHeight: 1.25,
          minHeight: 25,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {label.split("\n").map((w, i) => (
          <span key={i} style={{ display: "block" }}>{w}</span>
        ))}
      </span>
    </div>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", height: "100%" }}>{tile}</a>
    );
  }
  return to ? (
    <Link to={to} style={{ textDecoration: "none", display: "block", height: "100%" }}>{tile}</Link>
  ) : tile;
}

function SectionLabel({ children }) {
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

export default function HomeQuickActions() {
  return (
    <div>
      <SectionLabel>Command Center</SectionLabel>
      <div className="grid grid-cols-3 gap-2.5">
        {ACTIONS.map((a, i) => (
          <ActionTile key={a.id} {...a} index={i} />
        ))}
      </div>
    </div>
  );
}
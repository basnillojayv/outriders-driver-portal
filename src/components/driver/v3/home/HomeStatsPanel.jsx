import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { T } from "../v3tokens";

const WALLET_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/a0b4c5a12_wallet.svg";
const FOUNDERS_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/29e4c6607_founders_program.svg";
const GEAR_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/6fe6c2726_GearShop_2.png";
const PASSPORT_ICON =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/e614bceea_digital_passport_icon.svg";

const BUTTONS = [
  { id: "wallet",   label: "Member\nWallet",     image: WALLET_ICON,   to: "/member-card",   color: T.orange, accentDim: T.orangeDim, border: "rgba(255,106,0,0.35)", flex: 1 },
  { id: "passport", label: "Digital\nPassport",  image: PASSPORT_ICON, to: "/digital-passport", color: T.blue,   accentDim: T.blueDim,   border: "rgba(124,146,181,0.35)", flex: 1 },
  { id: "founders", label: "Founders\nProgram",  image: FOUNDERS_ICON, to: "/rewards",       color: T.green,  accentDim: T.greenDim,  border: "rgba(24,195,126,0.35)", flex: 1, watermark: true },
  { id: "gear",     label: "Gear\nShop",          image: GEAR_ICON,     href: "https://lhs-gear-shop.myshopify.com/", color: T.orange, accentDim: T.orangeDim, border: "rgba(255,106,0,0.35)", flex: 1 },
];

export default function HomeStatsPanel() {
  return (
    <div
      style={{
        backgroundColor: "#1A1208",
        backgroundImage:
          "radial-gradient(circle at 18% 28%, rgba(180,90,30,0.55) 0%, transparent 48%)," +
          "radial-gradient(circle at 82% 72%, rgba(140,60,20,0.50) 0%, transparent 52%)," +
          "radial-gradient(circle at 50% 50%, rgba(40,20,8,0.7) 0%, transparent 65%)," +
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px)",
        border: "2px solid #B85A20",
        borderRadius: 18,
        padding: "10px 6px",
        boxShadow:
          "inset 0 1px 0 rgba(255,170,90,0.22), inset 0 0 18px rgba(0,0,0,0.55), 0 2px 12px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex items-stretch">
        {BUTTONS.map((b, i) => {
          const Icon = b.icon;
          const size = 68;
          const inner = (
            <div className="flex flex-col items-center text-center" style={{ gap: 4 }}>
              <div
                style={{
                  width: size, height: size, borderRadius: "50%",
                  background: b.image ? "transparent" : b.accentDim,
                  border: b.image ? "none" : `1px solid ${b.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 12px 2px rgba(255,106,0,0.55), 0 0 4px rgba(255,170,90,0.4)",
                }}
              >
                {b.image ? (
                  <img src={b.image} alt={b.id} style={{ width: size, height: size, objectFit: "contain", filter: b.brighten ? "brightness(1.35) saturate(1.2)" : "none" }} />
                ) : (
                  <Icon size={20} style={{ color: b.color }} />
                )}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  lineHeight: 1.5,
                }}
              >
                {b.label.split("\n").map((w, i) => <span key={i} style={{ display: "block" }}>{w}</span>)}
              </span>
            </div>
          );
          return (
            <React.Fragment key={b.id}>
              <div style={{
                flex: b.flex ?? 1,
                padding: "10px 4px",
                position: "relative",
              }}>
                {b.watermark && b.image && (
                  <img
                    src={b.image}
                    alt=""
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: "50%", left: "50%",
                      width: 100, height: 100,
                      transform: "translate(-50%, -58%)",
                      objectFit: "contain",
                      opacity: 0.09,
                      filter: "none",
                      pointerEvents: "none",
                      zIndex: 0,
                    }}
                  />
                )}
                {b.to ? (
                  <Link to={b.to} className="transition-all active:scale-95" style={{ textDecoration: "none", position: "relative" }}>
                    {inner}
                  </Link>
                ) : b.href ? (
                  <a href={b.href} target="_blank" rel="noopener noreferrer" className="transition-all active:scale-95" style={{ textDecoration: "none", position: "relative" }}>
                    {inner}
                  </a>
                ) : (
                  <div style={{ cursor: "default", position: "relative" }}>{inner}</div>
                )}
              </div>
              {i < BUTTONS.length - 1 && (
                <div style={{ width: 1, background: "#B85A20", alignSelf: "stretch" }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
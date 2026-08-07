import React from "react";
import { T } from "@/components/driver/v3/v3tokens";

const OUTRIDERS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/6cb494d67_lhs_outriders_logo_circle.png";
const LHS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/58421c7bd_LHSLogo.jpg";

export default function PassportCover({ memberName, memberId, completion }) {
  return (
    <div style={{
      borderRadius: "18px",
      overflow: "hidden",
      border: `1.5px solid rgba(255,106,0,0.22)`,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      background: "linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)",
      position: "relative",
    }}>
      {/* Inner gold frame */}
      <div style={{
        position: "absolute", inset: 8,
        border: `1px solid rgba(255,106,0,0.12)`,
        borderRadius: "12px",
        pointerEvents: "none",
      }} />

      <div style={{ padding: "32px 24px", position: "relative", zIndex: 1 }}>
        {/* Brand logos */}
        <div className="flex items-center justify-center gap-3" style={{ marginBottom: 20 }}>
          <img src={LHS_LOGO} alt="LineHaul Station" style={{ height: 70, width: "auto", objectFit: "contain" }} />
          <img src={OUTRIDERS_LOGO} alt="Outriders" style={{ width: 58, height: 58, borderRadius: "50%", objectFit: "contain" }} />
        </div>

        {/* Title block */}
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 700,
          color: T.orange, letterSpacing: "0.08em",
          textAlign: "center",
          textShadow: "0 0 12px rgba(255,106,0,0.2)",
        }}>
          DIGITAL PASSPORT
        </h1>

        {/* Divider */}
        <div style={{
          height: 1, background: "linear-gradient(90deg, transparent, rgba(255,106,0,0.2), transparent)",
          margin: "20px 0",
        }} />

        {/* Holder + Passport No. */}
        <div className="flex items-center justify-between">
          <div>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
              color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase",
            }}>
              Member
            </p>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700,
              color: T.textPrimary, marginTop: 4,
            }}>
              {memberName || "—"}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
              color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase",
            }}>
              Passport No.
            </p>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700,
              color: T.orange, marginTop: 4,
            }}>
              {memberId}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
import React from "react";
import { T } from "@/components/driver/v3/v3tokens";

const OUTRIDERS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/6cb494d67_lhs_outriders_logo_circle.png";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function PassportDashboardCover({ memberName, memberHandle, headline, memberId, memberSince, photoUrl, qrUrl }) {
  const initials = memberName
    ? memberName.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()
    : "D";

  return (
    <div style={{
      borderRadius: "18px",
      overflow: "hidden",
      border: `1.5px solid ${T.orange}`,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      background: "linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)",
      position: "relative",
    }}>
      {/* Inner gold frame */}
      <div style={{
        position: "absolute", inset: 8,
        border: `1px solid rgba(255,106,0,0.18)`,
        borderRadius: "12px",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      <div style={{ padding: "28px 22px", position: "relative", zIndex: 2, textAlign: "center" }}>
        {/* Header text */}
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700,
          color: T.orange, letterSpacing: "0.1em",
          textShadow: "0 0 12px rgba(255,106,0,0.2)",
        }}>
          Digital Passport
        </h1>

        {/* Emblem */}
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            border: `1.5px solid ${T.orange}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,106,0,0.05)",
            boxShadow: "inset 0 0 12px rgba(255,106,0,0.12)",
          }}>
            <img src={OUTRIDERS_LOGO} alt="Outriders" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />
          </div>
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
            color: T.orange, letterSpacing: "0.18em", marginTop: 8,
          }}>
            LEAD • GUIDE • PROTECT
          </p>
        </div>

        {/* Profile photo */}
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 120, height: 120, borderRadius: 14,
            border: `2px solid ${T.orange}`,
            overflow: "hidden",
            background: T.cardAlt,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {photoUrl
              ? <img src={photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 700, color: T.textSecondary }}>{initials}</span>
            }
          </div>
        </div>

        {/* User details */}
        {memberHandle && (
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700,
            color: T.orange, marginTop: 14, letterSpacing: "0.02em",
          }}>
            "{memberHandle}"
          </p>
        )}
        <p style={{
          fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700,
          color: T.textPrimary, marginTop: memberHandle ? 4 : 14,
        }}>
          {memberName}
        </p>
        <p style={{
          fontSize: 13, color: T.textSecondary, marginTop: 4,
          fontFamily: "var(--font-body)",
        }}>
          {headline}
        </p>

        {/* Divider */}
        <div style={{
          height: 1, background: "linear-gradient(90deg, transparent, rgba(255,106,0,0.2), transparent)",
          margin: "18px 0",
        }} />

        {/* Footer data */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
              color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase",
            }}>
              Passport ID
            </p>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
              color: T.orange, marginTop: 4,
            }}>
              {memberId}
            </p>
          </div>
          <div>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
              color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase",
            }}>
              Member Since
            </p>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
              color: T.textPrimary, marginTop: 4,
            }}>
              {formatDate(memberSince)}
            </p>
          </div>
        </div>

        {/* QR code */}
        {qrUrl && (
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 120, height: 120, borderRadius: 8,
              background: "#fff", padding: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src={qrUrl} alt="QR Code" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
              color: T.orange, letterSpacing: "0.18em", textTransform: "uppercase",
              marginTop: 8,
            }}>
              Scan to View Passport
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
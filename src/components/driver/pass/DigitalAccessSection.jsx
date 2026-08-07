/**
 * DigitalAccessSection — QR code + wallet actions.
 * Supporting module below the credential card.
 */
import React from "react";
import { Wallet, QrCode } from "lucide-react";
import { T, steelCard, btnPrimary, btnSecondary } from "../v3/v3tokens";

export default function DigitalAccessSection({ referralLink }) {
  const qrUrl = referralLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=ffffff&color=000000&qzone=1&data=${encodeURIComponent(referralLink)}`
    : null;

  return (
    <div style={steelCard}>
      {/* Header */}
      <div className="flex items-center gap-2.5" style={{ marginBottom: 18 }}>
        <QrCode size={16} style={{ color: T.orange }} />
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
          Digital Access
        </p>
      </div>

      <div style={{ height: 1, background: T.borderAlt, marginBottom: 20 }} />

      {/* QR + buttons */}
      <div className="flex flex-col items-center gap-5">
        {qrUrl ? (
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
              background: T.bg,
              padding: 8,
            }}
          >
            <img src={qrUrl} alt="Referral QR" width={116} height={116} style={{ display: "block", borderRadius: 6 }} />
          </div>
        ) : (
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: 12,
              border: `1px dashed ${T.borderAlt}`,
              background: T.cardAlt,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 9, color: T.textMuted, textAlign: "center", padding: "0 12px" }}>
              No link yet
            </p>
          </div>
        )}

        <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.55, textAlign: "center", whiteSpace: "nowrap" }}>
          Gate Access and Amenities with QR
        </p>

        <button
          disabled
          className="w-full flex items-center justify-center gap-2 transition-all"
          style={{ ...btnSecondary, fontSize: 12, padding: "12px 10px", minHeight: 44, opacity: 0.4, cursor: "not-allowed" }}
        >
          <Wallet size={14} />
          Add to Wallet
        </button>
      </div>
    </div>
  );
}
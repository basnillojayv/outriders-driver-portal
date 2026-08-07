/**
 * PublicPassport — public, no-auth-required passport view page.
 * Fetches passport data via getPublicPassport backend function and
 * renders the FlippingBook-style booklet. Reachable at /passport/:userId.
 */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import { T, carbonBg } from "@/components/driver/v3/v3tokens";
import PassportBooklet from "@/components/driver/passport/PassportBooklet";
import { buildPassportData } from "@/lib/passportData";

const OUTRIDERS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/6cb494d67_lhs_outriders_logo_circle.png";

export default function PublicPassport() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    base44.functions
      .invoke("getPublicPassport", { userId })
      .then((res) => {
        const passportUser = res.data;
        if (passportUser?.error) {
          setError(passportUser.error);
        } else {
          setData(buildPassportData(passportUser, passportUser.lhs_member_id));
        }
      })
      .catch((e) => setError(e.message || "Failed to load passport"));
  }, [userId]);

  if (error) {
    return (
      <div style={{ ...carbonBg, minHeight: "100vh" }} className="flex flex-col items-center justify-center px-6 text-center">
        <img src={OUTRIDERS_LOGO} alt="Outriders" style={{ width: 64, height: 64, borderRadius: "50%", marginBottom: 20, opacity: 0.7 }} />
        <p style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>
          Passport Not Available
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: T.textMuted }}>
          {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ ...carbonBg, minHeight: "100vh" }} className="flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="animate-spin" style={{ color: T.orange }} />
        <p style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700, color: T.textMuted, letterSpacing: "0.14em" }}>
          LOADING PASSPORT…
        </p>
      </div>
    );
  }

  return (
    <div style={{ ...carbonBg, height: "100vh" }} className="flex flex-col">
      {/* Top bar */}
      <header style={{ background: "#000000", flexShrink: 0 }}>
        <div
          aria-hidden
          style={{
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${T.orange} 20%, ${T.orange} 80%, transparent 100%)`,
            opacity: 0.55,
          }}
        />
        <div className="flex items-center justify-between px-5" style={{ height: 56 }}>
          <div className="flex items-center gap-2">
            <img src={OUTRIDERS_LOGO} alt="Outriders" style={{ width: 32, height: 32, borderRadius: "50%" }} />
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 800,
              color: T.orange, letterSpacing: "0.22em", textTransform: "uppercase",
            }}>
              Digital Passport
            </p>
          </div>
        </div>
        <div aria-hidden style={{ height: 1, background: T.borderAlt }} />
      </header>

      {/* Booklet */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <PassportBooklet data={data} />
      </div>
    </div>
  );
}
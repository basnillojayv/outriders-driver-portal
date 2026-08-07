/**
 * ShareMenu — in-app share affordance for the top nav.
 * Two options: "My Referral Link" (driver-to-driver) and "Share to Company" (current page).
 */
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Share, Link2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { T } from "./v3tokens";

export default function ShareMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: members } = useQuery({
    queryKey: ["myMember", user?.email],
    queryFn: () =>
      base44.asServiceRole
        ? base44.entities.Member.filter({ email: user.email })
        : Promise.resolve([]),
    enabled: !!user?.email,
  });

  const member = members?.[0] || null;
  const referralLink = member?.affiliate_referral_link || null;

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const pageUrl = window.location.origin + location.pathname;
  const memberName = member?.first_name || user?.full_name?.split(" ")[0] || "";

  const shareReferral = async () => {
    setOpen(false);
    if (!referralLink) {
      toast.error("Your referral link isn't ready yet — check back shortly.");
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Outriders — LineHaul Station",
          text: "Join me on Outriders:",
          url: referralLink,
        });
        return;
      } catch { /* cancelled */ }
    }
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const shareToCompany = () => {
    setOpen(false);
    const subject = "Check out LineHaul Station";
    const body = [
      "Hi,",
      "",
      "I've been using the Outriders member portal from LineHaul Station — America's first member-only, shared-use truck terminal network. Take a look:",
      pageUrl,
      "",
      memberName ? `Best,\n${memberName}` : "Best,",
    ].join("\n");
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Share"
        aria-expanded={open}
        className="flex items-center justify-center transition-all active:scale-95"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: T.orange,
          border: "none",
        }}
      >
        <Share size={18} strokeWidth={1.75} style={{ color: "#000000" }} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-50 fade-up"
          style={{
            minWidth: 240,
            borderRadius: 12,
            background: T.card,
            border: `1px solid ${T.border}`,
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            padding: 8,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 10,
              fontWeight: 700,
              color: T.textMuted,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "8px 12px 6px",
            }}
          >
            Share
          </p>

          <button
            onClick={shareReferral}
            className="flex items-center gap-3 w-full text-left transition-all active:scale-[0.98] rounded-[10px]"
            style={{ padding: "12px", background: T.cardAlt, border: `1px solid ${T.borderAlt}` }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-[8px]"
              style={{ width: 32, height: 32, background: T.orangeDim, border: `1px solid ${T.heroBorder}`, color: T.orange }}
            >
              <Link2 size={15} />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, color: T.textPrimary }}>
                Send to Other Driver
              </p>
              <p style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                Share your referral link
              </p>
            </div>
          </button>

          <button
            onClick={shareToCompany}
            className="flex items-center gap-3 w-full text-left transition-all active:scale-[0.98] rounded-[10px]"
            style={{ marginTop: 8, padding: "12px", background: T.cardAlt, border: `1px solid ${T.borderAlt}` }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-[8px]"
              style={{ width: 32, height: 32, background: T.blueDim, border: `1px solid rgba(124,146,181,0.3)`, color: T.blue }}
            >
              <Building2 size={15} />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, color: T.textPrimary }}>
                Share to Company
              </p>
              <p style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                Email a company contact
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
/**
 * AddToHomeScreenPrompt — first-time PWA onboarding modal.
 *
 * Temporary onboarding until native iOS/Android apps ship.
 *   • Install App  → native install prompt (Android/Chrome);
 *                    guided step overlay (iPhone/Safari — does not just close).
 *   • Maybe Later  → hides for this session (shows again next launch).
 *   • Don't Show Again → permanent dismissal via localStorage.
 *
 * Auto-suppressed when already running standalone (installed).
 *
 * CONFIG: once native apps are live, set ONBOARDING_ENABLED = false to
 * disable this flow everywhere without removing the component.
 */
import React, { useState, useEffect } from "react";
import {
  Smartphone, Share, X, Zap, Maximize, Layout, Route, ArrowRight, Check,
} from "lucide-react";
import { T } from "./v3tokens";

// ── Master switch — flip to false once native apps are released ──
const ONBOARDING_ENABLED = true;

const LS_KEY = "outriders_aths_never";
const SS_KEY = "outriders_aths_session_skipped";

const BENEFITS = [
  { icon: Zap,      label: "Faster access" },
  { icon: Maximize, label: "Full-screen experience" },
  { icon: Layout,   label: "App-like experience" },
  { icon: Route,    label: "Easy access while you're on the road" },
];

const IPHONE_STEPS = [
  { icon: Share,     text: "Tap the Share button in Safari." },
  { icon: Smartphone, text: "Tap Add to Home Screen." },
  { icon: Check,     text: "Tap Add." },
];

export default function AddToHomeScreenPrompt() {
  const [visible, setVisible] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    if (!ONBOARDING_ENABLED) return;

    // Already installed / standalone → never show
    const standalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator?.standalone === true;
    if (standalone) return;

    if (localStorage.getItem(LS_KEY) === "1") return;
    if (sessionStorage.getItem(SS_KEY) === "1") return;

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const t = setTimeout(() => setVisible(true), 600);

    const onReopen = () => {
      sessionStorage.removeItem(SS_KEY);
      localStorage.removeItem(LS_KEY);
      setVisible(true);
    };
    window.addEventListener("outriders-aths-reopen", onReopen);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      clearTimeout(t);
      window.removeEventListener("outriders-aths-reopen", onReopen);
    };
  }, []);

  const close = () => {
    setVisible(false);
    setGuideOpen(false);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Android / Chrome — native install prompt
      try {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
      } catch { /* ignore */ }
      close();
    } else {
      // iPhone / Safari — show guided overlay (do not just close)
      setGuideOpen(true);
    }
  };

  const handleMaybeLater = () => {
    sessionStorage.setItem(SS_KEY, "1");
    close();
  };

  const handleNeverShow = () => {
    localStorage.setItem(LS_KEY, "1");
    close();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)", padding: "20px 16px" }}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Outriders HQ"
    >
      <div
        className="w-full max-w-md fade-up"
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: "20px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          overflow: "hidden",
          position: "relative",
          margin: "auto 0",
        }}
      >
        {/* Top accent */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${T.orange} 0%, transparent 100%)` }} />

        {/* Close (session skip) */}
        <button
          onClick={handleMaybeLater}
          aria-label="Close"
          className="flex items-center justify-center transition-all active:scale-95"
          style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "transparent", border: `1px solid ${T.borderAlt}`,
            color: T.textMuted, position: "absolute", top: 14, right: 14,
            cursor: "pointer", zIndex: 2,
          }}
        >
          <X size={16} />
        </button>

        {guideOpen ? (
          /* ── Guided overlay (iPhone) ── */
          <div style={{ padding: "30px 22px 24px" }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: 14,
                margin: "0 auto 18px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: T.orangeDim, border: `1px solid ${T.heroBorder}`,
                boxShadow: "0 0 18px 2px rgba(255,106,0,0.35)",
              }}
            >
              <Smartphone size={28} style={{ color: T.orange }} />
            </div>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
              color: T.orange, letterSpacing: "0.22em", textTransform: "uppercase",
              textAlign: "center", marginBottom: 8,
            }}>
              Install on iPhone
            </p>
            <h2 style={{
              fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700,
              color: T.textPrimary, textAlign: "center", lineHeight: 1.2, marginBottom: 22,
            }}>
              Add Outriders HQ to Home Screen
            </h2>

            <div className="space-y-3" style={{ marginBottom: 24 }}>
              {IPHONE_STEPS.map((step, i) => {
                const SIcon = step.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                    style={{
                      background: T.cardAlt,
                      border: `1px solid ${T.borderAlt}`,
                      borderRadius: T.radiusSm,
                      padding: "14px 16px",
                    }}
                  >
                    <span
                      style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: T.orange, color: "#0A0A0A",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontFamily: "var(--font-heading)",
                        fontWeight: 800, fontSize: 13,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 14, color: T.textPrimary, fontWeight: 600, flex: 1 }}>
                      {step.text}
                    </span>
                    <SIcon size={16} style={{ color: T.textMuted, flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>

            <button
              onClick={close}
              className="flex items-center justify-center gap-2 w-full transition-all active:scale-95"
              style={{
                fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                background: T.orange, color: "#0A0A0A", border: "none",
                borderRadius: T.radiusSm, padding: "15px 18px", minHeight: 50,
                cursor: "pointer",
              }}
            >
              <Check size={16} />
              Got it
            </button>
          </div>
        ) : (
          /* ── Default welcome view ── */
          <div style={{ padding: "30px 22px 22px" }}>
            {/* Icon */}
            <div
              style={{
                width: 56, height: 56, borderRadius: 14,
                margin: "8px auto 18px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: T.orangeDim, border: `1px solid ${T.heroBorder}`,
                boxShadow: "0 0 18px 2px rgba(255,106,0,0.35)",
              }}
            >
              <Smartphone size={28} style={{ color: T.orange }} />
            </div>

            <h2
              style={{
                fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700,
                color: T.textPrimary, textAlign: "center", lineHeight: 1.2, marginBottom: 6,
              }}
            >
              Welcome to Outriders HQ
            </h2>
            <p
              style={{
                fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700,
                color: T.orange, textAlign: "center", marginBottom: 12,
              }}
            >
              Install Outriders HQ
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)", fontSize: 14, color: T.textSecondary,
                textAlign: "center", lineHeight: 1.55, marginBottom: 22,
              }}
            >
              Install Outriders HQ on your Home Screen for fast, one-tap access and the best mobile experience.
            </p>

            {/* Benefits */}
            <div style={{ marginBottom: 22 }}>
              <div className="grid grid-cols-2 gap-2.5">
                {BENEFITS.map((b) => {
                  const BIcon = b.icon;
                  return (
                    <div
                      key={b.label}
                      className="flex items-center gap-2.5"
                      style={{
                        background: T.cardAlt,
                        border: `1px solid ${T.borderAlt}`,
                        borderRadius: T.radiusSm,
                        padding: "12px 14px",
                      }}
                    >
                      <span
                        style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: T.orangeDim, border: `1px solid ${T.heroBorder}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, color: T.orange,
                        }}
                      >
                        <BIcon size={14} />
                      </span>
                      <span style={{ fontSize: 12, color: T.textPrimary, fontWeight: 600, lineHeight: 1.3 }}>
                        {b.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleInstall}
                className="flex items-center justify-center gap-2 w-full transition-all active:scale-95"
                style={{
                  fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                  background: T.orange, color: "#0A0A0A", border: "none",
                  borderRadius: T.radiusSm, padding: "15px 18px", minHeight: 50,
                  cursor: "pointer",
                }}
              >
                <ArrowRight size={16} />
                Install App
              </button>
              <div className="flex gap-2.5">
                <button
                  onClick={handleMaybeLater}
                  className="flex-1 flex items-center justify-center transition-all active:scale-95"
                  style={{
                    fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
                    background: "transparent", color: T.textSecondary,
                    border: `1px solid ${T.border}`,
                    borderRadius: T.radiusSm, padding: "13px 16px", minHeight: 48,
                    cursor: "pointer",
                  }}
                >
                  Remind Me Later
                </button>
                <button
                  onClick={handleNeverShow}
                  className="flex-1 flex items-center justify-center transition-all active:scale-95"
                  style={{
                    fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
                    background: "transparent", color: T.textMuted,
                    border: `1px solid ${T.borderAlt}`,
                    borderRadius: T.radiusSm, padding: "13px 16px", minHeight: 48,
                    cursor: "pointer",
                  }}
                >
                  Don't Show Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
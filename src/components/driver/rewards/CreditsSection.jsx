import React from "react";
import { Coins } from "lucide-react";

export default function CreditsSection({ credits }) {
  return (
    <div className="space-y-3">
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Credits
      </p>

      <div
        className="rounded-xl p-5 space-y-4"
        style={{
          background: "var(--carbon-800)",
          border: "1px solid var(--carbon-500)",
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Coins size={16} style={{ color: "var(--accent)" }} />
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Current Balance
            </p>
          </div>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 32, fontWeight: 900, color: "var(--accent)" }}>
            {credits}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>Credits</p>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        <div className="space-y-2">
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            How to Earn Credits
          </p>
          <ul className="space-y-1.5 text-sm text-text-secondary">
            <li className="flex gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--fuel-300)", fontWeight: 700 }}>•</span>
              <span>1 qualified referral = 1 credit</span>
            </li>
            <li className="flex gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--fuel-300)", fontWeight: 700 }}>•</span>
              <span>Credits are awarded after referral verification.</span>
            </li>
          </ul>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
            Redeem Your Credits
          </p>
          <button
            disabled
            className="w-full py-3 rounded-lg font-heading font-bold text-sm transition-all cursor-not-allowed"
            style={{
              background: "rgba(204,91,48,0.1)",
              border: "1px solid rgba(204,91,48,0.2)",
              color: "var(--text-muted)",
            }}
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
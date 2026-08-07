import React from "react";
import V2Chip from "./V2Chip";

const OUTRIDERS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/6cb494d67_lhs_outriders_logo_circle.png";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function V2Hero({ firstName, status, memberId, summary }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-v2-surface border border-v2-border p-5">
      <img
        src={OUTRIDERS_LOGO}
        alt=""
        aria-hidden
        className="absolute -right-8 -bottom-12 h-48 w-48 object-contain pointer-events-none"
        style={{ opacity: 0.06 }}
      />
      <p className="font-v2-sub uppercase tracking-[0.22em] text-[11px] relative" style={{ color: "#6B7480" }}>
        {greeting()}
      </p>
      <h2
        className="font-v2-head text-v2-text mt-1 relative"
        style={{ fontSize: 30, letterSpacing: "0.03em", lineHeight: 1.05 }}
      >
        {firstName}
      </h2>
      <div className="mt-3 flex items-center gap-2 relative">
        <V2Chip tone={status === "active" ? "success" : "fuel"}>
          {(status || "—").toUpperCase()}
        </V2Chip>
        {memberId && (
          <span className="font-v2-mono text-xs" style={{ color: "#AEB7C0" }}>
            {memberId}
          </span>
        )}
      </div>
      {summary && (
        <p className="font-v2-body text-sm mt-3 relative" style={{ color: "#AEB7C0" }}>
          {summary}
        </p>
      )}
    </section>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Users } from "lucide-react";

export default function TopTenPreview({ directCount, credits, networkCount }) {
  const progress = Math.min(100, ((directCount || 0) / 10) * 100);
  const remaining = Math.max(0, 10 - (directCount || 0));

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.07)", background: "var(--carbon-800)" }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" style={{ color: "var(--success)" }} />
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
            Top 10 Truckers
          </p>
        </div>
        <Link
          to="/rewards"
          className="flex items-center gap-1 transition-colors"
          style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 800, color: "var(--fuel-300)", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
        >
          View <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 16px" }} />

      {/* Stats */}
      <div className="px-4 py-3 grid grid-cols-3 gap-3">
        <div>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 8, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Direct</p>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.1, marginTop: 2 }}>
            {directCount || 0}<span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>/10</span>
          </p>
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 8, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Network</p>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.1, marginTop: 2 }}>
            {networkCount || 0}
          </p>
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 8, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Credits</p>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 900, color: "var(--fuel-300)", lineHeight: 1.1, marginTop: 2 }}>
            {credits || 0}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-4 space-y-1.5">
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--carbon-700)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: progress >= 100 ? "var(--success)" : "linear-gradient(90deg, var(--fuel-500), var(--fuel-300))" }}
          />
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)" }}>
          {remaining > 0
            ? `${remaining} more driver${remaining !== 1 ? "s" : ""} to complete your Top Ten`
            : "Top Ten complete — you're a Lead member"}
        </p>
      </div>
    </div>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import V2Chip from "./V2Chip";

const ACCENTS = {
  fuel: "#FF6600",
  cobalt: "#4A6FA3",
  success: "#10B981",
  warning: "#EF4444",
};

export default function V2ModuleCard({
  icon: Icon,
  label,
  chip,
  chipTone = "success",
  metric,
  unit,
  headline,
  sub,
  actionLabel,
  to,
  accent = "fuel",
  progress,
}) {
  const accentColor = ACCENTS[accent] || ACCENTS.fuel;

  return (
    <section className="rounded-2xl bg-v2-surface border border-v2-border p-4 flex flex-col">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon size={15} className="flex-shrink-0" style={{ color: accentColor }} />}
          <span
            className="font-v2-sub uppercase tracking-[0.15em] text-[11px] truncate"
            style={{ color: "#AEB7C0" }}
          >
            {label}
          </span>
        </div>
        {chip && <V2Chip tone={chipTone}>{chip}</V2Chip>}
      </header>

      {headline ? (
        <p
          className="font-v2-head uppercase text-v2-text mt-3"
          style={{ fontSize: 18, letterSpacing: "0.02em", lineHeight: 1.2 }}
        >
          {headline}
        </p>
      ) : (
        <div className="mt-3 flex items-baseline gap-1.5">
          <span
            className="font-v2-mono text-v2-text"
            style={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}
          >
            {metric}
          </span>
          {unit && (
            <span className="font-v2-mono text-sm" style={{ color: "#6B7480" }}>
              {unit}
            </span>
          )}
        </div>
      )}

      {sub && (
        <p className="font-v2-body text-[13px] mt-1.5" style={{ color: "#AEB7C0" }}>
          {sub}
        </p>
      )}

      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 w-full rounded-full" style={{ background: "#1E252D" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.min(100, progress)}%`, background: "#FF6600" }}
          />
        </div>
      )}

      {actionLabel && to && (
        <Link
          to={to}
          className="mt-3 inline-flex items-center gap-1 font-v2-sub uppercase tracking-[0.1em] text-xs"
          style={{ color: accentColor }}
        >
          {actionLabel}
          <ChevronRight size={14} />
        </Link>
      )}
    </section>
  );
}
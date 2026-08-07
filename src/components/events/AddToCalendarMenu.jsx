import React, { useState } from "react";
import { Calendar, X } from "lucide-react";
import { format } from "date-fns";

function toICSDate(dateStr, timeStr) {
  const dt = new Date(`${dateStr}T${timeStr || "00:00"}:00`);
  return dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function buildICS(event) {
  const start = toICSDate(event.date, event.time);
  const end = event.end_time ? toICSDate(event.date, event.end_time) : toICSDate(event.date, event.time);
  const loc = [event.location, event.address].filter(Boolean).join(", ");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LineHaul Station//Events//EN",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${(event.description || "").replace(/\n/g, "\\n")}`,
    loc ? `LOCATION:${loc}` : "",
    `STATUS:CONFIRMED`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
}

function googleCalUrl(event) {
  const start = toICSDate(event.date, event.time);
  const end = event.end_time ? toICSDate(event.date, event.end_time) : toICSDate(event.date, event.time);
  const loc = [event.location, event.address].filter(Boolean).join(", ");
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description || "",
    location: loc,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

function downloadICS(event) {
  const ics = buildICS(event);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, "-")}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AddToCalendarMenu({ event, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 0 24px",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--carbon-700)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "24px 20px",
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: "var(--text-primary)" }}>
            Add to My Calendar
          </p>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {[
          {
            label: "Google Calendar",
            emoji: "📅",
            action: () => window.open(googleCalUrl(event), "_blank"),
          },
          {
            label: "Apple Calendar / Outlook",
            emoji: "🍎",
            action: () => downloadICS(event),
          },
          {
            label: "Download .ics File",
            emoji: "💾",
            action: () => downloadICS(event),
          },
        ].map(opt => (
          <button
            key={opt.label}
            onClick={() => { opt.action(); onClose(); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              width: "100%",
              padding: "16px 18px",
              marginBottom: 8,
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "left",
              minHeight: 52,
              transition: "background 0.15s",
            }}
          >
            <span style={{ fontSize: 22 }}>{opt.emoji}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
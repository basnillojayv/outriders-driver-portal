import React, { useState } from "react";
import { X, MapPin, Clock, Calendar, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";
import EventTypeBadge from "./EventTypeBadge";
import AddToCalendarMenu from "./AddToCalendarMenu";

function formatDate(dateStr) {
  try { return format(parseISO(dateStr), "EEEE, MMMM d, yyyy"); } catch { return dateStr; }
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm} CT`;
}

export default function EventDetailSheet({ event, onClose }) {
  const [showCalMenu, setShowCalMenu] = useState(false);
  if (!event) return null;

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 160,
          overflowY: "auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "20px 16px 40px",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "var(--carbon-800)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            width: "100%",
            maxWidth: 480,
            boxShadow: "0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
            marginTop: 8,
          }}
        >
          {/* Header */}
          <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, padding: 0 }}
            >
              ← Back to Events
            </button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, cursor: "pointer", color: "var(--text-muted)" }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: "16px 20px 24px" }}>
            <EventTypeBadge type={event.event_type} size="lg" />

            {event.image_url && (
              <img src={event.image_url} alt="" loading="lazy" style={{ width: "100%", borderRadius: 12, marginTop: 16, objectFit: "cover", maxHeight: 180 }} />
            )}

            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 22, color: "var(--text-primary)", marginTop: 14, marginBottom: 16, lineHeight: 1.2 }}>
              {event.title}
            </h2>

            {/* Chrome divider */}
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent)", marginBottom: 16 }} />

            {/* Meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-primary)", fontSize: 15 }}>
                <Calendar size={16} style={{ color: "var(--fuel-300)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{formatDate(event.date)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)", fontSize: 15 }}>
                <Clock size={16} style={{ color: "var(--fuel-300)", flexShrink: 0 }} />
                <span>{formatTime(event.time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ""}</span>
              </div>
              {(event.location || event.address) && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, color: "var(--text-secondary)", fontSize: 15 }}>
                  <MapPin size={16} style={{ color: "var(--fuel-300)", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    {event.location && <div style={{ fontWeight: 600 }}>{event.location}</div>}
                    {event.address && <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{event.address}</div>}
                  </div>
                </div>
              )}
            </div>

            {/* About */}
            <SectionLabel label="ABOUT" />
            <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>{event.description}</p>

            {/* How to join */}
            {(event.virtual_link || event.virtual_instructions) && (
              <>
                <SectionLabel label="HOW TO JOIN" />
                {event.virtual_instructions && (
                  <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 12 }}>{event.virtual_instructions}</p>
                )}
                {event.virtual_link && (
                  <a
                    href={event.virtual_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 18px",
                      borderRadius: 10,
                      background: "rgba(204,91,48,0.12)",
                      border: "1px solid rgba(204,91,48,0.3)",
                      color: "var(--fuel-300)",
                      fontFamily: "var(--font-heading)",
                      fontSize: 14,
                      fontWeight: 700,
                      textDecoration: "none",
                      marginBottom: 20,
                    }}
                  >
                    <ExternalLink size={15} /> Open Event Link
                  </a>
                )}
              </>
            )}

            {/* Notes */}
            {event.notes && (
              <>
                <SectionLabel label="NOTES" />
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>{event.notes}</p>
              </>
            )}

            {/* Recurring notice */}
            {event.is_recurring && (
              <div style={{ background: "rgba(138,138,138,0.1)", border: "1px solid rgba(138,138,138,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 20, color: "var(--text-secondary)", fontSize: 14 }}>
                🔁 This event repeats {event.recurrence_pattern || "regularly"}
                {event.recurrence_end_date ? ` until ${format(parseISO(event.recurrence_end_date), "MMM d, yyyy")}` : ""}
              </div>
            )}

            {/* Add to Calendar */}
            <button
              className="btn-primary"
              onClick={() => setShowCalMenu(true)}
            >
              <Calendar size={18} /> Add to My Calendar
            </button>
          </div>
        </div>
      </div>

      {showCalMenu && <AddToCalendarMenu event={event} onClose={() => setShowCalMenu(false)} />}
    </>
  );
}

function SectionLabel({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <span style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 800, letterSpacing: "1px", color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
    </div>
  );
}
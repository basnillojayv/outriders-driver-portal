import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Calendar, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { format, parseISO, isPast, isToday, isFuture } from "date-fns";
import EventTypeBadge from "@/components/events/EventTypeBadge";
import EventDetailSheet from "@/components/events/EventDetailSheet";
import AddToCalendarMenu from "@/components/events/AddToCalendarMenu";

function formatDate(dateStr) {
  try { return format(parseISO(dateStr), "EEE, MMM d, yyyy"); } catch { return dateStr; }
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm} CT`;
}

function isUpcoming(event) {
  try {
    const d = parseISO(event.date);
    return isFuture(d) || isToday(d);
  } catch { return false; }
}

export default function PrivateEventCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calEvent, setCalEvent] = useState(null);
  const [pastOpen, setPastOpen] = useState(false);

  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ["events-published"],
    queryFn: () => base44.entities.Event.filter({ status: "published" }, "date", 100),
  });

  const upcoming = allEvents.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date));
  const past = allEvents.filter(e => !isUpcoming(e)).sort((a, b) => b.date.localeCompare(a.date));
  const hero = upcoming[0] || null;

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 16 }}>
        <div className="progress-bar" style={{ width: 200 }}><div className="progress-fill" style={{ width: "60%" }} /></div>
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em" }}>LOADING EVENTS</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 16px 48px", maxWidth: 480, margin: "0 auto" }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 26, color: "var(--text-primary)", marginBottom: 6 }}>
          Private Event Calendar
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Exclusive events for LineHaul Station members</p>
      </div>

      {/* Hero — Next Event */}
      {hero ? (
        <div style={{
          background: "linear-gradient(135deg, var(--carbon-700), var(--carbon-800))",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 18,
          padding: "22px 20px",
          marginBottom: 20,
          boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Chrome shine */}
          <div className="chrome-shine" style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 18 }} />

          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 11, color: "var(--fuel-300)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
            ⭐ NEXT EVENT
          </p>

          <EventTypeBadge type={hero.event_type} />

          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 20, color: "var(--text-primary)", marginTop: 12, marginBottom: 4, lineHeight: 1.2 }}>
            {hero.title}
          </h2>
          <p style={{ color: "var(--fuel-300)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
            {formatDate(hero.date)}
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: hero.location ? 8 : 12 }}>
            {formatTime(hero.time)}
          </p>
          {hero.location && (
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 12 }}>
              🏢 {hero.location}
            </p>
          )}
          {hero.short_description && (
            <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
              {hero.short_description}
            </p>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn-primary"
              style={{ flex: 1, minHeight: 48, padding: "12px 16px", fontSize: 14 }}
              onClick={() => setCalEvent(hero)}
            >
              <Calendar size={16} /> Add to Calendar
            </button>
            <button
              onClick={() => setSelectedEvent(hero)}
              style={{
                flex: 1,
                minHeight: 48,
                padding: "12px 16px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-heading)",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              View Details
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          background: "var(--carbon-800)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: 28,
          textAlign: "center",
          marginBottom: 20,
        }}>
          <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>No upcoming events scheduled.</p>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Check back soon for member-exclusive events.</p>
        </div>
      )}

      {/* Upcoming events list */}
      {upcoming.length > 1 && (
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 13, color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
            UPCOMING EVENTS
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.slice(1).map(event => (
              <EventCard
                key={event.id}
                event={event}
                onDetails={() => setSelectedEvent(event)}
                onCalendar={() => setCalEvent(event)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past events (collapsed) */}
      {past.length > 0 && (
        <div>
          <button
            onClick={() => setPastOpen(!pastOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "14px 0",
              background: "none",
              border: "none",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-heading)",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            PAST EVENTS ({past.length})
            {pastOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {pastOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              {past.map(event => (
                <EventCard key={event.id} event={event} muted onDetails={() => setSelectedEvent(event)} />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedEvent && <EventDetailSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {calEvent && <AddToCalendarMenu event={calEvent} onClose={() => setCalEvent(null)} />}
    </div>
  );
}

function EventCard({ event, onDetails, onCalendar, muted = false }) {
  return (
    <div
      style={{
        background: muted ? "rgba(255,255,255,0.02)" : "var(--carbon-800)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "16px 18px",
        opacity: muted ? 0.55 : 1,
        boxShadow: muted ? "none" : "0 2px 8px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <EventTypeBadge type={event.event_type} />
      </div>
      <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: "var(--text-primary)", marginBottom: 4, lineHeight: 1.25 }}>
        {event.title}
      </h3>
      <p style={{ color: "var(--fuel-300)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, marginBottom: 1 }}>
        {formatDate(event.date)}
      </p>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: event.location ? 4 : 8 }}>
        {formatTime(event.time)}
      </p>
      {event.location && (
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 8 }}>📍 {event.location}</p>
      )}
      {event.short_description && (
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5, marginBottom: 12 }}>
          {event.short_description}
        </p>
      )}
      {!muted && (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onCalendar}
            style={{
              flex: 1, minHeight: 44, padding: "10px 12px", borderRadius: 10,
              background: "linear-gradient(135deg, #e8a14b, #cc5b30)",
              border: "none", color: "#fff",
              fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 800,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              boxShadow: "0 3px 12px rgba(204,91,48,0.3)",
            }}
          >
            <Calendar size={14} /> Add to Calendar
          </button>
          <button
            onClick={onDetails}
            style={{
              flex: 1, minHeight: 44, padding: "10px 12px", borderRadius: 10,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Details
          </button>
        </div>
      )}
    </div>
  );
}
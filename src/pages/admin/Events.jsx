import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Edit2, Trash2, Copy, Eye, EyeOff, X, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import EventTypeBadge from "@/components/events/EventTypeBadge";

const EMPTY_FORM = {
  title: "", date: "", time: "14:00", timezone: "America/Chicago", end_time: "",
  event_type: "in_person", description: "", short_description: "",
  location: "", address: "", virtual_link: "", virtual_instructions: "",
  notes: "", is_recurring: false, recurrence_pattern: "", recurrence_end_date: "",
  status: "published", image_url: "",
};

export default function Events() {
  const qc = useQueryClient();
  const [form, setForm] = useState(null); // null = closed, {} = new/edit
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState("all");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: () => base44.entities.Event.list("date", 200),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) return base44.entities.Event.update(data.id, data);
      return base44.entities.Event.create(data);
    },
    onSuccess: () => { qc.invalidateQueries(["admin-events"]); setForm(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Event.delete(id),
    onSuccess: () => { qc.invalidateQueries(["admin-events"]); setDeleteId(null); },
  });

  const toggleStatus = (event) => {
    base44.entities.Event.update(event.id, { status: event.status === "published" ? "draft" : "published" })
      .then(() => qc.invalidateQueries(["admin-events"]));
  };

  const duplicate = (event) => {
    const { id, created_date, updated_date, ...rest } = event;
    setForm({ ...rest, title: `${rest.title} (Copy)`, status: "draft" });
  };

  const filtered = events.filter(e => filter === "all" ? true : e.event_type === filter || e.status === filter);

  return (
    <div style={{ padding: "24px 24px 48px", maxWidth: 960, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 22, color: "var(--text-primary)" }}>Events</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>Manage member events</p>
        </div>
        <button
          onClick={() => setForm({ ...EMPTY_FORM })}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10,
            background: "linear-gradient(135deg, #e8a14b, #cc5b30)", border: "none", color: "#fff",
            fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 800, cursor: "pointer",
            boxShadow: "0 3px 14px rgba(204,91,48,0.35)", minHeight: 44,
          }}
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {[
          { val: "all", label: "All" },
          { val: "published", label: "Published" },
          { val: "draft", label: "Drafts" },
          { val: "in_person", label: "In-Person" },
          { val: "virtual", label: "Virtual" },
          { val: "milestone", label: "Milestone" },
        ].map(f => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val)}
            style={{
              padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700,
              fontFamily: "var(--font-heading)", cursor: "pointer",
              background: filter === f.val ? "rgba(204,91,48,0.18)" : "rgba(255,255,255,0.04)",
              border: filter === f.val ? "1px solid var(--fuel-500)" : "1px solid rgba(255,255,255,0.08)",
              color: filter === f.val ? "var(--fuel-300)" : "var(--text-secondary)",
              transition: "all 0.15s",
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Loader2 size={28} style={{ color: "var(--fuel-500)", animation: "spin 1s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>
          No events found.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.sort((a, b) => a.date?.localeCompare(b.date)).map(event => (
            <div
              key={event.id}
              style={{
                background: "var(--carbon-800)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                opacity: event.status === "draft" ? 0.65 : 1,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <EventTypeBadge type={event.event_type} />
                  {event.status === "draft" && (
                    <span style={{ fontSize: 10, fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>DRAFT</span>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, color: "var(--text-primary)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {event.title}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
                  {event.date ? format(parseISO(event.date), "MMM d, yyyy") : "No date"} {event.time ? `· ${event.time}` : ""} · {event.location || "No location"}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <ActionBtn icon={event.status === "published" ? EyeOff : Eye} title={event.status === "published" ? "Unpublish" : "Publish"} onClick={() => toggleStatus(event)} color="var(--text-secondary)" />
                <ActionBtn icon={Copy} title="Duplicate" onClick={() => duplicate(event)} color="var(--text-secondary)" />
                <ActionBtn icon={Edit2} title="Edit" onClick={() => setForm({ ...event })} color="var(--fuel-300)" />
                <ActionBtn icon={Trash2} title="Delete" onClick={() => setDeleteId(event.id)} color="#c0392b" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Form Modal */}
      {form && (
        <EventFormModal
          form={form}
          setForm={setForm}
          onSave={() => saveMutation.mutate(form)}
          saving={saveMutation.isPending}
          onClose={() => setForm(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "var(--carbon-700)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "28px 24px", maxWidth: 380, width: "100%", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "var(--text-primary)", marginBottom: 10 }}>Delete this event?</p>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteId)} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#c0392b", border: "none", color: "#fff", fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon: Icon, title, onClick, color }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        color, cursor: "pointer", transition: "background 0.15s",
      }}
    >
      <Icon size={15} />
    </button>
  );
}

function EventFormModal({ form, setForm, onSave, saving, onClose }) {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 16px 40px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--carbon-800)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, width: "100%", maxWidth: 600, boxShadow: "0 8px 40px rgba(0,0,0,0.7)", marginTop: 8 }}>
        <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 18, color: "var(--text-primary)" }}>
            {form.id ? "Edit Event" : "New Event"}
          </h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "20px 24px", display: "grid", gap: 16 }}>
          <Field label="Event Title *">
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Driver Appreciation Day" style={inputStyle} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Date *">
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Event Type *">
              <select value={form.event_type} onChange={e => set("event_type", e.target.value)} style={inputStyle}>
                <option value="in_person">🏢 In-Person</option>
                <option value="virtual">📺 Virtual</option>
                <option value="fb_live">📱 FB Live</option>
                <option value="recurring">🔁 Recurring</option>
                <option value="milestone">🏆 Milestone</option>
              </select>
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Start Time *">
              <input type="time" value={form.time} onChange={e => set("time", e.target.value)} style={inputStyle} />
            </Field>
            <Field label="End Time">
              <input type="time" value={form.end_time} onChange={e => set("end_time", e.target.value)} style={inputStyle} />
            </Field>
          </div>

          <Field label="Location Name">
            <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="West Memphis Launch Hub" style={inputStyle} />
          </Field>

          <Field label="Address">
            <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="1212 MLK Dr, West Memphis, AR" style={inputStyle} />
          </Field>

          <Field label="Virtual Link (Zoom/Meet/FB)">
            <input value={form.virtual_link} onChange={e => set("virtual_link", e.target.value)} placeholder="https://..." style={inputStyle} />
          </Field>

          <Field label="Short Description (list preview)">
            <input value={form.short_description} onChange={e => set("short_description", e.target.value)} placeholder="1-2 line summary" style={inputStyle} />
          </Field>

          <Field label="Full Description *">
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} placeholder="Event details..." style={{ ...inputStyle, resize: "vertical" }} />
          </Field>

          <Field label="Virtual Join Instructions">
            <textarea value={form.virtual_instructions} onChange={e => set("virtual_instructions", e.target.value)} rows={2} placeholder="How to join virtually..." style={{ ...inputStyle, resize: "vertical" }} />
          </Field>

          <Field label="Notes">
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} placeholder="Additional info..." style={{ ...inputStyle, resize: "vertical" }} />
          </Field>

          {/* Recurring */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input type="checkbox" id="isrec" checked={form.is_recurring} onChange={e => set("is_recurring", e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--fuel-500)" }} />
            <label htmlFor="isrec" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: "var(--text-secondary)", cursor: "pointer" }}>Recurring event</label>
          </div>

          {form.is_recurring && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Pattern">
                <select value={form.recurrence_pattern} onChange={e => set("recurrence_pattern", e.target.value)} style={inputStyle}>
                  <option value="">Select…</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </Field>
              <Field label="End Date">
                <input type="date" value={form.recurrence_end_date} onChange={e => set("recurrence_end_date", e.target.value)} style={inputStyle} />
              </Field>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Status *">
              <select value={form.status} onChange={e => set("status", e.target.value)} style={inputStyle}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
            <Field label="Image URL">
              <input value={form.image_url} onChange={e => set("image_url", e.target.value)} placeholder="https://..." style={inputStyle} />
            </Field>
          </div>

          {/* Save / Cancel */}
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "14px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving || !form.title || !form.date || !form.time || !form.description}
              style={{
                flex: 2, padding: "14px", borderRadius: 12, border: "none", color: "#fff",
                background: "linear-gradient(135deg, #e8a14b, #cc5b30)",
                fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 900,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
                boxShadow: "0 4px 16px rgba(204,91,48,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {saving ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : (form.id ? "Save Changes" : "Create Event")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  background: "var(--carbon-900)", border: "1.5px solid var(--carbon-500)",
  color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: 15,
  outline: "none", boxSizing: "border-box",
};
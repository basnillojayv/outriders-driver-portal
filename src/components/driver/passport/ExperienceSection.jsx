/**
 * ExperienceSection — resume-style work experience form.
 * Renders an editable list of experience entries (title, company, location,
 * dates, current-role flag, description) with add/remove controls.
 */
import React from "react";
import { Plus, Trash2, Briefcase } from "lucide-react";
import PassportSection from "@/components/driver/passport/PassportSection";
import { T, btnSecondary } from "@/components/driver/v3/v3tokens";

function FieldLabel({ children }) {
  return (
    <label style={{
      fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
      color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase",
      display: "block", marginBottom: 6,
    }}>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", background: T.cardAlt, color: T.textPrimary,
  border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
  padding: "12px 14px", fontSize: 14, fontFamily: "var(--font-body)",
};

function newEntry() {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    current: false,
    description: "",
  };
}

export default function ExperienceSection({ experiences, setExperiences, page }) {
  const update = (id, patch) =>
    setExperiences(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
  const add = () => setExperiences(prev => [...prev, newEntry()]);
  const remove = (id) => setExperiences(prev => prev.filter(e => e.id !== id));

  return (
    <PassportSection icon={Briefcase} title="Career Summary" page={page}>
      <div className="space-y-4">
        {experiences.length === 0 && (
          <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>
            Add your work history — carriers you've driven for, roles held, and what you did.
          </p>
        )}

        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            style={{
              background: T.cardAlt,
              border: `1px solid ${T.borderAlt}`,
              borderRadius: T.radiusSm,
              padding: 16,
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <span style={{
                fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700,
                color: T.textMuted, letterSpacing: "0.22em", textTransform: "uppercase",
              }}>
                Entry {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(exp.id)}
                aria-label="Remove entry"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 30, height: 30, borderRadius: 8,
                  background: "transparent", border: `1px solid ${T.border}`,
                  color: T.textMuted, cursor: "pointer",
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <FieldLabel>Job Title</FieldLabel>
                <input
                  style={inputStyle}
                  value={exp.title}
                  onChange={e => update(exp.id, { title: e.target.value })}
                  placeholder="e.g. Owner-Operator, OTR Driver"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Company / Carrier</FieldLabel>
                  <input
                    style={inputStyle}
                    value={exp.company}
                    onChange={e => update(exp.id, { company: e.target.value })}
                    placeholder="Carrier or company"
                  />
                </div>
                <div>
                  <FieldLabel>Location</FieldLabel>
                  <input
                    style={inputStyle}
                    value={exp.location}
                    onChange={e => update(exp.id, { location: e.target.value })}
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Start Date</FieldLabel>
                  <input
                    type="date"
                    style={inputStyle}
                    value={exp.start_date}
                    onChange={e => update(exp.id, { start_date: e.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel>End Date</FieldLabel>
                  <input
                    type="date"
                    style={inputStyle}
                    value={exp.end_date}
                    disabled={exp.current}
                    onChange={e => update(exp.id, { end_date: e.target.value })}
                    placeholder={exp.current ? "Present" : ""}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={e => update(exp.id, { current: e.target.checked, end_date: e.target.checked ? "" : exp.end_date })}
                  style={{ accentColor: T.orange, width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: T.textSecondary }}>I currently work here</span>
              </label>

              <div>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                  value={exp.description}
                  onChange={e => update(exp.id, { description: e.target.value })}
                  placeholder="Routes, freight, equipment, accomplishments…"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          style={{ ...btnSecondary, width: "100%" }}
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>
    </PassportSection>
  );
}
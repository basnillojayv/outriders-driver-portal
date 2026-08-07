/**
 * ReferencesSection — resume-style professional references form.
 * Captures name, company, email, phone, and relationship (dropdown with
 * an "Other" option that reveals a free-text input).
 */
import React from "react";
import { Plus, Trash2, Users } from "lucide-react";
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

const RELATIONSHIPS = ["Carrier", "Broker", "Co-worker", "Supervisor", "Other"];

function newEntry() {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: "",
    company: "",
    email: "",
    phone: "",
    relationship: "",
    relationship_other: "",
  };
}

export default function ReferencesSection({ references, setReferences, page }) {
  const update = (id, patch) =>
    setReferences(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
  const add = () => setReferences(prev => [...prev, newEntry()]);
  const remove = (id) => setReferences(prev => prev.filter(r => r.id !== id));

  return (
    <PassportSection icon={Users} title="References" page={page}>
      <div className="space-y-4">
        {references.length === 0 && (
          <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>
            Add professional references — carriers, brokers, or supervisors who can vouch for your work.
          </p>
        )}

        {references.map((ref, idx) => {
          const showOther = ref.relationship === "Other";
          return (
            <div
              key={ref.id}
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
                  Reference {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(ref.id)}
                  aria-label="Remove reference"
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
                  <FieldLabel>Name</FieldLabel>
                  <input
                    style={inputStyle}
                    value={ref.name}
                    onChange={e => update(ref.id, { name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <FieldLabel>Company</FieldLabel>
                  <input
                    style={inputStyle}
                    value={ref.company}
                    onChange={e => update(ref.id, { company: e.target.value })}
                    placeholder="Company or carrier"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <input
                      type="email"
                      style={inputStyle}
                      value={ref.email}
                      onChange={e => update(ref.id, { email: e.target.value })}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <FieldLabel>Phone</FieldLabel>
                    <input
                      type="tel"
                      style={inputStyle}
                      value={ref.phone}
                      onChange={e => update(ref.id, { phone: e.target.value })}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Relationship</FieldLabel>
                  <select
                    style={inputStyle}
                    value={ref.relationship}
                    onChange={e => update(ref.id, {
                      relationship: e.target.value,
                      relationship_other: e.target.value === "Other" ? ref.relationship_other : "",
                    })}
                  >
                    <option value="">Select relationship…</option>
                    {RELATIONSHIPS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {showOther && (
                  <div>
                    <FieldLabel>Specify Relationship</FieldLabel>
                    <input
                      style={inputStyle}
                      value={ref.relationship_other}
                      onChange={e => update(ref.id, { relationship_other: e.target.value })}
                      placeholder="Describe the relationship"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={add}
          style={{ ...btnSecondary, width: "100%" }}
        >
          <Plus size={16} />
          Add Reference
        </button>
      </div>
    </PassportSection>
  );
}
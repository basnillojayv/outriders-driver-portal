import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { OH, IMG, LIFE_SITUATIONS, REGIONS } from "./ohConstants";

const inputSt = {
  width: "100%", padding: "14px 16px", borderRadius: 10,
  background: OH.bg, border: `1.5px solid ${OH.border}`,
  color: OH.text, fontSize: 16, outline: "none",
  boxSizing: "border-box", fontFamily: "var(--font-body)",
};

const labelSt = {
  fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
  color: OH.textSec, letterSpacing: "0.8px", textTransform: "uppercase",
  display: "block", marginBottom: 6,
};

export default function WaitlistForm({ user, isPortal = false }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [firstName, setFirstName] = useState(user?.full_name?.split(" ")[0] || "");

  const [form, setForm] = useState({
    first_name:        user?.full_name?.split(" ")[0] || "",
    last_name:         user?.full_name?.split(" ").slice(1).join(" ") || "",
    email:             user?.email || "",
    phone:             user?.phone || "",
    location:          "",
    life_situation:    "",
    driver_type:       "",
    preferred_hub:     "",
    interest_level:    "",
    interested_region: "",
    ran_calculator:    false,
    notes:             "",
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.life_situation) e.life_situation = "Required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await base44.entities.OneHomeWaitlist.create({
        first_name:         form.first_name.trim(),
        last_name:          form.last_name.trim(),
        email:              form.email.trim(),
        phone:              form.phone.trim(),
        location:           form.location.trim(),
        life_situation:     form.life_situation,
        driver_type:        form.driver_type || null,
        preferred_hub:      form.preferred_hub || null,
        interest_level:     form.interest_level || null,
        interested_region:  form.interested_region,
        ran_calculator:     form.ran_calculator,
        notes:              form.notes.trim(),
        source:             "onehome_landing",
        is_existing_member: !!user,
        existing_user_id:   user?.id || null,
        tags:               JSON.stringify(user ? ["onehome_lead", "app_user"] : ["onehome_lead", "public_lead"]),
      });
      setFirstName(form.first_name);
      setSubmitted(true);
    } catch (_) {}
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 26, color: OH.text, marginBottom: 12, lineHeight: 1.2 }}>
          YOU'RE ON THE LIST,<br />
          <span style={{ color: OH.accent }}>{firstName.toUpperCase()}!</span>
        </h2>
        <p style={{ color: OH.textSec, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
          We'll keep you updated on OneHome availability. West Memphis — occupancy June 2026.
        </p>
        {user || isPortal ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link to="/onehome" style={{
              display: "block", textAlign: "center", padding: "16px",
              borderRadius: 12, background: `linear-gradient(135deg, ${OH.accentLight}, ${OH.accent})`,
              color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 15, textDecoration: "none",
            }}>
              Run the Lifestyle Calculator →
            </Link>
            {isPortal && (
              <Link to="/" style={{
                display: "block", textAlign: "center", padding: "14px",
                borderRadius: 12, border: `1px solid ${OH.border}`,
                color: OH.textSec, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, textDecoration: "none",
              }}>
                Back to Dashboard →
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ color: OH.textSec, fontSize: 14, lineHeight: 1.7, marginBottom: 4 }}>
              OneHome is part of the LineHaul Station network. Join the Outriders Drivers Club to get into the app:
            </p>
            <Link to="/join/outriders" style={{
              display: "block", textAlign: "center", padding: "16px",
              borderRadius: 12, background: `linear-gradient(135deg, #e8a14b, #cc5b30)`,
              color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 15, textDecoration: "none",
            }}>
              Join Outriders — It's Free
            </Link>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); base44.auth.redirectToLogin("/join/onehome"); }}
              style={{
                display: "block", textAlign: "center", padding: "14px",
                borderRadius: 12, border: `1px solid ${OH.border}`,
                color: OH.textSec, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, textDecoration: "none",
              }}
            >
              Already a member? Log In
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <img
        src={`${IMG}ONEHOME-LOGO-text.png`} alt="OneHome"
        style={{ height: 28, marginBottom: 20, display: "block" }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 26, color: OH.text, marginBottom: 10, lineHeight: 1.2 }}>
        JOIN THE INTEREST LIST
      </h2>
      <p style={{ color: OH.textSec, fontSize: 15, lineHeight: 1.6, marginBottom: 12 }}>
        We need your help. OneHome is targeting multiple markets across the country and we are prioritizing locations based on driver demand. It's not only your chance to have a voice on where we should build, but also an opportunity to get on the list early. We're listening…. and you'll be contacted as markets are selected — based on your location, your interest level, and your position on the interest list.
      </p>
      <p style={{ color: OH.textSec, fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
        This is not a generic email signup. This is a member driven expansion program that will radically improve how truck drivers experience life.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {user ? (
          <div style={{ padding: "16px", background: `rgba(238,117,44,0.08)`, border: `1px solid ${OH.borderAcc}`, borderRadius: 12 }}>
            <p style={{ color: OH.text, fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
              {form.first_name} {form.last_name}
            </p>
            <p style={{ color: OH.textSec, fontSize: 14 }}>{form.email}{form.phone ? ` · ${form.phone}` : ""}</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelSt}>First Name <span style={{ color: OH.accent }}>*</span></label>
                <input value={form.first_name} onChange={set("first_name")} placeholder="First" style={{ ...inputSt, ...(errors.first_name ? { borderColor: "#d94040" } : {}) }} />
                {errors.first_name && <p style={{ color: "#d94040", fontSize: 12, marginTop: 4 }}>{errors.first_name}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelSt}>Last Name <span style={{ color: OH.accent }}>*</span></label>
                <input value={form.last_name} onChange={set("last_name")} placeholder="Last" style={{ ...inputSt, ...(errors.last_name ? { borderColor: "#d94040" } : {}) }} />
                {errors.last_name && <p style={{ color: "#d94040", fontSize: 12, marginTop: 4 }}>{errors.last_name}</p>}
              </div>
            </div>
            <div>
              <label style={labelSt}>Email <span style={{ color: OH.accent }}>*</span></label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" style={{ ...inputSt, ...(errors.email ? { borderColor: "#d94040" } : {}) }} />
              {errors.email && <p style={{ color: "#d94040", fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
            </div>
            <div>
              <label style={labelSt}>Phone <span style={{ color: OH.accent }}>*</span></label>
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder="Mobile number" style={{ ...inputSt, ...(errors.phone ? { borderColor: "#d94040" } : {}) }} />
              {errors.phone && <p style={{ color: "#d94040", fontSize: 12, marginTop: 4 }}>{errors.phone}</p>}
            </div>
            <div>
              <label style={labelSt}>Current Location</label>
              <input value={form.location} onChange={set("location")} placeholder="City, State" style={inputSt} />
            </div>
          </>
        )}

        <div>
          <label style={labelSt}>Life Situation <span style={{ color: OH.accent }}>*</span></label>
          <select value={form.life_situation} onChange={set("life_situation")} style={{ ...inputSt, ...(errors.life_situation ? { borderColor: "#d94040" } : {}) }}>
            <option value="">Select…</option>
            {LIFE_SITUATIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {errors.life_situation && <p style={{ color: "#d94040", fontSize: 12, marginTop: 4 }}>{errors.life_situation}</p>}
        </div>
        <div>
          <label style={labelSt}>Driver Type</label>
          <select value={form.driver_type} onChange={set("driver_type")} style={inputSt}>
            <option value="">Select…</option>
            <option value="company_driver">Company Driver</option>
            <option value="owner_operator">Owner-Operator</option>
            <option value="small_carrier">Small Carrier</option>
          </select>
        </div>
        <div>
          <label style={labelSt}>Preferred Home Hub</label>
          <select value={form.preferred_hub} onChange={set("preferred_hub")} style={inputSt}>
            <option value="">Select a city…</option>
            <option value="dallas_fw">Dallas/FW</option>
            <option value="houston">Houston</option>
            <option value="san_antonio">San Antonio</option>
            <option value="indianapolis">Indianapolis</option>
            <option value="atlanta">Atlanta</option>
            <option value="phoenix">Phoenix</option>
            <option value="chicago">Chicago</option>
            <option value="carlisle_pa">Carlisle, PA</option>
            <option value="minneapolis">Minneapolis</option>
            <option value="kansas_city">Kansas City</option>
            <option value="las_vegas">Las Vegas</option>
            <option value="salt_lake_city">Salt Lake City</option>
            <option value="nashville">Nashville</option>
            <option value="charlotte">Charlotte</option>
            <option value="tampa">Tampa</option>
            <option value="other">Other (please comment below)</option>
          </select>
        </div>
        <div>
          <label style={labelSt}>Interest Level</label>
          <select value={form.interest_level} onChange={set("interest_level")} style={inputSt}>
            <option value="">Select…</option>
            <option value="learning">Just Learning About OneHome</option>
            <option value="ready">I Love It… and Ready to get Started!</option>
          </select>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.ran_calculator}
            onChange={(e) => setForm((p) => ({ ...p, ran_calculator: e.target.checked }))}
            style={{ accentColor: OH.accent, width: 16, height: 16 }}
          />
          <span style={{ color: OH.textSec, fontSize: 14 }}>I've run the Lifestyle Calculator</span>
        </label>
        <div>
          <label style={labelSt}>Notes</label>
          <textarea
            value={form.notes}
            onChange={set("notes")}
            placeholder="Anything else you'd like us to know…"
            rows={3}
            style={{ ...inputSt, resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%", padding: "18px 24px", borderRadius: 12,
            background: `linear-gradient(135deg, ${OH.accentLight}, ${OH.accent})`,
            border: "none", color: "#fff",
            fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 16,
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.6 : 1,
            boxShadow: "0 4px 20px rgba(238,117,44,0.35)",
            marginTop: 8,
          }}
        >
          {submitting ? "Submitting…" : "JOIN THE INTEREST LIST"}
        </button>
      </form>
    </>
  );
}
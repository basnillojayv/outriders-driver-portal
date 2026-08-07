import React, { useState } from "react";
import { base44 } from "@/api/base44Client";

const OH = {
  accent: "#ee752c",
  accentLight: "#f59b5e",
  border: "#3d1f14",
  text: "#f0eeec",
  textSec: "#a09088",
};

const inputSt = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 10,
  background: "rgba(0,0,0,0.55)",
  border: `1.5px solid ${OH.border}`,
  color: OH.text,
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "var(--font-body)",
};

const labelSt = {
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: 13,
  color: OH.textSec,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  display: "block",
  marginBottom: 6,
};

export default function PublicWaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    location: "",
    company: "",
    driver_type: "",
    preferred_hub: "",
    interest_level: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.phone || !form.email || !form.location) return;

    setSubmitting(true);
    try {
      await base44.entities.OneHomePublicWaitlist.create({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        company: form.company || null,
        driver_type: form.driver_type || null,
        preferred_hub: form.preferred_hub || null,
        interest_level: form.interest_level || null,
        notes: form.notes || null,
        source: "onehome_public_landing",
        tags: JSON.stringify(["onehome_public_waitlist"]),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Form submission error:", err);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3 style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 900,
          fontSize: 24,
          color: "#fff",
          marginBottom: 12,
          textShadow: "0 2px 6px rgba(0,0,0,0.5)",
        }}>
          YOU'RE ON THE LIST
        </h3>
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 14,
          lineHeight: 1.7,
          marginBottom: 24,
        }}>
          Thank you for joining the OneHome Waiting List. We'll keep you updated as OneHome launches in new markets — you'll hear from us based on your location and position on the list.
        </p>

        <div style={{
          padding: "20px",
          background: "rgba(238,117,44,0.1)",
          border: `1px solid ${OH.border}`,
          borderRadius: 14,
          marginBottom: 20,
        }}>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: 16,
            color: OH.accentLight,
            marginBottom: 8,
          }}>
            One more thing — let's get you into the club.
          </p>
          <p style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 14,
            lineHeight: 1.6,
          }}>
            To participate in OneHome, you'll need to be a member of the Outriders Driver Club — LineHaul Station's private driver network. Membership is free to join.
          </p>
        </div>

        <a
          href="/join/outriders"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: `linear-gradient(135deg, ${OH.accentLight}, ${OH.accent})`,
            color: "#fff",
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: 15,
            padding: "16px 32px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            textDecoration: "none",
            boxShadow: `0 4px 20px rgba(238,117,44,0.35)`,
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.background = `linear-gradient(135deg, #efa55a, #b84a28)`;
            e.target.style.boxShadow = `0 6px 28px rgba(238,117,44,0.55)`;
          }}
          onMouseOut={(e) => {
            e.target.style.background = `linear-gradient(135deg, ${OH.accentLight}, ${OH.accent})`;
            e.target.style.boxShadow = `0 4px 20px rgba(238,117,44,0.35)`;
          }}
        >
          Join the Outriders Driver Club →
        </a>
      </div>
    );
  }

  return (
    <>
      <img
        src="https://raw.githubusercontent.com/LineHaulStation/app/main/images/ONEHOME-LOGO-main.png"
        alt="OneHome"
        style={{ width: "100%", maxWidth: 200, margin: "0 auto 16px", display: "block" }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
      <h3 style={{
        fontFamily: "var(--font-heading)",
        fontWeight: 900,
        fontSize: 24,
        color: "#fff",
        marginBottom: 12,
        textShadow: "0 2px 6px rgba(0,0,0,0.5)",
      }}>
        JOIN THE ONEHOME WAITING LIST
      </h3>
      <p style={{
        color: "rgba(255,255,255,0.85)",
        fontSize: 14,
        lineHeight: 1.7,
        marginBottom: 12,
      }}>
        We need your help. OneHome is targeting multiple markets across the country and we are prioritizing locations based on driver demand. It's not only your chance to have a voice on where we should build, but also an opportunity to get on the list early. We're listening…. and you'll be contacted as markets are selected — based on your location, your interest level, and your position on the interest list.
      </p>
      <p style={{
        color: "rgba(255,255,255,0.85)",
        fontSize: 14,
        lineHeight: 1.7,
        marginBottom: 24,
      }}>
        This is not a generic email signup. This is a member driven expansion program that will radically improve how truck drivers experience life.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelSt}>First Name <span style={{ color: OH.accentLight }}>*</span></label>
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
              style={inputSt}
              required
            />
          </div>
          <div>
            <label style={labelSt}>Last Name <span style={{ color: OH.accentLight }}>*</span></label>
            <input
              type="text"
              value={form.last_name}
              onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
              style={inputSt}
              required
            />
          </div>
        </div>

        <div>
          <label style={labelSt}>Email <span style={{ color: OH.accentLight }}>*</span></label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            style={inputSt}
            required
          />
        </div>

        <div>
          <label style={labelSt}>Phone <span style={{ color: OH.accentLight }}>*</span></label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            style={inputSt}
            required
          />
        </div>

        <div>
          <label style={labelSt}>Home Base / City / Region <span style={{ color: OH.accentLight }}>*</span></label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            placeholder="e.g., Memphis, TN"
            style={inputSt}
            required
          />
        </div>

        <div>
          <label style={labelSt}>Company</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
            style={inputSt}
          />
        </div>

        <div>
          <label style={labelSt}>Driver Type</label>
          <select
            value={form.driver_type}
            onChange={(e) => setForm((p) => ({ ...p, driver_type: e.target.value }))}
            style={inputSt}
          >
            <option value="">Select…</option>
            <option value="company_driver">Company Driver</option>
            <option value="owner_operator">Owner-Operator</option>
            <option value="small_carrier">Small Carrier</option>
          </select>
        </div>

        <div>
          <label style={labelSt}>Preferred Home Hub</label>
          <select
            value={form.preferred_hub}
            onChange={(e) => setForm((p) => ({ ...p, preferred_hub: e.target.value }))}
            style={inputSt}
          >
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
          <select
            value={form.interest_level}
            onChange={(e) => setForm((p) => ({ ...p, interest_level: e.target.value }))}
            style={inputSt}
          >
            <option value="">Select…</option>
            <option value="learning">Just Learning About OneHome</option>
            <option value="ready">I Love It… and Ready to get Started!</option>
          </select>
        </div>

        <div>
          <label style={labelSt}>Notes / Comments</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Anything you'd like us to know…"
            rows={3}
            style={{ ...inputSt, resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !form.first_name || !form.last_name || !form.email || !form.phone || !form.location}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${OH.accentLight}, ${OH.accent})`,
            border: "none",
            color: "#fff",
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: 15,
            cursor: submitting || !form.first_name || !form.last_name || !form.email || !form.phone || !form.location ? "not-allowed" : "pointer",
            opacity: submitting || !form.first_name || !form.last_name || !form.email || !form.phone || !form.location ? 0.5 : 1,
            boxShadow: "0 4px 20px rgba(238,117,44,0.35)",
            transition: "all 0.2s",
          }}
        >
          {submitting ? "Submitting…" : "JOIN THE INTEREST LIST"}
        </button>
      </form>
    </>
  );
}
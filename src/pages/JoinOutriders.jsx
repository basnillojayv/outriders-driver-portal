import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const GITHUB = "https://raw.githubusercontent.com/LineHaulStation/app/main/images";
const VIDEO_URL = "https://raw.githubusercontent.com/LineHaulStation/app/main/video/Outriders_BG_Lowres.mp4";

// Outriders copper palette
const C = {
  dark:   "#1a0f08",
  base:   "#2a1a0e",
  mid:    "#3d2414",
  border: "#5c3518",
  glow:   "#cc5b30",
};

const VALUE_CARDS = [
  {
    img: `${GITHUB}/Outriders-BG-checkup.jpg`,
    headline: "AN UNMATCHED\nEXPERIENCE",
    body: "Leave isolation in the dust and come join the country's best pro drivers that share the passion for keeping America running.",
    cta: "DISCOVER YOUR GREATNESS",
  },
  {
    img: `${GITHUB}/Outriders-BG-handshake.jpg`,
    headline: "BUILD REWARDING\nFRIENDSHIPS",
    body: "Outriders makes it easy! You'll create remarkable connections with fellow drivers who understand the challenges and adventures on the road.",
    cta: "SEE HOW OUTRIDERS HELPS",
  },
  {
    img: `${GITHUB}/Outriders-BG-thumbsup.jpg`,
    headline: "DARE TO BE\nBETTER",
    body: "Learn more, gain respect and spread your wings. Discover ways to boost your career to new heights.",
    cta: "EXPLORE THE BENEFITS",
  },
];

const GALLERY_IMGS = [
  "lifestyle-entrance.png",
  "lifestyle-memphis-skyline1.png",
  "lifestyle-dinner1.png",
  "lifestyle-dinner2.png",
  "lifestyle-skydeck1.png",
  "lifestyle-skydeck2.png",
  "lifestyle-gym.png",
  "lifestyle-billiards.png",
  "lifestyle-relax1.png",
  "lifestyle-relax2.png",
  "lifestyle-dog-park1.png",
  "lifestyle-dog-park2.png",
  "lifestyle-truck-wash.png",
  "lifestyle-laundry.png",
  "lifestyle-gear-shop.png",
].map((f) => `https://raw.githubusercontent.com/LineHaulStation/app/main/images/${f}`);

const FAQS = [
  {
    q: "What is LineHaul Station?",
    a: "LineHaul Station is a planned network of private, member-only truck terminals offering secure parking, trailer drop, and top-tier driver amenities. Our goal is to improve trucking efficiency, safety, and community across the country.",
  },
  {
    q: "Where is the first LineHaul Station?",
    a: "Our first terminal opens in West Memphis, AR, with future locations planned along all the major freight lanes, eventually creating a network of over 50 flex-space terminals.",
  },
  {
    q: "What is the Outriders Club?",
    a: "The Outriders Club is both a physical drivers' club at LineHaul Station and an exclusive membership. Members enjoy on-site amenities like a restaurant, fitness center, showers, gaming, and outdoor patios. Pre-launch, drivers have full access to our driver app, apparel shop, exclusive discount codes, and special events with opportunities to connect, learn, and support fellow truckers.",
  },
  {
    q: "Why should I join The Outriders?",
    a: "Apart from joining a supportive community and gaining access to industry tools, your membership sends a major signal to carriers and brokers that you support the shared-use facilities we're building. It shows the industry you care about safer, better-equipped terminals and stronger trucking networks.",
  },
  {
    q: "How much does my membership cost?",
    a: "Driver memberships are completely free. Proprietary space memberships are typically purchased by carriers and brokers and then distributed to their drivers. Through Outriders, you can connect your current carrier to the program — but the best part of membership is access to the list of carriers and brokers who provide spaces to their drivers. This is your shortcut to finding a great carrier who recognizes your value and gives you this valuable perk.",
  },
  {
    q: "What do you do with my information?",
    a: "Your membership is always private. LineHaul Station never shares, sells, or gives your information to any third party. The only way your info is used is for your access to the exclusive Outriders Club and for opportunities you choose — like referring other drivers, sharing your driver profile with carriers you authorize, and participating in community interactions with other members. It's a truly private, drivers-only club. Your information is secure, confidential, and fully under your control.",
  },
];

const MEMBER_TYPES = [
  "Company Driver",
  "Owner Operator",
  "For-Hire Carrier",
  "Freight Broker",
  "Private Fleet",
];

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 12,
        }}
      >
        <span style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: 15,
          color: "var(--text-primary)",
          lineHeight: 1.4,
        }}>{q}</span>
        {open
          ? <Minus size={16} style={{ color: "var(--fuel-300)", flexShrink: 0 }} />
          : <Plus size={16} style={{ color: "var(--fuel-300)", flexShrink: 0 }} />
        }
      </button>
      {open && (
        <p style={{
          color: "var(--text-secondary)",
          fontSize: 15,
          lineHeight: 1.7,
          paddingBottom: 18,
        }}>{a}</p>
      )}
    </div>
  );
}

export default function JoinOutriders() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    first_name: "", last_name: "", company: "",
    phone: "", email: "", member_type: "",
    truck_count: "", trailer_count: "",
    password: "", password_confirm: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // FAQ
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.member_type) e.member_type = "Required";
    if (form.password.length < 8) e.password = "Must be at least 8 characters";
    else if (!/\d/.test(form.password)) e.password = "Must include at least one number";
    if (form.password !== form.password_confirm) e.password_confirm = "Passwords don't match";
    if (!termsAccepted) e.terms = "Please accept the Terms of Service to continue";
    return e;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      // Create account
      await base44.users.inviteUser(form.email, "user");

      // Create Driver record
      const driver = await base44.entities.Driver.create({
        first_name: form.first_name,
        last_name: form.last_name,
        business_name: form.company,
        phone: form.phone,
        email: form.email,
        tags: `member_type:${form.member_type}${form.truck_count ? `,trucks:${form.truck_count}` : ""}${form.trailer_count ? `,trailers:${form.trailer_count}` : ""},source:outriders_landing`,
        status: "imported",
      });

      // Send welcome email (non-blocking)
      try {
        await base44.functions.invoke("sendWelcomeEmail", {
          email: form.email,
          first_name: form.first_name,
        });
      } catch (_) {}

      // Store join data for activation page
      sessionStorage.setItem("outriders_join", JSON.stringify({ ...form, driver_id: driver.id }));
      navigate("/activate");
    } catch (err) {
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("already")) {
        setErrors({ email: "An account with this email already exists." });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Landing Page ──
  return (
    <div style={{ background: C.dark, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        background: C.dark,
        minHeight: 520,
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
      }}>
        {/* Video background */}
        <video
          autoPlay muted loop playsInline preload="metadata"
          poster={`${GITHUB}/outriders-hero-poster.jpg`}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            opacity: 0.35,
          }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Copper gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(180deg, rgba(26,15,8,0.7) 0%, rgba(42,26,14,0.85) 50%, rgba(26,15,8,0.95) 100%)`,
          pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 480, margin: "0 auto", padding: "36px 20px 52px" }}>
          {/* Logo */}
          <div style={{ marginBottom: 24 }}>
            <img
              src={`${GITHUB}/LHS-Outriders-HYRID-LOGO.png`}
              alt="Outriders Drivers Club"
              style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: "clamp(30px, 8vw, 42px)",
            color: "#f0eeec",
            lineHeight: 1.1,
            marginBottom: 14,
          }}>
            AMERICA NEEDS<br />GREAT TRUCK DRIVERS
          </h1>

          <p style={{ color: "#b6ada2", fontSize: 18, fontStyle: "italic", marginBottom: 16, lineHeight: 1.5 }}>
            Be your best with The Outriders.
          </p>
          <p style={{ color: "#b6ada2", fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
            We're building the most exclusive Drivers Club in trucking — a social network, learning platform and career centric organization with amenity rich club locations planned for the busiest freight lanes.
          </p>

          <button className="btn-primary" onClick={scrollToForm} style={{ maxWidth: 320 }}>
            JOIN NOW — IT'S FREE
          </button>
        </div>
      </section>

      {/* ── VALUE CARDS ── */}
      <section style={{ padding: "40px 20px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {VALUE_CARDS.map((card, i) => (
            <div key={i} style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 16,
              border: `1.5px solid ${C.border}`,
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              background: C.dark,
              boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
            }}>
              {/* Background image at 25% opacity */}
              <img
                src={card.img}
                alt=""
                loading="lazy"
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  opacity: 0.25,
                }}
              />
              {/* Copper gradient overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(180deg, rgba(42,26,14,0.4) 0%, rgba(26,15,8,0.9) 70%, rgba(26,15,8,0.95) 100%)`,
                pointerEvents: "none",
              }} />
              {/* Content */}
              <div style={{ position: "relative", zIndex: 2, padding: "24px" }}>
                <h3 style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  fontSize: 20,
                  color: "#f0eeec",
                  whiteSpace: "pre-line",
                  marginBottom: 12,
                  lineHeight: 1.2,
                }}>
                  {card.headline}
                </h3>
                <p style={{ color: "#b6ada2", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                  {card.body}
                </p>
                <button
                  onClick={scrollToForm}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    fontFamily: "var(--font-heading)", fontWeight: 800,
                    fontSize: 12, color: C.glow,
                    letterSpacing: "2px", textTransform: "uppercase",
                    display: "inline-block", marginTop: 4,
                  }}
                >
                  {card.cta} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SIGNUP FORM ── */}
      <section ref={formRef} style={{
        padding: "48px 20px",
        background: `linear-gradient(180deg, ${C.dark} 0%, ${C.base} 100%)`,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          {/* Form header graphic */}
          <div style={{ marginBottom: 24 }}>
            <img
              src={`${GITHUB}/outriders-badge.png`}
              alt="Outriders"
              style={{ width: "100%", maxWidth: 200, height: "auto", borderRadius: 12, marginBottom: 16 }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <h2 style={{ ...headingStyle(22), marginBottom: 6 }}>
              JOIN THE OUTRIDERS<br />DRIVERS CLUB
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              Free membership. Takes 30 seconds.
            </p>
          </div>

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>First Name <span style={{ color: "var(--fuel-500)" }}>*</span></label>
                <input value={form.first_name} onChange={set("first_name")} placeholder="First" style={{ ...inputStyle, ...(errors.first_name ? errorBorderStyle : {}) }} />
                {errors.first_name && <p style={errorTextStyle}>{errors.first_name}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Last Name <span style={{ color: "var(--fuel-500)" }}>*</span></label>
                <input value={form.last_name} onChange={set("last_name")} placeholder="Last" style={{ ...inputStyle, ...(errors.last_name ? errorBorderStyle : {}) }} />
                {errors.last_name && <p style={errorTextStyle}>{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Company</label>
              <input value={form.company} onChange={set("company")} placeholder="Carrier or employer name" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Phone <span style={{ color: "var(--fuel-500)" }}>*</span></label>
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder="Mobile number" style={{ ...inputStyle, ...(errors.phone ? errorBorderStyle : {}) }} />
              {errors.phone && <p style={errorTextStyle}>{errors.phone}</p>}
            </div>

            <div>
              <label style={labelStyle}>Email <span style={{ color: "var(--fuel-500)" }}>*</span></label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="Your email address" style={{ ...inputStyle, ...(errors.email ? errorBorderStyle : {}) }} />
              {errors.email && <p style={errorTextStyle}>{errors.email}</p>}
            </div>

            <div>
              <label style={labelStyle}>Member Type <span style={{ color: "var(--fuel-500)" }}>*</span></label>
              <select
                value={form.member_type}
                onChange={set("member_type")}
                style={{ ...inputStyle, ...(errors.member_type ? errorBorderStyle : {}) }}
              >
                <option value="">Select your type…</option>
                {MEMBER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.member_type && <p style={errorTextStyle}>{errors.member_type}</p>}
            </div>

            {(form.member_type === "For-Hire Carrier" || form.member_type === "Private Fleet") && (
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Truck Count</label>
                  <input type="number" value={form.truck_count} onChange={set("truck_count")} placeholder="0" style={inputStyle} min="0" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Trailer Count</label>
                  <input type="number" value={form.trailer_count} onChange={set("trailer_count")} placeholder="0" style={inputStyle} min="0" />
                </div>
              </div>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: C.border, margin: "4px 0" }} />

            <div>
              <label style={labelStyle}>Create Password <span style={{ color: "var(--fuel-500)" }}>*</span></label>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="Minimum 8 characters"
                style={{ ...inputStyle, ...(errors.password ? errorBorderStyle : {}) }}
              />
              {errors.password && <p style={errorTextStyle}>{errors.password}</p>}
              <ul style={{ color: "var(--text-muted)", fontSize: 12, paddingLeft: 16, lineHeight: 1.9, margin: "6px 0 0" }}>
                <li style={{ color: form.password.length >= 8 ? "#18a06b" : "var(--text-muted)" }}>8+ characters</li>
                <li style={{ color: /\d/.test(form.password) ? "#18a06b" : "var(--text-muted)" }}>At least one number</li>
              </ul>
            </div>

            <div>
              <label style={labelStyle}>Confirm Password <span style={{ color: "var(--fuel-500)" }}>*</span></label>
              <input
                type="password"
                value={form.password_confirm}
                onChange={set("password_confirm")}
                placeholder="Re-enter password"
                style={{ ...inputStyle, ...(errors.password_confirm ? errorBorderStyle : {}) }}
              />
              {errors.password_confirm && <p style={errorTextStyle}>{errors.password_confirm}</p>}
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ marginTop: 2, accentColor: C.glow, width: 16, height: 16, flexShrink: 0 }}
              />
              <span style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
                I agree to the{" "}
                <a href="#" style={{ color: C.glow }}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" style={{ color: C.glow }}>Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p style={errorTextStyle}>{errors.terms}</p>}

            <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: 8 }}>
              {submitting ? "Creating Account…" : "JOIN OUTRIDERS — IT'S FREE"}
            </button>

            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); base44.auth.redirectToLogin("/activate"); }}
                style={{ color: C.glow, fontWeight: 600 }}
              >
                Log In
              </a>
            </p>
          </form>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "48px 20px", maxWidth: 480, margin: "0 auto", background: C.dark }}>
        <h2 style={{ ...headingStyle(22), marginBottom: 28 }}>
          FREQUENTLY ASKED QUESTIONS
        </h2>
        {FAQS.map((faq, i) => (
          <FaqItem
            key={i}
            q={faq.q}
            a={faq.a}
            open={openFaq === i}
            onToggle={() => setOpenFaq(openFaq === i ? null : i)}
          />
        ))}
      </section>

      {/* ── GALLERY ── */}
      <section style={{ padding: "0 0 48px", background: C.dark }}>
        <div style={{ padding: "0 20px", maxWidth: 480, margin: "0 auto", marginBottom: 16, paddingTop: 40 }}>
          <p style={{
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
            color: "#7a7268", letterSpacing: "1px", textTransform: "uppercase",
          }}>
            LIFE AT LINEHAUL STATION
          </p>
        </div>
        <div style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          padding: "0 20px 12px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}>
          {GALLERY_IMGS.map((src, i) => (
            <div key={i} style={{
              flexShrink: 0,
              width: 220,
              height: 160,
              borderRadius: 10,
              overflow: "hidden",
              background: C.mid,
              border: `1px solid ${C.border}`,
              scrollSnapAlign: "start",
              boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
            }}>
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "32px 20px 48px",
        borderTop: `1px solid ${C.border}`,
        background: C.dark,
        maxWidth: "100%",
        textAlign: "center",
      }}>
        <img
          src={`${GITHUB}/logo-LHS-main.png`}
          alt="LineHaul Station"
          style={{ height: 28, marginBottom: 16, opacity: 0.7 }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.8, marginBottom: 12 }}>
          Contact Us<br />
          <a href="mailto:info@linehaulstation.com" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>info@linehaulstation.com</a><br />
          <a href="tel:6028988000" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>(602) 898-8000</a>
        </p>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy Policy</a>
          {" · "}
          <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}

// ── Shared style helpers ──

const headingStyle = (size) => ({
  fontFamily: "var(--font-heading)",
  fontWeight: 900,
  fontSize: size,
  color: "var(--text-primary)",
  lineHeight: 1.15,
});

const labelStyle = {
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: 13,
  color: "var(--text-secondary)",
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  display: "block",
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 10,
  background: "#1a0f08",
  border: "1.5px solid #5c3518",
  color: "#f0eeec",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "var(--font-body)",
};

const errorBorderStyle = {
  border: "1px solid var(--danger)",
};

const errorTextStyle = {
  color: "var(--danger)",
  fontSize: 12,
  marginTop: 4,
};
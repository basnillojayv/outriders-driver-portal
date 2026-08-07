import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Camera, CheckCircle2, Circle, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GITHUB = "https://raw.githubusercontent.com/LineHaulStation/app/main/images";

const C = {
  dark:   "#1a0f08",
  base:   "#2a1a0e",
  border: "#5c3518",
  glow:   "#cc5b30",
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

const inputStyle = {
  width: "100%", padding: "14px 16px", borderRadius: 10,
  background: "#1a0f08", border: "1.5px solid #5c3518",
  color: "#f0eeec", fontSize: 16, outline: "none",
  boxSizing: "border-box", fontFamily: "var(--font-body)",
};

const labelStyle = {
  fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
  color: "var(--text-secondary)", letterSpacing: "0.8px",
  textTransform: "uppercase", display: "block", marginBottom: 6,
};

const COC_TEXT = `LINEHAUL STATION — CODE OF CONDUCT

As a member of the LineHaul Station Outriders Club, I agree to:

1. RESPECT: Treat all fellow members, staff, and partners with respect and professionalism at all times, both online and in person.

2. HONESTY: Provide accurate information about myself, my qualifications, and my experience. I will not misrepresent my credentials or identity.

3. PROFESSIONALISM: Uphold the highest standards of professional conduct in all interactions representing the LineHaul Station brand.

4. COMMUNITY: Contribute positively to the Outriders community. Support fellow drivers. Share knowledge and experience generously.

5. SAFETY: Prioritize safety above all else on the road. Never operate a vehicle while impaired or in violation of federal or state regulations.

6. INTEGRITY: Act with integrity in all business dealings. Do not engage in fraud, theft, or any illegal activity.

7. CONFIDENTIALITY: Respect the privacy of other members. Do not share personal information without consent.

8. COMPLIANCE: Comply with all applicable laws, regulations, and LineHaul Station platform policies.

Violation of this Code of Conduct may result in suspension or permanent removal from the LineHaul Station platform.`;

export default function ActivateProfile() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Driver");
  const [joinData, setJoinData] = useState({});

  // Photo
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // CDL
  const [cdlNumber, setCdlNumber] = useState("");
  const [cdlState, setCdlState] = useState("");

  // CoC
  const [cocViewed, setCocViewed] = useState(false);
  const [cocAccepted, setCocAccepted] = useState(false);
  const [showCoc, setShowCoc] = useState(false);

  // Username
  const [username, setUsername] = useState("");

  // UI state
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [pulseMissing, setPulseMissing] = useState(false);

  // Check auth state on mount
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then((authed) => {
      if (!authed) {
        // Not logged in — send to Join
        navigate("/join/outriders");
      } else {
        setChecking(false);
      }
    });

    try {
      const stored = JSON.parse(sessionStorage.getItem("outriders_join") || "{}");
      setJoinData(stored);
      if (stored.first_name) setFirstName(stored.first_name);
    } catch (_) {}
  }, []);

  const photoOk = !!photoPreview;
  const cdlOk = cdlNumber.trim().length > 0 && !!cdlState;
  const cocOk = cocAccepted;
  const usernameOk = username.trim().length > 0;
  const requiredDone = [photoOk, cdlOk, cocOk, usernameOk].filter(Boolean).length;
  const allComplete = requiredDone === 4;

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const saveAndComplete = async (skip = false) => {
    setSaving(true);
    try {
      const user = await base44.auth.me();
      if (!user) { navigate("/join/outriders"); return; }

      let photoUrl = "";
      if (photoFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: photoFile });
        photoUrl = file_url;
      }

      const updateData = {
        ...(joinData.first_name && { first_name: joinData.first_name }),
        ...(joinData.last_name && { last_name: joinData.last_name }),
        ...(joinData.company && { business_name: joinData.company }),
        ...(joinData.phone && { phone: joinData.phone }),
        ...(photoUrl && { profile_photo_url: photoUrl }),
        ...(cdlNumber && { cdl_number: cdlNumber }),
        ...(cdlState && { cdl_state: cdlState }),
        ...(cocAccepted && {
          code_of_conduct_accepted: true,
          code_of_conduct_date: new Date().toISOString(),
        }),
        ...(username && { username }),
        status: skip ? "activation_started" : (allComplete ? "activation_completed" : "activation_started"),
      };

      await base44.auth.updateMe(updateData);

      if (!skip && allComplete) {
        try {
          await base44.functions.invoke("sendWelcomeEmail", {
            email: user.email,
            first_name: firstName,
            event: "activation_completed",
          });
        } catch (_) {}
        setCompleted(true);
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = () => {
    if (!allComplete) {
      setPulseMissing(true);
      setTimeout(() => setPulseMissing(false), 1200);
    }
    saveAndComplete(false);
  };

  if (checking) {
    return (
      <div style={{ background: C.dark, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.glow, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  // ── Completion Screen ──
  if (completed) {
    return (
      <div style={{
        background: C.dark, minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 20px",
      }}>
        <div style={{
          width: "100%", maxWidth: 400, textAlign: "center",
          background: C.base, border: `1px solid ${C.border}`,
          borderRadius: 20, padding: "48px 32px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
        }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>🎉</div>
          <h2 style={{
            fontFamily: "var(--font-heading)", fontWeight: 900,
            fontSize: 26, color: "#f0eeec", marginBottom: 10, lineHeight: 1.15,
          }}>
            YOU'RE ALL SET,<br />
            <span style={{ color: C.glow }}>{firstName.toUpperCase()}!</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            Your profile has been submitted. We're creating your custom Outriders avatar now — you'll receive an email when your profile is fully set up and ready.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button className="btn-primary" onClick={() => navigate("/")}>
              Explore the App →
            </button>
            <Link
              to="/profile"
              style={{
                display: "block", textAlign: "center", padding: "14px",
                borderRadius: 12, border: `1px solid ${C.border}`,
                color: "var(--text-secondary)", fontFamily: "var(--font-heading)",
                fontWeight: 700, fontSize: 14, textDecoration: "none",
              }}
            >
              View My Profile →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.dark, minHeight: "100vh", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>

        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <img
            src={`${GITHUB}/LHS-Outriders-HYRID-LOGO.png`}
            alt="Outriders Drivers Club"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#18a06b" }} />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 12, color: "#18a06b" }}>Step 1: Joined ✓</span>
          </div>
          <div style={{ flex: 1, height: 2, background: C.border, borderRadius: 2 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.glow }} />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 12, color: C.glow }}>Step 2: Activate Your Profile</span>
          </div>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: "var(--font-heading)", fontWeight: 900,
          fontSize: 26, color: "#f0eeec", lineHeight: 1.1, marginBottom: 10,
        }}>
          ACTIVATE YOUR<br />PROFILE
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
          Complete these steps to activate your Outriders membership. You can do them in any order.
        </p>

        {/* Progress Card */}
        <div style={{
          background: allComplete ? "rgba(24,160,107,0.08)" : C.base,
          border: `1px solid ${allComplete ? "rgba(24,160,107,0.3)" : C.border}`,
          borderRadius: 14, padding: "20px", marginBottom: 24,
        }}>
          <p style={{
            fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 12,
            color: allComplete ? "#18a06b" : "var(--text-secondary)",
            letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14,
          }}>
            YOUR ACTIVATION PROGRESS
          </p>
          {[
            { label: "Upload profile photo", done: photoOk, missing: !photoOk && pulseMissing },
            { label: "Enter CDL information", done: cdlOk, missing: !cdlOk && pulseMissing },
            { label: "Accept Code of Conduct", done: cocOk, missing: !cocOk && pulseMissing },
            { label: "Choose a username", done: usernameOk, missing: !usernameOk && pulseMissing },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              {item.done
                ? <CheckCircle2 size={14} style={{ color: "#18a06b", flexShrink: 0 }} />
                : <div style={{
                    width: 14, height: 14, borderRadius: 3,
                    border: `2px solid ${item.missing ? C.glow : "rgba(255,255,255,0.2)"}`,
                    flexShrink: 0,
                  }} />
              }
              <span style={{ color: item.done ? "#f0eeec" : "var(--text-secondary)", fontSize: 14 }}>{item.label}</span>
            </div>
          ))}
          {/* Progress bar */}
          <div style={{ marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{requiredDone} of 4 complete</span>
              <span style={{ color: C.glow, fontSize: 12, fontWeight: 700 }}>{Math.round((requiredDone / 4) * 100)}%</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 4,
                width: `${(requiredDone / 4) * 100}%`,
                background: `linear-gradient(90deg, #e8a14b, #cc5b30)`,
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>
        </div>

        {/* ── Profile Photo ── */}
        <SectionCard title="PROFILE PHOTO" done={photoOk} missing={!photoOk && pulseMissing}>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
            Upload a clear photo of your face. No sunglasses, no hat. Used for ID at LineHaul Station terminals and for your Outriders avatar.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: `2px solid ${photoOk ? "#18a06b" : C.border}`,
              overflow: "hidden", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {photoPreview
                ? <img src={photoPreview} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <Camera size={28} style={{ color: "var(--text-muted)" }} />
              }
            </div>
            <label style={{ cursor: "pointer" }}>
              <input type="file" accept="image/jpeg,image/png" capture="user" style={{ display: "none" }} onChange={handlePhoto} />
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 18px", borderRadius: 10,
                background: photoOk ? "rgba(24,160,107,0.1)" : `rgba(204,91,48,0.15)`,
                border: `1.5px solid ${photoOk ? "#18a06b" : C.glow}`,
                color: photoOk ? "#18a06b" : C.glow,
                fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 13,
                cursor: "pointer",
              }}>
                <Camera size={14} />
                {photoPreview ? "Change Photo" : "Upload Photo"}
              </span>
            </label>
          </div>
        </SectionCard>

        {/* ── CDL Information ── */}
        <SectionCard title="CDL INFORMATION" done={cdlOk} missing={!cdlOk && pulseMissing}>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
            Confirms you are an active driver. Your CDL number is kept private.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>CDL Number</label>
              <input
                value={cdlNumber}
                onChange={(e) => setCdlNumber(e.target.value)}
                placeholder="CDL Number"
                style={{ ...inputStyle, ...(pulseMissing && !cdlNumber ? { borderColor: C.glow } : {}) }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Issuing State</label>
              <Select value={cdlState} onValueChange={setCdlState}>
                <SelectTrigger style={{ ...inputStyle, height: "auto", display: "flex" }}>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        {/* ── Code of Conduct ── */}
        <SectionCard title="CODE OF CONDUCT" done={cocOk} missing={!cocOk && pulseMissing}>
          {cocAccepted ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={16} style={{ color: "#18a06b" }} />
              <span style={{ color: "#18a06b", fontSize: 14, fontWeight: 600 }}>
                Accepted on {new Date().toLocaleDateString()}
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => { setCocViewed(true); setShowCoc(true); }}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  color: C.glow, fontFamily: "var(--font-body)", fontWeight: 600,
                  fontSize: 14, textDecoration: "underline", textAlign: "left",
                }}
              >
                View Code of Conduct
              </button>
              <label style={{
                display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer",
                ...(!cocViewed ? { opacity: 0.4, pointerEvents: "none" } : {}),
              }}>
                <input
                  type="checkbox"
                  checked={cocAccepted}
                  onChange={(e) => { if (e.target.checked) setCocAccepted(true); }}
                  disabled={!cocViewed}
                  style={{ marginTop: 2, accentColor: C.glow, width: 16, height: 16, flexShrink: 0 }}
                />
                <span style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
                  I have read and accept the LineHaul Station Code of Conduct
                </span>
              </label>
              {!cocViewed && (
                <p style={{ color: "var(--text-muted)", fontSize: 12 }}>You must view the Code of Conduct before accepting.</p>
              )}
            </div>
          )}
        </SectionCard>

        {/* ── Username ── */}
        <SectionCard title="CHOOSE YOUR USERNAME" done={usernameOk} missing={!usernameOk && pulseMissing}>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
            Your public name for promotions, rankings, and shareable content. Choose something respectful and appropriate.
          </p>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 15 }}>@</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
              placeholder="yourhandle"
              style={{ ...inputStyle, paddingLeft: 30, ...(pulseMissing && !usernameOk ? { borderColor: C.glow } : {}) }}
            />
          </div>
          {usernameOk && (
            <p style={{ color: "#18a06b", fontSize: 13, marginTop: 6 }}>✅ @{username}</p>
          )}
        </SectionCard>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          <button
            className="btn-primary"
            onClick={handleActivate}
            disabled={saving}
          >
            {saving ? "Saving…" : allComplete ? "ACTIVATE MY MEMBERSHIP" : "ACTIVATE MY MEMBERSHIP"}
          </button>

          {!allComplete && (
            <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center" }}>
              Complete all 4 items above to activate.
            </p>
          )}

          <button
            onClick={() => saveAndComplete(true)}
            disabled={saving}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", fontSize: 14,
              fontFamily: "var(--font-body)", fontWeight: 600,
              padding: "10px 0", textAlign: "center",
            }}
          >
            Skip for now → Explore the App
          </button>
        </div>
      </div>

      {/* CoC Modal */}
      {showCoc && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          background: "rgba(0,0,0,0.75)",
        }}>
          <div style={{
            background: "#1a1a1a", borderRadius: "20px 20px 0 0",
            width: "100%", maxWidth: 480,
            maxHeight: "80vh", display: "flex", flexDirection: "column",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "#f0eeec" }}>Code of Conduct</span>
              <button onClick={() => setShowCoc(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ overflowY: "auto", padding: "16px 20px", flex: 1 }}>
              <pre style={{ color: "var(--text-secondary)", fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "var(--font-body)" }}>
                {COC_TEXT}
              </pre>
            </div>
            <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                className="btn-primary"
                onClick={() => { setCocAccepted(true); setCocViewed(true); setShowCoc(false); }}
              >
                I Accept the Code of Conduct
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, done, missing, children }) {
  return (
    <div style={{
      background: C.base,
      border: `1.5px solid ${done ? "rgba(24,160,107,0.35)" : missing ? C.glow : C.border}`,
      borderRadius: 14, padding: "20px", marginBottom: 16,
      transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        {done
          ? <CheckCircle2 size={14} style={{ color: "#18a06b" }} />
          : <div style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${C.border}` }} />
        }
        <span style={{
          fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 12,
          color: done ? "#18a06b" : "var(--text-secondary)",
          letterSpacing: "1.5px", textTransform: "uppercase",
        }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
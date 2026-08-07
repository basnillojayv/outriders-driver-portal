import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { OH, IMG } from "./ohConstants";

function calcBaseFee(annualDays) {
  if (annualDays <= 30)  return annualDays * 325;
  if (annualDays <= 90)  return annualDays * 320;
  if (annualDays <= 180) return annualDays * 305;
  if (annualDays <= 364) return annualDays * 295;
  return 107675; // 365 days
}

const sl = { // shared slider style
  width: "100%",
  accentColor: OH.accent,
  cursor: "pointer",
  height: 6,
};

const rowSt = {
  display: "flex", justifyContent: "space-between",
  alignItems: "baseline", marginBottom: 4,
};

const labelSt = { color: OH.textSec, fontSize: 14 };
const valueSt = { color: OH.text, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15 };

const cardSt = {
  background: "rgba(0,0,0,0.45)",
  border: `1px solid ${OH.border}`,
  borderRadius: 14,
  padding: "22px 20px",
  marginBottom: 16,
};

const stepBtnSt = (primary) => ({
  flex: 1,
  padding: "14px 12px",
  borderRadius: 10,
  border: primary ? "none" : `1px solid ${OH.border}`,
  background: primary ? `linear-gradient(135deg, ${OH.accentLight}, ${OH.accent})` : "rgba(0,0,0,0.3)",
  color: primary ? "#fff" : OH.textSec,
  fontFamily: "var(--font-heading)",
  fontWeight: 900,
  fontSize: 14,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
});

/** Returns calculator data object for attaching to form submission */
export function getCalcData(rent, utilities, services, roadDays) {
  const monthlyCost = rent + utilities + services;
  const annualCost = monthlyCost * 12;
  const homeDays = 365 - roadDays;
  const costPerDayHome = homeDays > 0 ? Math.round(annualCost / homeDays) : 0;
  const annualDays = Math.min(365, Math.max(1, 365 - roadDays));
  const baseFee = calcBaseFee(annualDays);
  const eaFee = Math.round(baseFee * 0.661);
  const annualOneHomeCost = annualDays * 19;
  const savings = Math.round(annualCost * 0.8 - annualOneHomeCost);
  const pay12 = Math.round((eaFee * 1.2) / 12);
  const pay24 = Math.round((eaFee * 1.2) / 24);
  return { rent, utilities, services, roadDays, homeDays, monthlyCost, annualCost, costPerDayHome, annualDays, baseFee, eaFee, annualOneHomeCost, savings, pay12, pay24 };
}

export default function InlineCalculator({ onComplete }) {
  const [step, setStep] = useState(1);
  const [rent, setRent] = useState(1500);
  const [utilities, setUtilities] = useState(275);
  const [internet, setInternet] = useState(100);
  const [maintenance, setMaintenance] = useState(150);
  const [parking, setParking] = useState(275);
  const [homeDays, setHomeDays] = useState(100);

  const roadDays = 365 - homeDays;
  const d = getCalcData(rent, utilities, internet + maintenance + parking, roadDays);

  const goNext = () => {
    if (step === 3 && onComplete) onComplete(d);
    else setStep((s) => s + 1);
  };

  return (
    <div>
      {/* Step indicators */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{
            flex: 1, height: 3, borderRadius: 3,
            background: step >= s ? OH.accent : "rgba(255,255,255,0.15)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      {/* Step 1: Home Costs */}
      {step === 1 && (
        <div style={cardSt}>
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 16, color: OH.accent, marginBottom: 18, textTransform: "uppercase", letterSpacing: "1px" }}>
            Step 1 — MY Current Cost of Living
          </p>
          <div style={{ marginBottom: 20 }}>
            <div style={rowSt}>
              <span style={labelSt}>Rent / Mortgage</span>
              <span style={valueSt}>${rent.toLocaleString()}/mo</span>
            </div>
            <input type="range" style={sl} min={0} max={5000} step={50} value={rent} onChange={(e) => setRent(+e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={rowSt}>
              <span style={labelSt}>Utilities – Elec, Gas, Water &amp; Trash</span>
              <span style={valueSt}>${utilities}/mo</span>
            </div>
            <input type="range" style={sl} min={0} max={1000} step={25} value={utilities} onChange={(e) => setUtilities(+e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={rowSt}>
              <span style={labelSt}>Internet Services</span>
              <span style={valueSt}>${internet}/mo</span>
            </div>
            <input type="range" style={sl} min={0} max={500} step={10} value={internet} onChange={(e) => setInternet(+e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={rowSt}>
              <span style={labelSt}>Home Maintenance &amp; Lawn/Snow</span>
              <span style={valueSt}>${maintenance}/mo</span>
            </div>
            <input type="range" style={sl} min={0} max={1000} step={25} value={maintenance} onChange={(e) => setMaintenance(+e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={rowSt}>
              <span style={labelSt}>Off-Site Truck Parking (while at home)</span>
              <span style={valueSt}>${parking}/mo</span>
            </div>
            <input type="range" style={sl} min={0} max={1000} step={25} value={parking} onChange={(e) => setParking(+e.target.value)} />
          </div>
          <div style={{
            borderTop: `1px solid ${OH.border}`, paddingTop: 14, marginTop: 4,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ color: OH.textSec, fontSize: 14 }}>Monthly Total</span>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 22, color: "#d94040" }}>
              ${d.monthlyCost.toLocaleString()}/mo
            </span>
          </div>
          <div style={{ marginTop: 18 }}>
            <button style={stepBtnSt(true)} onClick={goNext}>
              Next: Home Time <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Road Schedule */}
      {step === 2 && (
        <div style={cardSt}>
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 16, color: OH.accent, marginBottom: 18, textTransform: "uppercase", letterSpacing: "1px" }}>
            Step 2 — Home Time Calculator
            </p>
            <div style={{ marginBottom: 20 }}>
            <div style={rowSt}>
             <span style={labelSt}>Days at home per year</span>
             <span style={valueSt}>{homeDays} days</span>
            </div>
            <input type="range" style={sl} min={25} max={315} step={5} value={homeDays} onChange={(e) => setHomeDays(+e.target.value)} />
            <div style={{ textAlign: "center", marginTop: 6 }}>
             <span style={{ color: OH.textMuted, fontSize: 12 }}>({roadDays} days on the road)</span>
            </div>
            </div>
            <div style={{
            background: "rgba(217,64,64,0.12)", border: "1px solid rgba(217,64,64,0.25)",
            borderRadius: 12, padding: "18px", textAlign: "center", marginBottom: 18,
            }}>
            <p style={{ color: OH.textSec, fontSize: 13, marginBottom: 6 }}>You're paying for a home you only use</p>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 40, color: OH.accent, lineHeight: 1 }}>
             {homeDays}
            </p>
            <p style={{ color: OH.accent, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>days per year</p>
            <p style={{ color: OH.textSec, fontSize: 13 }}>
             That's <strong style={{ color: "#d94040" }}>${d.costPerDayHome}/day</strong> for each day you're actually home
            </p>
            </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={stepBtnSt(false)} onClick={() => setStep(1)}>
              <ArrowLeft size={14} /> Back
            </button>
            <button style={stepBtnSt(true)} onClick={goNext}>
              See Results <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <div>
          {/* Big $19/day reveal */}
          <div style={{
            background: "rgba(13,42,26,0.85)", border: "2px solid rgba(61,184,122,0.4)",
            borderRadius: 14, padding: "28px 20px", textAlign: "center", marginBottom: 14,
          }}>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 13, color: OH.green, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>
              YOUR ONEHOME PLAN
            </p>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 72, color: OH.green, lineHeight: 1 }}>$19</p>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: OH.green, marginBottom: 8 }}>per day</p>
            <p style={{ color: OH.textSec, fontSize: 13 }}>Resort-quality living — everywhere the road takes you</p>
          </div>

          {/* Savings */}
          {d.savings > 0 && (
            <div style={{
              background: "rgba(13,42,26,0.6)", border: `1px solid ${OH.green}40`,
              borderRadius: 12, padding: "16px 18px", textAlign: "center", marginBottom: 14,
            }}>
              <p style={{ color: OH.textSec, fontSize: 13, marginBottom: 4 }}>Estimated annual savings vs. your current costs</p>
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 36, color: OH.green }}>
                ${d.savings.toLocaleString()}
              </p>
              <p style={{ color: OH.textMuted, fontSize: 12 }}>Based on your inputs. Actual savings may vary.</p>
            </div>
          )}

          {/* Payment options */}
          <div style={cardSt}>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 13, color: OH.accent, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>
              Early Adopter Membership
            </p>
            <p style={{ color: OH.textSec, fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>
              West Memphis founding members get 33.9% off. Fully refundable.
            </p>
            {[
              { label: "Pay in Full",     value: `$${d.eaFee.toLocaleString()}` },
              { label: "12-Month Plan",   value: `$${d.pay12.toLocaleString()}/mo` },
              { label: "24-Month Plan",   value: `$${d.pay24.toLocaleString()}/mo` },
            ].map((row) => (
              <div key={row.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 14px", background: "rgba(0,0,0,0.3)",
                border: `1px solid ${OH.border}`, borderRadius: 8, marginBottom: 8,
              }}>
                <span style={{ color: OH.textSec, fontSize: 14 }}>{row.label}</span>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 15, color: OH.accent }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button style={stepBtnSt(false)} onClick={() => setStep(2)}>
              <ArrowLeft size={14} /> Back
            </button>
            {onComplete ? (
              <button style={stepBtnSt(true)} onClick={() => onComplete(d)}>
                Join the Waiting List <ArrowRight size={14} />
              </button>
            ) : (
              <a href="tel:6024282222" style={{ ...stepBtnSt(true), flex: 1, textDecoration: "none" }}>
                Call 602.428.2222
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
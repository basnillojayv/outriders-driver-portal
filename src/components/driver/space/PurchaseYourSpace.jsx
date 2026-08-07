import React, { useState } from "react";
import { ChevronUp } from "lucide-react";

const SPACE_TIERS = [
  { minAnn: 15,  maxAnn: 29,  equity: 325, dues: 25, fee: 4875,   label: "15–29 Day Tier" },
  { minAnn: 30,  maxAnn: 59,  equity: 320, dues: 23, fee: 9600,   label: "30–59 Day Tier" },
  { minAnn: 60,  maxAnn: 99,  equity: 315, dues: 21, fee: 18900,  label: "60–99 Day Tier" },
  { minAnn: 100, maxAnn: 364, equity: 295, dues: 19, fee: 29500,  label: "100–364 Day Tier" },
  { minAnn: 365, maxAnn: 999, equity: 275, dues: 16, fee: 100375, label: "365-Day Tier" },
];

const EARLY_ADOPTER_FEE = 19500;

export default function PurchaseYourSpace() {
  const [daysPerYear, setDaysPerYear] = useState(100);

  // Get tier for current days, default to first tier if not found
  const currentTier = SPACE_TIERS.find(t => daysPerYear >= t.minAnn && daysPerYear <= t.maxAnn) || SPACE_TIERS[0];
  const tierLabel = daysPerYear === 365 ? "365-Day Tier" : `${currentTier.minAnn}–${currentTier.maxAnn} Day Tier`;
  
  // Calculate membership fee
  const isEarlyAdopter = daysPerYear === 100;
  const membershipFee = isEarlyAdopter ? EARLY_ADOPTER_FEE : currentTier.fee;
  const equityRate = currentTier.equity;
  const duesRate = currentTier.dues;

  // Payment options
  const pay12month = Math.round(membershipFee / 12);
  const pay24month = Math.round(membershipFee / 24);

  return (
    <div style={{ marginBottom: 48 }}>
      {/* A. Days Selector */}
      <div style={{
        background: "var(--carbon-800)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "22px 20px",
        marginBottom: 24,
      }}>
        <label style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: 14,
          color: "var(--text-primary)",
          display: "block",
          marginBottom: 16,
        }}>
          How many days per year will you use LineHaul?
        </label>

        <input
          type="range"
          min="1"
          max="365"
          value={daysPerYear}
          onChange={(e) => setDaysPerYear(parseInt(e.target.value))}
          style={{
            width: "100%",
            height: 6,
            borderRadius: 6,
            background: "var(--carbon-600)",
            outline: "none",
            accentColor: "var(--fuel-500)",
            cursor: "pointer",
          }}
        />

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 900,
              fontSize: 18,
              color: "var(--fuel-300)",
            }}>
              {daysPerYear} days/year
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 2 }}>
              {tierLabel}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Equity Rate</p>
            <p style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 900,
              fontSize: 20,
              color: "var(--text-primary)",
            }}>
              ${equityRate}/day
            </p>
          </div>
        </div>
      </div>

      {/* B. Two Membership Types */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 24,
      }}>
        {/* Proprietary Space */}
        <div style={{
          background: isEarlyAdopter ? "rgba(238,117,44,0.08)" : "var(--carbon-800)",
          border: isEarlyAdopter ? "1.5px solid rgba(238,117,44,0.4)" : "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: "18px 16px",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: -8,
            left: 12,
            background: "linear-gradient(135deg, #e8a14b, #cc5b30)",
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            color: "#fff",
          }}>
            ⭐ BEST VALUE
          </div>

          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: 13,
            color: "var(--fuel-300)",
            marginBottom: 12,
            marginTop: 12,
          }}>
            PROPRIETARY SPACE
          </p>

          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: 24,
            color: "var(--text-primary)",
            marginBottom: 4,
          }}>
            ${duesRate}
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 14 }}>
            /day (member rate)
          </p>

          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 12, fontStyle: "italic" }}>
            Once your membership is purchased
          </p>

          <ul style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.6, listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>✓ Your dedicated space reserved</li>
            <li style={{ marginBottom: 6 }}>✓ Pay in full or finance</li>
            <li style={{ marginBottom: 6 }}>✓ 80% refundable</li>
            <li>✓ Rate locked forever</li>
          </ul>
        </div>

        {/* Space Available */}
        <div style={{
          background: "var(--carbon-800)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: "18px 16px",
        }}>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: 13,
            color: "var(--text-secondary)",
            marginBottom: 12,
          }}>
            SPACE AVAILABLE
          </p>

          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: 24,
            color: "var(--text-primary)",
            marginBottom: 4,
          }}>
            $59
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 14 }}>
            /night
          </p>

          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 12, fontStyle: "italic" }}>
            No purchase required
          </p>

          <ul style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.6, listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>✓ Pay as you go</li>
            <li style={{ marginBottom: 6 }}>✓ No upfront cost</li>
            <li style={{ marginBottom: 6 }}>✓ Subject to availability</li>
            <li>✓ Same amenities & access</li>
          </ul>
        </div>
      </div>

      {/* C. Purchase Details */}
      <div style={{
        background: "var(--carbon-800)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "22px 20px",
      }}>
        <h3 style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: 16,
          color: "var(--text-primary)",
          marginBottom: 6,
        }}>
          Purchase Your Space
        </h3>
        <p style={{
          color: "var(--text-secondary)",
          fontSize: 13,
          marginBottom: 16,
        }}>
          {daysPerYear} days/year × ${equityRate}/day equity rate
        </p>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 10,
          padding: "14px",
          marginBottom: 16,
        }}>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 4 }}>
            One-Time Refundable Membership Fee
          </p>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: 28,
            color: "var(--text-primary)",
            lineHeight: 1,
          }}>
            ${membershipFee.toLocaleString()}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 6 }}>
            80% refundable based on program terms
          </p>
        </div>

        {/* Payment Options */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 12,
          color: "var(--text-secondary)",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          Three Ways to Pay
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {/* Pay in Full */}
          <div style={{
            background: "rgba(24,160,107,0.1)",
            border: "1px solid rgba(24,160,107,0.3)",
            borderRadius: 10,
            padding: "14px",
          }}>
            <p style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: 12,
              color: "var(--success)",
              marginBottom: 6,
            }}>
              PAY IN FULL ⭐
            </p>
            <p style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 900,
              fontSize: 22,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}>
              ${membershipFee.toLocaleString()}
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>
              One payment. Then ${duesRate}/day.
            </p>
          </div>

          {/* 12-Month */}
          <div style={{
            background: "rgba(204,91,48,0.08)",
            border: "1px solid rgba(204,91,48,0.2)",
            borderRadius: 10,
            padding: "14px",
          }}>
            <p style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: 12,
              color: "var(--fuel-300)",
              marginBottom: 6,
            }}>
              12-MONTH PLAN
            </p>
            <p style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 900,
              fontSize: 22,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}>
              ${pay12month.toLocaleString()}/mo
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>
              12 payments. Then ${duesRate}/day.
            </p>
          </div>

          {/* 24-Month */}
          <div style={{
            background: "rgba(204,91,48,0.08)",
            border: "1px solid rgba(204,91,48,0.2)",
            borderRadius: 10,
            padding: "14px",
          }}>
            <p style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: 12,
              color: "var(--fuel-300)",
              marginBottom: 6,
            }}>
              24-MONTH PLAN
            </p>
            <p style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 900,
              fontSize: 22,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}>
              ${pay24month.toLocaleString()}/mo
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>
              24 payments. Then ${duesRate}/day.
            </p>
          </div>
        </div>

        <p style={{
          color: "var(--text-primary)",
          fontSize: 13,
          lineHeight: 1.6,
          padding: "12px",
          background: "rgba(238,117,44,0.05)",
          border: "1px solid rgba(238,117,44,0.15)",
          borderRadius: 8,
        }}>
          All three paths lead to the same result: <strong>${duesRate}/day</strong> once your membership is purchased.
        </p>
      </div>

      {/* D. Early Adopter Promo (100 days only) */}
      {isEarlyAdopter && (
        <div style={{
          background: "linear-gradient(135deg, rgba(238,117,44,0.15), rgba(238,117,44,0.08))",
          border: "2px solid rgba(238,117,44,0.4)",
          borderRadius: 14,
          padding: "20px",
          marginTop: 20,
        }}>
          <p style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            marginBottom: 8,
          }}>
            📍 West Memphis Launch Hub
          </p>
          <h3 style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: 18,
            color: "var(--fuel-300)",
            marginBottom: 12,
          }}>
            ⚡ Early Adopter Promotion
          </h3>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--text-secondary)",
            marginBottom: 4,
            textDecoration: "line-through",
            opacity: 0.7,
          }}>
            ${SPACE_TIERS[3].fee.toLocaleString()}
          </p>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: 28,
            color: "var(--fuel-300)",
            marginBottom: 12,
          }}>
            ${EARLY_ADOPTER_FEE.toLocaleString()}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{
              fontSize: 11,
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              background: "rgba(238,117,44,0.2)",
              border: "1px solid rgba(238,117,44,0.4)",
              borderRadius: 6,
              padding: "4px 10px",
              color: "var(--fuel-300)",
            }}>
              100-Day Package
            </span>
            <span style={{
              fontSize: 11,
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              background: "rgba(24,160,107,0.15)",
              border: "1px solid rgba(24,160,107,0.3)",
              borderRadius: 6,
              padding: "4px 10px",
              color: "var(--success)",
            }}>
              You Save $10,000
            </span>
          </div>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: 13,
          }}>
            Limited availability. Founding member pricing locked forever.
          </p>
        </div>
      )}

      {!isEarlyAdopter && (
        <button
          onClick={() => setDaysPerYear(100)}
          style={{
            marginTop: 20,
            padding: "14px",
            width: "100%",
            background: "rgba(238,117,44,0.12)",
            border: "1px solid rgba(238,117,44,0.3)",
            borderRadius: 10,
            color: "var(--fuel-300)",
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(238,117,44,0.18)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(238,117,44,0.12)";
          }}
        >
          ★ Return to Early Adopter Promotion (100 Days)
        </button>
      )}
    </div>
  );
}
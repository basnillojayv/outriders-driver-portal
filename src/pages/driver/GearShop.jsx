import React, { useState } from "react";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import { T } from "@/components/driver/v3/v3tokens";
import { base44 } from "@/api/base44Client";
import { ShoppingBag, Truck, HardHat, Coffee } from "lucide-react";

const CATEGORIES = [
  { id: "apparel",   icon: ShoppingBag, label: "Apparel",       sub: "Outriders-branded threads" },
  { id: "essentials", icon: Truck,      label: "Road Essentials", sub: "Gear built for the long haul" },
  { id: "hardlines", icon: HardHat,     label: "Work Gear",     sub: "Built for the job site" },
  { id: "lifestyle", icon: Coffee,      label: "Lifestyle",    sub: "Cab & downtime comforts" },
];

function Eyebrow({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 11,
        fontWeight: 700,
        color: T.orange,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  );
}

export default function GearShop() {
  return (
    <V3Shell>
      <BackBar />
      {/* ── Hero ── */}
      <div
        style={{
          position: "relative",
          height: 380,
          borderRadius: T.radius,
          overflow: "hidden",
          border: `1px solid ${T.border}`,
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/4f74e9e06_hero_exterior.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark gradient overlay for text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
          }}
        />
        {/* Text content — lower-left */}
        <div
          style={{
            position: "absolute",
            left: 0, right: 0, bottom: 0,
            padding: "24px 22px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 26,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            CRAFTED FOR THOSE WHO LEAD.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              fontWeight: 500,
              color: "#FFFFFF",
              marginTop: 6,
              opacity: 0.9,
            }}
          >
            Built for those that ride.
          </p>
          <a
            href="https://lhs-gear-shop.myshopify.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-heading)",
              fontSize: 13,
              fontWeight: 700,
              color: "#FFFFFF",
              background: "transparent",
              border: "1.5px solid #FFFFFF",
              borderRadius: T.radiusSm,
              padding: "11px 22px",
              marginTop: 16,
              cursor: "pointer",
              transition: "all 0.15s ease",
              textDecoration: "none",
            }}
          >
            Shop now
          </a>
        </div>
      </div>

      {/* ── Category teasers ── */}
      <div>
        <Eyebrow>What's In Store</Eyebrow>
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radiusSm,
                  padding: "16px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: T.orangeDim,
                    border: `1px solid rgba(255,106,0,0.3)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon size={20} style={{ color: T.orange }} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: T.textPrimary,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {c.label}
                  </p>
                  <p style={{ fontSize: 12, color: T.textMuted, marginTop: 2, lineHeight: 1.4 }}>
                    {c.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </V3Shell>
  );
}
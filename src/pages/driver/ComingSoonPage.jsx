import React from "react";
import V3Shell from "@/components/driver/v3/V3Shell";
import { T } from "@/components/driver/v3/v3tokens";

export default function ComingSoonPage({ title, description, iconUrl, iconColor = T.orange, features }) {
  return (
    <V3Shell>
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: T.radius,
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        {iconUrl && (
          <div
            style={{
              width: 96, height: 96, borderRadius: "50%",
              margin: "0 auto 22px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: T.orangeDim,
              border: `1px solid rgba(255,106,0,0.4)`,
              boxShadow: "0 0 18px 3px rgba(255,106,0,0.45), 0 0 6px rgba(255,170,90,0.4)",
            }}
          >
            <img src={iconUrl} alt={title} style={{ width: 72, height: 72, objectFit: "contain" }} />
          </div>
        )}

        <span
          style={{
            display: "inline-block",
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: T.orange,
            background: T.orangeDim,
            border: `1px solid rgba(255,106,0,0.35)`,
            borderRadius: 20,
            padding: "6px 16px",
            marginBottom: 24,
          }}
        >
          Coming Soon
        </span>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 26,
            fontWeight: 800,
            color: T.textPrimary,
            letterSpacing: "0.01em",
            marginBottom: 16,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: T.textSecondary,
            lineHeight: 1.65,
            maxWidth: 340,
            margin: "0 auto",
          }}
        >
          {description ||
            "This experience is being built for the Outriders community. Check back soon."}
        </p>

        {features && features.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "28px auto 0",
              maxWidth: 360,
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {features.map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 8, height: 8, borderRadius: "50%",
                    marginTop: 7,
                    background: T.orange,
                    boxShadow: "0 0 8px rgba(255,106,0,0.6)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    color: T.textSecondary,
                    lineHeight: 1.55,
                  }}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </V3Shell>
  );
}
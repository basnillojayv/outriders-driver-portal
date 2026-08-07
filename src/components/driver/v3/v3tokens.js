// Home v3 / V4 — Premium Membership design tokens
// American Express Platinum × Professional Trucking
// Source of truth: src/docs/design-system.md (v2.0)

export const T = {
  // Surfaces
  bg:       "#111111",
  card:     "#1C1C1C",
  cardAlt:  "#181818",
  border:   "rgba(255,255,255,0.13)",
  borderAlt:"rgba(255,255,255,0.07)",

  // Hero-specific
  heroBg:      "#141414",
  heroBorder:  "rgba(255,106,0,0.22)",
  heroRadius:  "22px",

  // Text
  textPrimary:   "#FFFFFF",
  textSecondary: "#DCDCDC",
  textMuted: "#9B9B9B",

  // Accents
  orange:    "#FF6A00",
  orangeDim: "rgba(255,106,0,0.15)",
  green:     "#18C37E",
  greenDim:  "rgba(24,195,126,0.12)",
  blue:      "#7C92B5",
  blueDim:   "rgba(124,146,181,0.13)",

  // Radii
  radius:    "16px",
  radiusSm:  "10px",

  // Spacing scale (refined for vertical rhythm)
  space:     "18px",   // default inter-section gap
  cardPad:   "22px",   // standard steel card padding
};

// Typography scale — use these style fragments; set fontSize per context.
// Hierarchy: Display (member name) > H1 (page) > H2 (card) > Section label > Body > Caption
export const type = {
  display: { fontFamily: "var(--font-heading)", fontWeight: 900, color: T.textPrimary, letterSpacing: "0.01em" },
  h1:      { fontFamily: "var(--font-heading)", fontWeight: 700, color: T.textPrimary, letterSpacing: "0.01em" },
  h2:      { fontFamily: "var(--font-heading)", fontWeight: 700, color: T.textPrimary, lineHeight: 1.2 },
  sectionLabel: { fontFamily: "var(--font-heading)", fontWeight: 700, color: T.textMuted, letterSpacing: "0.22em", textTransform: "uppercase" },
  body:    { fontFamily: "var(--font-body)", fontWeight: 400, color: T.textSecondary, lineHeight: 1.6 },
  caption: { fontFamily: "var(--font-body)", fontWeight: 400, color: T.textMuted, lineHeight: 1.55 },
};

// Carbon fiber CSS background — page-level and hero only
export const carbonBg = {
  backgroundColor: T.bg,
  backgroundImage: `
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.055) 0px,
      rgba(255,255,255,0.055) 1px,
      transparent 1px,
      transparent 6px
    )
  `,
};

// Hero carbon texture — slightly richer than page background
export const heroCarbonTexture = `
  repeating-linear-gradient(
    45deg,
    rgba(255,255,255,0.03) 0px,
    rgba(255,255,255,0.03) 1px,
    transparent 1px,
    transparent 6px
  )
`;

// Thin steel card border — solid fill, no texture
export const steelCard = {
  background: T.card,
  backgroundImage: "none",
  backgroundAttachment: "unset",
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  padding: T.cardPad,
  isolation: "isolate",
};

// ── Button standards — solid, premium, consistent ──
// Title case labels (no all-caps). Regular Bold (700), never Black.
const btnShared = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontFamily: "var(--font-heading)",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.01em",
  borderRadius: T.radiusSm,
  padding: "13px 18px",
  minHeight: 48,
  cursor: "pointer",
  textDecoration: "none",
  transition: "all 0.15s ease",
};

export const btnPrimary = {
  ...btnShared,
  background: T.orange,
  color: "#0A0A0A",
  border: "none",
};

export const btnSecondary = {
  ...btnShared,
  background: "transparent",
  color: T.textSecondary,
  border: `1px solid ${T.border}`,
};

export const btnAccent = {
  ...btnShared,
  background: T.orangeDim,
  color: T.orange,
  border: `1px solid ${T.heroBorder}`,
};
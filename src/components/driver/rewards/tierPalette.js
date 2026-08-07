/**
 * Tier palette — single source of truth for the three Circles.
 *
 * Imported by both the dashboard cards and the network map so the two can never
 * drift apart.
 *
 * Hues follow the badge artwork (steel → blue → oxblood), but saturation is
 * pulled toward the portal's own tokens: `blue` sits beside Steel Blue
 * (#7C92B5) and `oxblood` is an industrial red rather than a signal red. The
 * design system bans gaming UI and neon glow, so these are finishes on metal,
 * not emissive colour.
 *
 *   base   — the machined face of a lit node / the filled gauge band
 *   rim    — bezel and hairline edges; darker than base
 *   bright — text and small marks; must clear 4.5:1 on card #1C1C1C
 */
export const TIER_PALETTE = {
  inner: {
    base:   "#9AA3AC",   // brushed steel
    rim:    "#565D64",
    bright: "#E4E9ED",
  },
  convoy: {
    base:   "#5F7FA6",   // sits beside the Steel Blue token
    rim:    "#2E425C",
    bright: "#A8C0DC",
  },
  founders: {
    // Oxblood, not signal red. Lightened from #A04038, which measured 2.67:1 on
    // card #1C1C1C — under the 3:1 bar for meaningful graphics.
    base:   "#BE5247",
    rim:    "#5A211C",
    bright: "#E89A92",
  },
};

/**
 * Instrument tones for the gauge unit, sampled off the Founders asset sheet.
 *
 * The dial is its own near-black enclosure (#101214), so these are measured
 * against that rather than the card. Two values are nudged off the raw artwork
 * to clear WCAG on that ground:
 *   convoy band  #1259CE → #1B64DA  (2.99:1, under the 3:1 graphics bar)
 *   readout text  raw hues → the `text` values (both were under 4.5:1)
 *
 *   base / glow / deep — the band gradient, bottom-lit with a specular ridge
 *   text              — the live readout and the "to go" line
 */
export const TIER_GAUGE = {
  inner:    { base: "#B8BCC0", glow: "#FFFFFF", deep: "#5E646A", text: "#FFFFFF" },
  convoy:   { base: "#1B64DA", glow: "#6FB4FF", deep: "#0A2D6B", text: "#6FB4FF" },
  founders: { base: "#D9251B", glow: "#FF7A63", deep: "#5E100B", text: "#FF7A63" },
};

/** Gunmetal used for an unearned seat — same geometry, no tint. */
export const TIER_OFF = {
  base:   "#23272B",
  rim:    "#0D0F11",
  bright: "#5A6067",
};

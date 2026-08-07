/**
 * NetworkNode — one machined seat on the membership map.
 *
 * Finished like a turned metal part rather than a glossy button: a brushed
 * bezel, a matte face with concentric turning marks, a single restrained
 * highlight along the top edge and a contact shadow along the bottom. The
 * design system rules out gaming UI, neon and glassmorphism, so there is no
 * specular sweep and no emissive colour — a lit seat reads as tinted metal
 * catching light, an unlit one as the same part in bare gunmetal.
 */
import React from "react";

/** Tractor-trailer and heraldic shield, drawn at r=16 and scaled. */
function Mark({ kind, r, lit }) {
  const s = r / 16;
  const face = lit ? "url(#nm-mark)" : "#5A6067";
  const edge = "rgba(0,0,0,0.5)";

  if (kind === "inner") {
    return (
      <g transform={`scale(${s})`} fill={face} stroke={edge} strokeWidth="0.45">
        <circle cx="0" cy="-3.9" r="3.4" />
        <path d="M-6.3 6.5c0-3.5 2.8-6 6.3-6s6.3 2.5 6.3 6z" />
      </g>
    );
  }

  if (kind === "convoy") {
    return (
      <g transform={`scale(${s})`} stroke={edge} strokeWidth="0.45">
        <rect x="-8.5" y="-5.5" width="9.1" height="7.8" rx="0.6" fill={face} />
        <path d="M1.0 -2.5h3.1l2.9 3.2v1.6H1.0z" fill={face} />
        <rect x="-8.7" y="2.5" width="15.7" height="1.1" rx="0.45" fill={face} />
        <circle cx="-5.1" cy="5.0" r="1.85" fill={face} />
        <circle cx="-2.4" cy="5.0" r="1.85" fill={face} />
        <circle cx="4.3" cy="5.0" r="1.85" fill={face} />
        <circle cx="-5.1" cy="5.0" r="0.65" fill="rgba(0,0,0,0.55)" stroke="none" />
        <circle cx="-2.4" cy="5.0" r="0.65" fill="rgba(0,0,0,0.55)" stroke="none" />
        <circle cx="4.3" cy="5.0" r="0.65" fill="rgba(0,0,0,0.55)" stroke="none" />
      </g>
    );
  }

  return (
    <g transform={`scale(${s})`}>
      <path
        d="M0 -7.2 7.2 -4.5v5C7.2 4.5 4.1 7.1 0 8.4-4.1 7.1-7.2 4.5-7.2 0.5v-5z"
        fill={face}
        stroke={edge}
        strokeWidth="0.55"
      />
      <path d="M0 -6v13.8C-3.3 6.7-6 4.4-6 0.5v-4.1z" fill="rgba(0,0,0,0.18)" />
    </g>
  );
}

export default function NetworkNode({ x, y, r, kind, lit, tone }) {
  const faceR = r - 2.4;

  return (
    <g transform={`translate(${x} ${y})`}>
      {/* seated in the dial face */}
      <ellipse cx="0" cy={r * 0.34} rx={r * 0.94} ry={r * 0.8} fill="rgba(0,0,0,0.5)" />

      {/* brushed bezel, then the recess it sits in */}
      <circle r={r} fill="url(#nm-bezel)" />
      <circle r={r} fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="0.7" />
      <circle r={r - 1.5} fill="#0B0D0F" />

      {/* matte machined face */}
      <circle r={faceR} fill={tone.base} />
      <circle r={faceR} fill="url(#nm-face-shade)" />

      {/* turning marks — the tell of a cut part, not a moulded one */}
      <g opacity={lit ? 0.28 : 0.2}>
        <circle r={faceR * 0.82} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5" />
        <circle r={faceR * 0.6} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="0.4" />
      </g>

      {/* one highlight along the top edge, one contact shadow at the bottom */}
      <circle r={faceR} fill="none" stroke="url(#nm-lip)" strokeWidth="1.4" />

      <Mark kind={kind} r={r} lit={lit} />

      {/* hairline keeps the silhouette crisp against the dark face */}
      <circle r={r - 1.5} fill="none" stroke={tone.rim} strokeWidth="0.9" />
    </g>
  );
}

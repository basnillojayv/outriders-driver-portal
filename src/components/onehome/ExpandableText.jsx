import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { OH } from "./ohConstants";

const expandBtnSt = {
  display: "inline-flex", alignItems: "center", gap: 4,
  background: "none", border: "none", cursor: "pointer",
  color: OH.accentLight, fontFamily: "var(--font-heading)",
  fontWeight: 700, fontSize: 13, padding: 0, marginTop: 10,
};

export default function ExpandableText({ short, expanded, shortStyle, expandedStyle }) {
  const [open, setOpen] = useState(false);

  const defaultShortStyle = {
    fontFamily: "var(--font-heading)",
    fontWeight: 700,
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
    lineHeight: 1.8,
    textShadow: "0 2px 8px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.9)",
  };

  const defaultExpandedStyle = {
    fontFamily: "var(--font-heading)",
    fontWeight: 700,
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
    lineHeight: 1.8,
    textShadow: "0 2px 8px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.9)",
    marginTop: 14,
    whiteSpace: "pre-line",
  };

  return (
    <div>
      <p style={{ ...defaultShortStyle, ...shortStyle }}>{short}</p>
      {expanded && open && (
        <p style={{ ...defaultExpandedStyle, ...expandedStyle }}>{expanded}</p>
      )}
      {expanded && (
        <button style={expandBtnSt} onClick={() => setOpen(!open)}>
          {open ? "Read Less" : "Read More"}
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      )}
    </div>
  );
}
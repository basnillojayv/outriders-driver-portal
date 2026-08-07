/**
 * LHSWebsite — link out to the public LineHaul Station website.
 */
import React from "react";
import { Globe } from "lucide-react";
import { T, steelCard, btnPrimary } from "../v3/v3tokens";

const WEBSITE_URL = "https://www.linehaulstation.com";

export default function LHSWebsite() {
  return (
    <div style={steelCard}>
      <a
        href={WEBSITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 transition-all active:scale-95"
        style={{ ...btnPrimary, textDecoration: "none" }}
      >
        <Globe size={15} />
        Visit LineHaulStation.com
      </a>
    </div>
  );
}
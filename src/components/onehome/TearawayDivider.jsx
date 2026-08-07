import React from "react";
import { IMG, OH } from "./ohConstants";

/**
 * Tearaway transition between sections.
 * direction: "left" | "right" — alternates the tear direction via horizontal flip
 * Since tearaway PNGs may not be available yet, we render a cinematic texture strip
 * that mimics the pull-tab feel using ONEHOME-bg1.jpg + gradient edges.
 * When tearaway-left.png / tearaway-right.png are pushed to GitHub they'll show automatically.
 */
export default function TearawayDivider({ direction = "left", lifestyle }) {
  const flip = direction === "right";

  return (
    <div style={{ position: "relative", width: "100%", margin: "-2px 0", zIndex: 5, overflow: "hidden" }}>
      {/* Attempt real tearaway PNG */}
      <img
        src={`${IMG}tearaway-${direction}.png`}
        alt=""
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          transform: flip ? "scaleX(-1)" : "none",
        }}
        onError={(e) => {
          // Fallback: hide the PNG, reveal the texture fallback below
          e.target.style.display = "none";
          if (e.target.nextSibling) e.target.nextSibling.style.display = "block";
        }}
      />

      {/* Texture fallback (hidden until PNG fails) */}
      <div
        style={{
          display: "none",
          position: "relative",
          height: 220,
          overflow: "hidden",
          background: OH.bg,
        }}
      >
        <img
          src={`${IMG}ONEHOME-bg1.jpg`} alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        {lifestyle && (
          <img
            src={`${IMG}${lifestyle}`} alt=""
            loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}
        {/* Jagged edge overlays using clipping */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 60,
          background: `linear-gradient(180deg, ${OH.bg} 0%, transparent 100%)`,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
          background: `linear-gradient(0deg, ${OH.bg} 0%, transparent 100%)`,
        }} />
        {/* Diagonal accent line for tear feel */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: flip ? "auto" : 0,
          right: flip ? 0 : "auto",
          width: "100%",
          height: 2,
          background: `linear-gradient(${flip ? "270deg" : "90deg"}, transparent, rgba(238,117,44,0.3) 50%, transparent)`,
          transform: `translateY(-50%) rotate(${flip ? "-1.5deg" : "1.5deg"})`,
        }} />
      </div>
    </div>
  );
}
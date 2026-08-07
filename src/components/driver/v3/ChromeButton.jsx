/**
 * ChromeButton — truck-dashboard aesthetic control.
 * Brushed radial metal grain, dark beveled frame, glowing amber LED ring,
 * etched/debossed dark icon with specular highlights.
 */
import React from "react";

export default function ChromeButton({
  as: As = "button",
  size = 40,
  icon: Icon,
  iconSize = 16,
  iconStrokeWidth = 2.2,
  ariaLabel,
  onClick,
  to,
  active = false,
  style,
  children,
}) {
  const props = {
    onClick,
    to,
    "aria-label": ariaLabel,
    style: {
      position: "relative",
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none",
      border: "1px solid #1A1A1A",
      background:
        "radial-gradient(circle at 50% 35%, #A8A8A8 0%, #787878 40%, #4A4A4A 72%, #2A2A2A 100%)",
      boxShadow:
        "0 2px 6px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.6)",
      cursor: "pointer",
      ...style,
    },
  };

  return (
    <As {...props}>
      {/* Amber LED ring */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,149,0,0.9)",
          boxShadow: active
            ? "0 0 8px rgba(255,149,0,0.85), 0 0 16px rgba(255,149,0,0.4), inset 0 0 6px rgba(255,149,0,0.6)"
            : "0 0 5px rgba(255,149,0,0.6), inset 0 0 4px rgba(255,149,0,0.4)",
          pointerEvents: "none",
        }}
      />
      {/* Brushed-metal inner disc with radial grain */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 6,
          borderRadius: "50%",
          background:
            "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.07) 0deg 1.5deg, rgba(0,0,0,0.07) 1.5deg 3deg), radial-gradient(circle at 50% 35%, #989898 0%, #626262 55%, #3A3A3A 100%)",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.55)",
          pointerEvents: "none",
        }}
      />
      {/* Specular highlight — 10 o'clock */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "18%",
          left: "22%",
          width: "22%",
          height: "14%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.28)",
          filter: "blur(3px)",
          pointerEvents: "none",
        }}
      />
      {/* Specular highlight — 4 o'clock */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: "20%",
          right: "24%",
          width: "16%",
          height: "10%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.16)",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
      {Icon && (
        <Icon
          size={iconSize}
          strokeWidth={iconStrokeWidth}
          style={{
            position: "relative",
            zIndex: 1,
            color: "#161616",
            filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.3)) drop-shadow(0 -1px 1px rgba(0,0,0,0.5))",
          }}
        />
      )}
      {children}
    </As>
  );
}
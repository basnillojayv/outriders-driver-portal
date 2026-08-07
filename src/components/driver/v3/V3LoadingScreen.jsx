import React, { useState, useEffect } from "react";
import { carbonBg, T } from "@/components/driver/v3/v3tokens";

const OUTRIDERS_LOGO =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/6cb494d67_lhs_outriders_logo_circle.png";

export default function V3LoadingScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="h-screen flex flex-col items-center justify-center gap-8"
      style={{
        ...carbonBg,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          opacity: 0.9,
          animation: "v3-coin 2s ease-in-out infinite",
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        <img
          src={OUTRIDERS_LOGO}
          alt="Outriders"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        />
        <img
          src={OUTRIDERS_LOGO}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        />
      </div>

      <style>{`
        @keyframes v3-coin {
          0%   { transform: rotateY(0deg); }
          50%  { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
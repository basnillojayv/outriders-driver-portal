import React, { useRef, useEffect, useState } from "react";
import { IMG, OH } from "./ohConstants";

/**
 * Full-width parallax section.
 * images: array of filenames (1 = static, 2+ = series that crossfade)
 * minHeight: section height
 * overlay: gradient string override
 */
export default function ParallaxSection({ images = [], minHeight = 500, children, overlay, isMobile }) {
  const ref = useRef(null);
  const imgRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Parallax scroll effect (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const el = ref.current;
    const imgEl = imgRef.current;
    if (!el || !imgEl) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const progress = -rect.top / (rect.height + window.innerHeight);
      imgEl.style.transform = `translateY(${progress * 80}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  // Series crossfade timer
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const defaultOverlay = `linear-gradient(180deg, rgba(26,14,10,0.55) 0%, rgba(18,8,4,0.8) 50%, rgba(26,14,10,0.65) 100%)`;

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        minHeight,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: OH.bg,
      }}
    >
      {/* Background images */}
      {images.map((src, i) => (
        <img
          key={src}
          ref={i === 0 ? imgRef : null}
          src={`${IMG}${src}`}
          alt=""
          loading={i === 0 ? "eager" : "lazy"}
          style={{
            position: "absolute",
            inset: isMobile ? 0 : "-20% 0",
            width: "100%",
            height: isMobile ? "100%" : "140%",
            objectFit: "cover",
            willChange: "transform",
            transition: "opacity 1.5s ease",
            opacity: i === activeIdx ? 1 : 0,
            pointerEvents: "none",
          }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ))}

      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: overlay || defaultOverlay,
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 540, padding: "60px 24px" }}>
        {children}
      </div>
    </div>
  );
}
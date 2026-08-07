import React from "react";
import { IMG, OH } from "./ohConstants";
import ParallaxSection from "./ParallaxSection";
import TearawayDivider from "./TearawayDivider";

export default function AmenityParallaxSection({ amenity, tearDirection = "left", isMobile, showFleetLogo }) {
  return (
    <>
      <ParallaxSection
        images={amenity.lifestyle}
        minHeight={isMobile ? 380 : 520}
        isMobile={isMobile}
        overlay="linear-gradient(180deg, rgba(18,8,4,0.45) 0%, rgba(18,8,4,0.7) 45%, rgba(18,8,4,0.92) 100%)"
      >
        <div style={{ textAlign: "center" }}>
          {/* Amenity card image as floating element */}
          <div style={{
            width: 80, height: 80, margin: "0 auto 20px",
            borderRadius: 16, overflow: "hidden",
            border: `1.5px solid ${OH.borderAcc}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}>
            <img
              src={`${IMG}${amenity.img}`}
              alt={amenity.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>

          {showFleetLogo && (
            <img
              src={`${IMG}Fleet-Services-LOGO.png`} alt="Fleet Services"
              style={{ height: 32, margin: "0 auto 16px", display: "block" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}

          <p style={{
            fontFamily: "var(--font-heading)", fontWeight: 900,
            fontSize: "clamp(22px, 5vw, 32px)",
            color: OH.text, marginBottom: 8, lineHeight: 1.1,
          }}>
            {amenity.name}
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12,
            color: OH.accent, letterSpacing: "1.5px", textTransform: "uppercase",
            marginBottom: 16,
          }}>
            {amenity.tagline}
          </p>
          <p style={{
            color: OH.textSec, fontSize: 16, lineHeight: 1.7,
            maxWidth: 360, margin: "0 auto",
          }}>
            {amenity.desc}
          </p>

          {amenity.fleetServices && (
            <div style={{ marginTop: 24, maxWidth: 400, margin: "24px auto 0", textAlign: "left" }}>
              <p style={{ color: OH.textSec, fontSize: 15, lineHeight: 1.75, marginBottom: 14 }}>
                Breakdowns can be financially devastating and our approach to superior maintenance and repair is uncompromised. The costs can add up quickly, and our highly experienced team has the connections to source products at the best prices and will always be fair with our labor rates.
              </p>
              <p style={{ color: OH.textSec, fontSize: 15, lineHeight: 1.75 }}>
                We also recognize the importance of maintaining a clean fleet and our state-of-the-art truck wash will help ensure your impeccable image matches your quality brand.
              </p>
            </div>
          )}
        </div>
      </ParallaxSection>

      <TearawayDivider direction={tearDirection} />
    </>
  );
}
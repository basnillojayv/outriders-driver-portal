import React, { useState, useEffect } from "react";
import {
  OH, IMG, AMENITIES, LIFE_SITUATIONS, REGIONS,
  PROGRAM_SUMMARY_SHORT,
  HOME_TODAY_EXPANDED,
  TRUCKERS_OPTION_SHORT, TRUCKERS_OPTION_EXPANDED,
  CALC_INTRO, AMENITIES_INTRO,
  NETWORK_SHORT, NETWORK_EXPANDED,
  HOME_HUB_SHORT, HOME_HUB_EXPANDED,
  WAITLIST_SHORT } from
"@/components/onehome/ohConstants";
import ExpandableText from "@/components/onehome/ExpandableText";
import InlineCalculator from "@/components/onehome/InlineCalculator";
import PublicWaitlistForm from "@/components/onehome/PublicWaitlistForm";

/* Crossfading images component */
function CrossfadeImages({ images }) {
  const [active, setActive] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % 2), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden", aspectRatio: "16/9" }}>
      {images.map((img, i) =>
      <img key={img} src={`${IMG}${img}`} alt="" loading="lazy"
      style={{ position: i === 0 ? "relative" : "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: active === i ? 1 : 0, transition: "opacity 1s ease-in-out" }}
      onError={(e) => {e.target.style.display = "none";}} />

      )}
    </div>);

}

/* Memphis skyline crossfade */
function MemphisImages() {
  return <CrossfadeImages images={["lifestyle-memphis-skyline1.png", "lifestyle-memphis-skyline2.png"]} />;
}

const BG = {
  backgroundImage: `url(${IMG}ONEHOME-bg1.jpg)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "transparent"
};

// Consistent body copy style across all OneHome sections
const BODY = {
  fontFamily: "var(--font-heading)",
  fontWeight: 700,
  fontSize: 15,
  color: "rgba(255,255,255,0.92)",
  lineHeight: 1.8,
  textShadow: "0 2px 8px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.9)",
};

// Lighter body style for amenity copy
const BODY_LIGHT = {
  fontFamily: "var(--font-body)",
  fontWeight: 400,
  fontSize: 15,
  color: "rgba(255,255,255,0.88)",
  lineHeight: 1.75,
  textShadow: "0 1px 4px rgba(0,0,0,0.6)",
};

function AmenityBlock({ amenity }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = amenity.fullDesc || amenity.extDesc;

  return (
    <div style={{ ...BG, padding: "36px 16px 32px", borderTop: `1px solid ${OH.border}` }}>
      <div>
        {amenity.logoImg ? (
          <img
            src={`${IMG}${amenity.logoImg}`} alt={amenity.name} loading="lazy"
            style={{ height: 40, display: "block", marginBottom: 10, objectFit: "contain" }}
            onError={(e) => { e.target.style.display = "none"; }} />
        ) : (
          <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 22, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.6)", marginBottom: 6, lineHeight: 1.1 }}>
            {amenity.name}
          </h3>
        )}
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 11, color: OH.accentLight, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>
          {amenity.tagline}
        </p>
        <p style={BODY_LIGHT}>{amenity.desc}</p>
      </div>
      <img
        src={`${IMG}${amenity.img}`} alt={amenity.name} loading="lazy"
        style={{ width: "100%", height: "auto", display: "block", margin: "20px 0 0", padding: 0, border: "none", background: "none" }}
        onError={(e) => {e.target.style.display = "none";}} />

      {hasMore && !expanded && (
        <div style={{ position: "relative", marginTop: 20 }}>
          <p style={{ ...BODY_LIGHT, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
            {amenity.fullDesc || amenity.extDesc?.split("\n\n")[0]}
          </p>

          <button
            onClick={() => setExpanded(true)}
            style={{ background: "none", border: "none", color: OH.accentLight, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: "10px 0 0", letterSpacing: "0.3px", display: "block" }}
          >
            Read more ↓
          </button>
        </div>
      )}

      {expanded && (
        <>
          {amenity.fullDesc && (
            <div style={{ padding: "20px 0 0" }}>
              <p style={BODY_LIGHT}>{amenity.fullDesc}</p>
            </div>
          )}
          {amenity.extDesc && (
            <div style={{ padding: "16px 0 0" }}>
              {amenity.extDesc.split("\n\n").map((para, i) =>
                <p key={i} style={{ ...BODY_LIGHT, marginBottom: i === 0 ? 12 : 0, fontStyle: i === 0 ? "italic" : "normal" }}>{para}</p>
              )}
            </div>
          )}
          <button
            onClick={() => setExpanded(false)}
            style={{ background: "none", border: "none", color: OH.textMuted, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: "14px 0 0", letterSpacing: "0.3px" }}
          >
            Read less ↑
          </button>
        </>
      )}
    </div>
  );
}

export default function JoinOneHome() {
  const [calcData, setCalcData] = useState(null);

  return (
    <div style={{ background: "#1a0e0a", minHeight: "100vh", overflowX: "hidden" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

      {/* ── LOGO + HERO ── */}
      <section style={{ ...BG, padding: "40px 16px 0", textAlign: "center" }}>
        <div style={{ textAlign: "center" }}>
          <img
            src={`${IMG}ONEHOME-LOGO-main.png`} alt="OneHome"
            style={{ width: "100%", maxWidth: 260, margin: "0 auto 32px", display: "block" }}
            onError={(e) => {e.target.style.display = "none";}} />
          
        </div>
        <img
          src={`${IMG}ONEHOME-hero1.png`} alt=""
          style={{ width: "100%", height: "auto", display: "block", margin: 0, padding: 0, border: "none", background: "none" }}
          onError={(e) => {e.target.style.display = "none";}} />
        
      </section>

      {/* ── PROGRAM SUMMARY ── */}
      <section style={{ ...BG, padding: "40px 16px" }}>
        <div>
          <p style={BODY}>{PROGRAM_SUMMARY_SHORT}</p>
        </div>
      </section>

      {/* ── WHAT IS HOME FOR YOU TODAY ── */}
      <section style={{ ...BG, padding: "40px 16px 0", borderTop: `1px solid ${OH.border}` }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src={`${IMG}headline-what-is-home-for-you-today.png`} alt="What Is Home For You Today?"
            style={{ width: "100%", maxWidth: 420, margin: "0 auto", display: "block" }}
            onError={(e) => {e.target.style.display = "none";}} />
          
        </div>
        <img
          src={`${IMG}ONEHOME-comparison.png`} alt="Cost Comparison"
          style={{ width: "100%", display: "block", margin: 0, padding: 0, mixBlendMode: "lighten" }}
          loading="lazy"
          onError={(e) => {e.target.style.display = "none";}} />
        
      </section>
      <section style={{ ...BG, padding: "28px 16px 40px" }}>
        <div>
          {HOME_TODAY_EXPANDED.split("\n\n").map((para, i) =>
          <p key={i} style={{ ...BODY, marginBottom: i < 2 ? 16 : 0 }}>{para}</p>
          )}
        </div>
      </section>

      {/* ── RELAX IMAGES CROSSFADE ── */}
      <CrossfadeImages images={["lifestyle-relax1.png", "lifestyle-relax2.png"]} />

      {/* ── TRUCKERS HAVE A NEW OPTION ── */}
      <section style={{ ...BG, padding: "40px 16px", borderTop: `1px solid ${OH.border}` }}>
        <div>
          <img
            src={`${IMG}headline-truckers-have-a-new-option.png`} alt="Truckers Have A New Option"
            style={{ width: "100%", maxWidth: 420, margin: "0 auto 20px", display: "block" }}
            onError={(e) => {e.target.style.display = "none";}} />
          
          <p style={BODY}>{TRUCKERS_OPTION_SHORT} {TRUCKERS_OPTION_EXPANDED.split("ONLY PAY FOR THE DAYS YOU USE IT.")[0]}ONLY PAY FOR THE DAYS YOU USE IT.</p>
        </div>
      </section>

      {/* ── MEMPHIS IMAGES ── */}
      <MemphisImages />

      {/* ── LIFESTYLE CALCULATOR ── */}
      <section style={{ ...BG, padding: "40px 16px", borderTop: `1px solid ${OH.border}` }}>
        <div>
          <img
            src={`${IMG}headline-you-will-love-how-the-numbers-add-up.png`} alt="You Will Love How The Numbers Add Up"
            style={{ width: "100%", maxWidth: 520, margin: "0 auto 24px", display: "block" }}
            onError={(e) => {e.target.style.display = "none";}} />
          
          {CALC_INTRO.split("\n\n").map((para, i) =>
          <p key={i} style={{ ...BODY, marginBottom: 20 }}>{para}</p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <img
              src={`${IMG}ONEHOME-LOGO-text.png`} alt="OneHome"
              style={{ height: 18, display: "block", filter: "brightness(0) invert(1) opacity(0.85)", flexShrink: 0 }}
              onError={(e) => {e.target.style.display = "none";}} />
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: OH.accentLight, letterSpacing: "0.5px", margin: 0 }}>
              DRIVER LIFESTYLE CALCULATOR
            </p>
          </div>
          {calcData ?
          <div style={{ background: "rgba(13,42,26,0.7)", border: `2px solid ${OH.green}50`, borderRadius: 14, padding: "16px 18px", textAlign: "center" }}>
              <p style={{ color: OH.green, fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 12, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>Calculator Complete ✓</p>
              <p style={{ color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 24, marginBottom: 4 }}>${calcData.savings.toLocaleString()}/year savings</p>
              <button onClick={() => setCalcData(null)} style={{ background: "none", border: "none", color: OH.accentLight, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                Run again →
              </button>
            </div> :
          <InlineCalculator onComplete={setCalcData} />
          }
        </div>
      </section>

      {/* ── AMENITIES ── */}
      <section style={{ ...BG, padding: "48px 16px 28px" }}>
        <div style={{ textAlign: "center" }}>
          <img
            src={`${IMG}ONEHOME-LOGO-main.png`} alt="OneHome"
            style={{ width: "100%", maxWidth: 200, margin: "0 auto 16px", display: "block" }}
            onError={(e) => {e.target.style.display = "none";}} />
          
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 20, color: "#fff", marginBottom: 16 }}>
            Absolutely Amazing Amenities
          </h2>
          <p style={{ ...BODY, textAlign: "left" }}>{AMENITIES_INTRO}</p>
        </div>
      </section>

      {AMENITIES.slice(0, 3).map((amenity) =>
      <AmenityBlock key={amenity.name} amenity={amenity} />
      )}

      {/* ── LIFESTYLE IMAGES — DINING + GAMING ── */}
      <CrossfadeImages images={["lifestyle-dinner1.png", "lifestyle-billiards.png", "lifestyle-dinner2.png", "lifestyle-trap-and-skeet.png"]} />

      {AMENITIES.slice(3, 6).map((amenity) =>
      <AmenityBlock key={amenity.name} amenity={amenity} />
      )}

      {/* ── LIFESTYLE IMAGES — LAUNDRY + GEAR + GYM ── */}
      <CrossfadeImages images={["lifestyle-laundry.png", "lifestyle-gear-shop.png", "lifestyle-gym.png"]} />

      {AMENITIES.slice(6, 8).map((amenity) =>
      <AmenityBlock key={amenity.name} amenity={amenity} />
      )}

      {/* ── LIFESTYLE IMAGES — DOG PARK + TRUCK WASH ── */}
      <CrossfadeImages images={["lifestyle-dog-park1.png", "lifestyle-truck-wash.png", "lifestyle-dog-park2.png"]} />

      {AMENITIES.slice(8).map((amenity) =>
      <AmenityBlock key={amenity.name} amenity={amenity} />
      )}

      {/* ── NETWORK + LIFESTYLE IMAGES — CORNHOLE + SKYDECK ── */}
      <section style={{ ...BG, padding: "44px 16px", borderTop: `1px solid ${OH.border}` }}>
        <div>
          <img
            src={`${IMG}ONEHOME-LOGO-main.png`} alt="OneHome"
            style={{ width: "100%", maxWidth: 200, margin: "0 auto 24px", display: "block" }}
            onError={(e) => {e.target.style.display = "none";}} />
          
          <img
            src={`${IMG}ONEHOME-map.png`} alt="Network Map"
            style={{ width: "100%", borderRadius: 12, marginBottom: 24 }}
            loading="lazy"
            onError={(e) => {e.target.style.display = "none";}} />

          <div style={{ marginBottom: 24 }}>
            <p style={{ ...BODY, marginBottom: 14 }}>
              OneHome is built on a network that continues to grow. As new locations open, your access expands—giving you more places to feel at home wherever the road takes you.
            </p>
            <p style={BODY}>
              This isn't just a single destination. It's a lifestyle program designed to move with you. The more the network grows, the more valuable your membership becomes—and the fewer nights you'll ever need to spend in a truck stop again.
            </p>
          </div>
        </div>
      </section>

      {/* ── LIFESTYLE IMAGES — CORNHOLE + SKYDECK ── */}
      <CrossfadeImages images={["lifestyle-cornhole.png", "lifestyle-skydeck1.png", "lifestyle-skydeck2.png"]} />

      {/* ── EVERYTHING YOU NEED ── */}
      <section style={{ ...BG, padding: "44px 16px", borderTop: `1px solid ${OH.border}` }}>
        <div>
          <img
            src={`${IMG}ONEHOME-services1.png`} alt="Services"
            style={{ width: "100%", borderRadius: 12, marginBottom: 24 }}
            loading="lazy"
            onError={(e) => {e.target.style.display = "none";}} />

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <img src={`${IMG}ONEHOME-LOGO-square.png`} alt="" style={{ width: 26, height: 26, objectFit: "contain" }} onError={(e) => {e.target.style.display = "none";}} />
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17, color: "#fff" }}>EVERYTHING YOU NEED</h3>
          </div>
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: OH.accentLight, marginBottom: 12 }}>
            We have EVERYTHING you need.<br />Personal Storage • Mail Services • Personal Vehicle
          </p>
          <ExpandableText short={HOME_HUB_SHORT} expanded={HOME_HUB_EXPANDED} shortStyle={{ fontSize: 14, marginBottom: 14 }} />
        </div>
      </section>

      {/* ── PUBLIC WAITING LIST FORM ── */}
      <section style={{ ...BG, padding: "44px 16px 60px", borderTop: `1px solid ${OH.border}` }}>
        <div>
          <PublicWaitlistForm />
        </div>
      </section>
      </div>
    </div>);

}
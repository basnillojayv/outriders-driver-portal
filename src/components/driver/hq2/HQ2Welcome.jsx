import React from "react";

export default function HQ2Welcome({ firstName }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";

  return (
    <div>
      <p
        className="font-v2-head text-v2-text"
        style={{ fontSize: 22, letterSpacing: "0.02em", fontWeight: 700 }}
      >
        Good {greeting}, {firstName}!
      </p>
    </div>
  );
}
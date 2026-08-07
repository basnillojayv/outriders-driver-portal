import React from "react";

export default function WelcomeMessage({ firstName }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";

  return (
    <div className="space-y-1">
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 900, color: "var(--text-primary)" }}>
        Good {greeting}, {firstName}!
      </p>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { T } from "../v3tokens";

// Rotating greetings shown across the LHS app. Index is derived from the
// current hour so the greeting changes automatically every hour.
const GREETINGS = [
  "Howdy",
  "Hola",
  "Cheers",
  "Hi",
  "Welcome",
  "Hello",
  "Greetings",
  "Welcome Back",
  "Aloha",
  "Ciao",
  "Namaste",
  "Let's Roll",
  "Bonjour",
  "Morning",
  "Afternoon",
  "Evening",
  "Yo",
];

export default function HomeGreeting({ firstName }) {
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    return GREETINGS[hour % GREETINGS.length];
  });

  // Refresh once an hour in case the app stays open across an hour boundary.
  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      setGreeting(GREETINGS[hour % GREETINGS.length]);
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 28,
          fontWeight: 700,
          color: T.textPrimary,
          textTransform: "uppercase",
          lineHeight: 1.08,
          letterSpacing: "0.02em",
        }}
      >
        {greeting}, {firstName}!
      </h1>
    </div>
  );
}
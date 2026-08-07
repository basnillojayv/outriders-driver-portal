import React from "react";

export default function WelcomeSection({ firstName, isActive, memberSince }) {
  const sinceYear = memberSince ? new Date(memberSince).getFullYear() : null;

  return (
    <div className="space-y-1">
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.15 }}>
        Welcome back, {firstName}.
      </p>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
        {isActive
          ? `Your membership is active. Thanks for being part of the Outriders Club.`
          : "Your membership is being processed. We'll have you set up shortly."}
        {sinceYear && ` Member since ${sinceYear}.`}
      </p>
    </div>
  );
}
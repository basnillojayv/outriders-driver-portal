import React from "react";
import { Info } from "lucide-react";
import { T } from "@/components/driver/v3/v3tokens";

export default function HowRankGrows() {
  const lines = [
    { term: "Lead",    desc: "is earned through your direct referrals." },
    { term: "Guide",   desc: "grows as your referrals begin referring other drivers." },
    { term: "Protect", desc: "reflects the continued growth of your extended network." },
    { term: "Founder", desc: "recognizes exceptional contribution to the Outriders community." },
  ];

  return (
    <div className="space-y-3">
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 10,
          fontWeight: 700,
          color: T.orange,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}
      >
        How Your Rank Grows
      </p>

      <div
        className="rounded-[14px] p-5 space-y-3"
        style={{ background: T.blueDim, border: `1px solid ${T.blue}`, backgroundImage: "none", isolation: "isolate" }}
      >
        <div className="flex gap-3">
          <Info size={16} style={{ color: T.blue, marginTop: 1, flexShrink: 0 }} />
          <div className="space-y-2.5 text-sm">
            {lines.map((l) => (
              <p key={l.term} style={{ color: T.textSecondary, lineHeight: 1.6 }}>
                <strong style={{ color: T.textPrimary, fontWeight: 700 }}>{l.term}</strong> {l.desc}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
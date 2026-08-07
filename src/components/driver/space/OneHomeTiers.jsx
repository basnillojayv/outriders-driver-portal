import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react";

const TIERS = [
  { label: "15–29 Days", days: 15, equityPerDay: 225, totalEquity: 3375, duesPerDay: 25, monthly: "337.50", refundable: 2700 },
  { label: "30–59 Days", days: 30, equityPerDay: 220, totalEquity: 6600, duesPerDay: 23, monthly: "660", refundable: 5280 },
  { label: "60–99 Days", days: 60, equityPerDay: 215, totalEquity: 12900, duesPerDay: 21, monthly: "1,290", refundable: 10320 },
  { label: "100–364 Days", days: 100, equityPerDay: 195, totalEquity: 19500, duesPerDay: 19, monthly: "1,950", refundable: 15600, featured: true },
  { label: "365 Days", days: 365, equityPerDay: 175, totalEquity: 63875, duesPerDay: 16, monthly: "6,387.50", refundable: 51100 },
];

function fmt(n) {
  return n.toLocaleString("en-US");
}

export default function OneHomeTiers() {
  return (
    <div className="space-y-4" id="onehome">
      {/* Header */}
      <div>
        <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-widest mb-1">ONEHOME MEMBERSHIP</p>
        <p className="text-sm text-muted-foreground font-medium">Two components, always separate.</p>
      </div>

      {/* Two Components explainer */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1 pb-3 border-b border-border">
            <p className="font-heading font-semibold text-sm">Component 1</p>
            <p className="text-fuel-orange font-heading font-bold text-base">Daily Member Rate: $19/day</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pay only for the days you use it. All amenities, facilities, and truck parking included.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-heading font-semibold text-sm">Component 2</p>
            <p className="font-heading font-bold text-base">Refundable Equity Fee</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A one-time investment based on your planned usage days. This is YOUR asset — not a cost. <span className="text-lhs-green font-semibold">80% refundable.</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Early Adopter Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-fuel-orange text-white text-xs font-heading font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Early Adopter — West Memphis
        </span>
      </div>
      <p className="text-xs text-muted-foreground">The lowest price this membership will ever be at this location. 33.9% off.</p>

      {/* Tier Cards */}
      <div className="space-y-3">
        {TIERS.map((t) => (
          <Card
            key={t.label}
            className={t.featured ? "border-2 border-fuel-orange shadow-md" : ""}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-heading font-bold text-sm">{t.label} PLAN</p>
                {t.featured && (
                  <span className="bg-fuel-orange text-white text-xs font-heading font-semibold px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Early Adopter — West Memphis</p>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Equity/Day</span>
                <span className="font-semibold">${fmt(t.equityPerDay)}/day</span>
                <span className="text-muted-foreground">Total Equity</span>
                <span className="font-semibold">${fmt(t.totalEquity)}</span>
                <span className="text-muted-foreground">Daily Member Rate</span>
                <span className="font-semibold text-fuel-orange">${t.duesPerDay}/day</span>
                <span className="text-muted-foreground">12-Mo Plan</span>
                <span className="font-semibold">${t.monthly}/mo</span>
                <span className="text-muted-foreground">80% Refundable</span>
                <span className="font-semibold text-lhs-green">${fmt(t.refundable)}</span>
              </div>
              <a
                href="tel:6028588000"
                className="flex items-center justify-center gap-2 w-full mt-1 border border-fuel-orange text-fuel-orange rounded-xl py-2.5 text-sm font-heading font-semibold hover:bg-fuel-orange hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" /> Talk to JJ — 602-858-8000
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Three Ways to Pay */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <p className="font-heading font-bold text-sm">THREE WAYS TO PAY</p>
          <p className="text-xs text-muted-foreground">All lead to the same result: $19/day member rate once fully paid.</p>
          <div className="space-y-3">
            {[
              { n: "1", label: "Pay In Full", desc: "One-time. Lowest total cost. $19/day member rate starts now." },
              { n: "2", label: "12-Month Plan", desc: "Monthly payments for 12 months. Includes 20% premium. $19/day member rate starts day one." },
              { n: "3", label: "24-Month Plan", desc: "Lowest monthly payment. Includes 20% premium. $19/day member rate starts day one." },
            ].map((item) => (
              <div key={item.n} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-fuel-orange text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.n}
                </span>
                <div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main CTA */}
      <a
        href="tel:6028588000"
        className="flex items-center justify-center gap-2 w-full bg-fuel-orange text-white rounded-xl py-4 font-heading font-bold text-base hover:bg-fuel-orange/90 transition-colors"
      >
        <Phone className="w-5 h-5" /> Talk to JJ Swenson — 602-858-8000
      </a>
    </div>
  );
}
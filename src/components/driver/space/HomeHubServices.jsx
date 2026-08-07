import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const SERVICES = [
  { icon: "✉", label: "Mail Service", price: "$22/mo" },
  { icon: "🚗", label: "Personal Vehicle Parking", price: "$135/mo" },
  { icon: "📦", label: "Storage Locker (5×10)", price: "$100/mo" },
  { icon: "📶", label: "Internet / WiFi", price: "INCLUDED", included: true },
  { icon: "⚡", label: "Utilities & Taxes", price: "INCLUDED", included: true },
  { icon: "🚛", label: "Truck Parking (on-site)", price: "INCLUDED", included: true },
];

export default function HomeHubServices() {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-widest mb-1">YOUR HOME HUB</p>
        <p className="text-sm text-foreground font-medium">Everything you need. One place.</p>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Every OneHome member selects a Home Hub — your personal anchor in the network.
      </p>
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {SERVICES.map((s) => (
            <div key={s.label} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="text-base">{s.icon}</span>
                <span className="text-sm">{s.label}</span>
              </div>
              <span className={`text-sm font-semibold ${s.included ? "text-lhs-green" : "text-foreground"}`}>
                {s.price}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="bg-lhs-green/5 border-lhs-green/30">
        <CardContent className="p-4 space-y-1">
          <p className="font-heading font-bold text-lhs-green text-base">TOTAL: $415/mo</p>
          <p className="text-xs text-muted-foreground">Based on 100 days/year with full Home Hub services.</p>
          <p className="text-sm text-foreground leading-relaxed mt-1">That's the complete cost of living at LineHaul Station. No hidden costs.</p>
        </CardContent>
      </Card>
    </div>
  );
}
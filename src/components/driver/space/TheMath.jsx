import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ROWS = [
  { label: "Monthly", renting: "$1,800", owning: "$2,396", onehome: "$415" },
  { label: "Annual", renting: "$21,600", owning: "$28,752", onehome: "$4,984" },
  { label: "Per Day", renting: "$59", owning: "$79", onehome: "$19" },
  { label: "10 Years", renting: "$216,000", owning: "$249,120", onehome: "$49,840" },
  { label: "30 Years", renting: "$648,000", owning: "$747,360", onehome: "$149,520" },
];

export default function TheMath() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-widest mb-1">THE MATH</p>
        <p className="text-sm text-muted-foreground">See how OneHome compares to renting or owning. (100-day plan)</p>
      </div>

      {/* Mobile: stacked cards */}
      <div className="space-y-3">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 space-y-2">
            <p className="font-heading font-bold text-sm text-destructive">Renting</p>
            {ROWS.map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-semibold">{r.renting}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/3">
          <CardContent className="p-4 space-y-2">
            <p className="font-heading font-bold text-sm">Owning ($200K home)</p>
            {ROWS.map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-semibold">{r.owning}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-2 border-lhs-green bg-lhs-green/5">
          <CardContent className="p-4 space-y-2">
            <p className="font-heading font-bold text-sm text-lhs-green">OneHome (100 days)</p>
            {ROWS.map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-semibold text-lhs-green">{r.onehome}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Savings callout */}
      <Card className="bg-lhs-green text-white">
        <CardContent className="p-4 flex items-start gap-3">
          <TrendingDown className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-heading font-bold text-base">Save $1,683/month</p>
            <p className="font-heading font-semibold text-sm text-white/90">$20,192/year</p>
            <p className="text-sm text-white/80 mt-1 leading-relaxed">That's an 80% reduction in housing costs.</p>
          </div>
        </CardContent>
      </Card>

      <button
        onClick={() => navigate("/onehome")}
        className="w-full border border-border rounded-xl py-3 text-sm font-heading font-semibold text-foreground hover:bg-muted transition-colors"
      >
        Run the Lifestyle Calculator →
      </button>
    </div>
  );
}
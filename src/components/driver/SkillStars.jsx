import React from "react";
import { Star } from "lucide-react";

export default function SkillStars({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? 0 : n)}
            className="p-0.5 touch-manipulation"
          >
            <Star
              className="w-5 h-5 transition-colors"
              fill={n <= (value || 0) ? "hsl(var(--fuel-orange))" : "none"}
              color={n <= (value || 0) ? "hsl(var(--fuel-orange))" : "hsl(var(--muted-foreground))"}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
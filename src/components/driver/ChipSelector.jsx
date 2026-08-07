import React from "react";

export default function ChipSelector({ options, selected, onChange }) {
  const toggle = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors touch-manipulation ${
              active
                ? "bg-fuel-orange text-white border-fuel-orange"
                : "bg-background text-muted-foreground border-border hover:border-fuel-orange/50"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
import React from "react";
import { Check, X } from "lucide-react";

const ITEMS = [
  { key: "username", label: "Username", check: (d) => !!d.username },
  { key: "photo", label: "Profile Photo", check: (d) => !!d.profile_photo_url },
  { key: "cdl", label: "CDL Info", check: (d) => !!d.cdl_number && !!d.cdl_state },
  { key: "coc", label: "Code of Conduct", check: (d) => !!d.code_of_conduct_accepted },
];

export default function ActivationChecklist({ driver, onMarkReceived }) {
  const allComplete = ITEMS.every((item) => item.check(driver));

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-sm font-semibold text-foreground">
        {allComplete ? "All Items Received ✓" : "To Activate This Driver:"}
      </h3>
      <div className="space-y-2">
        {ITEMS.map((item) => {
          const done = item.check(driver);
          return (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {done ? (
                  <div className="w-5 h-5 rounded-full bg-lhs-green/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-lhs-green" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="w-3 h-3 text-destructive" />
                  </div>
                )}
                <span className={`text-sm ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {item.label}
                </span>
              </div>
              {!done && onMarkReceived && (
                <button
                  onClick={() => onMarkReceived(item.key)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Mark received
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
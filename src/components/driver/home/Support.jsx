import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare } from "lucide-react";

const SUPPORT_OPTIONS = [
  {
    icon: MessageSquare,
    label: "Chat with Lulu",
    description: "Get instant help from our AI assistant",
    action: "lulu",
    color: "text-fuel-300",
  },
  {
    icon: Mail,
    label: "Contact LineHaul Station Member Support",
    description: "Email LineHaul Station Member Support",
    action: "email",
    color: "text-lhs-green",
  },
];

export default function Support() {
  const handleAction = (action) => {
    if (action === "lulu") {
      window.location.href = "/lulu";
    } else if (action === "email") {
      window.location.href = "mailto:support@linehaul-station.com";
    } else if (action === "faq") {
      // TODO: Link to FAQ page when available
      alert("FAQ page coming soon");
    }
  };

  return (
    <div className="space-y-3">
      <p className="font-heading font-bold text-xs text-muted-foreground tracking-widest uppercase">Support</p>
      <div className="space-y-2">
        {SUPPORT_OPTIONS.map((option) => (
          <Card
            key={option.action}
            className="bg-carbon-800 border-border hover:bg-carbon-700 transition-colors cursor-pointer"
            onClick={() => handleAction(option.action)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <option.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${option.color}`} />
              <div className="flex-1">
                <p className="font-heading font-semibold text-sm text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
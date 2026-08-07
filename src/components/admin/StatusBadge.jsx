import React from "react";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  imported: { label: "Imported", className: "bg-muted text-muted-foreground" },
  contacted: { label: "Contacted", className: "bg-steel-blue/10 text-steel-blue" },
  activation_started: { label: "Activation Started", className: "bg-accent/20 text-accent-foreground" },
  activation_completed: { label: "Activation Done", className: "bg-lhs-green/10 text-lhs-green" },
  avatar_pending: { label: "Avatar Pending", className: "bg-primary/10 text-primary" },
  portal_ready: { label: "Portal Ready", className: "bg-lhs-green/20 text-lhs-green" },
  active_user: { label: "Active User", className: "bg-lhs-green text-white" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.imported;
  return (
    <Badge variant="secondary" className={`${config.className} border-0 font-medium text-xs`}>
      {config.label}
    </Badge>
  );
}
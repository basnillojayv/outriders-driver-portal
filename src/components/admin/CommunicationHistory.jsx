import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Mail, MessageSquare, ArrowUpDown, CheckSquare, StickyNote } from "lucide-react";
import { format } from "date-fns";

const TYPE_CONFIG = {
  email_sent: { icon: Mail, label: "Email Sent", color: "text-steel-blue" },
  response_received: { icon: MessageSquare, label: "Response", color: "text-lhs-green" },
  status_change: { icon: ArrowUpDown, label: "Status Change", color: "text-primary" },
  item_received: { icon: CheckSquare, label: "Item Received", color: "text-lhs-green" },
  note: { icon: StickyNote, label: "Note", color: "text-muted-foreground" },
};

export default function CommunicationHistory({ driverId }) {
  const { data: logs = [] } = useQuery({
    queryKey: ["comms", driverId],
    queryFn: () => base44.entities.CommunicationLog.filter({ driver_id: driverId }, "-created_date", 100),
  });

  if (logs.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground">
        No communication history yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const config = TYPE_CONFIG[log.type] || TYPE_CONFIG.note;
        const Icon = config.icon;
        return (
          <div key={log.id} className="flex gap-3">
            <div className={`mt-0.5 ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium">{config.label}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(log.created_date), "MMM d, h:mm a")}
                </span>
              </div>
              {log.subject && <p className="text-sm font-medium mt-0.5">{log.subject}</p>}
              {log.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{log.body}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
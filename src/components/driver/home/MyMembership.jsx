import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function MyMembership({ firstName, isActive, memberSince, member, directCount }) {
  const memberYear = memberSince ? new Date(memberSince).getFullYear() : null;
  const statusText = isActive ? "Active" : "Pending";
  const statusColor = isActive ? "text-lhs-green" : "text-muted-foreground";

  return (
    <Card className="bg-carbon-800 border-border">
      <CardContent className="p-5 space-y-4">
        
        {/* Greeting */}
        <div>
          <p className="font-heading text-lg font-bold">Good to see you, {firstName}.</p>
          <p className="text-sm text-muted-foreground mt-1">Your membership is {statusText.toLowerCase()}.</p>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-widest">Member Since</p>
            <p className="text-lg font-heading font-bold mt-1">{memberYear || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-widest">Status</p>
            <p className={`text-lg font-heading font-bold mt-1 ${statusColor}`}>{statusText}</p>
          </div>
          <div>
            <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-widest">Member ID</p>
            <p className="text-lg font-heading font-bold mt-1 font-mono">{member?.lhs_member_id || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-widest">My Network</p>
            <p className="text-lg font-heading font-bold mt-1">{directCount}</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
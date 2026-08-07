import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Send, Plus, Phone } from "lucide-react";
import { toast } from "sonner";

export default function LineHaulList({ user }) {
  const [carrierInput, setCarrierInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddCarrier = async () => {
    if (!carrierInput.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success(`Request sent for ${carrierInput.trim()}!`);
    setCarrierInput("");
    setSubmitting(false);
  };

  return (
    <div className="space-y-4" id="linehaullist">
      <div>
        <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-widest mb-1">THE LINEHAUL LIST</p>
        <p className="text-sm text-muted-foreground">Carriers who offer LineHaul Station access to their drivers.</p>
      </div>

      {/* Carrier list */}
      <div className="space-y-2">
        {[
          { name: "Maverick Transportation", location: "North Little Rock, AR" },
          { name: "Prime Inc.", location: "Springfield, MO" },
          { name: "Heartland Express", location: "North Liberty, IA" },
          { name: "USA Truck", location: "Van Buren, AR" },
          { name: "Covenant Logistics", location: "Chattanooga, TN" },
          { name: "Schneider National", location: "Green Bay, WI" },
          { name: "Werner Enterprises", location: "Omaha, NE" },
          { name: "Roehl Transport", location: "Marshfield, WI" },
        ].map((carrier) => (
          <Card key={carrier.name}>
            <CardContent className="p-4 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-heading font-semibold text-sm">{carrier.name}</p>
                <p className="text-xs text-muted-foreground">{carrier.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Carrier */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <p className="font-heading font-semibold text-sm">Add Your Carrier</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Don't see your carrier? Enter their name and we'll send them info about the LineHaul List on your behalf.
          </p>
          <div className="flex gap-2">
            <input
              value={carrierInput}
              onChange={(e) => setCarrierInput(e.target.value)}
              placeholder="Carrier name"
              className="flex-1 border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button
              onClick={handleAddCarrier}
              disabled={!carrierInput.trim() || submitting}
              size="sm"
              className="flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5 mr-1" /> Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Direct contact */}
      <p className="text-xs text-muted-foreground text-center">
        Or connect directly:{" "}
        <a href="tel:6028588000" className="text-fuel-orange font-medium">
          JJ Swenson — 602-858-8000
        </a>
      </p>
    </div>
  );
}
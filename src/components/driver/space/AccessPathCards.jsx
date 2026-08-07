import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Handshake, Star, Unlock } from "lucide-react";

export default function AccessPathCards({ onBookOnDemand }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-widest mb-3">
          HOW TO ACCESS LINEHAUL STATION
        </p>
        <div className="space-y-3">
          {/* Purchase */}
          <Card className="border-fuel-orange/30">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-fuel-orange/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-fuel-orange" />
                </div>
                <div>
                  <p className="font-heading font-bold text-sm">PURCHASE</p>
                  <p className="text-xs text-muted-foreground">OneHome Membership</p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Buy your own dedicated space. $19/day member rate. 80% refundable equity fee.
              </p>
              <p className="text-sm font-semibold text-fuel-orange">Starting at $3,375</p>
              <p className="text-xs text-muted-foreground">West Memphis Early Adopter</p>
              <a href="#onehome" className="inline-block text-sm text-fuel-orange font-medium underline underline-offset-2">
                Learn More ↓
              </a>
            </CardContent>
          </Card>

          {/* Partner */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Handshake className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-bold text-sm">PARTNER</p>
                  <p className="text-xs text-muted-foreground">The LineHaul List</p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Carriers on the LineHaul List offer space to their drivers. Browse carriers, send your profile, connect.
              </p>
              <a href="#linehaullist" className="inline-block text-sm text-primary font-medium underline underline-offset-2">
                Browse the LineHaul List ↓
              </a>
            </CardContent>
          </Card>

          {/* Earn */}
          <Card className="opacity-60">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Star className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-heading font-bold text-sm">EARN</p>
                  <p className="text-xs text-muted-foreground">Coming Soon</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Earn free nights through referrals, milestones, and platform engagement. Connected to Outriders Club and Top 10 Truckers.
              </p>
              <span className="inline-block text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
                Coming Soon
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* On-Demand */}
      <Card className="bg-lhs-green/5 border-lhs-green/30">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Unlock className="w-4 h-4 text-lhs-green" />
            <p className="font-heading font-bold text-sm text-lhs-green">ON-DEMAND ACCESS</p>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            $59/night. Any driver. Any night. No membership. No commitment.
          </p>
          <p className="text-xs text-muted-foreground">Full access to all amenities and facilities.</p>
          <button
            onClick={onBookOnDemand}
            className="w-full mt-1 bg-lhs-green text-white font-heading font-semibold text-sm py-3 rounded-xl hover:bg-lhs-green/90 transition-colors"
          >
            Book On-Demand — $59
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
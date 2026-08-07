import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Star, Users, Zap } from "lucide-react";

export default function EarnedHistory({ directCount, networkCount, freeNights, badgeNames, history = [] }) {
  return (
    <div className="space-y-3">
      <p className="font-heading font-bold text-sm">YOUR CREDITS & EARNINGS</p>

      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <Coins className="w-4 h-4 text-fuel-orange" />
                <span className="font-heading font-bold text-lg">{freeNights}</span>
              </div>
              <p className="text-xs text-muted-foreground">Credits</p>
            </div>
            <div className="text-center space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-accent" />
                <span className="font-heading font-bold text-lg">{badgeNames.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
            <div className="text-center space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <Users className="w-4 h-4 text-lhs-green" />
                <span className="font-heading font-bold text-lg">{directCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Referrals</p>
            </div>
          </div>
          {badgeNames.length > 0 && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              Badges: {badgeNames.join(", ")}
            </p>
          )}
        </CardContent>
      </Card>

      {history.length > 0 ? (
        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide">History</p>
            <div className="space-y-3">
              {history.map((event, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Zap className="w-3.5 h-3.5 text-fuel-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm">{event.label}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-2">
          Your reward history will appear here as you earn.
        </p>
      )}
    </div>
  );
}
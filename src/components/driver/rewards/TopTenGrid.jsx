import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { format } from "date-fns";

export default function TopTenGrid({ referrals = [], onInvite }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const slots = Array.from({ length: 10 }, (_, i) => referrals[i] || null);

  return (
    <div className="space-y-3">
      <div>
        <p className="font-heading font-bold text-sm">MY TOP 10 TRUCKERS</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Invite 10 great drivers. They each invite 10 more. Watch your network grow.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {slots.map((driver, i) => {
          const filled = !!driver;
          return (
            <button
              key={i}
              onClick={() => filled ? setSelectedSlot(selectedSlot === i ? null : i) : onInvite()}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                filled
                  ? "border-2 border-lhs-green bg-lhs-green/5"
                  : "border-2 border-dashed border-border hover:border-fuel-orange/50 bg-muted/30"
              }`}
            >
              {filled ? (
                <>
                  {driver.profile_photo_url
                    ? <img src={driver.profile_photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    : <div className="w-8 h-8 rounded-full bg-lhs-green/20 flex items-center justify-center text-xs font-bold text-lhs-green">
                        {driver.first_name?.[0] || "?"}
                      </div>
                  }
                  <span className="text-xs text-foreground font-medium truncate w-full text-center px-1 leading-none">
                    {driver.first_name || "Driver"}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-heading font-bold text-muted-foreground">{i + 1}</span>
                  <UserPlus className="w-3 h-3 text-muted-foreground/50" />
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded slot info */}
      {selectedSlot !== null && referrals[selectedSlot] && (
        <Card className="border-lhs-green/30 bg-lhs-green/5">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-lhs-green/20 flex items-center justify-center text-sm font-bold text-lhs-green flex-shrink-0">
              {referrals[selectedSlot].first_name?.[0] || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{referrals[selectedSlot].first_name} {referrals[selectedSlot].last_name?.[0]}.</p>
              {referrals[selectedSlot].created_date && (
                <p className="text-xs text-muted-foreground">
                  Joined {format(new Date(referrals[selectedSlot].created_date), "MMM d, yyyy")}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Their referrals: {referrals[selectedSlot].referral_count || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-center">
        {referrals.length} of 10 slots filled
      </p>
    </div>
  );
}
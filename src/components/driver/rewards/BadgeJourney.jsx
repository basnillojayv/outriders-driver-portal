import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Lock } from "lucide-react";
import { BADGES } from "@/lib/badges";

export default function BadgeJourney({ directCount = 0, networkCount = 0 }) {
  const [lockedTap, setLockedTap] = useState(null);

  const getBadgeStatus = (badge) => {
    if (directCount >= badge.directReq && networkCount >= badge.networkReq) return "earned";
    return "locked";
  };

  const currentBadgeIndex = [...BADGES]
    .map((b, i) => ({ ...b, i }))
    .filter((b) => getBadgeStatus(b) === "earned")
    .pop()?.i ?? 0;

  const nextBadge = BADGES[currentBadgeIndex + 1];
  const directNeeded = nextBadge ? Math.max(0, nextBadge.directReq - directCount) : 0;
  const networkNeeded = nextBadge ? Math.max(0, nextBadge.networkReq - networkCount) : 0;

  return (
    <div className="space-y-3">
      <div>
        <p className="font-heading font-bold text-sm">BADGE JOURNEY</p>
        <p className="text-xs text-muted-foreground mt-1">Every referral moves you forward. See how far you can go.</p>
      </div>

      {/* Badge row */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {BADGES.map((badge, i) => {
          const status = getBadgeStatus(badge);
          const isCurrent = i === currentBadgeIndex;
          return (
            <React.Fragment key={badge.name}>
              <button
                onClick={() => status === "locked" ? setLockedTap(lockedTap === badge.name ? null : badge.name) : null}
                className="flex flex-col items-center gap-1 flex-shrink-0"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all overflow-hidden ${
                  status === "earned"
                    ? "border-2 border-lhs-green shadow-lg"
                    : isCurrent
                    ? "border-2 border-fuel-orange"
                    : "border-2 border-border opacity-35"
                }`}>
                  <img
                    src={badge.img}
                    alt={badge.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
                <span className={`text-xs font-heading font-bold ${
                  status === "earned" ? "text-lhs-green" : isCurrent ? "text-fuel-orange" : "text-muted-foreground"
                }`}>
                  {badge.name.toUpperCase()}
                </span>
                {status === "earned" && <CheckCircle2 className="w-3 h-3 text-lhs-green" />}
                {status === "locked" && !isCurrent && <Lock className="w-3 h-3 text-muted-foreground/40" />}
                {isCurrent && status !== "earned" && <span className="w-1.5 h-1.5 rounded-full bg-fuel-orange" />}
              </button>
              {i < BADGES.length - 1 && (
                <div className={`flex-1 h-0.5 mb-6 min-w-[8px] ${i < currentBadgeIndex ? "bg-lhs-green" : "bg-border"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Locked badge tooltip */}
      {lockedTap && (
        <Card className="border-border">
          <CardContent className="p-3 text-sm">
            <p className="font-semibold">{BADGES.find((b) => b.name === lockedTap)?.name} Badge</p>
            <p className="text-xs text-muted-foreground mt-0.5">{BADGES.find((b) => b.name === lockedTap)?.desc}</p>
          </CardContent>
        </Card>
      )}

      {/* Next badge callout */}
      {nextBadge ? (
        <Card className="bg-fuel-orange/5 border-fuel-orange/20">
          <CardContent className="p-4 flex items-center gap-4">
            <img src={nextBadge.img} alt={nextBadge.name} className="w-12 h-12 object-contain flex-shrink-0 opacity-70" />
            <div className="space-y-1">
              <p className="font-heading font-bold text-sm">
                Current: <span className="text-foreground">{BADGES[currentBadgeIndex].name}</span>
              </p>
              <p className="text-sm text-foreground">
                Next: <span className="font-semibold text-fuel-orange">{nextBadge.name}</span> — {nextBadge.desc}
              </p>
              {directNeeded > 0 && (
                <p className="text-sm font-semibold text-fuel-orange">
                  {directNeeded} more direct referral{directNeeded !== 1 ? "s" : ""} to go
                </p>
              )}
              {networkNeeded > 0 && directNeeded === 0 && (
                <p className="text-sm font-semibold text-fuel-orange">
                  {networkNeeded} more network referrals to go
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-lhs-green/5 border-lhs-green/30">
          <CardContent className="p-4 flex items-center gap-4">
            <img src={BADGES[BADGES.length - 1].img} alt="Founder" className="w-12 h-12 object-contain flex-shrink-0" />
            <div>
              <p className="font-heading font-bold text-sm text-lhs-green">FOUNDER STATUS ACHIEVED</p>
              <p className="text-xs text-muted-foreground mt-1">You've reached the highest badge level.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
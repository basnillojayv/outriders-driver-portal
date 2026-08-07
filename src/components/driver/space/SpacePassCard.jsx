import React from "react";
import { QrCode, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SpacePassCard({ user, onBook }) {
  const hasPass = false; // Future: check user.space_pass_type

  if (hasPass) {
    return (
      <Card className="bg-carbon text-white overflow-hidden">
        <CardContent className="p-5 space-y-4">
          <h2 className="font-heading font-bold text-base">MY SPACE PASS</h2>
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl">
              <QrCode className="w-20 h-20 text-black" />
            </div>
            <div className="space-y-1">
              <p className="font-heading font-bold">{user?.full_name}</p>
              {user?.username && <p className="text-fuel-orange text-sm">@{user.username}</p>}
              <p className="text-xs text-white/70">Access: OneHome 100</p>
              <p className="text-xs text-white/70">Home Hub: West Memphis</p>
              <p className="text-xs text-white/70">Valid: June 2026+</p>
            </div>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Your Space Pass is your identity and access key. Non-transferable. Regenerated per visit.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-carbon text-white overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <h2 className="font-heading font-bold text-base">MY SPACE PASS</h2>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            {user?.profile_photo_url
              ? <img src={user.profile_photo_url} alt="" className="w-full h-full object-cover rounded-full" />
              : <User className="w-6 h-6 text-white/40" />
            }
          </div>
          <div>
            <p className="font-heading font-bold">{user?.full_name || "Driver"}</p>
            {user?.username && <p className="text-fuel-orange text-sm">@{user.username}</p>}
          </div>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">
          You don't have a Space Pass yet. There are three ways to get access:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button className="bg-fuel-orange text-white text-xs font-heading font-semibold py-2 px-1 rounded-lg">
            Purchase
          </button>
          <button className="bg-white/10 text-white text-xs font-heading font-semibold py-2 px-1 rounded-lg">
            Partner
          </button>
          <button className="bg-white/10 text-white/50 text-xs font-heading font-semibold py-2 px-1 rounded-lg cursor-not-allowed">
            Earn
          </button>
        </div>
        <p className="text-xs text-white/50">Or book an On-Demand night:</p>
        <button
          onClick={onBook}
          className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 text-sm font-heading font-semibold text-white transition-colors"
        >
          $59/night — Book Now
        </button>
      </CardContent>
    </Card>
  );
}
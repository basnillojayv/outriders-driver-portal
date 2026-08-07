import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, User, Users, Download, ExternalLink } from "lucide-react";

export default function SocialHub() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  return (
    <div className="px-4 pt-6 space-y-4">
      <h1 className="font-heading text-xl font-bold">Social Hub</h1>
      <p className="text-sm text-muted-foreground">Share, connect, and represent</p>

      {/* Avatar */}
      <Card>
        <CardContent className="p-5 text-center">
          <div className="w-24 h-24 rounded-full bg-muted mx-auto flex items-center justify-center">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="font-heading font-semibold mt-3">Your Outriders Avatar</p>
          <p className="text-xs text-muted-foreground mt-1">Your custom avatar will appear here</p>
          <Button size="sm" variant="outline" className="mt-3" disabled>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download Avatar
          </Button>
        </CardContent>
      </Card>

      {/* Driver Card */}
      <Card className="bg-carbon text-white">
        <CardContent className="p-5 text-center">
          <p className="font-heading font-bold">Driver Card</p>
          <p className="text-xs text-white/60 mt-1">Your shareable professional identity</p>
          <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/10">
            <p className="font-heading font-bold text-lg">{user?.full_name || "Your Name"}</p>
            <p className="text-fuel-orange text-sm">Outriders Club Member</p>
            <p className="text-xs text-white/50 mt-1">LineHaul Station</p>
          </div>
          <div className="flex gap-2 mt-4 justify-center">
            <Button size="sm" variant="outline" className="text-white border-white/20 hover:bg-white/10" disabled>
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share
            </Button>
            <Button size="sm" variant="outline" className="text-white border-white/20 hover:bg-white/10" disabled>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-heading text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Community
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Connect with fellow Outriders</p>
          <Button size="sm" variant="outline" className="mt-3" asChild>
            <a href="https://www.facebook.com/groups/linehaulstation" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Join Facebook Group
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Sharing Tools */}
      <Card>
        <CardContent className="p-5 text-center">
          <Share2 className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-heading font-semibold text-sm">Sharing Tools</p>
          <p className="text-xs text-muted-foreground mt-1">Custom shareable content and promotions — coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const NEWS_ITEMS = [
  {
    title: "West Memphis Terminal Opening",
    description: "LineHaul Station's new flagship terminal launches in Q3 2026.",
    date: "Coming Soon",
    tag: "Locations",
  },
  {
    title: "Top 10 Truckers Season 2",
    description: "New leaderboard season starts. Recruit your network and climb the ranks.",
    date: "Ongoing",
    tag: "Competition",
  },
  {
    title: "Community Spotlight",
    description: "Meet this month's featured Outriders member and their story.",
    date: "Monthly",
    tag: "Community",
  },
];

export default function WhatsNew() {
  return (
    <div className="space-y-3">
      <p className="font-heading font-bold text-xs text-muted-foreground tracking-widest uppercase">Member Updates</p>
      <div className="space-y-2">
        {NEWS_ITEMS.map((item, idx) => (
          <Card key={idx} className="bg-carbon-800 border-border hover:bg-carbon-700 transition-colors cursor-pointer">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-heading font-semibold text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-heading font-bold text-text-muted-lhs">{item.date}</span>
                <span className="px-2 py-1 rounded-full bg-carbon-700 text-muted-foreground">{item.tag}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
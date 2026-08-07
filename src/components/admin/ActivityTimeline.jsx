import React from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

// Map event types to icons
const EVENT_ICONS = {
  member_created: "👤",
  membership_activated: "✓",
  membership_renewed: "🔄",
  membership_updated: "✏️",
  referral_shared: "🔗",
  referral_started: "📤",
  referral_converted: "⭐",
  top_ten_completed: "🏆",
  credit_earned: "💳",
  credit_adjusted: "⚙️",
  credit_redeemed: "✅",
  profile_completed: "📋",
  member_card_downloaded: "📲",
  wallet_pass_added: "💰",
  badge_earned: "🎖️",
  milestone_reached: "🎯",
  featured_member: "⭐",
  announcement_read: "📢",
  support_request_opened: "🆘",
};

export default function ActivityTimeline({ memberId }) {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["memberActivities", memberId],
    queryFn: () => base44.asServiceRole.entities.MemberActivity.filter({ member_id: memberId }, "-created_date", 100),
    enabled: !!memberId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div
        style={{
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.02)",
          padding: 20,
        }}
      >
        <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
          No activity yet
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.02)",
        padding: 20,
      }}
    >
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 900, color: "var(--text-primary)", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Activity Timeline
      </h2>

      <div style={{ position: "relative", paddingLeft: 24 }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: 8,
            top: 12,
            bottom: 0,
            width: 1,
            background: "linear-gradient(180deg, rgba(204,91,48,0.3), transparent)",
          }}
        />

        {activities.map((activity, idx) => (
          <div key={activity.id} style={{ marginBottom: idx < activities.length - 1 ? 24 : 0 }}>
            {/* Timeline dot */}
            <div
              style={{
                position: "absolute",
                left: -8,
                top: 12,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "var(--carbon-800)",
                border: "2px solid var(--fuel-500)",
                boxShadow: "0 0 8px rgba(204,91,48,0.4)",
              }}
            />

            {/* Content */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>{EVENT_ICONS[activity.event_type] || "•"}</span>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                  {activity.title}
                </h3>
              </div>

              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, lineHeight: 1.5 }}>
                {activity.description}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em" }}>
                  {new Date(activity.created_date).toLocaleDateString()}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: `rgba(${getCategoryColor(activity.category)}, 0.15)`,
                    color: `rgb(${getCategoryColor(activity.category)})`,
                  }}
                >
                  {activity.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getCategoryColor(category) {
  const colors = {
    membership: "24,160,107", // green
    referral: "232,161,75", // fuel orange
    credits: "44,95,138", // steel blue
    member: "204,91,48", // fuel red
    community: "232,161,75", // fuel orange
    system: "122,114,104", // text-muted
    support: "192,57,43", // danger
  };
  return colors[category] || "204,91,48";
}
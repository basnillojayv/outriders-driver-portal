import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { T } from "@/components/driver/v3/v3tokens";

// Refined toggle — restrained on-state: dim orange track, orange thumb.
const toggleOn = {
  background: "rgba(255,106,0,0.16)",
  border: `1px solid ${T.orange}`,
};
const toggleOff = {
  background: T.cardAlt,
  border: `1px solid ${T.border}`,
};

function NotificationCard({ icon: Icon, title, description, checked, onChange }) {
  return (
    <div
      className="rounded-[14px] p-5"
      style={{
        background: T.card,
        backgroundImage: "none",
        border: `1px solid ${T.border}`,
        isolation: "isolate",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-[10px] flex items-center justify-center mt-0.5"
            style={{ background: T.orangeDim, color: T.orange, border: `1px solid ${T.heroBorder}` }}
          >
            <Icon size={17} />
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: 14, fontFamily: "var(--font-heading)", fontWeight: 700, color: T.textPrimary }}>
              {title}
            </p>
            <p style={{ fontSize: 12, color: T.textSecondary, marginTop: 3, lineHeight: 1.55 }}>
              {description}
            </p>
          </div>
        </div>
        <button
          onClick={() => onChange(!checked)}
          className="flex-shrink-0 rounded-full transition-all duration-200 relative mt-1"
          style={{ width: 44, height: 24, ...(checked ? toggleOn : toggleOff) }}
          aria-label={`Toggle ${title}`}
        >
          <span
            className="absolute top-[2px] w-4 h-4 rounded-full transition-all duration-200"
            style={{
              left: checked ? "23px" : "4px",
              background: checked ? T.orange : T.textMuted,
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          />
        </button>
      </div>
    </div>
  );
}

export default function NotificationsTab({ user }) {
  const queryClient = useQueryClient();

  const prefs = user?.notification_prefs ? JSON.parse(user.notification_prefs) : {};

  const [emailUpdates, setEmailUpdates] = useState(prefs.email_updates ?? true);
  const [smsEnabled, setSmsEnabled] = useState(prefs.sms_enabled ?? true);
  const [newsEvents, setNewsEvents] = useState(prefs.member_news ?? true);

  const saveMutation = useMutation({
    mutationFn: async (updated) => {
      await base44.auth.updateMe({
        notification_prefs: JSON.stringify({
          email_updates:    updated.emailUpdates,
          sms_enabled:      updated.smsEnabled,
          member_news:      updated.newsEvents,
          new_referral:     prefs.new_referral     ?? true,
          milestone_reached: prefs.milestone_reached ?? true,
          new_event:        prefs.new_event        ?? true,
          credit_updates:   prefs.credit_updates   ?? true,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Preferences saved");
    },
  });

  const handleToggle = (setter, key, value) => {
    setter(value);
    const next = { emailUpdates, smsEnabled, newsEvents, [key]: value };
    saveMutation.mutate(next);
  };

  return (
    <div className="space-y-3">
      <p
        style={{
          fontSize: 10,
          color: T.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.28em",
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          paddingBottom: 2,
        }}
      >
        Communication Preferences
      </p>
      <NotificationCard
        icon={Mail}
        title="Email Communications"
        description="Membership updates, receipts, news, and announcements."
        checked={emailUpdates}
        onChange={(v) => handleToggle(setEmailUpdates, "emailUpdates", v)}
      />
      <NotificationCard
        icon={MessageSquare}
        title="SMS Messages"
        description="Important membership and operational text messages."
        checked={smsEnabled}
        onChange={(v) => handleToggle(setSmsEnabled, "smsEnabled", v)}
      />
    </div>
  );
}
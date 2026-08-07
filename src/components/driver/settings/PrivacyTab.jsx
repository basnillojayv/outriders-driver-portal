import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="flex-shrink-0 w-10 h-6 rounded-full transition-all duration-200 relative"
        style={{ background: checked ? "var(--fuel-500)" : "var(--carbon-500)" }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200"
          style={{ left: checked ? "22px" : "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
        />
      </button>
    </div>
  );
}

export default function PrivacyTab({ user }) {
  const queryClient = useQueryClient();

  const { data: visibility, isLoading } = useQuery({
    queryKey: ["memberVisibility", user?.id],
    queryFn: async () => {
      const records = await base44.entities.MemberVisibility.filter({ member_id: user.id });
      return records[0] || null;
    },
    enabled: !!user?.id,
  });

  const [isSearchable, setIsSearchable] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [showNetworkSize, setShowNetworkSize] = useState(true);
  const [showAffiliateLink, setShowAffiliateLink] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("members_only");

  useEffect(() => {
    if (visibility) {
      setIsSearchable(visibility.is_searchable ?? true);
      setAllowMessages(visibility.allow_messages ?? true);
      setShowNetworkSize(visibility.show_network_size ?? true);
      setShowAffiliateLink(visibility.show_affiliate_link ?? true);
      setProfileVisibility(visibility.profile_visibility ?? "members_only");
    }
  }, [visibility]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        member_id: user.id,
        is_searchable: isSearchable,
        allow_messages: allowMessages,
        show_network_size: showNetworkSize,
        show_affiliate_link: showAffiliateLink,
        profile_visibility: profileVisibility,
      };
      if (visibility?.id) {
        await base44.entities.MemberVisibility.update(visibility.id, data);
      } else {
        await base44.entities.MemberVisibility.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberVisibility", user?.id] });
      toast.success("Privacy settings saved");
    },
  });

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-1">
          <h3 className="font-heading text-sm font-semibold mb-3">Profile Visibility</h3>

          <div className="space-y-2 mb-4">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Who can see your profile?</label>
            <div className="space-y-2">
              {[
                { value: "public", label: "Public", desc: "Anyone, including non-members" },
                { value: "members_only", label: "Members Only", desc: "Logged-in Outriders members" },
                { value: "private", label: "Private", desc: "Only you and admins" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                  style={{ background: profileVisibility === opt.value ? "rgba(204,91,48,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${profileVisibility === opt.value ? "rgba(204,91,48,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                  <input type="radio" name="profileVisibility" value={opt.value} checked={profileVisibility === opt.value}
                    onChange={() => setProfileVisibility(opt.value)} className="accent-fuel-orange" />
                  <div>
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Toggle checked={isSearchable} onChange={setIsSearchable}
            label="Appear in member directory"
            description="Other members can find you when searching the community." />
          <Toggle checked={allowMessages} onChange={setAllowMessages}
            label="Allow direct messages"
            description="Other members can send you messages through the platform." />
          <Toggle checked={showNetworkSize} onChange={setShowNetworkSize}
            label="Show my network size"
            description="Others can see your referral count and Top Ten progress." />
          <Toggle checked={showAffiliateLink} onChange={setShowAffiliateLink}
            label="Show my referral link publicly"
            description="Your referral link appears on your public profile." />
        </CardContent>
      </Card>

      <Button className="w-full h-12 font-heading font-semibold" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Privacy Settings
      </Button>
    </div>
  );
}
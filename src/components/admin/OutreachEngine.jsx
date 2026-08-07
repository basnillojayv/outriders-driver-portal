import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Sparkles, Send, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const TEMPLATES = {
  activation_invite: "Activation Invite",
  activation_reminder: "Activation Reminder",
  photo_cdl_followup: "Photo/CDL Follow-Up",
  portal_ready: "Portal Ready",
  onehome_intro: "OneHome Intro",
};

function getMissingItems(driver) {
  const missing = [];
  if (!driver.username) missing.push("username");
  if (!driver.profile_photo_url) missing.push("profile photo");
  if (!driver.cdl_number || !driver.cdl_state) missing.push("CDL info");
  if (!driver.code_of_conduct_accepted) missing.push("Code of Conduct agreement");
  return missing;
}

export default function OutreachEngine({ driver }) {
  const [generating, setGenerating] = useState(false);
  const [options, setOptions] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [editedBody, setEditedBody] = useState("");
  const [editedSubject, setEditedSubject] = useState("");
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const missing = getMissingItems(driver);

  const generateOptions = async () => {
    setGenerating(true);
    setOptions(null);
    setSelectedIdx(null);

    const missingText = missing.length > 0 ? missing.join(", ") : "none — all items received";
    const statusText = driver.status;
    const activationLink = `https://lulu-road-hub.base44.app/activate?id=${driver.id}`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are Lulu, LineHaul Station's activation concierge. Generate 4 email message options for a driver outreach.

Driver: ${driver.first_name} ${driver.last_name}
Carrier: ${driver.business_name || "Unknown"}
Status: ${statusText}
Missing activation items: ${missingText}
Activation link: ${activationLink}

Generate 4 options with different tones:
1. Direct — professional, straightforward
2. Friendly — warm, encouraging  
3. Value — emphasize benefits (portal, resume tools, OneHome)
4. Casual — relaxed, brief

Each email should:
- Address the driver by first name
- Be appropriate for the current status and missing items
- After the intro paragraph, include this exact call-to-action block (copy it verbatim):

"Click below to activate your membership — it only takes 2 minutes:

👉 Activate My Membership → ${activationLink}

(Can't click? Copy and paste this link into your browser: ${activationLink})"

- Use Lulu's voice: confident, warm, driver-respecting
- Never say "Sign Up" (say "Join"), never say "professional drivers" (say "American truckers")
- Keep emails under 200 words each

Return a JSON object with a "subject" field (one email subject line) and an "options" array of 4 objects, each with "tone" and "body" fields.`,
      response_json_schema: {
        type: "object",
        properties: {
          subject: { type: "string" },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tone: { type: "string" },
                body: { type: "string" },
              },
            },
          },
        },
      },
    });

    setOptions(result);
    setEditedSubject(result.subject || "");
    setGenerating(false);
  };

  const logMutation = useMutation({
    mutationFn: async () => {
      // Log the communication
      await base44.entities.CommunicationLog.create({
        driver_id: driver.id,
        type: "email_sent",
        subject: editedSubject,
        body: editedBody,
      });
      // Update driver status + last_contacted
      const updates = { last_contacted: new Date().toISOString(), last_activity: new Date().toISOString() };
      if (driver.status === "imported") updates.status = "contacted";
      await base44.entities.Driver.update(driver.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver", driver.id] });
      queryClient.invalidateQueries({ queryKey: ["comms", driver.id] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Email draft logged. Gmail compose window opened.");
      setOptions(null);
      setSelectedIdx(null);
    },
  });

  const handleSelect = (idx) => {
    setSelectedIdx(idx);
    setEditedBody(options.options[idx].body);
  };

  const handleCopyToOutlook = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(driver.email)}&su=${encodeURIComponent(editedSubject)}&body=${encodeURIComponent(editedBody)}`;
    window.open(gmailUrl, "_blank");
    logMutation.mutate();
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(`Subject: ${editedSubject}\n\n${editedBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold">Outreach</h3>
        <Button size="sm" onClick={generateOptions} disabled={generating}>
          {generating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
          Generate Email
        </Button>
      </div>

      {generating && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          Lulu is writing message options...
        </div>
      )}

      {options && !generating && (
        <div className="space-y-3">
          {/* Options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`text-left p-3 rounded-lg border text-sm transition-all ${
                  selectedIdx === idx
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="font-medium text-xs text-primary mb-1 capitalize">{opt.tone}</div>
                <p className="text-muted-foreground text-xs line-clamp-3">{opt.body}</p>
              </button>
            ))}
          </div>

          {/* Editor */}
          {selectedIdx !== null && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Subject</label>
                  <input
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Body</label>
                  <Textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    rows={6}
                    className="mt-1 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCopyToOutlook} disabled={logMutation.isPending}>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Open in Gmail
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCopyClipboard}>
                    {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
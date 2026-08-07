import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building2, Phone, Mail, Calendar, Clock, Send, Plus } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import ActivationChecklist from "@/components/admin/ActivationChecklist";
import OutreachEngine from "@/components/admin/OutreachEngine";
import CommunicationHistory from "@/components/admin/CommunicationHistory";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function DriverDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const driverId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState("");

  const { data: driver, isLoading } = useQuery({
    queryKey: ["driver", driverId],
    queryFn: async () => {
      const drivers = await base44.entities.Driver.filter({ id: driverId });
      return drivers[0];
    },
    enabled: !!driverId,
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["notes", driverId],
    queryFn: () => base44.entities.DriverNote.filter({ driver_id: driverId }, "-created_date", 50),
    enabled: !!driverId,
  });

  const markReceivedMutation = useMutation({
    mutationFn: async (itemKey) => {
      const updates = { last_activity: new Date().toISOString() };
      if (itemKey === "username") updates.username = driver.username || `${driver.first_name.toLowerCase()}_${driver.last_name.toLowerCase()}`;
      if (itemKey === "photo") updates.profile_photo_url = "received";
      if (itemKey === "cdl") { updates.cdl_number = "received"; updates.cdl_state = "received"; }
      if (itemKey === "coc") updates.code_of_conduct_accepted = true;

      // Check if all items complete after this update
      const merged = { ...driver, ...updates };
      const allDone = merged.username && merged.profile_photo_url && (merged.cdl_number && merged.cdl_state) && merged.code_of_conduct_accepted;
      if (allDone && ["imported", "contacted", "activation_started"].includes(driver.status)) {
        updates.status = "activation_completed";
      } else if (["imported", "contacted"].includes(driver.status)) {
        updates.status = "activation_started";
      }

      await base44.entities.Driver.update(driver.id, updates);
      await base44.entities.CommunicationLog.create({
        driver_id: driver.id,
        type: "item_received",
        subject: `${itemKey} received`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver", driverId] });
      queryClient.invalidateQueries({ queryKey: ["comms", driverId] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Item marked as received");
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.DriverNote.create({ driver_id: driverId, content: newNote });
      await base44.entities.CommunicationLog.create({
        driver_id: driverId,
        type: "note",
        body: newNote,
      });
    },
    onSuccess: () => {
      setNewNote("");
      queryClient.invalidateQueries({ queryKey: ["notes", driverId] });
      queryClient.invalidateQueries({ queryKey: ["comms", driverId] });
    },
  });

  const quickNudgeMutation = useMutation({
    mutationFn: async () => {
      const body = `Hey ${driver.first_name}, just following up — we'd love to get you activated. Let me know if you need anything!`;
      const subject = `Quick follow-up — ${driver.first_name}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(driver.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, "_blank");

      await base44.entities.CommunicationLog.create({
        driver_id: driver.id,
        type: "email_sent",
        subject,
        body,
        template_used: "quick_nudge",
      });
      const updates = { last_contacted: new Date().toISOString(), last_activity: new Date().toISOString() };
      if (driver.status === "imported") updates.status = "contacted";
      await base44.entities.Driver.update(driver.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver", driverId] });
      queryClient.invalidateQueries({ queryKey: ["comms", driverId] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Gmail compose window opened for quick nudge.");
    },
  });

  if (isLoading || !driver) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const daysSinceActivity = driver.last_activity
    ? formatDistanceToNow(new Date(driver.last_activity), { addSuffix: true })
    : "Unknown";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back + Header */}
      <button onClick={() => navigate("/admin")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to drivers
      </button>

      {/* Driver Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold">{driver.first_name} {driver.last_name}</h1>
            <StatusBadge status={driver.status} />
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{driver.email}</span>
            {driver.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{driver.phone}</span>}
            {driver.business_name && <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{driver.business_name}</span>}
          </div>
          <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
            {driver.tags && <span>Type: {driver.tags}</span>}
            {driver.csv_import_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Imported {format(new Date(driver.csv_import_date), "MMM d, yyyy")}</span>}
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Last activity {daysSinceActivity}</span>
            <span>
              {driver.last_contacted
                ? `Last contacted: ${format(new Date(driver.last_contacted), "MMM d")}`
                : "Never contacted"}
            </span>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => quickNudgeMutation.mutate()} disabled={quickNudgeMutation.isPending}>
          <Send className="w-3.5 h-3.5 mr-1.5" />
          Quick Nudge
        </Button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activation + Outreach */}
          <Card>
            <CardContent className="p-5 space-y-6">
              <ActivationChecklist
                driver={driver}
                onMarkReceived={(key) => markReceivedMutation.mutate(key)}
              />
              <div className="border-t pt-5">
                <OutreachEngine driver={driver} />
              </div>
            </CardContent>
          </Card>

          {/* Communication History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-heading">Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              <CommunicationHistory driverId={driverId} />
            </CardContent>
          </Card>
        </div>

        {/* Right column — Notes */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-heading">Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
              </div>
              {newNote && (
                <Button size="sm" onClick={() => addNoteMutation.mutate()} disabled={addNoteMutation.isPending}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Save Note
                </Button>
              )}
              <div className="space-y-2 mt-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-2.5 rounded-lg bg-muted text-sm">
                    <p>{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(note.created_date), "MMM d, h:mm a")}
                    </p>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3">No notes yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
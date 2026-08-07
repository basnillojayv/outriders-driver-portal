import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCheck, Paperclip, AlertTriangle, ArrowUpRight, MessageSquare, ChevronLeft } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

const STATUS_OPTIONS = [
  "imported", "contacted", "activation_started", "activation_completed",
  "avatar_pending", "portal_ready", "active_user"
];

export default function Inbox() {
  const queryClient = useQueryClient();
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showThread, setShowThread] = useState(false); // mobile toggle

  const { data: allLogs = [] } = useQuery({
    queryKey: ["inbox-logs"],
    queryFn: () => base44.entities.CommunicationLog.list("-created_date", 500),
  });

  const { data: drivers = [] } = useQuery({
    queryKey: ["drivers-inbox"],
    queryFn: () => base44.entities.Driver.list("-updated_date", 2000),
  });

  // Build driver map
  const driverMap = useMemo(() => {
    const map = {};
    drivers.forEach((d) => { map[d.id] = d; });
    return map;
  }, [drivers]);

  // Filter to inbound/reply logs only
  const inboundLogs = useMemo(() =>
    allLogs.filter((l) => l.type === "inbound" || l.type === "reply"),
    [allLogs]
  );

  // Group by driver_id, sorted by most recent
  const driverThreads = useMemo(() => {
    const grouped = {};
    inboundLogs.forEach((log) => {
      if (!grouped[log.driver_id]) grouped[log.driver_id] = [];
      grouped[log.driver_id].push(log);
    });
    return Object.entries(grouped)
      .map(([driverId, logs]) => ({
        driverId,
        logs: logs.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)),
        lastLog: logs.reduce((a, b) => new Date(a.created_date) > new Date(b.created_date) ? a : b),
      }))
      .sort((a, b) => new Date(b.lastLog.created_date) - new Date(a.lastLog.created_date));
  }, [inboundLogs]);

  // All logs for selected driver (all types)
  const { data: threadLogs = [] } = useQuery({
    queryKey: ["thread-logs", selectedDriverId],
    queryFn: () => base44.entities.CommunicationLog.filter({ driver_id: selectedDriverId }, "created_date"),
    enabled: !!selectedDriverId,
  });

  const selectedDriver = selectedDriverId ? driverMap[selectedDriverId] : null;
  const selectedThread = driverThreads.find((t) => t.driverId === selectedDriverId);

  const needsAction = (thread) => {
    const driver = driverMap[thread.driverId];
    if (!driver) return false;
    const isInbound = thread.lastLog.type === "inbound" || thread.lastLog.type === "reply";
    return isInbound && (driver.status === "imported" || driver.status === "activation_started");
  };

  const hasAttachment = (log) => {
    if (!log.metadata) return false;
    try {
      const meta = JSON.parse(log.metadata);
      return !!meta.attachment;
    } catch { return false; }
  };

  const markReviewedMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.CommunicationLog.create({
        driver_id: selectedDriverId,
        type: "note",
        subject: "Marked as reviewed",
        body: "Thread reviewed by admin",
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["thread-logs", selectedDriverId] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status) => {
      await base44.entities.Driver.update(selectedDriverId, { status });
      await base44.entities.CommunicationLog.create({
        driver_id: selectedDriverId,
        type: "status_change",
        subject: `Status updated to ${status}`,
        body: `Admin updated driver status from inbox.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers-inbox"] });
      queryClient.invalidateQueries({ queryKey: ["thread-logs", selectedDriverId] });
      setNewStatus("");
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.DriverNote.create({ driver_id: selectedDriverId, content: newNote });
      await base44.entities.CommunicationLog.create({
        driver_id: selectedDriverId,
        type: "note",
        subject: "Admin note added",
        body: newNote,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thread-logs", selectedDriverId] });
      setNewNote("");
    },
  });

  const handleSelectDriver = (driverId) => {
    setSelectedDriverId(driverId);
    setShowThread(true);
  };

  const LOG_TYPE_STYLE = {
    inbound: { label: "Inbound", className: "bg-steel-blue/10 text-steel-blue" },
    reply: { label: "Reply", className: "bg-accent/20 text-accent-foreground" },
    email_sent: { label: "Sent", className: "bg-muted text-muted-foreground" },
    status_change: { label: "Status", className: "bg-lhs-green/10 text-lhs-green" },
    note: { label: "Note", className: "bg-primary/10 text-primary" },
    response_received: { label: "Response", className: "bg-steel-blue/10 text-steel-blue" },
    item_received: { label: "Item", className: "bg-lhs-green/10 text-lhs-green" },
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* LEFT PANEL */}
      <div className={`
        w-full lg:w-80 xl:w-96 flex-shrink-0 border-r border-border bg-card flex flex-col
        ${showThread ? "hidden lg:flex" : "flex"}
      `}>
        <div className="p-4 border-b border-border">
          <h2 className="font-heading font-semibold text-base">Inbox</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{driverThreads.length} conversations</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {driverThreads.length === 0 && (
            <div className="p-8 text-center">
              <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No inbound messages yet</p>
            </div>
          )}
          {driverThreads.map((thread) => {
            const driver = driverMap[thread.driverId];
            const isSelected = selectedDriverId === thread.driverId;
            const flagged = needsAction(thread);
            return (
              <button
                key={thread.driverId}
                onClick={() => handleSelectDriver(thread.driverId)}
                className={`w-full text-left px-4 py-3.5 transition-colors hover:bg-muted/50 ${isSelected ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {flagged && <span className="w-2 h-2 rounded-full bg-lhs-red flex-shrink-0 mt-1.5" />}
                    <span className={`text-sm font-medium truncate ${flagged ? "font-bold" : ""}`}>
                      {driver ? `${driver.first_name} ${driver.last_name}` : thread.driverId}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {format(new Date(thread.lastLog.created_date), "MMM d")}
                  </span>
                </div>
                {driver && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{driver.email}</p>
                )}
                <p className="text-xs text-muted-foreground truncate mt-1 opacity-70">
                  {thread.lastLog.subject || thread.lastLog.body || "No subject"}
                </p>
                {flagged && (
                  <Badge className="mt-1.5 text-[10px] bg-lhs-red/10 text-lhs-red border-0">Needs Action</Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className={`
        flex-1 flex flex-col min-w-0 bg-background
        ${showThread ? "flex" : "hidden lg:flex"}
      `}>
        {!selectedDriverId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Select a conversation</p>
            </div>
          </div>
        ) : (
          <>
            {/* Driver card header */}
            <div className="border-b border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <button
                  className="lg:hidden text-muted-foreground mr-1"
                  onClick={() => setShowThread(false)}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {selectedDriver ? (
                  <div className="flex-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-heading font-semibold">
                      {selectedDriver.first_name} {selectedDriver.last_name}
                    </span>
                    <span className="text-sm text-muted-foreground">{selectedDriver.phone}</span>
                    <span className="text-sm text-muted-foreground">{selectedDriver.email}</span>
                    <StatusBadge status={selectedDriver.status} />
                    {needsAction(selectedThread) && (
                      <Badge className="bg-lhs-red/10 text-lhs-red border-0 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Needs Action
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Driver ID: {selectedDriverId}</span>
                )}
                <Link
                  to={`/admin/driver/${selectedDriverId}`}
                  className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0"
                >
                  View record <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Admin actions */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markReviewedMutation.mutate()}
                  disabled={markReviewedMutation.isPending}
                  className="h-8 text-xs"
                >
                  <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark Reviewed
                </Button>

                <Select value={newStatus} onValueChange={(v) => { setNewStatus(v); updateStatusMutation.mutate(v); }}>
                  <SelectTrigger className="h-8 text-xs w-44">
                    <SelectValue placeholder="Update status…" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">{s.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {threadLogs.map((log) => {
                const typeStyle = LOG_TYPE_STYLE[log.type] || { label: log.type, className: "bg-muted text-muted-foreground" };
                const attachment = hasAttachment(log);
                const isInbound = log.type === "inbound" || log.type === "reply";
                return (
                  <div
                    key={log.id}
                    className={`rounded-xl border p-4 space-y-1.5 ${isInbound ? "bg-steel-blue/5 border-steel-blue/20" : "bg-card border-border"}`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`${typeStyle.className} border-0 text-[10px]`}>
                          {typeStyle.label}
                        </Badge>
                        {attachment && (
                          <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-0 text-[10px] flex items-center gap-1">
                            <Paperclip className="w-2.5 h-2.5" /> Attachment
                          </Badge>
                        )}
                        {log.subject && (
                          <span className="text-sm font-medium">{log.subject}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.created_date), "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                    {log.body && (
                      <p className="text-sm text-foreground/80 whitespace-pre-wrap">{log.body}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add note */}
            <div className="border-t border-border bg-card p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Add a note</p>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Write a note about this driver…"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="text-sm min-h-[60px] resize-none flex-1"
                />
                <Button
                  size="sm"
                  disabled={!newNote.trim() || addNoteMutation.isPending}
                  onClick={() => addNoteMutation.mutate()}
                  className="self-end"
                >
                  Save
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
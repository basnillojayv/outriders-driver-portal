import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, User, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const STATUS_COLORS = {
  pending: "bg-accent/20 text-accent-foreground",
  in_progress: "bg-steel-blue/10 text-steel-blue",
  complete: "bg-lhs-green/10 text-lhs-green",
  rejected: "bg-destructive/10 text-destructive",
};

export default function AvatarQueue() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["avatar-tasks"],
    queryFn: () => base44.entities.AvatarTask.list("-created_date", 200),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ taskId, updates, driverUpdates }) => {
      await base44.entities.AvatarTask.update(taskId, updates);
      if (driverUpdates) {
        const task = tasks.find((t) => t.id === taskId);
        if (task) await base44.entities.Driver.update(task.driver_id, driverUpdates);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avatar-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Avatar task updated");
    },
  });

  const handleUploadAvatar = async (task) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      updateMutation.mutate({
        taskId: task.id,
        updates: { avatar_url: file_url, status: "complete" },
        driverUpdates: { avatar_url: file_url, status: "portal_ready", last_activity: new Date().toISOString() },
      });
    };
    input.click();
  };

  const pending = tasks.filter((t) => t.status === "pending" || t.status === "in_progress");
  const completed = tasks.filter((t) => t.status === "complete" || t.status === "rejected");

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Avatar Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">{pending.length} pending, {completed.length} completed</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : pending.length === 0 && completed.length === 0 ? (
        <Card className="p-12 text-center">
          <Image className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No avatar tasks yet</p>
          <p className="text-sm text-muted-foreground mt-1">Tasks appear when drivers complete activation</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Active queue */}
          {pending.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active</h2>
              {pending.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Photo preview */}
                    <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {task.photo_url && task.photo_url !== "received" ? (
                        <img src={task.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{task.driver_name}</span>
                        {task.username && <span className="text-xs text-muted-foreground">@{task.username}</span>}
                        <Badge variant="secondary" className={`${STATUS_COLORS[task.status]} border-0 text-xs`}>
                          {task.status === "in_progress" ? "In Progress" : "Pending"}
                        </Badge>
                      </div>
                      {task.assigned_to && <p className="text-xs text-muted-foreground mt-0.5">Assigned: {task.assigned_to}</p>}
                      <p className="text-xs text-muted-foreground">{format(new Date(task.created_date), "MMM d, yyyy")}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {task.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMutation.mutate({ taskId: task.id, updates: { status: "in_progress" } })}
                        >
                          Start
                        </Button>
                      )}
                      <Button size="sm" onClick={() => handleUploadAvatar(task)}>
                        Upload Avatar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => updateMutation.mutate({
                          taskId: task.id,
                          updates: { status: "rejected", rejection_reason: "Photo needs to be retaken" },
                        })}
                      >
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completed</h2>
              {completed.map((task) => (
                <Card key={task.id} className="opacity-70">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {task.avatar_url ? (
                        <img src={task.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {task.status === "complete" ? <CheckCircle2 className="w-4 h-4 text-lhs-green" /> : <XCircle className="w-4 h-4 text-destructive" />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm">{task.driver_name}</span>
                      <Badge variant="secondary" className={`${STATUS_COLORS[task.status]} border-0 text-xs ml-2`}>
                        {task.status === "complete" ? "Complete" : "Rejected"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
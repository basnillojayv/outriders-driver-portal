import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, CheckCircle2, Mail, User } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { toast } from "sonner";

export default function CreateUsers() {
  const queryClient = useQueryClient();

  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ["portal-ready-drivers"],
    queryFn: () => base44.entities.Driver.filter({ status: "portal_ready" }, "-updated_date", 200),
  });

  const createUserMutation = useMutation({
    mutationFn: async (driver) => {
      // Invite the driver as an app user
      await base44.users.inviteUser(driver.email, "user");
      // Update driver status
      await base44.entities.Driver.update(driver.id, {
        status: "active_user",
        portal_user_id: "invited",
        last_activity: new Date().toISOString(),
      });
      // Log the event
      await base44.entities.CommunicationLog.create({
        driver_id: driver.id,
        type: "status_change",
        subject: "Portal user created",
        body: `Portal access invite sent to ${driver.email}`,
      });
    },
    onSuccess: (_, driver) => {
      queryClient.invalidateQueries({ queryKey: ["portal-ready-drivers"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success(`Portal invite sent to ${driver.first_name} ${driver.last_name}`);
    },
  });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Create Portal Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Drivers with completed activation and approved avatar
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : drivers.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No drivers ready for portal creation</p>
          <p className="text-sm text-muted-foreground mt-1">Drivers appear here after avatar approval</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {drivers.map((driver) => (
            <Card key={driver.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                  {driver.avatar_url ? (
                    <img src={driver.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{driver.first_name} {driver.last_name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    {driver.email}
                  </div>
                  {driver.username && (
                    <div className="text-xs text-muted-foreground">@{driver.username}</div>
                  )}
                </div>
                <StatusBadge status={driver.status} />
                <Button
                  size="sm"
                  onClick={() => createUserMutation.mutate(driver)}
                  disabled={createUserMutation.isPending}
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  Create Portal User
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
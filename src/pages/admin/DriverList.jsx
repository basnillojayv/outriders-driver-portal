import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Users, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { format } from "date-fns";

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "imported", label: "Imported" },
  { value: "contacted", label: "Contacted" },
  { value: "activation_started", label: "Activation Started" },
  { value: "activation_completed", label: "Activation Done" },
  { value: "avatar_pending", label: "Avatar Pending" },
  { value: "portal_ready", label: "Portal Ready" },
  { value: "active_user", label: "Active User" },
];

export default function DriverList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => base44.entities.Driver.list("-created_date", 2000),
  });

  const filtered = drivers.filter((d) => {
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      `${d.first_name} ${d.last_name}`.toLowerCase().includes(searchLower) ||
      d.email?.toLowerCase().includes(searchLower) ||
      d.phone?.toLowerCase().includes(searchLower) ||
      d.business_name?.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  // Count by status
  const counts = {};
  drivers.forEach((d) => { counts[d.status] = (counts[d.status] || 0) + 1; });

  return (
    <div className="p-6 space-y-6">
      {/* Header + stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Drivers</h1>
          <p className="text-sm text-muted-foreground mt-1">{drivers.length} total contacts</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["imported", "contacted", "activation_completed", "avatar_pending", "active_user"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {STATUSES.find((st) => st.value === s)?.label} ({counts[s] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, phone, carrier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Driver table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No drivers found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {drivers.length === 0 ? "Import a CSV to get started" : "Try adjusting your filters"}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Phone</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Carrier</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Last Activity</th>
                  <th className="w-8 p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((driver) => (
                  <tr
                    key={driver.id}
                    onClick={() => navigate(`/admin/driver/${driver.id}`)}
                    className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-medium">{driver.first_name} {driver.last_name}</td>
                    <td className="p-3 text-muted-foreground hidden sm:table-cell">{driver.email}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{driver.phone || "—"}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{driver.business_name || "—"}</td>
                    <td className="p-3"><StatusBadge status={driver.status} /></td>
                    <td className="p-3 text-muted-foreground text-xs hidden sm:table-cell">
                      {driver.last_activity ? format(new Date(driver.last_activity), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="p-3">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Search, Loader2 } from "lucide-react";

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Get query params
  const params = new URLSearchParams(window.location.search);
  const initialFilter = params.get("status") || "";

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["allMembers"],
    queryFn: () => base44.entities.Member.list(),
  });

  // Filter members
  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        !searchTerm ||
        m.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !initialFilter || m.membership_status === initialFilter;

      return matchesSearch && matchesStatus;
    });
  }, [members, searchTerm, initialFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "var(--success)";
      case "pending":
        return "var(--accent)";
      case "suspended":
        return "var(--danger)";
      case "cancelled":
        return "var(--text-muted)";
      default:
        return "var(--text-secondary)";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-16 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 900, color: "var(--text-primary)", marginBottom: 8 }}>
          Members
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          {filtered.length} of {members.length} members
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            size={18}
            style={{
              position: "absolute",
              left: 12,
              top: 14,
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: 40,
              paddingRight: 16,
              paddingTop: 12,
              paddingBottom: 12,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "var(--carbon-800)",
              color: "var(--text-primary)",
              fontSize: 14,
            }}
          />
        </div>
        {initialFilter && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              borderRadius: 10,
              background: "rgba(204,91,48,0.12)",
              border: "1px solid rgba(204,91,48,0.2)",
              fontSize: 13,
              color: "var(--fuel-300)",
              textTransform: "capitalize",
              fontWeight: 600,
            }}
          >
            Filter: {initialFilter}
          </div>
        )}
      </div>

      {/* Members List */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((member) => (
            <div
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 16,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                transition: "all 0.15s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                  {member.first_name} {member.last_name}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {member.email}
                </p>
                {member.lhs_member_id && (
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    ID: {member.lhs_member_id}
                  </p>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 6,
                  background: `${getStatusColor(member.membership_status)}15`,
                  border: `1px solid ${getStatusColor(member.membership_status)}`,
                  fontSize: 11,
                  fontWeight: 700,
                  color: getStatusColor(member.membership_status),
                  textTransform: "capitalize",
                }}
              >
                {member.membership_status}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            color: "var(--text-muted)",
          }}
        >
          <p>No members found</p>
        </div>
      )}
    </div>
  );
}
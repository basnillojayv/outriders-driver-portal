import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { Users, Globe, Download } from "lucide-react";

const TABS = [
  { key: "public", label: "Public Interest List", icon: Globe },
  { key: "portal", label: "Portal Waitlist", icon: Users },
];

const pill = (label, color = "#ee752c") => (
  <span style={{
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    background: color + "22",
    border: `1px solid ${color}55`,
    color: color,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  }}>{label}</span>
);

const INTEREST_COLORS = {
  learning:      "#b6ada2",
  space_available: "#ee752c",
  proprietary:   "#f59b5e",
  ownership:     "#3db87a",
};

const INTEREST_LABELS = {
  learning:        "Just Learning",
  space_available: "Space Available",
  proprietary:     "Proprietary",
  ownership:       "Ownership",
};

function PublicLeadsTable({ data }) {
  if (!data?.length) return <Empty />;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {["Name", "Email", "Phone", "Location", "Company", "Driver Type", "Interest", "Date"].map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#7a6058", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <td style={{ padding: "10px 12px", color: "#f0eeec", whiteSpace: "nowrap" }}>{r.first_name} {r.last_name}</td>
              <td style={{ padding: "10px 12px", color: "#c4b5ac" }}>{r.email}</td>
              <td style={{ padding: "10px 12px", color: "#c4b5ac", whiteSpace: "nowrap" }}>{r.phone}</td>
              <td style={{ padding: "10px 12px", color: "#c4b5ac" }}>{r.location}</td>
              <td style={{ padding: "10px 12px", color: "#c4b5ac" }}>{r.company || "—"}</td>
              <td style={{ padding: "10px 12px", color: "#c4b5ac" }}>{r.driver_type ? r.driver_type.replace("_", " ") : "—"}</td>
              <td style={{ padding: "10px 12px" }}>
                {r.interest_level
                  ? pill(INTEREST_LABELS[r.interest_level] || r.interest_level, INTEREST_COLORS[r.interest_level] || "#ee752c")
                  : "—"}
              </td>
              <td style={{ padding: "10px 12px", color: "#7a6058", whiteSpace: "nowrap" }}>
                {r.created_date ? format(new Date(r.created_date), "MMM d, yyyy") : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SITUATION_LABELS = {
  single: "Single", married: "Married", family: "Family",
  empty_nester: "Empty Nester", retired: "Retired", other: "Other",
};

const REGION_LABELS = {
  southeast: "Southeast", southwest: "Southwest", midwest: "Midwest",
  northeast: "Northeast", west_coast: "West Coast", mountain_west: "Mountain West",
  gulf_coast: "Gulf Coast", no_preference: "No Preference",
};

function PortalLeadsTable({ data }) {
  if (!data?.length) return <Empty />;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {["Name", "Email", "Phone", "Location", "Life Situation", "Region", "Existing Member", "Date"].map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#7a6058", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <td style={{ padding: "10px 12px", color: "#f0eeec", whiteSpace: "nowrap" }}>{r.first_name} {r.last_name}</td>
              <td style={{ padding: "10px 12px", color: "#c4b5ac" }}>{r.email}</td>
              <td style={{ padding: "10px 12px", color: "#c4b5ac", whiteSpace: "nowrap" }}>{r.phone}</td>
              <td style={{ padding: "10px 12px", color: "#c4b5ac" }}>{r.location}</td>
              <td style={{ padding: "10px 12px", color: "#c4b5ac" }}>{SITUATION_LABELS[r.life_situation] || r.life_situation || "—"}</td>
              <td style={{ padding: "10px 12px", color: "#c4b5ac" }}>{REGION_LABELS[r.interested_region] || r.interested_region || "—"}</td>
              <td style={{ padding: "10px 12px" }}>
                {r.is_existing_member ? pill("Yes", "#3db87a") : pill("No", "#7a6058")}
              </td>
              <td style={{ padding: "10px 12px", color: "#7a6058", whiteSpace: "nowrap" }}>
                {r.created_date ? format(new Date(r.created_date), "MMM d, yyyy") : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Empty() {
  return (
    <div style={{ padding: "48px 24px", textAlign: "center", color: "#7a6058" }}>
      No submissions yet.
    </div>
  );
}

function downloadCSV(data, filename) {
  if (!data?.length) return;
  const keys = Object.keys(data[0]).filter(k => !["id","tags"].includes(k));
  const rows = [keys.join(","), ...data.map(r => keys.map(k => JSON.stringify(r[k] ?? "")).join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function OneHomeLeads() {
  const [tab, setTab] = useState("public");

  const { data: publicList = [], isLoading: loadingPublic } = useQuery({
    queryKey: ["onehome_public_waitlist"],
    queryFn: () => base44.entities.OneHomePublicWaitlist.list("-created_date", 500),
  });

  const { data: portalList = [], isLoading: loadingPortal } = useQuery({
    queryKey: ["onehome_waitlist"],
    queryFn: () => base44.entities.OneHomeWaitlist.list("-created_date", 500),
  });

  const isLoading = tab === "public" ? loadingPublic : loadingPortal;
  const activeData = tab === "public" ? publicList : portalList;

  return (
    <div style={{ padding: "28px 20px 80px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 24, color: "#f0eeec", marginBottom: 4 }}>
            OneHome Leads
          </h1>
          <p style={{ color: "#7a6058", fontSize: 13 }}>
            {publicList.length} public · {portalList.length} portal
          </p>
        </div>
        <button
          onClick={() => downloadCSV(activeData, `onehome-${tab}-${new Date().toISOString().slice(0,10)}.csv`)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(238,117,44,0.12)", border: "1px solid rgba(238,117,44,0.3)",
            borderRadius: 10, padding: "10px 16px", cursor: "pointer",
            color: "#ee752c", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13,
          }}
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer",
              fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13,
              background: tab === key ? "rgba(238,117,44,0.15)" : "rgba(255,255,255,0.04)",
              color: tab === key ? "#ee752c" : "#7a6058",
              borderBottom: tab === key ? "2px solid #ee752c" : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <Icon size={14} />
            {label}
            <span style={{
              background: tab === key ? "#ee752c" : "rgba(255,255,255,0.08)",
              color: tab === key ? "#fff" : "#7a6058",
              borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 800,
            }}>
              {key === "public" ? publicList.length : portalList.length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        overflow: "hidden",
      }}>
        {isLoading ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#7a6058" }}>Loading…</div>
        ) : tab === "public" ? (
          <PublicLeadsTable data={publicList} />
        ) : (
          <PortalLeadsTable data={portalList} />
        )}
      </div>
    </div>
  );
}
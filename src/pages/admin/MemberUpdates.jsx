import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageLayout from "@/components/admin/AdminPageLayout";
import { Plus, Loader2, Edit2, Archive, Trash2, Pin } from "lucide-react";

const CATEGORIES = [
  { value: "program", label: "Program" },
  { value: "location", label: "Location" },
  { value: "event", label: "Event" },
  { value: "announcement", label: "Announcement" },
  { value: "opportunity", label: "Opportunity" },
];

export default function MemberUpdates() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());

  const { data: updates = [], isLoading } = useQuery({
    queryKey: ["memberUpdates"],
    queryFn: () => base44.entities.MemberUpdate.list("-display_order", 100),
  });

  const sortedUpdates = useMemo(() => {
    return [...updates].sort((a, b) => (b.display_order || 0) - (a.display_order || 0));
  }, [updates]);

  function getEmptyForm() {
    return {
      title: "",
      summary: "",
      hero_image_url: "",
      category: "announcement",
      cta_text: "",
      cta_destination: "",
      featured: false,
      published: false,
      publish_date: new Date().toISOString().split("T")[0],
      expiration_date: "",
      display_order: 0,
    };
  }

  async function handleSave() {
    if (!formData.title || !formData.summary) {
      alert("Title and summary are required");
      return;
    }

    const payload = { ...formData };
    if (payload.publish_date) {
      payload.publish_date = new Date(payload.publish_date).toISOString();
    }
    if (payload.expiration_date) {
      payload.expiration_date = new Date(payload.expiration_date).toISOString();
    }

    try {
      if (editingId) {
        await base44.entities.MemberUpdate.update(editingId, payload);
      } else {
        await base44.entities.MemberUpdate.create(payload);
      }
      queryClient.invalidateQueries({ queryKey: ["memberUpdates"] });
      setShowForm(false);
      setEditingId(null);
      setFormData(getEmptyForm());
    } catch (err) {
      alert("Error saving update: " + err.message);
    }
  }

  async function handleArchive(id) {
    if (confirm("Archive this update?")) {
      try {
        await base44.entities.MemberUpdate.delete(id);
        queryClient.invalidateQueries({ queryKey: ["memberUpdates"] });
      } catch (err) {
        alert("Error archiving: " + err.message);
      }
    }
  }

  async function handleToggleFeatured(id, isFeatured) {
    try {
      // Unfeature all others if setting as featured
      if (!isFeatured) {
        const others = updates.filter((u) => u.id !== id && u.featured);
        for (const other of others) {
          await base44.entities.MemberUpdate.update(other.id, { featured: false });
        }
      }
      await base44.entities.MemberUpdate.update(id, { featured: !isFeatured });
      queryClient.invalidateQueries({ queryKey: ["memberUpdates"] });
    } catch (err) {
      alert("Error updating featured status: " + err.message);
    }
  }

  function startEdit(update) {
    setFormData(update);
    setEditingId(update.id);
    setShowForm(true);
  }

  function getCategoryLabel(cat) {
    return CATEGORIES.find((c) => c.value === cat)?.label || cat;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Member Updates"
      description="Manage Home page content and member communications"
      primaryAction={{
        label: "Create Update",
        onClick: () => {
          setEditingId(null);
          setFormData(getEmptyForm());
          setShowForm(true);
        },
      }}
    >
      {/* Form Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{
              background: "var(--carbon-800)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 24,
              maxWidth: 600,
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 18,
                fontWeight: 900,
                color: "var(--text-primary)",
                marginBottom: 20,
              }}
            >
              {editingId ? "Edit Update" : "Create Update"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="input-label">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Update title"
                />
              </div>

              <div>
                <label className="input-label">Summary *</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  placeholder="Short summary"
                  rows="3"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "var(--carbon-900)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    resize: "vertical",
                  }}
                />
              </div>

              <div>
                <label className="input-label">Hero Image URL</label>
                <input
                  type="url"
                  value={formData.hero_image_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero_image_url: e.target.value,
                    })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="input-label">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "var(--carbon-900)",
                    color: "var(--text-primary)",
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">CTA Text</label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) =>
                      setFormData({ ...formData, cta_text: e.target.value })
                    }
                    placeholder="Button label"
                  />
                </div>
                <div>
                  <label className="input-label">CTA Destination</label>
                  <input
                    type="text"
                    value={formData.cta_destination}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta_destination: e.target.value,
                      })
                    }
                    placeholder="/rewards"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Publish Date</label>
                  <input
                    type="date"
                    value={formData.publish_date?.split("T")[0] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, publish_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="input-label">Expiration Date</label>
                  <input
                    type="date"
                    value={formData.expiration_date?.split("T")[0] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expiration_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    Published
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    Featured
                  </span>
                </label>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 24,
              }}
            >
              <button
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                {editingId ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Updates List */}
      <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
        {sortedUpdates.length > 0 ? (
          sortedUpdates.map((update, i) => (
            <div
              key={update.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderBottom: i < sortedUpdates.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {/* Thumbnail */}
              {update.hero_image_url ? (
                <img
                  src={update.hero_image_url}
                  alt={update.title}
                  style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: 6, background: "rgba(255,255,255,0.05)", flexShrink: 0 }} />
              )}

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {update.title}
                  </span>
                  {update.featured && (
                    <span style={{ fontSize: 10, fontWeight: 800, color: "var(--fuel-300)", background: "rgba(232,161,75,0.15)", padding: "1px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>
                      Featured
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
                  <span style={{ textTransform: "capitalize" }}>{getCategoryLabel(update.category)}</span>
                  <span style={{ color: update.published ? "var(--success)" : "var(--text-disabled)" }}>
                    {update.published ? "Published" : "Draft"}
                  </span>
                  {update.publish_date && (
                    <span className="hidden sm:inline">{new Date(update.publish_date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => handleToggleFeatured(update.id, update.featured)}
                  title={update.featured ? "Unfeature" : "Set as featured"}
                  style={{ padding: 6, borderRadius: 6, border: "none", background: "transparent", color: update.featured ? "var(--fuel-300)" : "var(--text-muted)", cursor: "pointer" }}
                >
                  <Pin size={15} />
                </button>
                <button
                  onClick={() => startEdit(update)}
                  title="Edit"
                  style={{ padding: 6, borderRadius: 6, border: "none", background: "transparent", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleArchive(update.id)}
                  title="Delete"
                  style={{ padding: 6, borderRadius: 6, border: "none", background: "transparent", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>
            <p>No updates yet. Create one to get started.</p>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}
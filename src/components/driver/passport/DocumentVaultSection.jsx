import React, { useState } from "react";
import { Upload, Loader2, FileText, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { T } from "@/components/driver/v3/v3tokens";
import { toast } from "sonner";

const FILE_TYPE_LABELS = {
  pdf: "PDF", jpg: "JPG", jpeg: "JPG", png: "PNG", doc: "DOC", docx: "DOC",
};

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];

function getFileType(name) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return FILE_TYPE_LABELS[ext] || "FILE";
}

function isImage(name) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return IMAGE_EXTS.includes(ext);
}

export default function DocumentVaultSection({ documents, onAdd, onRemove }) {
  const [uploading, setUploading] = useState(false);

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        onAdd({ name: file.name, url: file_url, uploaded_at: new Date().toISOString() });
      }
      toast.success(`${files.length} file${files.length > 1 ? "s" : ""} uploaded.`);
    } catch {
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {/* Document list */}
      {documents.map((doc, idx) => {
        const fileType = getFileType(doc.name);
        return (
          <div key={idx} style={{
            background: T.cardAlt,
            border: `1px solid ${T.borderAlt}`,
            borderRadius: T.radiusSm,
            overflow: "hidden",
          }}>
            <div className="flex items-center gap-3" style={{ padding: "10px 12px" }}>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{
                width: 44, height: 44, borderRadius: 6, overflow: "hidden",
                background: "rgba(255,106,0,0.08)",
                border: `1px solid ${T.borderAlt}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {isImage(doc.name)
                  ? <img src={doc.url} alt={doc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <FileText size={16} style={{ color: T.orange }} />}
              </a>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{
                flex: 1, fontSize: 13, color: T.textSecondary,
                fontFamily: "var(--font-body)", textDecoration: "none",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {doc.name}
              </a>
              <span style={{
                fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
                color: T.orange, letterSpacing: "0.12em",
                border: `1px solid ${T.orange}`,
                borderRadius: 4, padding: "2px 7px",
                transform: "rotate(-3deg)", opacity: 0.85,
                flexShrink: 0,
              }}>
                {fileType}
              </span>
              <button onClick={() => onRemove(idx)} style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: T.textMuted, padding: 4, display: "flex",
              }}>
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}

      {/* Upload area */}
      <label style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 6, minHeight: 72, cursor: "pointer",
        background: T.cardAlt, border: `1px dashed ${T.border}`,
        borderRadius: T.radiusSm, padding: "14px",
      }}>
        {uploading
          ? <Loader2 size={18} className="animate-spin" style={{ color: T.orange }} />
          : <Upload size={18} style={{ color: T.textMuted }} />}
        <span style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700, color: T.textSecondary }}>
          {uploading ? "Uploading…" : "Upload Documents"}
        </span>
        <span style={{ fontSize: 10, color: T.textMuted, textAlign: "center" }}>
          CDL, insurance, certifications — PDF, JPG, PNG
        </span>
        <input type="file" multiple onChange={onUpload} style={{ display: "none" }} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
      </label>
    </div>
  );
}
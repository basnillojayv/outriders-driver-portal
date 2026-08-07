/**
 * PassportBooklet — reusable FlippingBook-style passport viewer.
 * Renders the cover + each section as a navigable page.
 * Used by PassportPreview (modal) and PublicPassport (full page).
 */
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { T } from "@/components/driver/v3/v3tokens";
import PassportCover from "./PassportCover";
import PassportPage from "./PassportPage";

function FieldRow({ label, value, placeholder = "—" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{
        fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
        color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase",
        marginBottom: 3,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500,
        color: value ? T.textPrimary : T.textMuted,
      }}>
        {value || placeholder}
      </p>
    </div>
  );
}

function ChipList({ items }) {
  if (!items || items.length === 0) {
    return <p style={{ fontSize: 13, color: T.textMuted }}>No selections yet</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} style={{
          padding: "5px 12px", borderRadius: 999,
          fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
          background: T.orangeDim, color: T.orange,
          border: `1px solid rgba(255,106,0,0.3)`,
        }}>
          {item}
        </span>
      ))}
    </div>
  );
}

export default function PassportBooklet({ data, initialPage = 0 }) {
  const [page, setPage] = useState(initialPage);

  const { form, photoUrl, memberId, completion, memberName, tractorTypes, trailerTypes, freightTypes, documents, references, experiences } = data;
  const initials = [form.first_name, form.last_name].filter(Boolean).map(p => p[0]).slice(0, 2).join("").toUpperCase() || "D";

  const PAGES = [
    {
      title: "Identity & Overview", icon: "ShieldCheck",
      render: () => (
        <div>
          <div className="flex flex-col items-center" style={{ marginBottom: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 14, border: `1px solid ${T.border}`,
              background: T.cardAlt, overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
            }}>
              {photoUrl
                ? <img src={photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 700, color: T.textSecondary }}>{initials}</span>
              }
            </div>
            <FieldRow label="Handle" value={form.username ? ('"' + form.username + '"') : ""} />
            <FieldRow label="Professional Headline" value={form.headline} />
            <FieldRow label="Summary" value={form.summary} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="First Name" value={form.first_name} />
            <FieldRow label="Last Name" value={form.last_name} />
          </div>
          <FieldRow label="Phone" value={form.phone} />
          <FieldRow label="Email" value={form.email} />
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="City" value={form.city} />
            <FieldRow label="State" value={form.state} />
          </div>
        </div>
      ),
    },
    {
      title: "Career History", icon: "Briefcase",
      render: () => (
        <div>
          {experiences && experiences.length > 0 ? (
            <div className="space-y-3">
              {experiences.map((exp, i) => (
                <div key={i} style={{
                  padding: "12px 14px", borderRadius: 10,
                  background: T.cardAlt, border: `1px solid ${T.borderAlt}`,
                }}>
                  <p style={{
                    fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                    color: T.textPrimary, marginBottom: 2,
                  }}>
                    {exp.title || "—"}
                  </p>
                  {exp.company && (
                    <p style={{ fontSize: 13, color: T.orange, marginBottom: 4, fontFamily: "var(--font-heading)", fontWeight: 700 }}>
                      {exp.company}
                    </p>
                  )}
                  {(exp.start_date || exp.end_date) && (
                    <p style={{
                      fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700,
                      color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
                      marginBottom: exp.description ? 6 : 0,
                    }}>
                      {[exp.start_date, exp.current ? "Present" : exp.end_date].filter(Boolean).join(" — ")}
                    </p>
                  )}
                  {exp.description && (
                    <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.5 }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: T.textMuted }}>No career history added yet</p>
          )}
        </div>
      ),
    },
    {
      title: "Credentials & Equipment", icon: "BadgeCheck",
      render: () => (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="CDL Number" value={form.cdl_number} />
            <FieldRow label="CDL State" value={form.cdl_state} />
          </div>
          <FieldRow label="Endorsements" value={form.endorsements} />
          <FieldRow label="Medical Card Expiry" value={form.medical_card_expiry} />
          <div style={{ height: 1, background: T.borderAlt, margin: "14px 0" }} />
          <div style={{ marginBottom: 14 }}>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
              color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6,
            }}>
              Tractor Types
            </p>
            <ChipList items={tractorTypes} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
              color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6,
            }}>
              Trailer Types
            </p>
            <ChipList items={trailerTypes} />
          </div>
          <div>
            <p style={{
              fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
              color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6,
            }}>
              Freight Types
            </p>
            <ChipList items={freightTypes} />
          </div>
        </div>
      ),
    },
    {
      title: "References", icon: "Users",
      render: () => (
        <div>
          {references && references.length > 0 ? (
            <div className="space-y-3">
              {references.map((ref, i) => {
                const relationship = ref.relationship === "Other"
                  ? (ref.relationship_other || "Other")
                  : (ref.relationship || "—");
                return (
                  <div key={i} style={{
                    padding: "12px 14px", borderRadius: 10,
                    background: T.cardAlt, border: `1px solid ${T.borderAlt}`,
                  }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                      <p style={{
                        fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                        color: T.textPrimary,
                      }}>
                        {ref.name || "—"}
                      </p>
                      <span style={{
                        fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
                        color: T.orange, letterSpacing: "0.14em", textTransform: "uppercase",
                        border: `1px solid rgba(255,106,0,0.3)`, borderRadius: 6,
                        padding: "3px 8px",
                      }}>
                        {relationship}
                      </span>
                    </div>
                    {ref.company && (
                      <p style={{ fontSize: 13, color: T.textSecondary, marginBottom: 4 }}>
                        {ref.company}
                      </p>
                    )}
                    <div className="flex flex-col gap-1">
                      {ref.email && (
                        <p style={{ fontSize: 12, color: T.textMuted }}>{ref.email}</p>
                      )}
                      {ref.phone && (
                        <p style={{ fontSize: 12, color: T.textMuted }}>{ref.phone}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: T.textMuted }}>No references added yet</p>
          )}
        </div>
      ),
    },
    {
      title: "Document Vault", icon: "ShieldCheck",
      render: () => {
        const IMG_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
        const typeLabel = (name) => {
          const ext = (name || "").split(".").pop()?.toLowerCase() || "";
          return ({ pdf: "PDF", jpg: "JPG", jpeg: "JPG", png: "PNG", doc: "DOC", docx: "DOC" })[ext] || "FILE";
        };
        const isImg = (name) => IMG_EXTS.includes((name || "").split(".").pop()?.toLowerCase() || "");
        return (
          <div>
            {documents && documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc, i) => {
                  const name = doc.name || doc.label || ("Document " + (i + 1));
                  return (
                    <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" style={{
                      textDecoration: "none", display: "flex", alignItems: "center", gap: 10,
                      padding: 8, borderRadius: 10,
                      background: T.cardAlt, border: `1px solid ${T.borderAlt}`,
                    }}>
                      <span style={{
                        width: 44, height: 44, borderRadius: 6, overflow: "hidden", flexShrink: 0,
                        background: "rgba(255,106,0,0.08)", border: `1px solid ${T.borderAlt}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isImg(name)
                          ? <img src={doc.url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 800, color: T.orange }}>{typeLabel(name)}</span>}
                      </span>
                      <span style={{ fontSize: 13, color: T.textSecondary, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {name}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700,
                        color: T.orange, letterSpacing: "0.14em", textTransform: "uppercase",
                        border: `1px solid rgba(255,106,0,0.3)`, borderRadius: 6, padding: "3px 8px", flexShrink: 0,
                      }}>
                        {typeLabel(name)}
                      </span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: T.textMuted }}>No documents uploaded yet</p>
            )}
          </div>
        );
      },
    },
  ];

  const totalPages = PAGES.length + 1;
  const isCover = page === 0;
  const currentPage = isCover ? null : PAGES[page - 1];

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Page area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          {isCover ? (
            <PassportCover memberName={memberName} memberId={memberId} completion={completion} />
          ) : (
            <PassportPage
              pageNumber={String(page + 1).padStart(2, "0")}
              title={currentPage.title}
              isComingSoon={currentPage.isComingSoon}
              comingSoonDescription={currentPage.comingSoonDescription}
            >
              {currentPage.render ? currentPage.render() : null}
            </PassportPage>
          )}
        </div>
      </div>

      {/* Nav bar */}
      <div className="flex items-center justify-between" style={{
        padding: "14px 18px",
        borderTop: `1px solid ${T.borderAlt}`,
        background: "#0a0a0a",
        flexShrink: 0,
        paddingBottom: "calc(env(safe-area-inset-bottom) + 14px)",
      }}>
        <button
          onClick={goPrev}
          disabled={page === 0}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: T.cardAlt, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "10px 16px", cursor: page === 0 ? "default" : "pointer",
            opacity: page === 0 ? 0.35 : 1,
            color: T.textSecondary,
            fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700,
          }}
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <span style={{
          fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700,
          color: T.textMuted, letterSpacing: "0.14em",
        }}>
          {page + 1} / {totalPages}
        </span>

        <button
          onClick={goNext}
          disabled={page === totalPages - 1}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: T.orange, border: "none",
            borderRadius: 10, padding: "10px 16px", cursor: page === totalPages - 1 ? "default" : "pointer",
            opacity: page === totalPages - 1 ? 0.35 : 1,
            color: "#0A0A0A",
            fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700,
          }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
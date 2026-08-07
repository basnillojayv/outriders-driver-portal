import React, { useState, useMemo } from "react";
import { X, Mail, Users, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";

export default function InvitePendingDialog({ candidates, loading, result, onClose, onConfirm }) {
  const [limit, setLimit] = useState(25);

  const safeLimit = Math.max(1, Math.min(500, Number(limit) || 1));
  const willInvite = useMemo(
    () => Math.min(safeLimit, candidates.length),
    [safeLimit, candidates.length]
  );
  const toInvite = useMemo(
    () => candidates.slice(0, safeLimit),
    [candidates, safeLimit]
  );
  const deferred = candidates.length - willInvite;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--carbon-800)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          maxWidth: 480,
          width: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Users size={18} style={{ color: "var(--fuel-300)" }} />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 18,
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              Invite Pending Members
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
          {result ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              {result.error ? (
                <>
                  <AlertTriangle size={32} style={{ color: "var(--danger)", marginBottom: 12 }} />
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
                    Invitation failed
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{result.error}</p>
                </>
              ) : (
                <>
                  <CheckCircle2 size={32} style={{ color: "var(--success)", marginBottom: 12 }} />
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
                    Batch complete
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 20,
                      fontSize: 13,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    <span style={{ color: "var(--success)", fontWeight: 800 }}>
                      {result.invited} invited
                    </span>
                    <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>
                      {result.skipped} skipped
                    </span>
                    {result.failed > 0 && (
                      <span style={{ color: "var(--danger)", fontWeight: 800 }}>
                        {result.failed} failed
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : candidates.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <Users size={32} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
              <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 600 }}>
                No active members are pending invitation.
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                All active members have already been invited or have portal accounts.
              </p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: "rgba(204,91,48,0.12)",
                  border: "1px solid rgba(204,91,48,0.3)",
                  marginBottom: 16,
                }}
              >
                <Mail size={18} style={{ color: "var(--fuel-300)", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "var(--fuel-300)", fontFamily: "var(--font-heading)" }}>
                    {willInvite} member{willInvite !== 1 ? "s" : ""} will be invited
                  </p>
                  {deferred > 0 && (
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      {deferred} will be deferred — run again to invite the next batch.
                    </p>
                  )}
                </div>
              </div>

              {/* Batch limit */}
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-heading)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  marginBottom: 6,
                }}
              >
                Batch limit
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "var(--carbon-900)",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              />

              {/* Email list */}
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-heading)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  marginBottom: 6,
                }}
              >
                Recipients ({toInvite.length})
              </label>
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  background: "var(--carbon-900)",
                  maxHeight: 180,
                  overflowY: "auto",
                }}
              >
                {toInvite.map((m, i) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderBottom: i < toInvite.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ width: 22, color: "var(--text-muted)", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}.
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {m.first_name} {m.last_name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {m.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "var(--text-secondary)",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              cursor: "pointer",
            }}
          >
            {result ? "Close" : "Cancel"}
          </button>
          {!result && candidates.length > 0 && (
            <button
              onClick={() => onConfirm(safeLimit)}
              disabled={loading}
              style={{
                padding: "9px 18px",
                borderRadius: 8,
                border: "none",
                background: loading ? "rgba(204,91,48,0.3)" : "linear-gradient(135deg, #e8a14b, #cc5b30)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 800,
                fontFamily: "var(--font-heading)",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Inviting…" : `Confirm — Invite ${willInvite}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
import React from "react";

/**
 * Consistent admin page layout for all Operations Console pages.
 * 
 * Props:
 *   title: string — Page title
 *   description: string — Subtitle/description
 *   primaryAction: { label, onClick } — Optional action button
 *   filters: ReactNode — Optional filter bar
 *   search: ReactNode — Optional search input
 *   children: ReactNode — Main content
 */
export default function AdminPageLayout({
  title,
  description,
  primaryAction,
  filters,
  search,
  children,
}) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 28,
              fontWeight: 900,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}
          >
            {title}
          </h1>
          {description && (
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              {description}
            </p>
          )}
        </div>
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--fuel-300), var(--fuel-500))",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-heading)",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.3px",
              flexShrink: 0,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(204,91,48,0.3)",
            }}
          >
            {primaryAction.label}
          </button>
        )}
      </div>

      {/* Search & Filters */}
      {(search || filters) && (
        <div className="space-y-4">
          {search && <div>{search}</div>}
          {filters && <div>{filters}</div>}
        </div>
      )}

      {/* Main Content */}
      <div>{children}</div>
    </div>
  );
}
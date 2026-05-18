import Link from "next/link";
import type { CSSProperties } from "react";

import type { UtilityJsonRecord } from "@/lib/utilities-data";

type Props = {
  stateParam: string;
  items: UtilityJsonRecord[];
  page: number;
  totalPages: number;
  total: number;
  query: string;
};

const paginationLinkStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#67e8f9",
  padding: "8px 14px",
  border: "1px solid #1a3a5c",
  borderRadius: 8,
  textDecoration: "none",
  background: "#071828",
};

export function UtilitiesStateList({ stateParam, items, page, totalPages, total, query }: Props) {
  const base = `/utilities/${stateParam}`;
  const qParam = query ? `&q=${encodeURIComponent(query)}` : "";

  return (
    <>
      <form
        method="get"
        action={base}
        style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search by name, PWSID, or city served…"
          style={{
            flex: "1 1 220px",
            padding: "11px 14px",
            background: "#071828",
            border: "1px solid #1a3a5c",
            borderRadius: 8,
            color: "#f1f5f9",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "11px 18px",
            border: "none",
            borderRadius: 8,
            background: "linear-gradient(135deg,#0891b2,#06b6d4)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Search
        </button>
        {query ? (
          <Link
            href={base}
            style={{
              padding: "11px 14px",
              fontSize: 14,
              color: "#94a3b8",
              textDecoration: "none",
              alignSelf: "center",
            }}
          >
            Clear
          </Link>
        ) : null}
      </form>

      <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px" }}>
        Showing page {page} of {totalPages} ({total.toLocaleString("en-US")} system
        {total === 1 ? "" : "s"}
        {query ? ` matching “${query}”` : ""})
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((u) => (
          <Link
            key={u.pwsid}
            href={`${base}/${u.slug}`}
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              padding: "12px 16px",
              background: "#0d2240",
              border: "1px solid #1a3a5c",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{u.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                {u.pwsid}
                {u.populationServed != null ? ` · ${u.populationServed.toLocaleString("en-US")} served` : ""}
              </div>
            </div>
            {!u.isClaimed ? (
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: "#64748b",
                  background: "#040d14",
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid #1a3a5c",
                  alignSelf: "center",
                }}
              >
                Unclaimed
              </span>
            ) : null}
          </Link>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label="Pagination"
          style={{
            marginTop: 24,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {page > 1 ? (
            <Link href={`${base}?page=${page - 1}${qParam}`} style={paginationLinkStyle}>
              ← Previous
            </Link>
          ) : null}
          <span style={{ fontSize: 13, color: "#94a3b8", padding: "0 8px" }}>
            Page {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={`${base}?page=${page + 1}${qParam}`} style={paginationLinkStyle}>
              Next →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}

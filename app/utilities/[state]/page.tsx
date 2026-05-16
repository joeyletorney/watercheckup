import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/app/components/SiteHeader";
import { stateLabel } from "@/lib/us-state-names";
import { getUtilitiesInState } from "@/lib/utilities-data";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: { state: string };
}): Promise<Metadata> {
  const code = params.state.toUpperCase();
  const name = stateLabel(code);
  return {
    title: `${name} Public Water Systems | WaterCheckup`,
    description: `Browse EPA public water systems in ${name}. PWSID, population served, violations snapshot, and full 2026-style reports.`,
    alternates: {
      canonical: `https://watercheckup.com/utilities/${params.state.toLowerCase()}`,
    },
  };
}

export default function UtilitiesStatePage({ params }: { params: { state: string } }) {
  let list: ReturnType<typeof getUtilitiesInState>;
  try {
    list = getUtilitiesInState(params.state);
  } catch {
    notFound();
  }
  if (list.length === 0) notFound();

  const code = params.state.toUpperCase();
  const stName = stateLabel(code);
  const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name, "en"));

  return (
    <div style={{ minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        <nav style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
            Home
          </Link>
          <span style={{ margin: "0 6px" }}>›</span>
          <Link href="/utilities" style={{ color: "#64748b", textDecoration: "none" }}>
            Utilities
          </Link>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#94a3b8" }}>{stName}</span>
        </nav>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#f1f5f9", margin: "0 0 12px" }}>
          Public water systems in {stName}
        </h1>
        <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 24px", lineHeight: 1.6 }}>
          {sorted.length.toLocaleString("en-US")} systems (SDWIS/Fed snapshot). Open any row for PFAS monitoring, violation
          counts, and filter recommendations.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((u) => (
            <Link
              key={u.pwsid}
              href={`/utilities/${params.state.toLowerCase()}/${u.slug}`}
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
      </div>
    </div>
  );
}

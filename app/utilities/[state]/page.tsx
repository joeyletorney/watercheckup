import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/app/components/SiteHeader";
import { UtilityOperatorCcrCta } from "@/components/UtilityOperatorCcrCta";
import { stateLabel } from "@/lib/us-state-names";
import { getStateUtilityCount, getUtilitiesInStatePage } from "@/lib/utilities-data";

import { UtilitiesStateList } from "./UtilitiesStateList";

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

export default function UtilitiesStatePage({
  params,
  searchParams,
}: {
  params: { state: string };
  searchParams: { page?: string; q?: string };
}) {
  const pageNum = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const query = searchParams.q?.trim() || "";

  let result: ReturnType<typeof getUtilitiesInStatePage>;
  try {
    result = getUtilitiesInStatePage(params.state, pageNum, undefined, query);
  } catch {
    notFound();
  }
  if (result.total === 0 && !query) notFound();

  const code = params.state.toUpperCase();
  const stName = stateLabel(code);
  const totalInState = getStateUtilityCount(params.state);

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
          {totalInState.toLocaleString("en-US")} systems (SDWIS/Fed snapshot). Search or browse pages — open any row
          for PFAS monitoring, violation counts, and filter recommendations.
        </p>

        <div
          style={{
            marginBottom: 20,
            padding: "14px 18px",
            background: "rgba(8, 145, 178, 0.08)",
            border: "1px solid rgba(8, 145, 178, 0.28)",
            borderRadius: 10,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <UtilityOperatorCcrCta variant="state-directory" />
          <Link
            href="/utilities/claim"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#0f172a",
              padding: "10px 16px",
              borderRadius: 8,
              background: "linear-gradient(135deg,#22d3ee,#06b6d4)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Claim Your Listing →
          </Link>
        </div>

        <UtilitiesStateList
          stateParam={params.state.toLowerCase()}
          items={result.items}
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          query={query}
        />
      </div>
    </div>
  );
}

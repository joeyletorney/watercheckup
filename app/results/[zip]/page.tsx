import type { Metadata } from 'next';
import { SiteHeader } from '../../components/SiteHeader';
import ResultsClient from './ResultsClient';
import { buildZipResultsDescription, buildZipResultsTitle } from '@/lib/zip-results-seo';

/** ZIP result pages are generated on first request (ISR), not at build — avoids 40k+ prerenders and remote fetch timeouts. */
export const dynamicParams = true;
export const revalidate = 86400;

interface Props { params: Promise<{ zip: string }> }

async function fetchWaterData(zip: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://watercheckup.com';
  const res = await fetch(`${base}/api/water?zip=${zip}`, { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await fetchWaterData(params.zip);
  if (!data) {
    return {
      title: `ZIP ${params.zip} Water Quality — Check Tap Water | WaterCheckup`,
      description: `Free EPA tap water report for ZIP ${params.zip}. PFAS, lead, violations, and NSF filter picks — no signup.`,
      alternates: { canonical: `https://watercheckup.com/results/${params.zip}` },
    };
  }
  const displayScore = Math.min(typeof data.score === 'number' ? data.score : 0, 88);
  const seoIn = {
    zip: params.zip,
    city: data.city,
    score: displayScore,
    grade: data.grade,
    openViolations: data.openViolations,
    pfasCount: data.pfasCount,
    pfasAboveMcl: data.pfasAboveMcl,
  };
  const title = buildZipResultsTitle(seoIn);
  const description = buildZipResultsDescription(seoIn);
  return {
    title,
    description,
    alternates: { canonical: `https://watercheckup.com/results/${params.zip}` },
    openGraph: {
      title,
      description,
      images: [{ url: `https://watercheckup.com/api/og?city=${encodeURIComponent(data.city)}&score=${displayScore}&grade=${data.grade}&violations=${data.openViolations}`, width: 1200, height: 630 }],
    },
  };
}

export default async function ResultsPage(props: Props) {
  const params = await props.params;
  const data = await fetchWaterData(params.zip);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check another ZIP →" ctaHref="/" />
      <ResultsClient zip={params.zip} initialData={data} />
    </div>
  );
}

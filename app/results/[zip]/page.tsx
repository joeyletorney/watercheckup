import type { Metadata } from 'next';
import { SiteHeader } from '../../components/SiteHeader';
import ResultsClient from './ResultsClient';
import { buildZipResultsDescription, buildZipResultsTitle } from '@/lib/zip-results-seo';
import { cache } from 'react';
import { lookupWaterReport } from '@/lib/server-water-report';
import { notFound } from 'next/navigation';

/** ZIP result pages are generated on first request (ISR), not at build — avoids 40k+ prerenders and remote fetch timeouts. */
// export const dynamicParams = true;
// // export const revalidate = 86400;

interface Props { params: Promise<{ zip: string }> }

const fetchWaterData = cache(async (zip: string) => {
  if (!/^\d{5}$/.test(zip)) return null;
  const response = await lookupWaterReport(zip);
  const body = await response.json();
  return response.ok ? body : { lookupError: body.error, lookupStatus: response.status, pwsid: body.pwsid };
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await fetchWaterData(params.zip);
  if (!data || data.lookupError || data.violationCoverage === 'unavailable') {
    return {
      title: `ZIP ${params.zip} Water Quality — Check Tap Water | WaterCheckup`,
      description: `Water records for ZIP ${params.zip}. Historical measurements may be available; current compliance must be verified with your supplier.`,
      alternates: { canonical: `https://watercheckup.com/results/${params.zip}` },
      robots: { index: false, follow: true },
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
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      images: [{ url: `https://watercheckup.com/api/og?city=${encodeURIComponent(data.city)}&score=${displayScore}&grade=${data.grade}&violations=${data.openViolations}`, width: 1200, height: 630 }],
    },
  };
}

export default async function ResultsPage(props: Props) {
  const params = await props.params;
  if (!/^\d{5}$/.test(params.zip)) notFound();
  const data = await fetchWaterData(params.zip);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check another ZIP →" ctaHref="/" />
      <ResultsClient zip={params.zip} initialData={data} />
    </div>
  );
}

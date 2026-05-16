import type { Metadata } from 'next';
import { SiteHeader } from '../../components/SiteHeader';
import ResultsClient from './ResultsClient';

/** ZIP result pages are generated on first request (ISR), not at build — avoids 40k+ prerenders and remote fetch timeouts. */
export const dynamicParams = true;
export const revalidate = 86400;

interface Props { params: { zip: string } }

async function fetchWaterData(zip: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://watercheckup.com';
  const res = await fetch(`${base}/api/water?zip=${zip}`, { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchWaterData(params.zip);
  if (!data) return { title: 'Water Quality Report | WaterCheckup' };
  const displayScore = Math.min(typeof data.score === 'number' ? data.score : 0, 88);
  return {
    title: `${data.city} Water Quality Report — Score ${displayScore}/88 | WaterCheckup`,
    description: `${data.city} tap water: ${data.openViolations} open violations, ${data.pfasCount} PFAS compounds detected. Free EPA report with filter recommendations.`,
    alternates: { canonical: `https://watercheckup.com/results/${params.zip}` },
    openGraph: {
      title: `${data.city} Water Safety Score: ${displayScore}/88`,
      description: `Free EPA water quality report for ${data.city}. ${data.summary}`,
      images: [{ url: `https://watercheckup.com/api/og?city=${encodeURIComponent(data.city)}&score=${displayScore}&grade=${data.grade}&violations=${data.openViolations}`, width: 1200, height: 630 }],
    },
  };
}

export default async function ResultsPage({ params }: Props) {
  const data = await fetchWaterData(params.zip);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check another ZIP →" ctaHref="/" />
      <ResultsClient zip={params.zip} initialData={data} />
    </div>
  );
}

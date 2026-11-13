import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SiteHeader } from '../components/SiteHeader';
import { WaterSearch } from '@/components/WaterSearch';
import { resolveWaterSearch } from '@/lib/water-search';

export const metadata: Metadata = {
  title: 'Find your water report | WaterCheckup',
  robots: { index: false, follow: true },
};

/** Native GET form fallback keeps search usable with JavaScript disabled or still loading. */
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const value = (typeof q === 'string' ? q : '').slice(0, 80);
  const match = resolveWaterSearch(value);
  if (match) redirect(`/results/${match.zip}`);
  return <>
    <SiteHeader variant="inner" />
    <section className="wc-page" aria-labelledby="wc-search-page-heading">
      <h1 id="wc-search-page-heading" style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Find your supplier’s water records</h1>
      <p style={{ color: '#cbd5e1', marginTop: 12 }}>Enter your 5-digit ZIP code or a supported city name. For cities with the same name, include the state abbreviation.</p>
      <WaterSearch initialValue={value} initialError={value ? 'City not found. Please try your 5-digit ZIP code.' : ''} />
    </section>
  </>;
}

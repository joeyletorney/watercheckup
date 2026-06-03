import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { CityRankingList } from '@/components/CityRankingList';
import { RankingRelatedLinks } from '@/components/RankingRelatedLinks';
import { buildBestCitiesBySafetyScore } from '@/lib/city-rankings';

export const metadata: Metadata = {
  title: '10 Best Cities for Tap Water Quality (2026 Safety Score) | WaterCheckup',
  description:
    'US cities with the highest Water Safety Scores on WaterCheckup — best composite grades from EPA UCMR5 and contaminant profiles among tracked metros.',
  alternates: { canonical: 'https://watercheckup.com/best-cities' },
};

export const revalidate = 86400;

export default function BestCitiesPage() {
  const cities = buildBestCitiesBySafetyScore(10);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#22d3ee', letterSpacing: 2, marginBottom: 10 }}>
            WATER SAFETY SCORE · 0–88
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 22px' }}>
            10 best cities for tap water quality
          </h1>
          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
            Among WaterCheckup&apos;s tracked city guides, these metros score highest on our exposure profile (88 =
            best possible — no municipal supply is perfect). &quot;Best&quot; here means fewer UCMR5 MCL flags and lighter
            contaminant profiles in our database — not a guarantee for every home. Older plumbing can still add lead at
            the tap. Compare with the{' '}
            <Link href="/worst-cities" style={{ color: '#22d3ee' }}>
              worst cities list
            </Link>
            .
          </p>
        </div>

        <CityRankingList
          items={cities.map((c) => ({
            slug: c.slug,
            name: c.name,
            state: c.state,
            subtitle: `${c.keyFinding} · ${c.population} residents`,
            badge: `Grade ${c.grade}`,
            badgeColor: c.gradeColor,
            rightLabel: `${c.score}/88`,
            rightColor: c.gradeColor,
          }))}
          highlightTop={3}
        />

        <RankingRelatedLinks
          links={[
            { href: '/worst-cities', label: 'Worst cities', desc: 'Lowest Water Safety Scores' },
            { href: '/water-hardness', label: 'Water hardness tool', desc: 'Hardness by ZIP and state' },
            { href: '/', label: 'Check your ZIP', desc: 'Your utility’s live EPA report' },
          ]}
        />
      </div>
    </div>
  );
}

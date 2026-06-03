import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { CityRankingList } from '@/components/CityRankingList';
import { RankingRelatedLinks } from '@/components/RankingRelatedLinks';
import {
  buildCitiesWithPfasMclViolations,
  buildCitiesWithUnregulatedPfasPeaks,
} from '@/lib/city-rankings';

export const metadata: Metadata = {
  title: '20 Worst Cities for PFAS — MCL Violations & Peak Readings (2026) | WaterCheckup',
  description:
    'US cities where EPA UCMR5 shows regulated PFAS over federal MCLs, plus cities with the highest unregulated PFAS peaks (e.g. 6:2 FTS). Links to free city reports.',
  alternates: { canonical: 'https://watercheckup.com/worst-pfas-cities' },
};

export const revalidate = 86400;

export default function WorstPfasCitiesPage() {
  const mclCities = buildCitiesWithPfasMclViolations(20);
  const peakCities = buildCitiesWithUnregulatedPfasPeaks(20);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>
            EPA UCMR5 · CITY REPORTS
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 22px' }}>
            Worst cities for PFAS in tap water
          </h1>
          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
            Two lists: cities with <strong style={{ color: '#e2e8f0' }}>regulated PFAS over EPA MCLs</strong> (PFOA, PFOS,
            PFHxS, etc.), and cities with the highest <strong style={{ color: '#e2e8f0' }}>unregulated peaks</strong> where
            MCL violation counts are still zero (e.g. high 6:2 FTS). For raw PWSID leaderboards see{' '}
            <Link href="/worst-pfas" style={{ color: '#22d3ee' }}>top 10 systems over MCL</Link> and{' '}
            <Link href="/worst-water" style={{ color: '#22d3ee' }}>top 50 peak readings</Link>.
          </p>
        </div>

        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 14 }}>
            TOP 20 — PFAS MCL VIOLATIONS (TRACKED CITIES)
          </div>
          <CityRankingList
            items={mclCities.map((c) => ({
              slug: c.slug,
              name: c.name,
              state: c.state,
              subtitle: `Worst regulated: ${c.worstCompound} at ${c.worstPpt >= 100 ? c.worstPpt.toFixed(0) : c.worstPpt.toFixed(1)} ppt`,
              badge: `${c.violations} MCL flag${c.violations === 1 ? '' : 's'}`,
              badgeColor: '#ef4444',
              rightLabel: `${c.maxPpt >= 100 ? c.maxPpt.toFixed(0) : c.maxPpt.toFixed(1)} ppt peak`,
              rightColor: '#ef4444',
            }))}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 14 }}>
            TOP 20 — HIGHEST UNREGULATED PFAS PEAKS (NO MCL VIOLATION COUNT)
          </div>
          <p style={{ fontSize: 14, color: '#a8b4c4', lineHeight: 1.6, margin: '0 0 22px' }}>
            These peaks are still serious forever chemicals — they are not yet counted as federal MCL violations in UCMR5
            violation fields.
          </p>
        </div>
        <CityRankingList
          items={peakCities.map((c) => ({
            slug: c.slug,
            name: c.name,
            state: c.state,
            subtitle: `Peak analyte: ${c.peakCompound}`,
            badge: 'Unregulated peak',
            badgeColor: '#f59e0b',
            rightLabel: `${c.maxPpt >= 100 ? c.maxPpt.toFixed(0) : c.maxPpt.toFixed(1)} ppt`,
            rightColor: '#f59e0b',
          }))}
          highlightTop={3}
        />

        <RankingRelatedLinks
          links={[
            { href: '/worst-cities', label: 'Worst overall cities', desc: 'Water Safety Score composite' },
            { href: '/water/sugar-land', label: 'Sugar Land report', desc: '672 ppt 6:2 FTS peak case study' },
            { href: '/pfas', label: 'PFAS explainer', desc: 'What PFAS are and how to filter' },
          ]}
        />
      </div>
    </div>
  );
}

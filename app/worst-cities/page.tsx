import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { CityRankingList } from '@/components/CityRankingList';
import { RankingRelatedLinks } from '@/components/RankingRelatedLinks';
import { buildWorstCitiesBySafetyScore } from '@/lib/city-rankings';
import { SearchDemandCities } from '@/components/SearchDemandCities';

export const metadata: Metadata = {
  title: '25 Worst Cities for Tap Water 2026 — Safety Grades | WaterCheckup',
  description:
    'Lowest Water Safety Scores (0–88): PFAS, lead, hardness & EPA violations by city. Free 2026 tap water reports with NSF filter picks for each metro.',
  alternates: { canonical: 'https://watercheckup.com/worst-cities' },
  openGraph: {
    title: '25 Worst Cities for Tap Water — 2026 Water Safety Score',
    description: 'Ranked by our 0–88 exposure profile score across tracked city water reports.',
  },
};

export const revalidate = 86400;

export default function WorstCitiesPage() {
  const cities = buildWorstCitiesBySafetyScore(25);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>
            WATER SAFETY SCORE · 0–88
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 22px' }}>
            25 worst cities for tap water quality
          </h1>
          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 22px' }}>
            Ranked by our <strong style={{ color: '#e2e8f0' }}>Water Safety Score</strong> — the same 0–88 exposure
            profile used on each city report. Regulatory PFAS MCL violations weigh heaviest; monitoring detections and
            lead, DBP, and chromium flags in our profiles add smaller penalties. This is not your ZIP&apos;s live SDWIS
            compliance score.
          </p>
          <p style={{ fontSize: 14, color: '#a8b4c4', lineHeight: 1.65, margin: 0 }}>
            Only tracked metros with WaterCheckup city guides ({cities.length} shown). For PFAS-only leaderboards see{' '}
            <Link href="/worst-water" style={{ color: '#22d3ee' }}>peak PFAS systems</Link> and{' '}
            <Link href="/worst-pfas-cities" style={{ color: '#22d3ee' }}>PFAS MCL cities</Link>.
          </p>
        </div>

        <SearchDemandCities title="Also ranking well in Google search" compact />

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
        />

        <RankingRelatedLinks
          links={[
            { href: '/best-cities', label: 'Best tap water cities', desc: 'Highest Water Safety Scores' },
            { href: '/worst-pfas-cities', label: 'PFAS MCL violation cities', desc: 'Regulated PFAS over EPA limits' },
            { href: '/worst-lead', label: 'Lead pipe risk cities', desc: 'Lead service line & plumbing risk' },
            { href: '/rankings', label: 'State rankings', desc: '% of cities over EPA limits by state' },
            { href: '/', label: 'Check your ZIP', desc: 'Live utility compliance report' },
          ]}
        />
      </div>
    </div>
  );
}

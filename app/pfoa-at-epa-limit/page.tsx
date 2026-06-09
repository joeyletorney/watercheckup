import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { CityRankingList } from '@/components/CityRankingList';
import { RankingRelatedLinks } from '@/components/RankingRelatedLinks';
import { buildCitiesWithPfoaAtEpaLimit } from '@/lib/city-rankings';

export const metadata: Metadata = {
  title: 'Cities Where PFOA Hit the EPA 4 ppt Limit — UCMR5 Data (2026) | WaterCheckup',
  description:
    'Tracked US cities where EPA UCMR5 found PFOA at or above the 2026 federal limit of 4 ppt — from Sugar Land TX (4.1 ppt) to Philadelphia (235 ppt). Free city reports.',
  alternates: { canonical: 'https://watercheckup.com/pfoa-at-epa-limit' },
  openGraph: {
    title: 'Cities Where PFOA Hit the EPA 4 ppt Limit (2026)',
    description:
      'EPA UCMR5 monitoring: which major metros have PFOA at or above the federal MCL, with links to graded city water reports.',
  },
};

// // export const revalidate = 86400;

export default function PfoaAtEpaLimitPage() {
  const cities = buildCitiesWithPfoaAtEpaLimit(3.8, 30);
  const atLimit = cities.filter((c) => c.atOrOverMcl);
  const nearLimit = cities.filter((c) => !c.atOrOverMcl);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my ZIP →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>
            EPA UCMR5 · APRIL 2024 PFOA RULE
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 22px' }}>
            Cities where PFOA hit the EPA 4 ppt limit
          </h1>
          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 16px' }}>
            The EPA&apos;s 2024 rule set a Maximum Contaminant Level of <strong style={{ color: '#f1f5f9' }}>4 ppt for PFOA</strong>{' '}
            alone. Under UCMR5 (2023–2025), many utilities tested at or above that line — some far above. This list covers{' '}
            <strong style={{ color: '#f1f5f9' }}>tracked metros on WaterCheckup</strong> with PFOA ≥ 3.8 ppt in federal
            monitoring tied to each city&apos;s anchor ZIP / UCMR5 PWSID.
          </p>
          <p style={{ fontSize: 14, color: '#a8b4c4', lineHeight: 1.7, margin: 0 }}>
            PFOA is only one regulated PFAS compound. Cities can also show high{' '}
            <strong style={{ color: '#e2e8f0' }}>6:2 FTS</strong> or PFOS peaks without a PFOA MCL flag — see{' '}
            <Link prefetch href="/water/sugar-land" style={{ color: '#22d3ee' }}>
              Sugar Land (672 ppt 6:2 FTS)
            </Link>
            ,{' '}
            <Link prefetch href="/worst-pfas-cities" style={{ color: '#22d3ee' }}>
              worst PFAS cities
            </Link>
            , and{' '}
            <Link prefetch href="/worst-pfas" style={{ color: '#22d3ee' }}>
              top systems over MCL
            </Link>
            .
          </p>
        </div>

        <div
          style={{
            padding: '16px 20px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.35)',
            borderRadius: 12,
            marginBottom: 40,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fca5a5', marginBottom: 8 }}>
            Sugar Land, TX — PFOA at the line, 6:2 FTS at 672 ppt
          </div>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>
            Sugar Land is the headline &quot;at the limit&quot; case: <strong style={{ color: '#f1f5f9' }}>PFOA at 4.1 ppt</strong>{' '}
            (EPA MCL = 4 ppt) plus the highest peak <strong style={{ color: '#f1f5f9' }}>6:2 FTS</strong> reading of any large
            Texas system in UCMR5. Only NSF 58 reverse osmosis reliably removes short-chain PFAS at the tap.
          </p>
          <Link
            prefetch
            href="/water/sugar-land"
            style={{ display: 'inline-block', marginTop: 12, fontSize: 13, fontWeight: 700, color: '#22d3ee', textDecoration: 'none' }}
          >
            Full Sugar Land water report →
          </Link>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 14 }}>
            AT OR ABOVE 4 PPT PFOA ({atLimit.length} TRACKED CITIES)
          </div>
          <CityRankingList
            items={atLimit.map((c) => ({
              slug: c.slug,
              name: c.name,
              state: c.state,
              subtitle: `PFOA ${c.pfoaPpt >= 100 ? c.pfoaPpt.toFixed(0) : c.pfoaPpt.toFixed(1)} ppt · ${c.timesOverMcl}× EPA limit`,
              badge: c.pfoaPpt <= 4.2 ? 'At MCL' : 'Over MCL',
              badgeColor: c.pfoaPpt <= 4.2 ? '#f59e0b' : '#ef4444',
              rightLabel: `PWSID ${c.pwsid}`,
              rightColor: '#94a3b8',
            }))}
          />
        </div>

        {nearLimit.length > 0 ? (
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 8 }}>
              NEAR THE LIMIT (3.8–3.9 PPT PFOA)
            </div>
            <p style={{ fontSize: 14, color: '#a8b4c4', lineHeight: 1.6, margin: '0 0 16px' }}>
              Below 4 ppt on paper — still within measurement uncertainty of the federal limit.
            </p>
            <CityRankingList
              items={nearLimit.map((c) => ({
                slug: c.slug,
                name: c.name,
                state: c.state,
                subtitle: `PFOA ${c.pfoaPpt.toFixed(1)} ppt`,
                badge: 'Near MCL',
                badgeColor: '#f59e0b',
                rightLabel: `${c.timesOverMcl}× limit`,
                rightColor: '#f59e0b',
              }))}
            />
          </div>
        ) : null}

        <div
          style={{
            padding: '20px 22px',
            background: '#071828',
            border: '1px solid #1a3a5c',
            borderRadius: 12,
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
            METHODOLOGY
          </div>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>
            Source: EPA UCMR5 national monitoring (2023–2025). PFOA MCL = 4 ppt as of the April 2024 PFAS rule. City rows
            use each metro&apos;s resolved UCMR5 PWSID (anchor ZIP when UCMR5 exists, otherwise the best-matching monitored
            system). For your exact tap, run a{' '}
            <Link prefetch href="/" style={{ color: '#67e8f9' }}>
              free ZIP report
            </Link>{' '}
            — home plumbing can differ from utility averages.
          </p>
        </div>

        <RankingRelatedLinks />
      </div>
    </div>
  );
}

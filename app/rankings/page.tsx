import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { buildStateRankingRows, STATE_NAMES } from '@/lib/water-rankings';
import { RankingsTable } from './RankingsTable';

export const metadata: Metadata = {
  title: 'Tap Water Quality Rankings by State 2026 | WaterCheckup',
  description:
    'Compare U.S. state tap water quality using EPA UCMR5 data across WaterCheckup city reports. Grades by share of tracked cities above EPA limits, plus the most contaminated cities.',
  alternates: { canonical: 'https://watercheckup.com/rankings' },
};

export default function RankingsPage() {
  const { rows, statesWithGuidelinesConcern, worstCities } = buildStateRankingRows();
  const trackedStates = rows.filter((r) => r.totalCities > 0).length;

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check your ZIP →" ctaHref="/" />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px' }}>
        <nav style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>
          <Link href="/" style={{ color: '#0891b2', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#94a3b8' }}>Rankings</span>
        </nav>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
          NATIONAL COMPARISON · 50 STATES + DC
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.15, margin: '0 0 16px' }}>
          Tap Water Quality Rankings by State 2026
        </h1>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 20px' }}>
          States are ordered by the share of <strong style={{ color: '#e2e8f0' }}>tracked cities</strong> with UCMR5 data flagged
          over an EPA limit or an active PFAS MCL violation (same bar as our state &amp; city reports). Grades use that
          percentage only; &quot;safe&quot; cities are tracked locations with no such flag and a low regional concern profile.
          States without a city guide yet appear at the bottom.
        </p>

        <div
          style={{
            marginBottom: 28,
            padding: '18px 22px',
            background: 'rgba(8,145,178,0.1)',
            border: '1px solid rgba(8,145,178,0.35)',
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 900, color: '#22d3ee', marginBottom: 6 }}>{statesWithGuidelinesConcern}</div>
          <p style={{ margin: 0, fontSize: 15, color: '#cbd5e1', lineHeight: 1.6 }}>
            states have cities with contaminants above EPA health or enforceable limits in our dataset (UCMR5 flags or MCL
            violations), among <strong style={{ color: '#f1f5f9' }}>{trackedStates}</strong> states with at least one tracked
            city.
          </p>
        </div>

        <div style={{ marginBottom: 14, fontSize: 12, color: '#64748b' }}>
          Click column headers to sort. Default: best rank (lowest % cities at risk) first.
        </div>
        <RankingsTable rows={rows} />

        <div style={{ marginTop: 48 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#0891b2',
              letterSpacing: 2,
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: '1px solid #0f2336',
            }}
          >
            WORST CITIES IN AMERICA (UCMR5 DETECTIONS)
          </div>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 18px', lineHeight: 1.6 }}>
            Top 20 tracked cities by count of distinct contaminants detected above zero in EPA UCMR5 data (not all are above
            health or legal limits — see each city report).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {worstCities.map((c, i) => (
              <Link
                key={c.slug}
                href={`/water/${c.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#0d2240',
                    border: '1px solid #1a3a5c',
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <span style={{ color: '#475569', marginRight: 10, fontSize: 13 }}>{i + 1}.</span>
                    <span style={{ fontWeight: 800, color: '#f1f5f9' }}>{c.name}</span>
                    <span style={{ color: '#64748b', marginLeft: 8, fontSize: 13 }}>{c.state}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#f87171', fontSize: 14 }}>{c.contaminantCount} contaminants</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            padding: '20px',
            background: '#071828',
            border: '1px solid #1a3a5c',
            borderRadius: 12,
            fontSize: 13,
            color: '#64748b',
            lineHeight: 1.65,
          }}
        >
          <strong style={{ color: '#94a3b8' }}>Methodology:</strong> State letter grades are not EPA grades — they reflect the
          percent of WaterCheckup city pages in that state with UCMR5 exceedance flags (A = 0–10% of those cities, B = 11–25%,
          C = 26–50%, D = 51–74%, F = 75% or more of those cities at risk). &quot;Worst contaminant&quot; is the analyte with
          the highest reported detection (ppt) among tracked cities in that state.
        </div>
      </div>
    </div>
  );
}

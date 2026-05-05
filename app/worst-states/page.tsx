import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { CITIES } from '../water/[city]/cities-data';

export const metadata: Metadata = {
  title: 'Worst States for Drinking Water Quality (2025 EPA Data) | WaterCheckup',
  description: 'US states ranked by tap water quality — based on city-level EPA violation data, PFAS detections, and lead risk. See which states have the worst drinking water.',
  alternates: { canonical: 'https://watercheckup.com/worst-states' },
  openGraph: {
    title: 'Worst States for Drinking Water Quality — 2025 EPA Data',
    description: 'Which US states have the worst tap water? Ranked using EPA violation records, PFAS monitoring data, and lead risk across 135+ cities.',
  },
};

// Roll up city data by state
function getStateRankings() {
  const stateMap: Record<string, { cities: typeof CITIES[string][], slugs: string[] }> = {};
  Object.entries(CITIES).forEach(([slug, city]) => {
    if (!stateMap[city.state]) stateMap[city.state] = { cities: [], slugs: [] };
    stateMap[city.state].cities.push(city);
    stateMap[city.state].slugs.push(slug);
  });

  return Object.entries(stateMap).map(([state, { cities, slugs }]) => {
    const highCount = cities.filter(c => c.urgency === 'high').length;
    const medCount = cities.filter(c => c.urgency === 'medium').length;
    const totalCities = cities.length;
    const highPct = Math.round((highCount / totalCities) * 100);
    const score = (highCount * 3) + (medCount * 1);
    const topIssues = Array.from(new Set(cities.flatMap(c => c.issues))).slice(0, 3);
    const worstCity = cities.sort((a, b) => (a.urgency === 'high' ? -1 : 1))[0];
    const worstSlug = slugs[cities.indexOf(worstCity)];

    return { state, highCount, medCount, totalCities, highPct, score, topIssues, worstCity, worstSlug };
  }).sort((a, b) => b.score - a.score);
}

const STATE_FULL: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'Washington D.C.',
};

export default function WorstStatesPage() {
  const rankings = getStateRankings();
  const top10 = rankings.slice(0, 10);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>
            STATE WATER QUALITY RANKINGS — 2025
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 16px' }}>
            Worst states for drinking water quality
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 20px' }}>
            Ranked using EPA violation records, PFAS monitoring data, and lead risk across {Object.keys(CITIES).length}+ cities. States are scored based on the proportion of their tracked cities rated "high concern" by EPA data — the more high-risk cities, the worse the state scores.
          </p>
          <div style={{ padding: '14px 18px', background: '#071828', border: '1px solid #f59e0b30', borderRadius: 10 }}>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
              ⚠️ <strong style={{ color: '#f59e0b' }}>Methodology note:</strong> Rankings reflect cities tracked by WaterCheckup — primarily larger population centers. Rural areas and smaller systems may have different profiles not captured here. Always check your specific ZIP code for the most accurate picture.
            </p>
          </div>
        </div>

        {/* Top 10 worst */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 16 }}>
            TOP 10 WORST STATES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {top10.map(({ state, highCount, medCount, totalCities, topIssues, worstSlug, worstCity }, i) => {
              const barWidth = Math.round((highCount / totalCities) * 100);
              return (
                <div key={state} style={{ padding: '18px 20px', background: '#071828', border: `1px solid ${i < 3 ? '#ef444440' : '#1a3a5c'}`, borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: i < 3 ? '#ef4444' : '#1a3a5c', minWidth: 32 }}>#{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>
                        {STATE_FULL[state] || state}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                        {highCount} high-concern {highCount === 1 ? 'city' : 'cities'} · {medCount} to monitor · {totalCities} tracked total
                      </div>
                      {/* Risk bar */}
                      <div style={{ background: '#0d2240', borderRadius: 4, height: 6, marginBottom: 10 }}>
                        <div style={{ height: 6, borderRadius: 4, background: i < 3 ? '#ef4444' : '#f59e0b', width: `${barWidth}%` }} />
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                        {topIssues.map(issue => (
                          <span key={issue} style={{ fontSize: 11, padding: '2px 8px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 5, color: '#94a3b8' }}>{issue}</span>
                        ))}
                      </div>
                      <Link href={`/water/${worstSlug}`} style={{ fontSize: 12, color: '#0891b2', fontWeight: 600, textDecoration: 'none' }}>
                        Worst city: {worstCity.name} → view full report
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All states table */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 16 }}>
            ALL STATES — FULL RANKING
          </div>
          <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px 80px', padding: '10px 16px', background: '#040d14', borderBottom: '1px solid #1a3a5c', gap: 8 }}>
              {['#', 'State', 'High Risk', 'Tracked'].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: 1 }}>{h}</div>
              ))}
            </div>
            {rankings.map(({ state, highCount, totalCities }, i) => (
              <Link key={state} href={`/water/state/${(STATE_FULL[state] || state).toLowerCase().replace(/\s+/g, '-')}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px 80px', padding: '12px 16px', borderBottom: '1px solid #0f2336', gap: 8, alignItems: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{STATE_FULL[state] || state}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: highCount > 3 ? '#ef4444' : highCount > 1 ? '#f59e0b' : '#22d3ee' }}>{highCount} cities</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{totalCities} total</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '24px 26px', background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid rgba(8,145,178,0.3)', borderRadius: 14, marginBottom: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Check your exact water</div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 18, lineHeight: 1.6 }}>State rankings show the big picture. Your specific water system may be better or worse than your state average. Enter your ZIP for the full picture.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>

        {/* Related */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 14 }}>RELATED RANKINGS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { href: '/worst-water', label: 'Worst cities for PFAS', desc: 'Top 50 by PFAS contamination' },
            { href: '/worst-lead', label: 'Worst cities for lead', desc: 'Highest lead risk by city' },
            { href: '/worst-violations', label: 'Most EPA violations', desc: 'Cities with worst records' },
            { href: '/blog/is-pfas-in-my-tap-water', label: 'Is PFAS in my water?', desc: 'How to check your city' },
          ].map(({ href, label, desc }) => (
            <Link key={href} href={href} style={{ display: 'block', padding: '14px 16px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, textDecoration: 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{desc}</div>
            </Link>
          ))}
        </div>

      </div>
      <SiteFooter />
    </div>
  );
}

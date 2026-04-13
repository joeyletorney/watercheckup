import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../../components/SiteHeader';
import { CITIES } from '../../[city]/cities-data';
import ucmr5Raw from '../../../../lib/ucmr5.json';

const UCMR5 = ucmr5Raw as unknown as Record<string, [number, number, [string, number, number, number][], number?]>;

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', DC: 'Washington DC',
};

// Slug to state abbreviation map
const SLUG_TO_STATE: Record<string, string> = {};
Object.entries(STATE_NAMES).forEach(([abbr, name]) => {
  SLUG_TO_STATE[name.toLowerCase().replace(/\s+/g, '-')] = abbr;
});
SLUG_TO_STATE['washington-dc'] = 'DC';
SLUG_TO_STATE['dc'] = 'DC';

function getStateCities(stateAbbr: string) {
  return Object.entries(CITIES)
    .filter(([, cd]) => cd.state === stateAbbr)
    .map(([slug, cd]) => {
      const pfas = UCMR5[cd.pwsid];
      return {
        slug, name: cd.name, population: cd.population,
        urgency: cd.urgency, system: cd.system,
        maxPpt: pfas ? pfas[0] : null,
        violations: pfas ? pfas[1] : null,
        hasData: !!pfas && pfas[2]?.length > 0,
      };
    })
    .sort((a, b) => (b.maxPpt ?? -1) - (a.maxPpt ?? -1));
}

export async function generateStaticParams() {
  const stateMap: Record<string, boolean> = {};
  Object.values(CITIES).forEach(cd => { stateMap[cd.state] = true; });
  return Object.keys(stateMap).map(state => ({
    city: STATE_NAMES[state]?.toLowerCase().replace(/\s+/g, '-') ?? state.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: stateSlug } = await params;
  const stateAbbr = SLUG_TO_STATE[stateSlug];
  const stateName = stateAbbr ? STATE_NAMES[stateAbbr] : null;
  if (!stateName) return { title: 'Water Quality | WaterCheckup' };
  const cities = getStateCities(stateAbbr);
  const withViolations = cities.filter(c => (c.violations ?? 0) > 0).length;
  return {
    title: `${stateName} Tap Water Quality — PFAS & Contaminant Data by City | WaterCheckup`,
    description: `EPA water quality data for ${cities.length} cities in ${stateName}. ${withViolations > 0 ? `${withViolations} cities with active PFAS violations. ` : ''}Check PFAS levels, lead risk, and filter recommendations for your city.`,
    alternates: { canonical: `https://watercheckup.com/water/state/${stateSlug}` },
  };
}

export default async function StatePage({ params }: { params: Promise<{ city: string }> }) {
  const { city: stateSlug } = await params;
  const stateAbbr = SLUG_TO_STATE[stateSlug];
  const stateName = stateAbbr ? STATE_NAMES[stateAbbr] : null;
  if (!stateName || !stateAbbr) notFound();

  const cities = getStateCities(stateAbbr);
  if (cities.length === 0) notFound();

  const withViolations = cities.filter(c => (c.violations ?? 0) > 0);
  const maxPpt = cities.reduce((m, c) => Math.max(m, c.maxPpt ?? 0), 0);
  const worstCity = cities.find(c => c.maxPpt === maxPpt);

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check My ZIP →" />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: '#475569', marginBottom: 24 }}>
          <Link href="/" style={{ color: '#0891b2', textDecoration: 'none' }}>Home</Link>
          {' / '}
          <Link href="/water" style={{ color: '#0891b2', textDecoration: 'none' }}>Cities</Link>
          {' / '}{stateName}
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
            EPA WATER QUALITY DATA · {stateAbbr}
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#f1f5f9', margin: '0 0 14px', lineHeight: 1.2 }}>
            {stateName} Tap Water Quality by City
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 28px' }}>
            EPA UCMR5 PFAS monitoring data, violation history, and filter recommendations for {cities.length} cities across {stateName}. All data sourced directly from federal EPA databases.
          </p>

          {/* State stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
            {[
              { label: 'Cities tracked', value: cities.length.toString() },
              { label: 'With PFAS violations', value: withViolations.length.toString(), alert: withViolations.length > 0 },
              { label: 'Highest PFAS detected', value: maxPpt > 0 ? `${maxPpt >= 10 ? maxPpt.toFixed(0) : maxPpt.toFixed(1)} ppt` : 'No detections', alert: maxPpt > 10 },
            ].map(({ label, value, alert }) => (
              <div key={label} style={{ padding: '14px 16px', background: '#0d2240', border: `1px solid ${alert ? '#ef444430' : '#1a3a5c'}`, borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: alert ? '#f87171' : '#f1f5f9' }}>{value}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Worst city callout */}
          {worstCity && maxPpt > 4 && (
            <div style={{ padding: '14px 18px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: 10, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
              <span style={{ color: '#fca5a5', fontWeight: 700 }}>Highest contamination in {stateName}:</span>{' '}
              <Link href={`/water/${worstCity.slug}`} style={{ color: '#f87171', fontWeight: 700, textDecoration: 'none' }}>{worstCity.name}</Link>
              {' '}— detected at <strong style={{ color: '#f87171' }}>{maxPpt >= 10 ? maxPpt.toFixed(0) : maxPpt.toFixed(1)} ppt</strong>
              {maxPpt > 4 && ` (${(maxPpt / 4).toFixed(0)}× the EPA limit for PFOA/PFOS)`}
            </div>
          )}
        </div>

        {/* City list */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
            {stateName.toUpperCase()} CITIES — TAP WATER REPORTS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cities.map(city => {
              const urgencyColor = city.urgency === 'high' ? '#ef4444' : city.urgency === 'medium' ? '#f59e0b' : '#22d3ee';
              const hasViolation = (city.violations ?? 0) > 0;
              const pfasColor = hasViolation ? '#ef4444' : (city.maxPpt ?? 0) > 0 ? '#f59e0b' : '#22d3ee';

              return (
                <Link key={city.slug} href={`/water/${city.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr auto',
                    alignItems: 'center', gap: 16, padding: '16px 18px',
                    background: '#0d2240',
                    border: `1px solid ${hasViolation ? '#ef444330' : '#1a3a5c'}`,
                    borderRadius: 10,
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{city.name}</span>
                        <span style={{ fontSize: 10, padding: '2px 7px', background: `${urgencyColor}15`, border: `1px solid ${urgencyColor}40`, borderRadius: 4, color: urgencyColor, fontWeight: 700, letterSpacing: 0.5 }}>
                          {city.urgency.toUpperCase()} RISK
                        </span>
                        {hasViolation && (
                          <span style={{ fontSize: 10, padding: '2px 7px', background: '#ef444415', border: '1px solid #ef444440', borderRadius: 4, color: '#f87171', fontWeight: 700 }}>
                            {city.violations} MCL VIOLATION{(city.violations ?? 0) !== 1 ? 'S' : ''}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        {city.system} · Pop. {city.population}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {city.hasData ? (
                        <>
                          <div style={{ fontSize: 18, fontWeight: 900, color: pfasColor }}>
                            {(city.maxPpt ?? 0) >= 10 ? (city.maxPpt ?? 0).toFixed(0) : (city.maxPpt ?? 0).toFixed(1)}
                          </div>
                          <div style={{ fontSize: 10, color: '#64748b' }}>ppt PFAS</div>
                        </>
                      ) : (
                        <div style={{ fontSize: 11, color: '#475569' }}>View report →</div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* State context */}
        <div style={{ marginBottom: 40, padding: '24px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 14 }}>
            ABOUT WATER QUALITY IN {stateName.toUpperCase()}
          </div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 12px' }}>
            {stateName} water quality varies significantly by city and water system. The EPA&apos;s UCMR5 monitoring program tested all systems serving 3,300+ people for 29 PFAS compounds between 2023 and 2025.
            {withViolations.length > 0
              ? ` In ${stateName}, ${withViolations.length} of the ${cities.length} tracked cities returned results with active MCL violations — meaning detected PFAS levels exceed the EPA's legally enforceable maximum.`
              : ` In ${stateName}, the tracked cities returned no active MCL violations for the regulated PFAS compounds, though detections below the MCL threshold were found in some systems.`
            }
          </p>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
            Click any city above for a full breakdown of detected compounds, violation history, water hardness data, and certified filter recommendations matched to the actual contaminant profile of that system.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '28px', background: 'linear-gradient(135deg,#071828,#040d14)', border: '1px solid #0f2d40', borderRadius: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
            Not seeing your city?
          </div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, lineHeight: 1.6 }}>
            Enter your ZIP code to pull the full EPA report for your specific water system — including PFAS readings, CCR violations, and filter recommendations.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '13px 30px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>

      </div>
    </div>
  );
}

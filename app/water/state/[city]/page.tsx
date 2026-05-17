import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../../components/SiteHeader';
import { CITIES } from '../../[city]/cities-data';
import EmailCapture from '../../[city]/EmailCapture';
import ucmr5Raw from '../../../../lib/ucmr5.json';
import { getCountiesForStateAbbr } from '@/lib/county-data';
import { getAverageHardnessForState } from '@/lib/water-hardness';

// UCMR5: [maxPFASppt, regulatedViolations, [[name, level, overEPALimit, overHealthLimit], ...], hardness?]
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

const SLUG_TO_STATE: Record<string, string> = {};
Object.entries(STATE_NAMES).forEach(([abbr, name]) => {
  SLUG_TO_STATE[name.toLowerCase().replace(/\s+/g, '-')] = abbr;
});
SLUG_TO_STATE['washington-dc'] = 'DC';
SLUG_TO_STATE['dc'] = 'DC';

function getPfasData(pwsid: string) {
  const entry = UCMR5[pwsid];
  if (!entry) return null;
  const [maxPpt, violations, compounds, hardness] = entry;
  return { maxPpt, violations, compounds, hardness };
}

/** Same scoring ladder as `app/water/[city]/page.tsx` for consistent grades. */
function computeWaterScore(
  urgency: 'high' | 'medium' | 'low',
  issues: string[],
  pfasData: { maxPpt: number; violations: number; compounds: [string, number, number, number][]; hardness?: number } | null,
): { score: number; grade: string; gradeColor: string } {
  let score = 88;
  if (urgency === 'high') score -= 40;
  if (urgency === 'medium') score -= 20;
  score -= Math.min(issues.length * 5, 20);
  if (pfasData) {
    if (pfasData.violations > 0) score -= 25;
    else if (pfasData.compounds.length > 3) score -= 12;
    else if (pfasData.compounds.length > 0) score -= 6;
    const overHealth = pfasData.compounds.some(([, , , oh]) => oh > 0);
    if (overHealth) score -= 10;
    if (pfasData.maxPpt > 50) score -= 8;
    else if (pfasData.maxPpt > 10) score -= 4;
  }
  score = Math.max(0, Math.min(88, score));
  let grade: string;
  let gradeColor: string;
  if (score >= 80) {
    grade = 'A-';
    gradeColor = '#22d3ee';
  } else if (score >= 65) {
    grade = 'B';
    gradeColor = '#86efac';
  } else if (score >= 50) {
    grade = 'C';
    gradeColor = '#f59e0b';
  } else if (score >= 35) {
    grade = 'D';
    gradeColor = '#f97316';
  } else {
    grade = 'F';
    gradeColor = '#ef4444';
  }
  return { score, grade, gradeColor };
}

/** Parse labels like "2.7M", "8.3M", "120K" for sorting. */
function parsePopulation(pop: string): number {
  const t = String(pop).trim().toLowerCase();
  if (!t) return 0;
  if (t.endsWith('m')) {
    const n = parseFloat(t.slice(0, -1).replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n * 1e6 : 0;
  }
  if (t.endsWith('k')) {
    const n = parseFloat(t.slice(0, -1).replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n * 1e3 : 0;
  }
  const n = parseFloat(t.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function isAtRiskFromUcmr(pfas: ReturnType<typeof getPfasData>): boolean {
  if (!pfas) return false;
  if (pfas.violations > 0) return true;
  return pfas.compounds.some(([, , overEpa]) => overEpa > 0);
}

type Band = 'at_risk' | 'safe' | 'monitor';

function cityRiskBand(cd: (typeof CITIES)[string], pfas: ReturnType<typeof getPfasData>): Band {
  if (isAtRiskFromUcmr(pfas)) return 'at_risk';
  if (cd.urgency === 'low') return 'safe';
  return 'monitor';
}

function buildStateRows(stateAbbr: string) {
  return Object.entries(CITIES)
    .filter(([, cd]) => cd.state === stateAbbr)
    .map(([slug, cd]) => {
      const pfas = getPfasData(cd.pwsid);
      const { grade, gradeColor } = computeWaterScore(cd.urgency, cd.issues, pfas);
      const contaminantsAboveLimit = pfas
        ? pfas.compounds.filter(([, , overEpa]) => overEpa > 0).length
        : 0;
      const band = cityRiskBand(cd, pfas);
      const popN = parsePopulation(cd.population);
      return {
        slug,
        name: cd.name,
        population: cd.population,
        popN,
        urgency: cd.urgency,
        system: cd.system,
        maxPpt: pfas ? pfas.maxPpt : null,
        violations: pfas ? pfas.violations : null,
        hasData: !!pfas && pfas.compounds.length > 0,
        grade,
        gradeColor,
        contaminantsAboveLimit,
        band,
        pfas,
      };
    });
}

function topContaminantsInState(rows: ReturnType<typeof buildStateRows>, limit: number) {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const seen = new Set<string>();
    if (!r.pfas) continue;
    for (const [name, level] of r.pfas.compounds) {
      if (level <= 0) continue;
      if (seen.has(name)) continue;
      seen.add(name);
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, cityCount]) => ({ name, cityCount }));
}

export async function generateStaticParams() {
  const stateMap: Record<string, boolean> = {};
  Object.values(CITIES).forEach((cd) => {
    stateMap[cd.state] = true;
  });
  return Object.keys(stateMap).map((state) => ({
    city: STATE_NAMES[state]?.toLowerCase().replace(/\s+/g, '-') ?? state.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: stateSlug } = await params;
  const stateAbbr = SLUG_TO_STATE[stateSlug];
  const stateName = stateAbbr ? STATE_NAMES[stateAbbr] : null;
  if (!stateName) return { title: 'Water Quality | WaterCheckup' };
  const rows = buildStateRows(stateAbbr);
  const atRisk = rows.filter((r) => r.band === 'at_risk').length;
  const topChem = topContaminantsInState(rows, 1)[0];
  const descExtra =
    topChem != null
      ? ` Common analytes include ${topChem.name} (${topChem.cityCount} cities).`
      : ' ';
  return {
    title: `${stateName} Tap Water Quality — PFAS by City, Grades & EPA UCMR5 | WaterCheckup`,
    description: `${stateName} tap water: ${rows.length} city reports, ${atRisk} at elevated risk (EPA limits / UCMR5). Grades, contaminants above guidelines, and filter guidance.${descExtra}`,
    alternates: { canonical: `https://watercheckup.com/water/state/${stateSlug}` },
  };
}

export default async function StatePage({ params }: { params: Promise<{ city: string }> }) {
  const { city: stateSlug } = await params;
  const stateAbbr = SLUG_TO_STATE[stateSlug];
  const stateName = stateAbbr ? STATE_NAMES[stateAbbr] : null;
  if (!stateName || !stateAbbr) notFound();

  const rows = buildStateRows(stateAbbr);
  if (rows.length === 0) notFound();

  const countyRows = getCountiesForStateAbbr(stateAbbr);

  const totalCities = rows.length;
  const atRiskCount = rows.filter((r) => r.band === 'at_risk').length;
  const safeCount = rows.filter((r) => r.band === 'safe').length;
  const monitorCount = rows.filter((r) => r.band === 'monitor').length;

  const sortedByPop = [...rows].sort((a, b) => b.popN - a.popN);
  const topChems = topContaminantsInState(rows, 5);

  const maxPpt = rows.reduce((m, c) => Math.max(m, c.maxPpt ?? 0), 0);
  const worstForPfas = rows.reduce(
    (best, c) => ((c.maxPpt ?? 0) > (best?.maxPpt ?? -1) ? c : best),
    sortedByPop[0],
  );

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ fontSize: 12, color: '#475569', marginBottom: 24 }}>
          <Link href="/" style={{ color: '#0891b2', textDecoration: 'none' }}>
            Home
          </Link>
          {' / '}
          <Link href="/water" style={{ color: '#0891b2', textDecoration: 'none' }}>
            Cities
          </Link>
          {' / '}
          {stateName}
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
            EPA WATER QUALITY DATA · {stateAbbr}
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#f1f5f9', margin: '0 0 14px', lineHeight: 1.2 }}>
            {stateName} Tap Water Quality by City
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 24px' }}>
            EPA UCMR5 PFAS monitoring, MCL / guideline flags, and WaterCheckup grades for {totalCities} cities in {stateName}.
            &quot;At Risk&quot; means at least one UCMR analyte flagged above an EPA limit or a regulated PFAS violation on record
            for that system. &quot;Monitor&quot; means no such flag in UCMR data, but the city profile is medium or high concern.
            &quot;Safe&quot; means no exceedance flags and a low-concern city profile (still not a guarantee for every tap).
          </p>

          {(() => {
            const h = getAverageHardnessForState(stateAbbr);
            if (h.avgPpm == null || h.citiesTested === 0) return null;
            return (
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.65, margin: '0 0 20px' }}>
                <Link href="/water-hardness" style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
                  Average water hardness in {stateName}: {h.avgPpm} ppm →
                </Link>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  {' '}
                  Mean of UCMR5 values for {h.citiesTested} tracked {stateName} cities (not every utility).
                </span>
              </p>
            );
          })()}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 10,
              marginBottom: 24,
            }}
          >
            {[
              { label: 'Cities tracked', value: String(totalCities), alert: false as boolean, sub: undefined as string | undefined },
              { label: 'At Risk', value: String(atRiskCount), alert: atRiskCount > 0, sub: 'Exceeds EPA limit / violation' },
              { label: 'Safe', value: String(safeCount), alert: false, sub: 'No flag, low profile' },
              { label: 'Monitor', value: String(monitorCount), alert: false, sub: 'No flag, watch profile' },
            ].map(({ label, value, alert, sub }) => (
              <div
                key={label}
                style={{
                  padding: '14px 14px',
                  background: '#0d2240',
                  border: `1px solid ${alert ? '#ef444440' : '#1a3a5c'}`,
                  borderRadius: 10,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 900, color: alert ? '#f87171' : '#f1f5f9' }}>{value}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 700 }}>{label}</div>
                {sub && (
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 3, lineHeight: 1.3 }}>{sub}</div>
                )}
              </div>
            ))}
          </div>

          {worstForPfas && maxPpt > 4 && (
            <div
              style={{
                padding: '14px 18px',
                background: '#ef444410',
                border: '1px solid #ef444430',
                borderRadius: 10,
                fontSize: 13,
                color: '#94a3b8',
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: '#fca5a5', fontWeight: 700 }}>Highest PFAS reading in {stateName}:</span>{' '}
              <Link href={`/water/${worstForPfas.slug}`} style={{ color: '#f87171', fontWeight: 700, textDecoration: 'none' }}>
                {worstForPfas.name}
              </Link>
              {' — '}
              <strong style={{ color: '#f87171' }}>{maxPpt >= 10 ? maxPpt.toFixed(0) : maxPpt.toFixed(1)} ppt</strong>
              {maxPpt > 4 && ` (${(maxPpt / 4).toFixed(0)}× the EPA limit for PFOA/PFOS)`}
            </div>
          )}
        </div>

        {topChems.length > 0 && (
          <div style={{ marginBottom: 36 }}>
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
              TOP CONTAMINANTS IN {stateName.toUpperCase()} (UCMR5)
            </div>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', lineHeight: 1.55 }}>
              Five most common UCMR analytes with detections (&gt;0) in our tracked {stateName} cities — each city counted once per
              compound.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topChems.map((c, i) => (
                <div
                  key={c.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#071828',
                    border: '1px solid #1a3a5c',
                    borderRadius: 10,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>
                    <span style={{ color: '#475569', marginRight: 8 }}>{i + 1}.</span>
                    {c.name}
                  </span>
                  <span style={{ fontSize: 13, color: '#67e8f9', fontWeight: 700 }}>
                    {c.cityCount} {c.cityCount === 1 ? 'city' : 'cities'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#0891b2',
              letterSpacing: 2,
              marginBottom: 16,
              paddingBottom: 10,
              borderBottom: '1px solid #0f2336',
            }}
          >
            {stateName.toUpperCase()} CITIES BY POPULATION
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #1a3a5c' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#071828', textAlign: 'left' }}>
                  {['City', 'Grade', 'Contaminants above limit', 'Population'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 14px',
                        color: '#94a3b8',
                        fontWeight: 800,
                        fontSize: 10,
                        letterSpacing: 1,
                        borderBottom: '1px solid #1a3a5c',
                      }}
                    >
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedByPop.map((city) => (
                  <tr key={city.slug} style={{ borderBottom: '1px solid #0f2336' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <Link href={`/water/${city.slug}`} style={{ color: '#f1f5f9', fontWeight: 700, textDecoration: 'none' }}>
                        {city.name}
                      </Link>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{city.system}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: 900, color: city.gradeColor }}>{city.grade}</span>
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 10,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background:
                            city.band === 'at_risk' ? '#ef444418' : city.band === 'monitor' ? '#f59e0b18' : '#22d3ee12',
                          color:
                            city.band === 'at_risk' ? '#f87171' : city.band === 'monitor' ? '#fbbf24' : '#67e8f9',
                          fontWeight: 700,
                        }}
                      >
                        {city.band === 'at_risk' ? 'AT RISK' : city.band === 'monitor' ? 'MONITOR' : 'SAFE'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: city.contaminantsAboveLimit > 0 ? '#f87171' : '#64748b' }}>
                      {city.contaminantsAboveLimit > 0 ? city.contaminantsAboveLimit : '—'}
                      {city.violations && city.violations > 0 ? (
                        <span style={{ fontSize: 10, display: 'block', color: '#fca5a5', marginTop: 2 }}>
                          {city.violations} MCL violation{city.violations !== 1 ? 's' : ''}
                        </span>
                      ) : null}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{city.population}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {countyRows.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#0891b2',
                letterSpacing: 2,
                marginBottom: 16,
                paddingBottom: 10,
                borderBottom: '1px solid #0f2336',
              }}
            >
              COUNTIES IN {stateName.toUpperCase()}
            </div>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', lineHeight: 1.55 }}>
              County-level grades roll up every WaterCheckup city we map into the same county (via USPS city–county reference data).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {countyRows.map((co) => (
                <Link
                  key={`${co.stateSlug}-${co.countySlug}`}
                  href={`/water/county/${co.stateSlug}/${co.countySlug}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#071828',
                    border: '1px solid #1a3a5c',
                    borderRadius: 10,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>
                    {co.countySlug === 'district-of-columbia' ? 'District of Columbia' : `${co.countyDisplay} County`}
                  </span>
                  <span style={{ fontSize: 13, color: '#67e8f9', fontWeight: 700 }}>
                    {co.totalCities} {co.totalCities === 1 ? 'city' : 'cities'} · Grade{' '}
                    <span style={{ color: co.countyGradeColor }}>{co.countyGrade}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 40 }}>
          <EmailCapture cityName={stateName} slug={stateSlug} stateScope={{ stateName, stateSlug }} />
        </div>

        <div
          style={{
            marginBottom: 40,
            padding: '24px',
            background: '#071828',
            border: '1px solid #1a3a5c',
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 14 }}>
            ABOUT WATER QUALITY IN {stateName.toUpperCase()}
          </div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 12px' }}>
            {stateName} water quality varies by city and water system. UCMR5 reports PFAS and related analytes; the &quot;above
            limit&quot; column uses the EPA-limit flags bundled with each analyte in our dataset (same basis as city pages).
            {atRiskCount > 0
              ? ` Here, ${atRiskCount} of ${totalCities} tracked cities show at least one such flag or a regulated violation count.`
              : ` Here, no tracked city shows a compound flagged above its EPA limit in UCMR data; violations row still notes regulated tallies when present.`}
          </p>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
            SDWIS/City reports: use each city link for full narrative, picks, and EPA Consumer Confidence Report context.
          </p>
        </div>

        <div
          style={{
            textAlign: 'center',
            padding: '28px',
            background: 'linear-gradient(135deg,#071828,#040d14)',
            border: '1px solid #0f2d40',
            borderRadius: 14,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Not seeing your city?</div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, lineHeight: 1.6 }}>
            Enter your ZIP code for the full EPA-linked report for your water system — PFAS, violations, and filter
            recommendations.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '13px 30px',
              background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
              borderRadius: 10,
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Check My Water Free →
          </Link>
        </div>
      </div>
    </div>
  );
}

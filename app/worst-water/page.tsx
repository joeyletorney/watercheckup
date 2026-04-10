import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import ucmr5Raw from '../../lib/ucmr5.json';

export const metadata: Metadata = {
  title: 'Most PFAS-Contaminated Water Systems in America (EPA Data 2025) | WaterCheckup',
  description: 'Ranked list of the 50 US water systems with the highest PFAS contamination detected by the EPA UCMR5 monitoring program. Real ppt readings, MCL violations, and affected populations.',
  alternates: { canonical: 'https://watercheckup.com/worst-water' },
  openGraph: {
    title: '50 Most PFAS-Contaminated Water Systems in America — EPA Data',
    description: 'Some US water systems have PFAS levels 100x the EPA limit. Here are the worst offenders, ranked by EPA monitoring data.',
  },
};

const UCMR5 = ucmr5Raw as Record<string, [number, number, [string, number, number, number][], number?]>;

// State abbreviation to full name
const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  GU: 'Guam', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana',
  IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
  MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
  VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin',
  WY: 'Wyoming', DC: 'D.C.', MP: 'N. Mariana Islands', PR: 'Puerto Rico', VI: 'U.S. Virgin Islands',
};

const EPA_MCL: Record<string, number> = {
  PFOA: 4, PFOS: 4, PFNA: 10, PFHxS: 10, 'HFPO-DA': 10,
};

function getRankedSystems() {
  return Object.entries(UCMR5)
    .filter(([, d]) => d[1] > 0 && d[2] && d[2].length > 0)
    .map(([id, d]) => {
      const state = id.substring(0, 2);
      const worstCompound = [...d[2]].sort((a, b) => b[1] - a[1])[0];
      const regulatedViolations = d[2].filter(([name,, overEPA]) => overEPA === 1 && EPA_MCL[name] !== undefined);
      const timesOverLimit = worstCompound && EPA_MCL[worstCompound[0]]
        ? (worstCompound[1] / EPA_MCL[worstCompound[0]]).toFixed(0)
        : null;
      return {
        id,
        state,
        stateName: STATE_NAMES[state] ?? state,
        maxPpt: d[0],
        violations: d[1],
        compounds: d[2],
        worstCompound,
        timesOverLimit,
        regulatedViolations,
      };
    })
    .sort((a, b) => b.maxPpt - a.maxPpt)
    .slice(0, 50);
}

export default function WorstWaterPage() {
  const systems = getRankedSystems();
  const totalPeopleAffected = '12+ million';

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check My Water →" />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>
            EPA UCMR5 DATA · UPDATED 2025
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 16px' }}>
            50 Most PFAS-Contaminated Water Systems in America
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 24px' }}>
            The EPA&apos;s 5th Unregulated Contaminant Monitoring Rule (UCMR5) tested over 7,000 public water systems for 29 PFAS &ldquo;forever chemicals&rdquo; between 2023 and 2025. The results revealed widespread contamination — with some systems delivering water at levels more than 100 times the EPA&apos;s own limits. These are the worst 50, ranked by maximum detected concentration.
          </p>

          {/* Key stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Systems with MCL violations', value: '800+' },
              { label: 'People served by top 50 worst systems', value: totalPeopleAffected },
              { label: 'EPA MCL for PFOA / PFOS', value: '4 ppt' },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '16px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px 18px', background: '#ef444412', border: '1px solid #ef444430', borderRadius: 8, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            <strong style={{ color: '#fca5a5' }}>Note on methodology:</strong> Rankings use the maximum PFAS concentration detected across all monitoring points for each water system, sourced directly from EPA UCMR5 national data. A single high detection at one sampling point represents a real exposure risk — it does not mean every tap in the system is equally contaminated, but it does mean the risk exists within the distribution network.
          </div>
        </div>

        {/* Ranking table */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
            RANKED: HIGHEST PFAS DETECTIONS WITH MCL VIOLATIONS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {systems.map((sys, idx) => {
              const isExtreme = sys.maxPpt > 200;
              const isHigh = sys.maxPpt > 50;
              const rankColor = isExtreme ? '#ef4444' : isHigh ? '#f59e0b' : '#22d3ee';

              return (
                <div key={sys.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '44px 1fr auto',
                  gap: 12,
                  alignItems: 'center',
                  padding: '16px 18px',
                  background: '#0d2240',
                  border: `1px solid ${isExtreme ? '#ef444430' : '#1a3a5c'}`,
                  borderRadius: 10,
                }}>
                  {/* Rank */}
                  <div style={{ fontSize: 18, fontWeight: 900, color: rankColor, textAlign: 'center' }}>
                    #{idx + 1}
                  </div>

                  {/* System info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
                        PWSID: {sys.id}
                      </span>
                      <span style={{ fontSize: 11, padding: '2px 8px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 4, color: '#94a3b8' }}>
                        {sys.stateName}
                      </span>
                      <span style={{ fontSize: 11, padding: '2px 8px', background: `${rankColor}15`, border: `1px solid ${rankColor}40`, borderRadius: 4, color: rankColor, fontWeight: 700 }}>
                        {sys.violations} MCL violation{sys.violations !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                      Worst: <span style={{ color: '#94a3b8', fontWeight: 600 }}>{sys.worstCompound?.[0]}</span> at <span style={{ color: rankColor, fontWeight: 700 }}>{sys.worstCompound?.[1].toFixed(1)} ppt</span>
                      {sys.timesOverLimit && Number(sys.timesOverLimit) > 1 && (
                        <span style={{ color: '#ef4444', marginLeft: 6 }}>({sys.timesOverLimit}× over EPA limit)</span>
                      )}
                      {' · '}{sys.compounds.length} compound{sys.compounds.length !== 1 ? 's' : ''} detected
                    </div>
                  </div>

                  {/* Max ppt badge */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: rankColor }}>{sys.maxPpt >= 100 ? sys.maxPpt.toFixed(0) : sys.maxPpt.toFixed(1)}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>ppt max</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What to do section */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
            WHAT THESE NUMBERS MEAN — AND WHAT TO DO
          </div>

          {[
            {
              q: 'What is ppt and why does 4 ppt matter?',
              a: 'Parts per trillion (ppt) is an almost incomprehensibly small unit — but PFAS compounds are dangerous at these trace levels because they accumulate in the body over decades and never break down. The EPA set the MCL for PFOA and PFOS at 4 ppt in 2024, reflecting the scientific consensus that there is no truly safe level of exposure. Systems showing 100+ ppt are delivering water at 25 times the legal limit.'
            },
            {
              q: 'Does this mean the water is unsafe to drink?',
              a: 'If your water system is on this list with active MCL violations, the EPA requires the utility to notify customers and take remediation steps. In the meantime, a certified reverse osmosis filter is the only technology independently proven to remove PFAS to safe levels at the tap. Standard Brita-style pitchers do not remove PFAS effectively.'
            },
            {
              q: 'Why are some PFAS compounds not shown as violations even at high levels?',
              a: 'The EPA currently has enforceable MCLs for only 6 PFAS compounds: PFOA, PFOS, PFNA, PFHxS, HFPO-DA (GenX), and a hazard index for certain combinations. Many other PFAS — like PFBA, PFPeA, and 6:2 FTS — are detected at high levels but are not yet subject to MCLs. This does not mean they are safe; it means the regulatory process has not caught up with the science.'
            },
            {
              q: 'How do I check my specific water system?',
              a: 'Enter your ZIP code on WaterCheckup to see the full EPA report for your local water utility, including PFAS detections, violation history, and filter recommendations matched to your actual contaminant profile.'
            },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 16, padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{q}</div>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid #0f2d40', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>Check if your ZIP is affected</div>
          <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
            Enter your ZIP code to see the full EPA PFAS report, violation history, and certified filter recommendations for your specific water system.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px #0891b244' }}>
            Check My Water Free →
          </Link>
        </div>

        {/* Data source note */}
        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, borderTop: '1px solid #0f2336', paddingTop: 20 }}>
          <strong style={{ color: '#64748b' }}>Data source:</strong> U.S. Environmental Protection Agency, 5th Unregulated Contaminant Monitoring Rule (UCMR5) national dataset, 2023–2025. Rankings reflect maximum PFAS concentration across all sampling points per public water system ID. MCL = Maximum Contaminant Level. ppt = parts per trillion. Data current as of publication date. Water quality can change — always check your utility&apos;s most recent Consumer Confidence Report for the latest readings.
        </div>

      </div>
    </div>
  );
}

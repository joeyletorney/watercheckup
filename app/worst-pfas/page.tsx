import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import ucmr5Raw from '../../lib/ucmr5.json';

export const metadata: Metadata = {
  title: '10 Water Systems with the Highest PFAS Contamination (UCMR5 vs EPA MCL) | WaterCheckup',
  description:
    'The 10 US water systems with the highest regulated PFAS above EPA limits — compound-by-compound ppt values and multiples of the MCL from federal UCMR5 monitoring.',
  alternates: { canonical: 'https://watercheckup.com/worst-pfas' },
  openGraph: {
    title: '10 Water Systems with the Highest PFAS Contamination — UCMR5 Data',
    description:
      'One North Carolina system tested at 490 ppt PFOS — 122 times the EPA limit of 4 ppt. Here are the 10 worst regulated PFAS violations in US tap water.',
    images: [{ url: 'https://watercheckup.com/api/og?city=Worst+PFAS+Cities&score=&grade=&violations=10', width: 1200, height: 630 }],
  },
};

const UCMR5 = ucmr5Raw as unknown as Record<string, [number, number, [string, number, number, number][], number?]>;

const EPA_MCL: Record<string, number> = { PFOA: 4, PFOS: 4, PFNA: 10, PFHxS: 10, 'HFPO-DA': 10 };

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',
  CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',GU:'Guam',HI:'Hawaii',
  ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',
  LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',
  MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',
  NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',
  OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',
  SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',
  VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',
  WY:'Wyoming',DC:'D.C.',MP:'N. Mariana Islands',PR:'Puerto Rico',VI:'U.S. Virgin Islands',
};

// Known system names for the worst offenders
const SYSTEM_NAMES: Record<string, { name: string; city: string; source: string }> = {
  'NC0464020': { name: 'Cape Fear Public Utility Authority', city: 'Wilmington, NC', source: 'Cape Fear River — downstream of Chemours Fayetteville Works GenX plant' },
  'CA3700963': { name: 'San Gabriel Valley Water District', city: 'San Gabriel, CA', source: 'Groundwater — contaminated by historic aerospace and industrial activity' },
  'CA3610062': { name: 'San Bernardino Valley Municipal Water District', city: 'San Bernardino, CA', source: 'Groundwater — former military base and industrial contamination' },
  'PA1460022': { name: 'Warminster Township Water Authority', city: 'Warminster, PA', source: 'Groundwater — contaminated by AFFF firefighting foam at Naval Air Station Warminster' },
  'WV3305404': { name: 'Parkersburg Utility Board', city: 'Parkersburg, WV', source: 'Ohio River — downstream of DuPont Washington Works PFOA plant' },
  'WA5303160': { name: 'City of Tacoma Water Division', city: 'Tacoma, WA', source: 'Surface water — contaminated by AFFF use at McChord Air Force Base' },
  'PA3390032': { name: 'Horsham Water & Sewer Authority', city: 'Horsham, PA', source: 'Groundwater — contaminated by AFFF at Naval Air Station Joint Reserve Base Willow Grove' },
  'NC0392373': { name: 'Fayetteville Public Works Commission', city: 'Fayetteville, NC', source: 'Cape Fear River — downstream of Chemours Fayetteville Works' },
  'SC0110001': { name: 'North Charleston Consolidated Public Service District', city: 'North Charleston, SC', source: 'Surface water — near Charleston Air Force Base AFFF contamination' },
  'GU0000006': { name: 'Guam Waterworks Authority', city: 'Dededo, Guam', source: 'Groundwater — contaminated by AFFF at Andersen Air Force Base' },
};

type UcmrCompoundRow = [string, number, number, number];

type RankedSystem = {
  id: string;
  state: string;
  stateName: string;
  maxPpt: number;
  regViolationCount: number;
  worstCompound: string;
  worstPpt: number;
  timesOver: string;
  allRegulated: UcmrCompoundRow[];
  knownInfo: { name: string; city: string; source: string } | null;
};

function getRankedSystems(): RankedSystem[] {
  return Object.entries(UCMR5)
    .map(([id, d]): RankedSystem | null => {
      const state = id.substring(0, 2);
      const regulated = (d[2] ?? []).filter(
        ([name, , overEPA]) => overEPA === 1 && EPA_MCL[name] !== undefined,
      ) as UcmrCompoundRow[];
      const worstReg = [...regulated].sort((a, b) => b[1] - a[1])[0];
      if (!worstReg) return null;
      const mcl = EPA_MCL[worstReg[0]];
      return {
        id,
        state,
        stateName: STATE_NAMES[state] ?? state,
        maxPpt: d[0],
        regViolationCount: regulated.length,
        worstCompound: worstReg[0],
        worstPpt: worstReg[1],
        timesOver: (worstReg[1] / mcl).toFixed(1),
        allRegulated: regulated,
        knownInfo: SYSTEM_NAMES[id] ?? null,
      };
    })
    .filter((x): x is RankedSystem => x !== null)
    .sort((a, b) => b.worstPpt - a.worstPpt)
    .slice(0, 10);
}

const COMPOUND_INFO: Record<string, { full: string; mcl: number; notes: string }> = {
  PFOS:     { full: 'Perfluorooctane Sulfonic Acid', mcl: 4,  notes: 'Primary compound in military AFFF firefighting foam. Linked to kidney cancer, thyroid disease, and immune suppression.' },
  PFOA:     { full: 'Perfluorooctanoic Acid',        mcl: 4,  notes: 'Used in DuPont Teflon manufacturing. The compound that sparked the Erin Brockovich-era lawsuits in WV and OH.' },
  PFHxS:    { full: 'Perfluorohexane Sulfonic Acid', mcl: 10, notes: 'Used in 3M\'s AFFF formulations. Linked to thyroid disease and developmental effects.' },
  'HFPO-DA':{ full: 'Hexafluoropropylene Oxide Dimer Acid (GenX)', mcl: 10, notes: 'Chemours replacement for PFOA. Found heavily in Cape Fear River, NC.' },
  PFNA:     { full: 'Perfluorononanoic Acid',        mcl: 10, notes: 'Used in fluoropolymer production. Linked to cancer and developmental harm.' },
};

export default function WorstPFASPage() {
  const systems = getRankedSystems();
  const worstTimesOver = systems[0]?.timesOver ?? '0';

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check My Water →" />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>
            EPA UCMR5 · REGULATED VIOLATIONS · 2025
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 16px' }}>
            10 water systems with the highest PFAS contamination
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 24px' }}>
            The EPA finalized enforceable PFAS limits in April 2024 — 4 ppt for PFOA and PFOS (others vary). These are the 10 water systems where regulated PFAS were found at the highest levels above those MCLs in EPA UCMR5 national monitoring. Each card lists every regulated compound over the limit with measured ppt and how many times above the limit. The worst single compound here is about {parseFloat(worstTimesOver).toFixed(0)}× over its MCL.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
            {[
              { label: 'Highest single reading', value: `${systems[0]?.worstPpt ?? '--'} ppt`, color: '#ef4444' },
              { label: 'Times over EPA limit (worst)', value: `${parseFloat(worstTimesOver).toFixed(0)}×`, color: '#ef4444' },
              { label: 'EPA MCL for PFOA / PFOS', value: '4 ppt', color: '#0891b2' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: '16px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color, marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px 18px', background: '#ef444412', border: '1px solid #ef444430', borderLeft: '4px solid #ef4444', borderRadius: 8, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            <strong style={{ color: '#fca5a5' }}>What this list is:</strong> Rankings are based on the highest single regulated PFAS compound reading (one that has an EPA MCL) per water system, from the federal UCMR5 dataset. Systems with only unregulated PFAS detections are tracked on our{' '}
            <Link href="/worst-water" style={{ color: '#22d3ee' }}>broader PFAS ranking page</Link>.
          </div>
        </div>

        {/* Rankings */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
            TOP 10 — HIGHEST REGULATED PFAS ABOVE EPA MCL
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {systems.map((sys, idx) => {
              const isExtreme = parseFloat(sys.timesOver) > 50;
              const isHigh = parseFloat(sys.timesOver) > 15;
              const rankColor = isExtreme ? '#ef4444' : isHigh ? '#f97316' : '#f59e0b';
              const cmpInfo = COMPOUND_INFO[sys.worstCompound];

              return (
                <div key={sys.id} style={{ background: '#0d2240', border: `1px solid ${isExtreme ? '#ef444430' : '#1a3a5c'}`, borderRadius: 12, overflow: 'hidden' }}>
                  {/* Top row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 12, alignItems: 'flex-start', padding: '18px 20px' }}>
                    <div style={{ textAlign: 'center', paddingTop: 4 }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: rankColor }}>#{idx + 1}</div>
                    </div>
                    <div>
                      {sys.knownInfo ? (
                        <>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 2 }}>{sys.knownInfo.city}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{sys.knownInfo.name}</div>
                        </>
                      ) : (
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
                          {sys.stateName} · PWSID {sys.id}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: `${rankColor}15`, border: `1px solid ${rankColor}40`, color: rankColor }}>
                          {sys.timesOver}× OVER EPA LIMIT
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#071828', border: '1px solid #1a3a5c', color: '#64748b' }}>
                          {sys.regViolationCount} regulated violation{sys.regViolationCount !== 1 ? 's' : ''}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#071828', border: '1px solid #1a3a5c', color: '#64748b' }}>
                          {sys.stateName}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 26, fontWeight: 900, color: rankColor }}>{sys.worstPpt >= 100 ? sys.worstPpt.toFixed(0) : sys.worstPpt.toFixed(1)}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>ppt {sys.worstCompound}</div>
                      <div style={{ fontSize: 10, color: '#334155', marginTop: 1 }}>MCL: {EPA_MCL[sys.worstCompound]} ppt</div>
                    </div>
                  </div>

                  {/* Compound-by-compound (every regulated analyte over MCL) */}
                  <div style={{ borderTop: '1px solid #0f2336', padding: '12px 20px 16px' }}>
                    {sys.knownInfo?.source ? (
                      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 12 }}>
                        <span style={{ color: '#475569', fontWeight: 700 }}>Source: </span>
                        {sys.knownInfo.source}
                      </div>
                    ) : null}
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
                      Regulated PFAS above EPA MCL (compound-by-compound)
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ color: '#64748b', textAlign: 'left' }}>
                            <th style={{ padding: '6px 8px', borderBottom: '1px solid #0f2336', fontWeight: 700 }}>Compound</th>
                            <th style={{ padding: '6px 8px', borderBottom: '1px solid #0f2336', fontWeight: 700 }}>Detected</th>
                            <th style={{ padding: '6px 8px', borderBottom: '1px solid #0f2336', fontWeight: 700 }}>EPA MCL</th>
                            <th style={{ padding: '6px 8px', borderBottom: '1px solid #0f2336', fontWeight: 700 }}>× over limit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...sys.allRegulated]
                            .sort((a, b) => b[1] - a[1])
                            .map(([name, ppt]) => {
                              const mcl = EPA_MCL[name];
                              const mult = mcl ? ppt / mcl : null;
                              return (
                                <tr key={name} style={{ color: '#cbd5e1' }}>
                                  <td style={{ padding: '8px', borderBottom: '1px solid #0f233620', fontWeight: 600 }}>{name}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid #0f233620' }}>
                                    {ppt >= 100 ? ppt.toFixed(0) : ppt.toFixed(1)} ppt
                                  </td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid #0f233620' }}>{mcl ?? '—'} ppt</td>
                                  <td
                                    style={{
                                      padding: '8px',
                                      borderBottom: '1px solid #0f233620',
                                      color: '#fca5a5',
                                      fontWeight: 700,
                                    }}
                                  >
                                    {mult != null ? `${mult.toFixed(1)}×` : '—'}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    {cmpInfo ? (
                      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginTop: 12 }}>
                        <span style={{ color: '#475569', fontWeight: 700 }}>
                          {sys.worstCompound} ({cmpInfo.full}):{' '}
                        </span>
                        {cmpInfo.notes}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What is PFAS / health context */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
            WHY THIS MATTERS
          </div>
          {[
            {
              q: 'Why are most of these systems near military bases?',
              a: "PFAS contamination in drinking water is heavily concentrated around military installations. The US military used AFFF (Aqueous Film-Forming Foam) — a highly effective but PFAS-laden firefighting agent — at bases and air stations for decades. During training exercises and emergency responses, AFFF was discharged directly onto tarmacs and into soil, where PFAS leached into groundwater and nearby water supplies. Hundreds of military installations have known PFAS contamination in their surrounding communities.",
            },
            {
              q: 'What does "times over the EPA limit" actually mean for health?',
              a: 'The EPA set the PFOA/PFOS MCL at 4 ppt — itself a level that reflects what\'s technically achievable, not a perfectly "safe" threshold. At 490 ppt, the Cape Fear system is delivering PFOS at concentrations 122 times that limit. Long-term exposure at these levels is associated with significantly elevated cancer risk, immune suppression, and hormonal disruption. Drinking water is not the only PFAS exposure route, but it is one of the most direct and controllable ones.',
            },
            {
              q: 'What is the only effective filter for PFAS?',
              a: 'Reverse osmosis (RO) systems certified to NSF/ANSI 58 remove 99%+ of PFAS including PFOA, PFOS, and GenX. Granular activated carbon (GAC) used in whole-house systems can remove 60–90% of some PFAS at adequate contact time. Standard pitcher filters (including most Brita products) are not certified for PFAS removal and should not be relied on in contaminated areas. For drinking and cooking water, an under-sink or countertop RO is the gold standard.',
            },
            {
              q: 'How do I know if my system is affected?',
              a: 'Enter your ZIP code above to see the UCMR5 PFAS data, violation history, and contaminant profile for your specific water utility.',
            },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 12, padding: '16px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{q}</div>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg,#071828,#040d14)', border: '1px solid #0f2d40', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>Check your ZIP for PFAS</div>
          <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
            Enter your ZIP to see the UCMR5 PFAS readings, MCL violations, and certified filter recommendations for your specific water system.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px #0891b244' }}>
            Check My Water Free →
          </Link>
        </div>

        {/* Related rankings */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 14 }}>MORE RANKINGS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { href: '/worst', label: 'Rankings hub', desc: 'All data-backed ranking pages' },
              { href: '/worst-water', label: 'All PFAS systems (top 50)', desc: 'Includes unregulated PFAS' },
              { href: '/worst-lead', label: 'Worst lead cities', desc: 'Lead service line risk by city' },
              { href: '/worst-thm', label: 'Worst THM/DBP cities', desc: 'Disinfection byproduct risk' },
              { href: '/worst-violations', label: 'Most EPA violations', desc: 'SDWIS violation history' },
            ].map(r => (
              <Link key={r.href} href={r.href} style={{ display: 'block', padding: '14px 16px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, textDecoration: 'none' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{r.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, borderTop: '1px solid #0f2336', paddingTop: 20 }}>
          <strong style={{ color: '#64748b' }}>Data source:</strong> U.S. Environmental Protection Agency UCMR5 (5th Unregulated Contaminant Monitoring Rule), 2023–2025 national dataset. Rankings show only systems with confirmed detections above EPA Maximum Contaminant Levels for regulated PFAS compounds: PFOA (4 ppt), PFOS (4 ppt), PFNA (10 ppt), PFHxS (10 ppt), HFPO-DA/GenX (10 ppt). Not affiliated with the EPA.
        </div>
      </div>
    </div>
  );
}

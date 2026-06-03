import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { buildWorstStatesRankings } from '@/lib/worst-states-rankings';

export const metadata: Metadata = {
  title: 'Worst States for Drinking Water Quality (2026 EPA Data) | WaterCheckup',
  description:
    'US states ranked by share of tracked cities with UCMR5 PFAS over EPA limits — same methodology as WaterCheckup state rankings. See which states have the worst drinking water.',
  alternates: { canonical: 'https://watercheckup.com/worst-states' },
  openGraph: {
    title: 'Worst States for Drinking Water Quality — 2026 EPA Data',
    description: 'Which US states have the worst tap water? Ranked using EPA violation records, PFAS monitoring data, and lead risk across all 50 states, all for free.',
  },
};

export const revalidate = 86400;

// Per-state narrative for the top entries — specific, data-backed
const STATE_NARRATIVE: Record<string, string> = {
  CA: "California's size works against it here — it has more tracked high-concern cities than any other state. The LA metro has elevated chromium-6 and PFAS from aerospace and military contamination. The San Gabriel Valley has some of the highest PFHxS readings in the nation (250 ppt — 25× the EPA limit). Multiple Bay Area systems have chloramine DBPs and PFAS from industrial legacy sites.",
  AZ: "Arizona's water problems stem from its geology and water sources. The Colorado River delivers high TDS and dissolved solids into Phoenix and Tucson. Groundwater in multiple districts tests positive for arsenic above EPA limits. Several military installations (Luke AFB, Davis-Monthan) have contaminated surrounding groundwater with PFAS from AFFF firefighting foam.",
  TX: "Texas has the most tracked cities of any state (15) and its biggest concern is disinfection byproducts — Houston and Dallas both have documented TTHM and HAA5 violations from high-organic river water treated with chloramine. Fayetteville and the Corpus Christi area have documented PFAS. The state's sprawling infrastructure and post-Harvey flooding have compounded long-term water quality challenges.",
  NC: "North Carolina is ground zero for GenX/PFAS contamination. The Cape Fear River — source water for Wilmington, Fayetteville, and surrounding communities — is downstream of the Chemours Fayetteville Works plant, which discharged HFPO-DA (GenX) and PFOS for decades. One system in Wilmington tested at 490 ppt PFOS — 122× the EPA limit. Charlotte and Raleigh have elevated PFAS from other industrial sources.",
  FL: "Florida's PFAS contamination is driven primarily by military base AFFF use — Jacksonville Naval Air Station, MacDill AFB near Tampa, Tyndall AFB near Panama City, and Patrick Space Force Base near Cape Canaveral have all contaminated surrounding groundwater. Miami and Orlando also have saltwater intrusion issues as sea levels rise, threatening freshwater aquifers.",
  OH: "Ohio's legacy as an industrial state shows in its water. Cleveland and Dayton both have significant PFAS contamination from industrial sources. Cleveland draws from Lake Erie, which has had repeated harmful algal blooms (HABs) producing microcystins that are difficult to treat. Columbus has PFAS from multiple upstream industrial sources in the Scioto River watershed.",
  CO: "Colorado's PFAS contamination centers on Buckley Space Force Base and Peterson Air Force Base in the Colorado Springs area. PFHxS was detected at 28 ppt — 3× the EPA limit — in affected systems. Denver Water's use of chloramine produces DBPs not removed by standard filters, and the city has pre-1986 lead infrastructure concerns.",
  MI: "Michigan's water legacy is defined by the Flint crisis, but the problems are wider. Detroit has one of the US's largest remaining lead service line counts — over 18,000 known lead lines. Ann Arbor and surrounding Washtenaw County have documented PFAS contamination from 3M and automotive industry sites. The state's aging post-industrial infrastructure compounds every other risk.",
  VA: "Virginia's water concerns are concentrated in the industrial corridor along the James River and Hampton Roads area. The Hopewell area has a long history of industrial contamination. Richmond and Norfolk have documented DBP issues from high-organic river water. Several Northern Virginia systems near military installations have PFAS from AFFF foam use.",
  NV: "Nevada's primary water problem is geological — Las Vegas and Henderson draw from the Colorado River and Lake Mead, which delivers water with extremely high TDS (total dissolved solids) and hardness. This hard water requires aggressive treatment that produces elevated disinfection byproducts. Nevada also has natural arsenic in groundwater serving several smaller communities.",
  TN: "Tennessee has 38 systems above the EPA PFAS limit and documented TTHM violations in Nashville and Memphis. Memphis draws from the Memphis Sands aquifer — naturally clean — but has PFAS contamination from upstream industrial sources including 1,4-dioxane from a nearby plant. Nashville has logged multiple disinfection byproduct violations.",
  AL: "Alabama is home to one of the most PFAS-contaminated water systems in the Southeast near Anniston — where Monsanto manufactured PCBs and PFAS for decades. The Anniston Army Depot also used AFFF. 81 systems across the state exceed federal PFAS limits. Alabama has some of the weakest state-level water quality enforcement in the US.",
  WI: "Wisconsin's PFAS contamination is heavily tied to 3M manufacturing operations. The Fox River Valley, where 3M produced PFAS-containing products for decades, has widespread groundwater contamination. Milwaukee also has significant lead service line issues — over 70,000 known lead lines — alongside industrial legacy contamination.",
  NJ: "New Jersey has some of the strictest state PFAS standards in the country — stricter than EPA — yet still has 158 systems above federal limits. The industrial density of the state, legacy Superfund sites, and military installations have left widespread groundwater contamination. Newark recently completed lead pipe replacement after a high-profile crisis.",
  CT: "Connecticut has 36 systems above EPA PFAS limits, many tied to military installations including Groton Naval Submarine Base. The state has compact geography with high industrial density and aging infrastructure. Chloramine DBPs are a secondary concern in several larger public water systems.",
  IL: "Illinois has 35 systems above PFAS limits and Chicago — with 150,000+ lead service lines — represents one of the largest single lead infrastructure challenges in the US. Chicago uses chloramine, which produces NDMA and DBPs not addressed by standard carbon filters. Several downstate systems have PFAS from industrial sources.",
  WA: "Washington state's contamination is heavily concentrated around Joint Base Lewis-McChord near Tacoma — one of the largest PFAS contamination sites in the US from AFFF use. Tacoma tested at PFOS 154 ppt, 38× over the EPA limit. Several other military installations across the state have also contaminated surrounding groundwater.",
  GA: "Georgia has 45 systems above EPA PFAS limits, concentrated along the Chattahoochee River corridor and near industrial sites in the Piedmont region. Atlanta has documented disinfection byproduct violations. The state's rapid suburban growth has stressed aging water infrastructure throughout metro Atlanta.",
  KY: "Kentucky has 36 systems above PFAS limits with contamination traced to military sites and industrial facilities. Louisville draws from the Ohio River, which carries industrial contamination from upstream states. The state has documented challenges with aging rural infrastructure and monitoring compliance.",
  IN: "Indiana has 23 systems above PFAS limits with PFHxS at 26 ppt near Grissom Air Reserve Base. Camp Atterbury and other military installations have contributed AFFF contamination. Indianapolis has lead concerns in older neighborhoods, and several smaller public water systems have struggled with monitoring compliance.",
  SC: "South Carolina has North Charleston as one of the worst single-system PFAS readings nationally — HFPO-DA (GenX) at 140 ppt, 14× the EPA limit — traced to Charleston Air Force Base AFFF use. The state has 69 systems above EPA limits, making it one of the most contaminated per capita in the Southeast.",
  MS: "Mississippi has significant infrastructure challenges compounded by the Jackson water crisis — the city faced the longest municipal boil water advisory in US history in 2022–2023. Lead contamination, aging pipes, and treatment failures have left Jackson residents without reliable safe water for years. Rural systems across the state face chronic monitoring violations.",
};

export default function WorstStatesPage() {
  const rankings = buildWorstStatesRankings();
  const top25 = rankings.slice(0, 25);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── HERO ── */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>
            STATE WATER QUALITY RANKINGS — 2026
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 22px' }}>
            Top 25 worst states for tap water quality
          </h1>
          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 20px' }}>
            Same methodology as our{' '}
            <Link href="/rankings" style={{ color: '#22d3ee' }}>
              state rankings table
            </Link>
            : each state is ordered by the <strong style={{ color: '#e2e8f0' }}>% of tracked cities</strong> with UCMR5 PFAS
            over an EPA limit or an MCL violation flag. Letter grades use that percentage (A = 0–10% at risk, … F = 75%+).
            &quot;Worst city&quot; links use the lowest Water Safety Score in that state.
          </p>
          <div style={{ padding: '14px 18px', background: '#071828', border: '1px solid #f59e0b30', borderRadius: 10 }}>
            <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: '#f59e0b' }}>Note:</strong> Rankings reflect WaterCheckup city guides, not every public water
              system in the state. For a composite city score list see{' '}
              <Link href="/worst-cities" style={{ color: '#22d3ee' }}>
                worst cities by safety score
              </Link>
              .
            </p>
          </div>
        </div>

        {/* ── TOP 25 ── */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 16 }}>
            TOP 25 WORST STATES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {top25.map((row, i) => {
              const barWidth = Math.min(100, Math.round(row.pctAtRisk));
              const rankColor = i < 3 ? '#ef4444' : i < 6 ? '#f97316' : '#f59e0b';
              const narrative = STATE_NARRATIVE[row.stateAbbr];

              return (
                <div key={row.stateAbbr} style={{ background: '#071828', border: `1px solid ${i < 3 ? '#ef444440' : '#1a3a5c'}`, borderRadius: 12, overflow: 'hidden' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 20px 14px' }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: rankColor, minWidth: 36, paddingTop: 2 }}>#{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>{row.stateName}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: row.gradeColor, padding: '2px 8px', background: `${row.gradeColor}18`, borderRadius: 5 }}>
                          Grade {row.grade}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 10 }}>
                        {row.citiesAtRisk} of {row.totalCities} tracked cities over EPA PFAS limits ({row.pctAtRisk}%)
                        {row.worstContaminant !== '—' ? ` · top analyte: ${row.worstContaminant}` : ''}
                      </div>
                      {/* Risk bar */}
                      <div style={{ background: '#0d2240', borderRadius: 4, height: 6, marginBottom: 10, maxWidth: 320 }}>
                        <div style={{ height: 6, borderRadius: 4, background: rankColor, width: `${barWidth}%`, transition: 'width 0.4s' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        {row.topIssues.map((issue) => (
                          <span key={issue} style={{ fontSize: 13, padding: '2px 8px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 5, color: '#cbd5e1' }}>
                            {issue}
                          </span>
                        ))}
                      </div>
                      <Link href={`/water/${row.worstSlug}`} style={{ fontSize: 13, color: '#0891b2', fontWeight: 700, textDecoration: 'none' }}>
                        Lowest safety score: {row.worstCityName} → view report
                      </Link>
                      <span style={{ margin: '0 8px', color: '#475569' }}>·</span>
                      <Link href={`/water/state/${row.stateSlug}`} style={{ fontSize: 13, color: '#67e8f9', fontWeight: 600, textDecoration: 'none' }}>
                        All {row.stateAbbr} cities
                      </Link>
                    </div>
                  </div>

                  {/* Narrative — specific data-backed context */}
                  {narrative && (
                    <div style={{ borderTop: '1px solid #0f2336', padding: '12px 20px 16px 70px' }}>
                      <p style={{ fontSize: 13, color: '#a8b4c4', lineHeight: 1.8, margin: 0 }}>{narrative}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FULL TABLE ── */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 16 }}>
            ALL STATES — FULL RANKING
          </div>
          <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 72px 72px', padding: '10px 16px', background: '#040d14', borderBottom: '1px solid #1a3a5c', gap: 8 }}>
              {['#', 'State', '% at risk', 'Grade'].map((h) => (
                <div key={h} style={{ fontSize: 13, fontWeight: 700, color: '#a8b4c4', letterSpacing: 1 }}>{h}</div>
              ))}
            </div>
            {rankings.map((row, i) => (
              <Link key={row.stateAbbr} href={`/water/state/${row.stateSlug}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 72px 72px', padding: '12px 16px', borderBottom: '1px solid #0f2336', gap: 8, alignItems: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>{i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{row.stateName}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: row.pctAtRisk >= 50 ? '#ef4444' : row.pctAtRisk >= 25 ? '#f59e0b' : '#22d3ee' }}>
                    {row.pctAtRisk}%
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: row.gradeColor }}>{row.grade}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ padding: '24px 26px', background: 'linear-gradient(135deg,#071828,#040d14)', border: '1px solid rgba(8,145,178,0.3)', borderRadius: 14, marginBottom: 72, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Check your exact water</div>
          <p style={{ fontSize: 14, color: '#cbd5e1', marginBottom: 18, lineHeight: 1.6 }}>
            State rankings show the big picture. Your specific water system may be better or worse than your state average. Enter your ZIP for the full report.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>

        {/* ── RELATED ── */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 14 }}>RELATED RANKINGS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
          {[
            { href: '/rankings',         label: 'Full state table',         desc: 'Sortable 50-state comparison' },
            { href: '/worst-cities',     label: 'Worst cities (safety score)', desc: 'Lowest 0–88 composite scores' },
            { href: '/worst-pfas-cities', label: 'Worst PFAS cities',       desc: 'MCL violations + peak readings' },
            { href: '/worst-lead',       label: 'Lead pipe risk cities',    desc: 'Lead / LSL flags by safety score' },
            { href: '/worst-hardness',   label: 'Hardest water',            desc: 'States and cities by hardness' },
            { href: '/worst',            label: 'Rankings hub',             desc: 'Every ranking in one place' },
          ].map(({ href, label, desc }) => (
            <Link key={href} href={href} style={{ display: 'block', padding: '14px 16px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, textDecoration: 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, color: '#a8b4c4' }}>{desc}</div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

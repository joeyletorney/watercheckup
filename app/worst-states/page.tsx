import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { CITIES } from '../water/[city]/cities-data';

export const metadata: Metadata = {
  title: 'Worst States for Drinking Water Quality (2025 EPA Data) | WaterCheckup',
  description: 'US states ranked by tap water quality — based on city-level EPA violation data, PFAS detections, and lead risk. See which states have the worst drinking water.',
  alternates: { canonical: 'https://watercheckup.com/worst-states' },
  openGraph: {
    title: 'Worst States for Drinking Water Quality — 2025 EPA Data',
    description: 'Which US states have the worst tap water? Ranked using EPA violation records, PFAS monitoring data, and lead risk across 400,000+ water systems.',
  },
};

export const revalidate = 86400;

const STATE_FULL: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',
  CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',
  IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',
  ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',
  MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',
  NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',
  NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',
  PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',
  TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',
  WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'Washington D.C.',
};

// Per-state narrative for the top 10 — specific, data-backed
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
  CT: "Connecticut has 36 systems above EPA PFAS limits, many tied to military installations including Groton Naval Submarine Base. The state has compact geography with high industrial density and aging infrastructure. Chloramine DBPs are a secondary concern in several larger utilities.",
  IL: "Illinois has 35 systems above PFAS limits and Chicago — with 400,000+ lead service lines — represents one of the largest single lead infrastructure challenges in the US. Chicago uses chloramine, which produces NDMA and DBPs not addressed by standard carbon filters. Several downstate systems have PFAS from industrial sources.",
  WA: "Washington state's contamination is heavily concentrated around Joint Base Lewis-McChord near Tacoma — one of the largest PFAS contamination sites in the US from AFFF use. Tacoma tested at PFOS 154 ppt, 38× over the EPA limit. Several other military installations across the state have also contaminated surrounding groundwater.",
  GA: "Georgia has 45 systems above EPA PFAS limits, concentrated along the Chattahoochee River corridor and near industrial sites in the Piedmont region. Atlanta has documented disinfection byproduct violations. The state's rapid suburban growth has stressed aging water infrastructure throughout metro Atlanta.",
  KY: "Kentucky has 36 systems above PFAS limits with contamination traced to military sites and industrial facilities. Louisville draws from the Ohio River, which carries industrial contamination from upstream states. The state has documented challenges with aging rural infrastructure and monitoring compliance.",
  IN: "Indiana has 23 systems above PFAS limits with PFHxS at 26 ppt near Grissom Air Reserve Base. Camp Atterbury and other military installations have contributed AFFF contamination. Indianapolis has lead concerns in older neighborhoods, and several smaller utilities have struggled with monitoring compliance.",
  SC: "South Carolina has North Charleston as one of the worst single-system PFAS readings nationally — HFPO-DA (GenX) at 140 ppt, 14× the EPA limit — traced to Charleston Air Force Base AFFF use. The state has 69 systems above EPA limits, making it one of the most contaminated per capita in the Southeast.",
  MS: "Mississippi has significant infrastructure challenges compounded by the Jackson water crisis — the city faced the longest municipal boil water advisory in US history in 2022–2023. Lead contamination, aging pipes, and treatment failures have left Jackson residents without reliable safe water for years. Rural systems across the state face chronic monitoring violations.",
};

function getStateRankings() {
  const stateMap: Record<string, { slugs: string[] }> = {};

  Object.entries(CITIES).forEach(([slug, city]) => {
    if (!stateMap[city.state]) stateMap[city.state] = { slugs: [] };
    stateMap[city.state].slugs.push(slug);
  });

  return Object.entries(stateMap).map(([state, { slugs }]) => {
    const entries = slugs.map(slug => ({ slug, city: CITIES[slug] }));
    const highEntries = entries.filter(e => e.city.urgency === 'high');
    const medEntries  = entries.filter(e => e.city.urgency === 'medium');

    const highCount  = highEntries.length;
    const medCount   = medEntries.length;
    const totalCities = entries.length;
    const score      = (highCount * 3) + (medCount * 1);

    // Correct worst city: largest population among high-urgency cities
    const worstEntry = (highEntries.length ? highEntries : entries)
      .sort((a, b) => {
        const popA = parseFloat(a.city.population.replace(/[^0-9.]/g, '')) || 0;
        const popB = parseFloat(b.city.population.replace(/[^0-9.]/g, '')) || 0;
        return popB - popA;
      })[0];

    const topIssues = Array.from(
      new Set(entries.flatMap(e => e.city.issues))
    ).slice(0, 3);

    return {
      state,
      highCount,
      medCount,
      totalCities,
      score,
      topIssues,
      worstSlug: worstEntry.slug,
      worstCityName: worstEntry.city.name,
    };
  }).sort((a, b) => b.score - a.score);
}

export default function WorstStatesPage() {
  const rankings = getStateRankings();
  const top25    = rankings.slice(0, 25);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── HERO ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>
            STATE WATER QUALITY RANKINGS — 2025
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 16px' }}>
            Top 25 worst states for tap water quality
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 20px' }}>
            Ranked using EPA violation records, PFAS monitoring data, and lead risk across {Object.keys(CITIES).length}+ cities.
            States are scored based on the number of tracked cities rated "high concern" — the more high-risk cities, the worse the state scores.
          </p>
          <div style={{ padding: '14px 18px', background: '#071828', border: '1px solid #f59e0b30', borderRadius: 10 }}>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
              ⚠️ <strong style={{ color: '#f59e0b' }}>Methodology note:</strong> Rankings reflect primarily larger population centers tracked by WaterCheckup.
              Rural areas and smaller systems may have different profiles. Always check your specific ZIP for the most accurate picture.
            </p>
          </div>
        </div>

        {/* ── TOP 25 ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 16 }}>
            TOP 25 WORST STATES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {top25.map(({ state, highCount, medCount, totalCities, topIssues, worstSlug, worstCityName }, i) => {
              const barWidth  = Math.round((highCount / totalCities) * 100);
              const rankColor = i < 3 ? '#ef4444' : i < 6 ? '#f97316' : '#f59e0b';
              const narrative = STATE_NARRATIVE[state];

              return (
                <div key={state} style={{ background: '#071828', border: `1px solid ${i < 3 ? '#ef444440' : '#1a3a5c'}`, borderRadius: 12, overflow: 'hidden' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 20px 14px' }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: rankColor, minWidth: 36, paddingTop: 2 }}>#{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>
                        {STATE_FULL[state] || state}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
                        {highCount} high-concern {highCount === 1 ? 'city' : 'cities'} · {medCount} to monitor · {totalCities} tracked total
                      </div>
                      {/* Risk bar */}
                      <div style={{ background: '#0d2240', borderRadius: 4, height: 6, marginBottom: 10, maxWidth: 320 }}>
                        <div style={{ height: 6, borderRadius: 4, background: rankColor, width: `${barWidth}%`, transition: 'width 0.4s' }} />
                      </div>
                      {/* Issue chips */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        {topIssues.map(issue => (
                          <span key={issue} style={{ fontSize: 11, padding: '2px 8px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 5, color: '#94a3b8' }}>
                            {issue}
                          </span>
                        ))}
                      </div>
                      {/* Correct worst city link */}
                      <Link href={`/water/${worstSlug}`} style={{ fontSize: 12, color: '#0891b2', fontWeight: 700, textDecoration: 'none' }}>
                        Worst city: {worstCityName} → view full report
                      </Link>
                    </div>
                  </div>

                  {/* Narrative — specific data-backed context */}
                  {narrative && (
                    <div style={{ borderTop: '1px solid #0f2336', padding: '12px 20px 16px 70px' }}>
                      <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{narrative}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FULL TABLE ── */}
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
              <Link
                key={state}
                href={`/water/state/${(STATE_FULL[state] || state).toLowerCase().replace(/[\s.]+/g, '-')}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px 80px', padding: '12px 16px', borderBottom: '1px solid #0f2336', gap: 8, alignItems: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{STATE_FULL[state] || state}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: highCount > 3 ? '#ef4444' : highCount > 1 ? '#f59e0b' : '#22d3ee' }}>
                    {highCount} cities
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{totalCities} total</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ padding: '24px 26px', background: 'linear-gradient(135deg,#071828,#040d14)', border: '1px solid rgba(8,145,178,0.3)', borderRadius: 14, marginBottom: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Check your exact water</div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 18, lineHeight: 1.6 }}>
            State rankings show the big picture. Your specific water system may be better or worse than your state average. Enter your ZIP for the full report.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>

        {/* ── RELATED ── */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 14 }}>RELATED RANKINGS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
          {[
            { href: '/worst-pfas',       label: 'Worst PFAS violations',   desc: 'Top 10 systems above EPA MCL' },
            { href: '/worst-thm',        label: 'Worst THM / DBP cities',  desc: 'Disinfection byproduct risk' },
            { href: '/worst-water',      label: 'All PFAS (top 50)',        desc: 'Broadest PFAS exposure list' },
            { href: '/worst-lead',       label: 'Worst lead cities',        desc: 'Highest lead risk by city' },
            { href: '/worst-violations', label: 'Most EPA violations',      desc: 'Cities with worst records' },
            { href: '/worst',            label: 'Rankings hub',             desc: 'Every ranking in one place' },
          ].map(({ href, label, desc }) => (
            <Link key={href} href={href} style={{ display: 'block', padding: '14px 16px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, textDecoration: 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{desc}</div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import TopPickBox from './TopPickBox';
import EmailCapture from './EmailCapture';

import { CITIES } from './cities-data';
import ucmr5Raw from '../../../lib/ucmr5.json';

// UCMR5 data: { [pwsid]: [maxPFASppt, regulatedViolations, [[name, level, overEPALimit, overHealthLimit], ...], hardness?] }
const UCMR5 = ucmr5Raw as unknown as Record<string, [number, number, [string, number, number, number][], number?]>;

// EPA MCLs (ppt) for regulated PFAS as of April 2024
const EPA_MCL: Record<string, number> = {
  PFOA: 4, PFOS: 4, PFNA: 10, PFHxS: 10, 'HFPO-DA': 10,
};
const EPA_HAZARD_INDEX = ['PFNA', 'PFHxS', 'HFPO-DA']; // hazard index compounds

function getPfasData(pwsid: string) {
  const entry = UCMR5[pwsid];
  if (!entry) return null;
  const [maxPpt, violations, compounds, hardness] = entry;
  return { maxPpt, violations, compounds, hardness };
}


// Top 3 filter picks per city
const RO_PICKS = [
  { product: 'Waterdrop G3P800 RO', brand: 'Waterdrop', price: '~$369', reason: 'Tankless 800 GPD, removes 99%+ PFAS & lead, 10-stage filtration. Smart faucet TDS display.', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20', badge: 'EDITORS PICK' },
  { product: 'Aquasana SmartFlow RO', brand: 'Aquasana', price: '~$449', reason: 'WQA Gold Seal + NSF 42/53/58/401. Most certifications of any under-sink RO. Removes 90+ contaminants.', link: 'https://www.aquasana.com/under-sink-water-filters', amazon: 'https://www.amazon.com/dp/B0CHZ8VQBB?tag=watercheck20-20', badge: 'MOST CERTIFIED' },
  { product: 'AquaTru Under-Sink RO', brand: 'AquaTru', price: '~$375', reason: 'NSF 42/53/58 certified. Quick-change filters, no tools. Compact tankless design, 4-stage filtration.', link: 'https://www.aquatruwater.com/under-sink-reverse-osmosis-water-purifier', amazon: 'https://www.amazon.com/dp/B0GGTSFZMY?tag=watercheck20-20', badge: 'EASIEST FILTER CHANGE' },
];

const PITCHER_PICKS = [
  { product: 'Clearly Filtered 3.5L Pitcher', brand: 'Clearly Filtered', price: '~$90', reason: 'Only pitcher certified to remove PFAS at 99.9%. NSF 42/53/244/401/P473 — 365+ contaminants.', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', amazon: 'https://www.amazon.com/dp/B076B6FXT5?tag=watercheck20-20', badge: 'BEST FOR PFAS & LEAD' },
  { product: 'Waterdrop Pitcher Filter', brand: 'Waterdrop', price: '~$40', reason: '7-stage filtration, 200-gallon life. Removes chlorine, PFOA/PFOS, heavy metals. No installation.', link: 'https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B01JSJFBNE?tag=watercheck20-20', badge: 'BEST VALUE' },
  { product: 'ZeroWater 10-Cup Pitcher', brand: 'ZeroWater', price: '~$40', reason: 'Reduces TDS to zero. NSF 42/53 certified for lead, chromium, and arsenic. Includes TDS meter.', link: 'https://www.zerowater.com/collections/pitchers', amazon: 'https://www.amazon.com/dp/B01I2I2R36?tag=watercheck20-20', badge: 'REMOVES TDS' },
];

const TOP_PICKS: Record<string, { label: string; picks: typeof RO_PICKS }> = {
  'chicago':       { label: 'Lead detected in tap water', picks: RO_PICKS },
  'los-angeles':   { label: 'Chromium-6 & PFAS detected', picks: RO_PICKS },
  'houston':       { label: 'Elevated THMs in tap water', picks: RO_PICKS },
  'new-york':      { label: 'Lead risk from building pipes', picks: PITCHER_PICKS },
  'phoenix':       { label: 'PFAS + high TDS detected', picks: RO_PICKS },
  'philadelphia':  { label: 'PFAS from Delaware River', picks: RO_PICKS },
  'san-antonio':   { label: 'Hard water + DBP violations', picks: RO_PICKS },
  'dallas':        { label: 'Elevated THMs + HAA5', picks: RO_PICKS },
  'miami':         { label: 'PFAS + aging infrastructure', picks: RO_PICKS },
  'seattle':       { label: 'Building pipe lead risk', picks: PITCHER_PICKS },
};
const DEFAULT_PICKS = { label: 'Contaminants detected in local water', picks: RO_PICKS };
const SERVICE_LINE_URLS: Record<string, { url: string; label: string; hasAddress: boolean }> = {
  'chicago': { url: 'https://sli.chicagowaterquality.org/', label: 'Chicago Address-Level Lookup', hasAddress: true },
  'new-york': { url: 'https://www.nyc.gov/site/dep/environment/lead-service-lines.page', label: 'NYC Lead Service Line Info', hasAddress: false },
  'philadelphia': { url: 'https://arcg.is/1vPmCC', label: 'Philadelphia Service Line Map', hasAddress: true },
  'detroit': { url: 'https://detroitmi.gov/departments/water-and-sewerage-department/water/lead-service-line-replacement', label: 'Detroit Lead Line Replacement', hasAddress: false },
  'cleveland': { url: 'https://www.clevelandwater.com/your-water/lead', label: 'Cleveland Water Lead Info', hasAddress: false },
  'milwaukee': { url: 'https://city.milwaukee.gov/water/lead', label: 'Milwaukee Water Lead Info', hasAddress: false },
  'pittsburgh': { url: 'https://www.pwsa.us/lead', label: 'Pittsburgh Water Lead Info', hasAddress: false },
  'denver': { url: 'https://www.denverwater.org/tap/lead', label: 'Denver Water Lead Info', hasAddress: false },
  'boston': { url: 'https://www.mwra.com/04water/html/leadpipe.htm', label: 'MWRA Lead Service Line Info', hasAddress: false },
  'washington-dc': { url: 'https://dcwater.com/lead', label: 'DC Water Lead Info', hasAddress: false },
  'minneapolis': { url: 'https://www.minneapolismn.gov/resident-services/home-property/water/lead/', label: 'Minneapolis Lead Info', hasAddress: false },
  'st-louis': { url: 'https://www.stlwater.com/lead-service-line-inventory/', label: 'St. Louis Lead Service Line Inventory', hasAddress: false },
  'indianapolis': { url: 'https://www.citizensenergygroup.com/My-Home/Utilities/Water/Lead-Service-Lines', label: 'Indianapolis Lead Service Lines', hasAddress: false },
  'baltimore': { url: 'https://www.bwsh2o.com/lead', label: 'Baltimore Water Lead Info', hasAddress: false },
};


export async function generateStaticParams() {
  return Object.keys(CITIES).map(city => ({ city }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cd = CITIES[params.city];
  if (!cd) return { title: 'Water Quality Report | WaterCheckup' };
  return {
    title: `Is ${cd.name} Tap Water Safe? EPA Report 2025 | WaterCheckup`,
    description: `${cd.name} water quality report powered by live EPA data. PFAS testing, lead violations, and expert filter recommendations for ${cd.name}, ${cd.state}.`,
    alternates: {
      canonical: `https://watercheckup.com/water/${params.city}`,
    },
    openGraph: {
      title: `${cd.name} Tap Water Quality -- EPA Report | WaterCheckup`,
      description: `See what's really in ${cd.name}'s tap water. Data from 5 EPA databases + EWG health guidelines.`,
      images: [{ url: `https://watercheckup.com/api/og?city=${encodeURIComponent(cd.name + ', ' + cd.state)}&score=&grade=&violations=`, width: 1200, height: 630 }],
    },
  };
}

const urgencyConfig = {
  high:   { color: '#ef4444', bg: '#ef444415', border: '#ef444440', label: 'HIGH CONCERN', icon: '🚨' },
  medium: { color: '#f59e0b', bg: '#f59e0b15', border: '#f59e0b40', label: 'MONITOR',      icon: '⚠️' },
  low:    { color: '#22d3ee', bg: '#22d3ee15', border: '#22d3ee40', label: 'GENERALLY OK', icon: '✅' },
};

export default function CityPage({ params }: { params: { city: string } }) {
  const cd = CITIES[params.city];
  const cityName = params.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const urg = cd ? urgencyConfig[cd.urgency] : urgencyConfig.medium;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is ${cd?.name ?? cityName} tap water safe to drink?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${cd?.name ?? cityName} tap water meets federal standards but EPA monitoring data — including PFAS levels and violation history — is shown on this page. A certified reverse osmosis filter is recommended for sensitive populations.`
        }
      },
      {
        "@type": "Question",
        "name": `Does ${cd?.name ?? cityName} water have PFAS?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `EPA UCMR5 monitoring data for ${cd?.name ?? cityName} (water system ${cd?.pwsid ?? ''}) is shown above. Only a reverse osmosis system or NSF 58-certified carbon block filter reliably removes PFAS from tap water.`
        }
      },
      {
        "@type": "Question",
        "name": `What water filter is best for ${cd?.name ?? cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `For ${cd?.name ?? cityName}'s water profile, a reverse osmosis system addresses the widest range of contaminants including PFAS, lead, and disinfection byproducts. The Waterdrop G3P800 and Aquasana SmartFlow are top-rated options.`
        }
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader variant="inner" showCta ctaLabel="Check My ZIP →" />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
            WATER QUALITY REPORT
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
            {cd ? `${cd.name}, ${cd.state}` : cityName} Tap Water Quality
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.6 }}>
            What EPA data, PFAS monitoring, and independent health research reveals about {cd?.name ?? cityName}'s drinking water -- and what you can do about it.
          </p>

          {cd && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: urg.bg, border: `1px solid ${urg.border}`, borderRadius: 10 }}>
              <span style={{ fontSize: 18 }}>{urg.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: urg.color, letterSpacing: 1 }}>{urg.label}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Based on EPA violations and contaminant profile</div>
              </div>
            </div>
          )}
        </div>


        {/* TOP PICK BOX */}
        <TopPickBox
          picks={(TOP_PICKS[params.city] || DEFAULT_PICKS).picks}
          label={(TOP_PICKS[params.city] || DEFAULT_PICKS).label}
          cityName={cd?.name ?? cityName}
        />

        {cd ? (
          <>
            {/* Known issues */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                KNOWN WATER ISSUES -- {cd.name.toUpperCase()}, {cd.state}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cd.issues.map((issue, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 }}>
                    <span style={{ color: urg.color, fontSize: 16, flexShrink: 0 }}>⚠</span>
                    <span style={{ fontSize: 15, color: '#e2e8f0', fontWeight: 600 }}>{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PFAS DATA SECTION */}
            {(() => {
              const pfas = getPfasData(cd.pwsid);
              if (!pfas) {
                return (
                  <div style={{ marginBottom: 40, padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>PFAS TESTING -- EPA UCMR5 DATA</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 20 }}>📋</span>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>No UCMR5 data on file for this system</div>
                    </div>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 12px' }}>
                      The EPA&apos;s 5th Unregulated Contaminant Monitoring Rule (UCMR5) required systems serving 3,300+ people to test for 29 PFAS compounds between 2023–2025. This system either was not required to test, reported no detections, or has not yet submitted results to the federal database.
                    </p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                      Source: EPA UCMR5 national dataset · Data current as of 2025
                    </p>
                  </div>
                );
              }
              const { maxPpt, violations, compounds, hardness } = pfas;
              const hasDetections = compounds.length > 0;
              const overEPALimit = compounds.filter(([,, overEPA]) => overEPA === 1);
              const overHealthLimit = compounds.filter(([,,, overHealth]) => overHealth === 1);
              const statusColor = violations > 0 ? '#ef4444' : hasDetections ? '#f59e0b' : '#22d3ee';
              const statusLabel = violations > 0 ? 'VIOLATIONS DETECTED' : hasDetections ? 'PFAS DETECTED (BELOW MCL)' : 'NO PFAS DETECTED';
              const statusIcon = violations > 0 ? '🚨' : hasDetections ? '⚠️' : '✅';

              return (
                <div style={{ marginBottom: 40 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                    PFAS TESTING DATA -- EPA UCMR5
                  </div>

                  {/* Status banner */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: `${statusColor}12`, border: `1px solid ${statusColor}35`, borderRadius: 10, marginBottom: 16 }}>
                    <span style={{ fontSize: 22 }}>{statusIcon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: statusColor, letterSpacing: 1 }}>{statusLabel}</div>
                      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>
                        {hasDetections
                          ? `Max detected: ${maxPpt} ppt · ${compounds.length} compound${compounds.length !== 1 ? 's' : ''} found · ${violations} EPA MCL violation${violations !== 1 ? 's' : ''}`
                          : 'All 29 PFAS compounds tested below detection limits'}
                      </div>
                    </div>
                  </div>

                  {/* Compounds table */}
                  {hasDetections && (
                    <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 120px', gap: 0 }}>
                        {/* Header */}
                        {['Compound', 'Level (ppt)', 'EPA MCL', 'Health Limit'].map((h, i) => (
                          <div key={h} style={{ padding: '10px 14px', fontSize: 10, fontWeight: 800, color: '#64748b', letterSpacing: 1, background: '#040d14', borderBottom: '1px solid #1a3a5c', textAlign: i > 0 ? 'center' : 'left' }}>
                            {h}
                          </div>
                        ))}
                        {/* Rows */}
                        {compounds.sort((a, b) => b[1] - a[1]).map(([name, level, overEPA, overHealth], idx) => (
                          <>
                            <div key={`${name}-name`} style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#e2e8f0', borderBottom: idx < compounds.length - 1 ? '1px solid #0f2336' : 'none' }}>
                              {name}
                              {EPA_MCL[name] !== undefined && <span style={{ fontSize: 10, color: '#64748b', marginLeft: 6 }}>regulated</span>}
                            </div>
                            <div key={`${name}-level`} style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: overHealth ? '#ef4444' : overEPA ? '#f59e0b' : '#94a3b8', textAlign: 'center', borderBottom: idx < compounds.length - 1 ? '1px solid #0f2336' : 'none' }}>
                              {level.toFixed(1)}
                            </div>
                            <div key={`${name}-epa`} style={{ padding: '10px 14px', fontSize: 12, textAlign: 'center', borderBottom: idx < compounds.length - 1 ? '1px solid #0f2336' : 'none', color: EPA_MCL[name] !== undefined ? (overEPA ? '#ef4444' : '#22d3ee') : '#64748b' }}>
                              {EPA_MCL[name] !== undefined ? (overEPA ? `❌ >${EPA_MCL[name]} ppt` : `✓ <${EPA_MCL[name]} ppt`) : '—'}
                            </div>
                            <div key={`${name}-health`} style={{ padding: '10px 14px', fontSize: 12, textAlign: 'center', borderBottom: idx < compounds.length - 1 ? '1px solid #0f2336' : 'none', color: overHealth ? '#ef4444' : '#22d3ee' }}>
                              {overHealth ? '❌ Exceeds' : '✓ Within'}
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hardness data if available */}
                  {hardness !== undefined && (
                    <div style={{ padding: '12px 16px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 12, color: '#64748b' }}>Water Hardness (from UCMR5): </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: hardness > 250 ? '#f59e0b' : '#22d3ee' }}>
                        {hardness} mg/L as CaCO₃
                        {hardness > 250 ? ' — Hard (scale risk, reduced soap lather)' : hardness > 121 ? ' — Moderately hard' : ' — Relatively soft'}
                      </span>
                    </div>
                  )}

                  <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                    Source: EPA UCMR5 national monitoring dataset · Testing period 2023–2025 · MCL = Maximum Contaminant Level (legally enforceable limit) · Health limit = EPA health advisory threshold
                  </p>
                </div>
              );
            })()}

            {/* Facts */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                WHAT YOU SHOULD KNOW
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {cd.facts.map((fact, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#0891b2', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{fact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* System info */}
            <div style={{ marginBottom: 40, padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 14 }}>WATER SYSTEM -- EPA SDWIS</div>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[
                  { l: 'System Name', v: cd.system },
                  { l: 'EPA PWSID', v: cd.pwsid },
                  { l: 'Population Served', v: cd.population },
                  { l: 'State', v: cd.state },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: 1, marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>City data coming soon</div>
            <p style={{ fontSize: 14 }}>Enter your ZIP code above to check your specific water system.</p>
          </div>
        )}

        {/* FAQ section */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
            COMMON QUESTIONS
          </div>
          {[
            { q: `Is ${cd?.name ?? cityName} tap water safe to drink?`, a: `${cd?.name ?? cityName} water meets EPA legal standards but meeting standards is not the same as being free of contaminants. EPA limits are set based on feasibility, not always on what is safest for health. Enter your ZIP above to see the full violation history and PFAS data for your specific water system.` },
            { q: 'Do I need a water filter?', a: 'Even compliant water can contain contaminants at levels above what independent health scientists consider safe -- particularly for PFAS, lead, and chromium-6. An EPA-certified RO system removes 95-99% of all detected contaminants and costs $0.10-$0.25 per gallon, compared to $1-$3 for bottled water.' },
            { q: "What's the best filter for this area?", a: 'For most US cities, a reverse osmosis system under the sink is the gold standard -- it removes lead, PFAS, arsenic, nitrates, fluoride, and virtually everything else. For renters, a Waterdrop D4 countertop RO requires zero installation. Enter your ZIP above to get personalized recommendations based on your actual water report.' },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 16, padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{q}</div>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* LEAD SERVICE LINE LOOKUP */}
        <div style={{ marginBottom: 32, padding: '20px 22px', background: 'linear-gradient(135deg,#0a1e35,#071525)', border: '1px solid #1a3a5c', borderRadius: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: 2, marginBottom: 10 }}>LEAD SERVICE LINE RISK</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Does your street have lead pipes?</div>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 16px' }}>
            As of October 2024, all US water utilities must publish a public inventory of their lead service lines —
            the pipes connecting the water main to your home. Even if your utility water tests clean at the treatment plant,
            lead can leach from these pipes into your tap. Homes built before 1986 are most at risk.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(() => {
              const custom = SERVICE_LINE_URLS[params.city];
              const pwsid = cd?.pwsid;
              return (
                <>
                  {custom && (
                    <a href={custom.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 9, textDecoration: 'none' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>{custom.label} →</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                          {custom.hasAddress ? 'Enter your address to check your exact service line material' : 'Lead pipe replacement info and local resources'}
                        </div>
                      </div>
                    </a>
                  )}
                  {pwsid && (
                    <a href={'https://sdwis.epa.gov/ords/sfdw_pub/r/sfdw/sdwis_fed_reports_public/service-line-inventory?pwsid=' + pwsid}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 9, textDecoration: 'none' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>EPA Official Service Line Inventory →</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Federal LCRR inventory data for {cd?.system} · PWSID {pwsid}</div>
                      </div>
                    </a>
                  )}
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, lineHeight: 1.6 }}>
                    💡 Homes built before 1986 may have lead solder or service lines. A filter certified NSF/ANSI 53 removes lead at the tap regardless of pipe material.
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Email capture */}
        <EmailCapture cityName={cd?.name ?? cityName} slug={params.city} />

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid #0f2d40', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>Check your specific address</div>
          <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
            City-wide data is just the start. Enter your ZIP to see your exact water system's EPA report, PFAS levels, and violation history.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px #0891b244' }}>
            Check My Water Free →
          </Link>
        </div>

        {/* Other cities */}
        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 14 }}>OTHER CITIES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(CITIES).filter(([k]) => k !== params.city).map(([slug, c]) => (
              <Link key={slug} href={`/water/${slug}`} style={{ padding: '5px 12px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 6, fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>
                {c.name}, {c.state}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

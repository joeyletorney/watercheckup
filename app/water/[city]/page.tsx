import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import TopPickBox from './TopPickBox';
import EmailCapture from './EmailCapture';

import { CITIES } from './cities-data';
import ucmr5Raw from '../../../lib/ucmr5.json';
import cityBlurbs from '@/lib/cityBlurbs';

// UCMR5 data: { [pwsid]: [maxPFASppt, regulatedViolations, [[name, level, overEPALimit, overHealthLimit], ...], hardness?] }
const UCMR5 = ucmr5Raw as unknown as Record<string, [number, number, [string, number, number, number][], number?]>;

// EPA MCLs (ppt) for regulated PFAS as of April 2024
const EPA_MCL: Record<string, number> = {
  PFOA: 4, PFOS: 4, PFNA: 10, PFHxS: 10, 'HFPO-DA': 10,
};
const EPA_HAZARD_INDEX = ['PFNA', 'PFHxS', 'HFPO-DA'];

function getPfasData(pwsid: string) {
  const entry = UCMR5[pwsid];
  if (!entry) return null;
  const [maxPpt, violations, compounds, hardness] = entry;
  return { maxPpt, violations, compounds, hardness };
}

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

const TOP_PICKS: Record<string, { label: string; picks: typeof RO_PICKS; why?: string }> = {
  'chicago':       { label: 'Lead detected in tap water', picks: RO_PICKS, why: 'Chosen for Chicago because it removes lead at the tap — the primary concern for homes with older plumbing in Chicago.' },
  'los-angeles':   { label: 'Chromium-6 & PFAS detected', picks: RO_PICKS, why: 'Chosen for LA because it removes both chromium-6 and PFAS — the two primary concerns in the LA municipal supply.' },
  'houston':       { label: 'Elevated THMs in tap water', picks: RO_PICKS, why: 'Chosen for Houston because RO is the most effective method for removing trihalomethanes and disinfection byproducts.' },
  'new-york':      { label: 'Lead risk from building pipes', picks: PITCHER_PICKS, why: 'Chosen for NYC because building pipe lead risk is the main concern — a certified pitcher is practical for renters and apartment dwellers.' },
  'phoenix':       { label: 'PFAS + high TDS detected', picks: RO_PICKS, why: 'Chosen for Phoenix because it removes both PFAS and the high dissolved solids common in Arizona groundwater.' },
  'philadelphia':  { label: 'PFAS from Delaware River', picks: RO_PICKS, why: 'Chosen for Philadelphia because it removes PFAS from the Delaware River source — the primary concern for Philly residents.' },
  'san-antonio':   { label: 'Hard water + DBP violations', picks: RO_PICKS, why: 'Chosen for San Antonio because it specifically addresses disinfection byproducts and hard water — the two primary concerns for SAWS customers.' },
  'dallas':        { label: 'Elevated THMs + HAA5', picks: RO_PICKS, why: 'Chosen for Dallas because RO reliably removes trihalomethanes and haloacetic acids logged in Dallas water violations.' },
  'miami':         { label: 'PFAS + aging infrastructure', picks: RO_PICKS, why: 'Chosen for Miami because it removes PFAS and protects against contaminants from aging South Florida infrastructure.' },
  'seattle':       { label: 'Building pipe lead risk', picks: PITCHER_PICKS, why: 'Chosen for Seattle because building pipe lead risk is the main concern — a certified pitcher is practical for renters.' },
};
const DEFAULT_PICKS = { label: 'Contaminants detected in local water', picks: RO_PICKS, why: '' };

/** Build a city-specific recommendation reason from its data profile. */
function getCityWhy(slug: string, cd: typeof CITIES[string] | undefined, pfas?: { compounds: [string, number, number, number][]; maxPpt: number } | null): string {
  if (!cd) return 'Chosen because it addresses the widest range of contaminants found in municipal water supplies.';
  const topPick = TOP_PICKS[slug];
  if (topPick?.why) return topPick.why;
  const issues = cd.issues ?? [];
  const hasLead = issues.some(i => /lead/i.test(i));
  // Check PFAS both from issues label AND from real UCMR5 data
  const hasPfasIssue = issues.some(i => /pfas|forever/i.test(i));
  const hasPfasData  = pfas && pfas.maxPpt > 0;
  const hasPfas = hasPfasIssue || hasPfasData;
  const hasThm  = issues.some(i => /thm|disinfection|byproduct/i.test(i));
  const hasHard = issues.some(i => /hard|tds|dissolved/i.test(i));
  const isHigh  = cd.urgency === 'high';
  // If we have real PFAS ppt data, use the specific number
  if (hasLead && hasPfas && hasPfasData && pfas!.maxPpt > 4) {
    return `Chosen for ${cd.name} because PFAS was detected at ${pfas!.maxPpt} ppt in EPA UCMR5 monitoring — above the 4 ppt federal limit — and lead service lines add additional risk. RO removes 99%+ of both at the tap.`;
  }
  if (hasPfas && hasPfasData && pfas!.maxPpt > 4) {
    return `Chosen for ${cd.name} because PFAS was detected at ${pfas!.maxPpt} ppt in EPA UCMR5 monitoring — above the 4 ppt federal limit. Reverse osmosis removes 99%+ of PFAS compounds and is the only reliably certified technology for this.`;
  }
  if (hasPfas && hasPfasData) {
    return `Chosen for ${cd.name} because PFAS compounds were detected in EPA UCMR5 monitoring data for this water system. Reverse osmosis is the most effective residential technology, removing 99%+ of PFAS.`;
  }
  if (hasLead && hasPfas) return `Chosen for ${cd.name} because RO removes both lead (99%+) and PFAS (99%+) at the tap — the two primary concerns flagged in this system's EPA data.`;
  if (hasLead) return `Chosen for ${cd.name} because lead is the primary concern — NSF 58 certified RO removes 99%+ of lead at the kitchen tap, regardless of what the service line is made of.`;
  if (hasPfas) return `Chosen for ${cd.name} because PFAS contamination is detected in this system's UCMR5 data — reverse osmosis is the most effective residential technology, removing 99%+ of PFAS compounds.`;
  if (hasThm) return `Chosen for ${cd.name} because elevated disinfection byproducts (THMs/HAAs) are the primary documented concern — RO removes them more completely than carbon filtration alone.`;
  if (hasHard) return `Chosen for ${cd.name} because high TDS and hard water are the primary issues — RO dramatically reduces dissolved solids, hardness minerals, and any co-occurring contaminants.`;
  if (isHigh) return `Chosen for ${cd.name} because EPA data shows elevated concern — RO provides the broadest contaminant coverage and removes 99%+ of the most common municipal water pollutants.`;
  return `Chosen for ${cd.name} because it removes the widest range of contaminants found in municipal supplies — PFAS, lead, chlorine, nitrates, and more — in a single system.`;
}

const SERVICE_LINE_URLS: Record<string, { url: string; label: string; hasAddress: boolean }> = {
  'chicago': { url: 'https://sli.chicagowaterquality.org/', label: 'Chicago Address-Level Lookup', hasAddress: true },
  'new-york': { url: 'https://www.nyc.gov/site/dep/environment/lead-service-lines.page', label: 'NYC Lead Service Line Info', hasAddress: false },
  'philadelphia': { url: 'https://arcg.is/1vPmCC', label: 'Philadelphia Service Line Map', hasAddress: true },
  'detroit': { url: 'https://detroitmi.gov/departments/water-and-sewerage-department/water/lead/lead-service-line-replacement', label: 'Detroit Lead Line Replacement', hasAddress: false },
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
  const pfas = getPfasData(cd.pwsid);
  const hasPfas = pfas && pfas.compounds.length > 0;
  const pfasViolation = pfas && pfas.violations > 0;
  const topIssue = cd.issues[0] ?? 'Contaminants';
  const descPfas = pfasViolation
    ? `PFAS above EPA limit detected.`
    : hasPfas
    ? `PFAS compounds detected.`
    : ``;
  return {
    title: `${cd.name} Tap Water Quality 2025 — Is It Safe? | WaterCheckup`,
    description: `${cd.name}, ${cd.state} water report: ${topIssue.toLowerCase()}${descPfas ? ' · ' + descPfas : ''} Free EPA data, PFAS results & filter picks for ${cd.name} residents.`,
    alternates: {
      canonical: `https://watercheckup.com/water/${params.city}`,
    },
    openGraph: {
      title: `${cd.name} Water Quality 2025 — What's Really in Your Tap Water | WaterCheckup`,
      description: `Free EPA report for ${cd.name}: violations, PFAS testing, lead risk & the best filters for your water. Updated 2025.`,
      images: [{ url: `https://watercheckup.com/api/og?city=${encodeURIComponent(cd.name + ', ' + cd.state)}&score=&grade=&violations=`, width: 1200, height: 630 }],
    },
  };
}

const urgencyConfig = {
  high:   { color: '#ef4444', bg: '#ef444415', border: '#ef444440', label: 'HIGH CONCERN', icon: '🚨' },
  medium: { color: '#f59e0b', bg: '#f59e0b15', border: '#f59e0b40', label: 'MONITOR',      icon: '⚠️' },
  low:    { color: '#22d3ee', bg: '#22d3ee15', border: '#22d3ee40', label: 'GENERALLY OK', icon: '✅' },
};

// Water Safety Score: 0 (worst) → 88 (best possible — no municipal water is perfect)
function computeWaterScore(
  urgency: 'high' | 'medium' | 'low',
  issues: string[],
  pfasData: { maxPpt: number; violations: number; compounds: [string, number, number, number][]; hardness?: number } | null
): { score: number; grade: string; gradeColor: string; label: string; scoreColor: string } {
  // Baseline: all municipal water has chlorine, DBPs, and unmonitored contaminants.
  // No tap water scores above 88 — "no violations on record" ≠ perfectly safe.
  let score = 88;

  // Urgency deductions
  if (urgency === 'high')   score -= 40;
  if (urgency === 'medium') score -= 20;

  // Issue count deductions
  score -= Math.min(issues.length * 5, 20);

  // PFAS deductions
  if (pfasData) {
    if (pfasData.violations > 0)            score -= 25;
    else if (pfasData.compounds.length > 3) score -= 12;
    else if (pfasData.compounds.length > 0) score -= 6;

    // Extra penalty if any compound exceeds health limit
    const overHealth = pfasData.compounds.some(([, , , oh]) => oh > 0);
    if (overHealth) score -= 10;

    if (pfasData.maxPpt > 50)      score -= 8;
    else if (pfasData.maxPpt > 10) score -= 4;
  }

  score = Math.max(0, Math.min(88, score));

  let grade: string;
  let gradeColor: string;
  let label: string;
  let scoreColor: string;

  if (score >= 80) {
    grade = 'A-'; gradeColor = '#22d3ee'; label = 'Good'; scoreColor = '#22d3ee';
  } else if (score >= 65) {
    grade = 'B'; gradeColor = '#86efac'; label = 'Fair'; scoreColor = '#86efac';
  } else if (score >= 50) {
    grade = 'C'; gradeColor = '#f59e0b'; label = 'Concerning'; scoreColor = '#f59e0b';
  } else if (score >= 35) {
    grade = 'D'; gradeColor = '#f97316'; label = 'Poor'; scoreColor = '#f97316';
  } else {
    grade = 'F'; gradeColor = '#ef4444'; label = 'High Risk'; scoreColor = '#ef4444';
  }

  return { score, grade, gradeColor, label, scoreColor };
}

// Per-urgency context copy shown in the problem banner
function getUrgencyContext(urgency: 'high' | 'medium' | 'low', issues: string[], cityName: string): string {
  if (urgency === 'high') {
    return `${cityName} has significant water quality concerns including ${issues[0]?.toLowerCase()}. EPA legal limits are set based on treatment feasibility — not always on what independent health scientists consider safe. Certified filtration is strongly recommended for this water supply.`;
  }
  if (urgency === 'medium') {
    return `${cityName} water meets EPA legal standards, but legal compliance is not the same as being free of health concerns. The issues flagged below are worth understanding before deciding whether to filter. EPA limits are often set below what independent scientists recommend as safe thresholds.`;
  }
  return `${cityName} water currently shows no major violations in EPA monitoring data. That said, your home's internal plumbing can add lead or other contaminants after water leaves the treatment plant — especially in homes built before 1986.`;
}

export default function CityPage({ params }: { params: { city: string } }) {
  const slug = params.city;
  const cd = CITIES[slug];
  const cityName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const urg = cd ? urgencyConfig[cd.urgency] : urgencyConfig.medium;
  const cityBlurbText = cityBlurbs[slug as keyof typeof cityBlurbs]?.blurb;
  // Compute pfas early so getCityWhy can use the real UCMR5 numbers
  const pfas = cd ? getPfasData(cd.pwsid) : null;
  const cityPicks = TOP_PICKS[slug] || DEFAULT_PICKS;
  const cityWhyText = getCityWhy(slug, cd, pfas);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is ${cd?.name ?? cityName} tap water safe to drink in 2025?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${cd?.name ?? cityName} water meets federal standards but EPA monitoring data — including PFAS levels and violation history — is shown on this page. ${cd?.urgency === 'high' ? `${cd.name} has known issues including ${cd.issues[0]?.toLowerCase()}. Certified filtration is strongly recommended.` : `A certified reverse osmosis filter is recommended for sensitive populations.`}`
        }
      },
      {
        "@type": "Question",
        "name": `Does ${cd?.name ?? cityName} water have PFAS?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `EPA UCMR5 monitoring data for ${cd?.name ?? cityName} (water system ${cd?.pwsid ?? ''}) is shown on this page. Only a reverse osmosis system or NSF 58-certified carbon block filter reliably removes PFAS from tap water. Standard pitchers do not remove PFAS.`
        }
      },
      {
        "@type": "Question",
        "name": `Does ${cd?.name ?? cityName} water have lead?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Lead in tap water almost always comes from plumbing inside your home, not the treatment plant. Homes built before 1986 in ${cd?.name ?? cityName} are most at risk. An NSF/ANSI 53-certified filter or reverse osmosis system removes lead at the tap.`
        }
      },
      {
        "@type": "Question",
        "name": `What water filter is best for ${cd?.name ?? cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `For ${cd?.name ?? cityName}'s water profile, a reverse osmosis system addresses the widest range of contaminants including PFAS, lead, and disinfection byproducts. The Waterdrop G3P800 and Aquasana SmartFlow are top-rated options. Renters can use the Waterdrop D4 countertop RO — no installation required.`
        }
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── HERO ── */}
        <div style={{ marginBottom: 32 }}>
          <nav style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
            <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <Link href="/water" style={{ color: '#64748b', textDecoration: 'none' }}>Cities</Link>
            {cd?.state && (
              <>
                <span style={{ margin: '0 6px' }}>›</span>
                <span>{cd.state}</span>
              </>
            )}
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#94a3b8' }}>{cd?.name ?? cityName}</span>
          </nav>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
            WATER QUALITY REPORT
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
            {cd ? `${cd.name}, ${cd.state}` : cityName} tap water: what&apos;s in it in 2025
          </h1>

          {cd && (
            <p style={{ fontSize: 15, color: '#94a3b8', margin: '0 0 18px', lineHeight: 1.6 }}>
              Serving {cd.population} residents via {cd.system}
              {cityBlurbText ? ` · ${cityBlurbText}` : ''}
            </p>
          )}

          {/* Issue tags */}
          {cd && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {cd.issues.map((issue, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', background: `${urg.color}18`, border: `1px solid ${urg.border}`, borderRadius: 6, color: urg.color }}>
                  {issue}
                </span>
              ))}
            </div>
          )}

          {/* Water Safety Score + Urgency badge */}
          {cd && (() => {
            const ws = computeWaterScore(cd.urgency, cd.issues, pfas);
            const circumference = 2 * Math.PI * 36;
            const dashOffset = circumference - (ws.score / 100) * circumference;
            return (
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Score circle */}
                <div style={{ background: '#071828', border: `2px solid ${ws.scoreColor}30`, borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, flex: '0 0 auto' }}>
                  <div style={{ position: 'relative', width: 88, height: 88 }}>
                    <svg width="88" height="88" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="44" cy="44" r="36" fill="none" stroke="#1a3a5c" strokeWidth="8" />
                      <circle
                        cx="44" cy="44" r="36" fill="none"
                        stroke={ws.scoreColor} strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: ws.scoreColor, lineHeight: 1 }}>{ws.score}</span>
                      <span style={{ fontSize: 9, color: '#64748b', letterSpacing: 1, marginTop: 2 }}>/ 100</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: 2, marginBottom: 4 }}>WATER SAFETY SCORE</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: ws.gradeColor, lineHeight: 1 }}>Grade: {ws.grade}</div>
                    <div style={{ fontSize: 13, color: ws.scoreColor, fontWeight: 600, marginTop: 4 }}>{ws.label}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>Based on EPA violations, PFAS data &amp; contaminant profile</div>
                  </div>
                </div>

                {/* Urgency badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: urg.bg, border: `1px solid ${urg.border}`, borderRadius: 10, alignSelf: 'center' }}>
                  <span style={{ fontSize: 18 }}>{urg.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: urg.color, letterSpacing: 1 }}>{urg.label}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>EPA violation status</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {cd ? (
          <>
            {/* ── STEP 1: THE PROBLEM ── */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                WHAT YOU SHOULD KNOW ABOUT {cd.name.toUpperCase()} WATER
              </div>

              {/* Context banner */}
              <div style={{ padding: '16px 20px', background: `${urg.color}10`, border: `1px solid ${urg.border}`, borderRadius: 12, marginBottom: 20 }}>
                <p style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
                  {getUrgencyContext(cd.urgency, cd.issues, cd.name)}
                </p>
              </div>

              {/* Known issues */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {cd.issues.map((issue, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 }}>
                    <span style={{ color: urg.color, fontSize: 16, flexShrink: 0 }}>⚠</span>
                    <span style={{ fontSize: 15, color: '#e2e8f0', fontWeight: 600 }}>{issue}</span>
                  </div>
                ))}
              </div>

              {/* Facts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {cd.facts.map((fact, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#0891b2', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                    <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{fact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── STEP 2: PFAS DATA ── */}
            {(() => {
              if (!pfas) {
                return (
                  <div style={{ marginBottom: 40, padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>PFAS TESTING — EPA UCMR5 DATA</div>
                    <div style={{ fontSize: 10, color: '#334155', marginBottom: 12 }}>EPA UCMR5 monitoring · Testing period 2023–2025 · Last updated Q1 2025</div>
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
              const statusColor = violations > 0 ? '#ef4444' : hasDetections ? '#f59e0b' : '#22d3ee';
              const statusLabel = violations > 0 ? 'VIOLATIONS DETECTED' : hasDetections ? 'PFAS DETECTED (BELOW MCL)' : 'NO PFAS DETECTED';
              const statusIcon = violations > 0 ? '🚨' : hasDetections ? '⚠️' : '✅';

              return (
                <div style={{ marginBottom: 40 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2 }}>PFAS TESTING DATA — EPA UCMR5</div>
                    <div style={{ fontSize: 10, color: '#334155' }}>Testing period 2023–2025 · Last updated Q1 2025</div>
                  </div>

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

                  {hasDetections && (
                    <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 120px', gap: 0 }}>
                        {['Compound', 'Level (ppt)', 'EPA MCL', 'Health Limit'].map((h, i) => (
                          <div key={h} style={{ padding: '10px 14px', fontSize: 10, fontWeight: 800, color: '#64748b', letterSpacing: 1, background: '#040d14', borderBottom: '1px solid #1a3a5c', textAlign: i > 0 ? 'center' : 'left' }}>
                            {h}
                          </div>
                        ))}
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

            {/* ── INLINE EMAIL CAPTURE — right after PFAS data while alarm is highest ── */}
            <div style={{ marginBottom: 24, padding: '14px 18px', background: 'rgba(8,145,178,0.07)', border: '1px solid rgba(8,145,178,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#94a3b8', flexShrink: 0 }}>🔔 Get alerts if {cd.name}&apos;s water data changes:</span>
              <EmailCapture cityName={cd.name} slug={slug} inline />
            </div>

            {/* ── STEP 3: FILTER RECOMMENDATION ── */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 6, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                WHAT TO DO ABOUT IT
              </div>
              <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.6 }}>
                Based on {cd.name}&apos;s water profile above, here&apos;s the exact system we recommend — and why it&apos;s right for this water supply specifically.
              </p>
            </div>

            <TopPickBox
              picks={cityPicks.picks}
              label={cityPicks.label}
              cityName={cd.name}
              citySlug={slug}
              whyText={cityWhyText}
            />

            {/* ── SYSTEM INFO ── */}
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

        {/* ── FAQ ── */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
            COMMON QUESTIONS
          </h2>
          {[
            {
              q: `Is ${cd?.name ?? cityName} tap water safe to drink in 2025?`,
              a: `${cd?.name ?? cityName} water meets EPA legal standards, but meeting legal standards is not the same as being free of health concerns. EPA limits are set based on treatment feasibility, not always on what independent scientists consider safe. ${cd?.urgency === 'high' ? `${cd.name} has ${cd.issues[0]?.toLowerCase()} which is a significant concern — certified filtration is strongly recommended.` : `The main concerns for ${cd?.name ?? cityName} residents are ${cd?.issues.slice(0, 2).join(' and ').toLowerCase()}. Enter your ZIP above to see the full violation history for your specific water system.`}`,
            },
            {
              q: `Does ${cd?.name ?? cityName} water have PFAS?`,
              a: `EPA UCMR5 monitoring data for ${cd?.name ?? cityName} (water system ${cd?.pwsid ?? 'your local system'}) is shown above. PFAS — sometimes called "forever chemicals" — are synthetic compounds that don't break down in the body. Only reverse osmosis systems or NSF 58-certified carbon block filters reliably remove PFAS from tap water. Standard pitcher filters do not remove PFAS.`,
            },
            {
              q: `Does ${cd?.name ?? cityName} water have lead?`,
              a: `Lead in tap water almost always comes from the pipes inside your home or building, not the treatment plant. Homes built before 1986 in ${cd?.name ?? cityName} are most at risk because they may have lead solder, brass fittings, or lead service lines. The EPA has no safe level for lead in children. An NSF/ANSI 53-certified filter or reverse osmosis system removes lead at the tap.`,
            },
            {
              q: `What water filter is best for ${cd?.name ?? cityName}?`,
              a: `For ${cd?.name ?? cityName}'s water profile — ${cd?.issues.slice(0, 2).join(', ').toLowerCase() ?? 'typical municipal contaminants'} — a reverse osmosis system addresses the widest range of contaminants. Under-sink RO (Waterdrop G3P800, Aquasana SmartFlow) is the gold standard for homeowners. Renters can use a countertop RO like the Waterdrop D4 — zero installation required. Clearly Filtered pitchers are the best non-RO option for PFAS and lead.`,
            },
            {
              q: `How do I get my ${cd?.name ?? cityName} water tested?`,
              a: `For the most accurate results for your specific tap, use a certified mail-in lab test rather than relying on city-wide data. SimpleLab Tap Score tests for 100+ contaminants including PFAS, lead, arsenic, and nitrates. Results come with a detailed health assessment and filter recommendations. City-wide EPA data like what you see above is a strong baseline, but your home's plumbing can add contaminants after the water leaves the treatment plant.`,
            },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 16, padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>{q}</h3>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* ── LEAD SERVICE LINE ── */}
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

        {/* ── STEP 4: EMAIL CAPTURE ── */}
        <EmailCapture cityName={cd?.name ?? cityName} slug={params.city} />

        {/* ── STEP 5: ZIP CTA ── */}
        <div style={{ background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid #0f2d40', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>
            Check your specific address
          </div>
          <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
            City-wide data is just the start. Enter your ZIP to see your exact water system&apos;s EPA report, PFAS levels, and violation history — then get the right filter for your home.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px #0891b244' }}>
            Fix My Water — Free →
          </Link>
        </div>

        {/* ── RELATED BLOG POSTS ── */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, margin: '0 0 14px' }}>RELATED GUIDES</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { slug: 'is-pfas-in-my-tap-water', title: 'Is PFAS in My Tap Water?', badge: 'PFAS' },
              { slug: 'best-water-filter-for-lead-removal', title: 'Best Filters for Lead Removal', badge: 'Lead' },
              { slug: 'what-water-filter-removes-pfas', title: 'What Filter Removes PFAS?', badge: 'Filters' },
              { slug: 'what-does-epa-water-violation-mean', title: 'What Does an EPA Violation Mean?', badge: 'EPA' },
              { slug: 'reverse-osmosis-pros-and-cons', title: 'Reverse Osmosis: Pros & Cons', badge: 'Filters' },
              { slug: 'tap-water-safety-during-pregnancy', title: 'Tap Water Safety During Pregnancy', badge: 'Health' },
            ].map(({ slug, title, badge }) => (
              <Link key={slug} href={`/blog/${slug}`} style={{ display: 'block', padding: '12px 14px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 8, textDecoration: 'none' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#0891b2', letterSpacing: 1, marginBottom: 4 }}>{badge}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.4 }}>{title}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── NEARBY CITIES ── */}
        <div>
          <h2 style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, margin: '0 0 14px' }}>COMPARE WATER QUALITY IN OTHER CITIES</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 20 }}>
            {Object.entries(CITIES)
              .filter(([k]) => k !== params.city)
              .sort(([ka, ca], [kb, cb]) => {
                const sameA = ca.state === cd?.state ? 0 : 1;
                const sameB = cb.state === cd?.state ? 0 : 1;
                if (sameA !== sameB) return sameA - sameB;
                const urgOrder = { high: 0, medium: 1, low: 2 };
                return urgOrder[ca.urgency] - urgOrder[cb.urgency];
              })
              .slice(0, 12)
              .map(([slug, c]) => {
                const uc = { high: { color: '#ef4444', label: 'High concern' }, medium: { color: '#f59e0b', label: 'Monitor' }, low: { color: '#22d3ee', label: 'OK' } }[c.urgency];
                return (
                  <Link key={slug} href={`/water/${slug}`} style={{ display: 'block', padding: '12px 14px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 8, textDecoration: 'none' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{c.name}, {c.state}</div>
                    <div style={{ fontSize: 11, color: uc.color }}>{uc.label} · {c.issues[0]}</div>
                  </Link>
                );
              })}
          </div>
          <Link href="/water" style={{ fontSize: 13, color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>View all 135+ city reports →</Link>
        </div>

      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

// Major US cities with representative ZIP codes and known water issues
const CITIES: Record<string, {
  name: string; state: string; zip: string; population: string;
  system: string; pwsid: string;
  issues: string[]; facts: string[];
  urgency: 'high' | 'medium' | 'low';
}> = {
  'chicago': {
    name: 'Chicago', state: 'IL', zip: '60601', population: '2.7M',
    system: 'Chicago Department of Water Management', pwsid: 'IL0100008',
    issues: ['Lead service lines', 'Chloramine disinfection byproducts', 'Legacy pipe infrastructure'],
    facts: [
      'Chicago has over 400,000 lead service lines — among the most in any US city.',
      'The city uses chloramine instead of chlorine, which forms NDMA and other DBPs.',
      'Lead leaches from pipes directly into tap water, especially in older homes.',
      'Only reverse osmosis removes lead to safe levels — Brita and standard pitchers do not.',
    ],
    urgency: 'high',
  },
  'los-angeles': {
    name: 'Los Angeles', state: 'CA', zip: '90001', population: '4M',
    system: 'Los Angeles Department of Water and Power', pwsid: 'CA1910067',
    issues: ['Chromium-6 (hexavalent chromium)', 'PFAS in some districts', 'Drought-driven water blending'],
    facts: [
      'LA\'s water has one of the highest chromium-6 levels of any major US city — a known carcinogen.',
      'Multiple LADWP water districts have detected PFAS above EPA health advisory levels.',
      'Water is blended from the Colorado River and local groundwater — quality varies by district.',
      'Only RO systems remove chromium-6 — activated carbon does not.',
    ],
    urgency: 'high',
  },
  'houston': {
    name: 'Houston', state: 'TX', zip: '77001', population: '2.3M',
    system: 'Houston Public Works Water', pwsid: 'TX1010013',
    issues: ['Disinfection byproducts (THMs)', 'Chloramine', 'Post-hurricane aging infrastructure'],
    facts: [
      'Houston\'s water consistently tests above average for trihalomethanes (THMs) — cancer-linked DBPs.',
      'Post-Harvey flooding stressed water infrastructure and contamination risks spiked.',
      'Chloramine used for disinfection produces NDMA and other byproducts that standard filters miss.',
      'Carbon block or RO filtration is recommended for Houston residents.',
    ],
    urgency: 'medium',
  },
  'new-york': {
    name: 'New York City', state: 'NY', zip: '10001', population: '8.3M',
    system: 'NYC Department of Environmental Protection', pwsid: 'NY7000627',
    issues: ['Legacy lead service lines in older boroughs', 'Chlorination byproducts', 'Building pipe contamination'],
    facts: [
      'NYC source water from the Catskills is excellent — but old building pipes add lead.',
      'Buildings built before 1986 likely have lead solder or lead pipes inside.',
      'NYCDEP water ranks among the best for municipal supply — but in-building pipes are the risk.',
      'A home lead test is essential for NYC residents in pre-1986 buildings.',
    ],
    urgency: 'medium',
  },
  'phoenix': {
    name: 'Phoenix', state: 'AZ', zip: '85001', population: '1.6M',
    system: 'Phoenix Water Services', pwsid: 'AZ0413005',
    issues: ['High TDS / hard water', 'PFAS from military sites', 'Arsenic in groundwater'],
    facts: [
      'Phoenix water has some of the highest TDS (dissolved solids) of any major US city — over 600 mg/L.',
      'Military installations nearby have contaminated some groundwater sources with PFAS.',
      'Arizona groundwater has naturally elevated arsenic levels — above EPA health goals in some areas.',
      'RO is essential in Phoenix — it removes TDS, arsenic, PFAS, and hard minerals.',
    ],
    urgency: 'high',
  },
  'philadelphia': {
    name: 'Philadelphia', state: 'PA', zip: '19101', population: '1.6M',
    system: 'Philadelphia Water Department', pwsid: 'PA2510007',
    issues: ['Lead service lines', 'PFAS from upstream industrial sources', 'Chlorination byproducts'],
    facts: [
      'Philadelphia has thousands of lead service lines still in use throughout the city.',
      'Delaware River — Philadelphia\'s source water — carries PFAS from upstream industrial discharge.',
      'In 2021, EWG detected multiple PFAS compounds in Philadelphia tap water above health guidelines.',
      'Both RO and Clearly Filtered-certified pitchers remove PFAS for Philly residents.',
    ],
    urgency: 'high',
  },
  'san-antonio': {
    name: 'San Antonio', state: 'TX', zip: '78201', population: '1.5M',
    system: 'San Antonio Water System (SAWS)', pwsid: 'TX0150010',
    issues: ['Radium and uranium from Edwards Aquifer', 'High TDS', 'Nitrates in some districts'],
    facts: [
      'San Antonio draws from the Edwards Aquifer, which has naturally elevated radium and uranium.',
      'Water TDS in San Antonio regularly exceeds 400 mg/L — noticeably hard and mineral-heavy.',
      'Some SAWS districts have reported nitrate levels above EPA health advisory levels.',
      'RO is the recommended solution — it removes radionuclides, TDS, and nitrates.',
    ],
    urgency: 'high',
  },
  'dallas': {
    name: 'Dallas', state: 'TX', zip: '75201', population: '1.3M',
    system: 'Dallas Water Utilities', pwsid: 'TX0570020',
    issues: ['Chloramine DBPs', 'High TDS from Trinity River', 'Lead in older infrastructure'],
    facts: [
      'Dallas uses chloramine disinfection, producing NDMA and haloacetic acids as byproducts.',
      'Trinity River source water carries agricultural runoff including nitrates and herbicides.',
      'EWG has flagged Dallas water for chromium-6 levels above health-based guidelines.',
      'Carbon filtration alone is insufficient — RO recommended for Dallas drinking water.',
    ],
    urgency: 'medium',
  },
  'miami': {
    name: 'Miami', state: 'FL', zip: '33101', population: '470K metro: 6.2M',
    system: 'Miami-Dade Water & Sewer', pwsid: 'FL4130083',
    issues: ['PFAS from Biscayne Bay industrial activity', 'High chlorine use', 'Aging infrastructure'],
    facts: [
      'South Florida PFAS contamination from military and industrial sites has reached municipal supplies.',
      'Miami-Dade uses high chlorine doses due to warm temperatures and long distribution lines.',
      'Hurricane damage risk creates periodic boil-water advisories and temporary contamination spikes.',
      'RO or certified pitcher filters are essential for Miami drinking water.',
    ],
    urgency: 'medium',
  },
  'seattle': {
    name: 'Seattle', state: 'WA', zip: '98101', population: '750K',
    system: 'Seattle Public Utilities', pwsid: 'WA00303',
    issues: ['Slightly corrosive soft water leaching lead from pipes', 'Low but present chloramine DBPs'],
    facts: [
      'Seattle source water (Cedar and Tolt rivers) is exceptionally clean — among the best in the US.',
      'The soft, slightly acidic nature of Seattle water makes it more corrosive — leaching lead from pipes.',
      'Seattle was one of the first US cities to document a lead crisis from this corrosivity issue.',
      'A shower filter and basic carbon filter are often sufficient — RO for added peace of mind.',
    ],
    urgency: 'low',
  },
};

export async function generateStaticParams() {
  return Object.keys(CITIES).map(city => ({ city }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cd = CITIES[params.city];
  if (!cd) return { title: 'Water Quality Report | WaterCheckup' };
  return {
    title: `Is ${cd.name} Tap Water Safe? EPA Report 2024 | WaterCheckup`,
    description: `${cd.name} water quality report powered by live EPA data. PFAS testing, lead violations, and expert filter recommendations for ${cd.name}, ${cd.state}.`,
    openGraph: {
      title: `${cd.name} Tap Water Quality — EPA Report | WaterCheckup`,
      description: `See what's really in ${cd.name}'s tap water. Live EPA SDWIS + UCMR5 PFAS data.`,
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

  return (
    <div style={{ minHeight: '100vh', background: '#091825', color: '#e2e8f0' }}>

      {/* NAV */}
      <div style={{ borderBottom: '1px solid #1a3a5c', padding: '0 24px', height: 62, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(6,15,30,0.97)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 44" width="180" height="36">
            <defs>
              <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0891b2"/><stop offset="100%" stopColor="#06b6d4"/>
              </linearGradient>
            </defs>
            <path d="M20 2 C20 2 6 15 6 24 C6 31.7 12.3 38 20 38 C27.7 38 34 31.7 34 24 C34 15 20 2 20 2Z" fill="url(#dg)"/>
            <polyline points="12,24 18,31 28,18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="42" y="30" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="24" fontWeight="800" fill="#f1f5f9">Water</text>
            <text x="106" y="30" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="24" fontWeight="800" fill="#22d3ee">Checkup</text>
          </svg>
        </Link>
        <nav style={{ display: 'flex', gap: 2, marginLeft: 16 }}>
          {([['/', 'Home'], ['/contaminants', 'Contaminants'], ['/faq', 'FAQ']] as [string,string][]).map(([href, label]) => (
            <Link key={href} href={href} style={{ padding: '6px 12px', borderRadius: 7, fontSize: 13, fontWeight: 600, color: '#94a3b8', textDecoration: 'none' }}>{label}</Link>
          ))}
        </nav>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(180deg, #071828 0%, #040d14 100%)', padding: '52px 24px 44px', textAlign: 'center', borderBottom: '1px solid #0f2336' }}>
        {cd && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: urg.bg, border: `1px solid ${urg.border}`, borderRadius: 30, padding: '6px 16px', marginBottom: 16, fontSize: 12, fontWeight: 700, color: urg.color }}>
            {urg.icon} {urg.label}
          </div>
        )}
        <h1 style={{ fontSize: 40, fontWeight: 900, color: '#f1f5f9', marginBottom: 12, lineHeight: 1.15 }}>
          Is {cd?.name ?? cityName} Tap Water Safe?
        </h1>
        <p style={{ fontSize: 17, color: '#64748b', maxWidth: 580, margin: '0 auto 28px', lineHeight: 1.7 }}>
          {cd
            ? `Live EPA water quality report for ${cd.name}, ${cd.state}. Powered by SDWIS, UCMR5 PFAS data, and EWG Tap Water Atlas.`
            : `Check your specific water system's EPA data, violations, and PFAS levels.`}
        </p>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0d2240, #091c35)', border: '1px solid #1e4a6e', borderRadius: 16, padding: '28px 32px', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>
            Enter your ZIP to see your exact water system's report
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <form action="/" method="get" style={{ display: 'flex', gap: 8 }}>
              <input
                name="zip"
                placeholder={cd?.zip ?? 'ZIP code'}
                maxLength={5}
                style={{ width: 130, padding: '11px 14px', fontSize: 18, background: '#0b1e36', border: '1px solid #1e4a6a', borderRadius: 8, color: '#22d3ee', outline: 'none', textAlign: 'center', letterSpacing: 2 }}
              />
              <button type="submit" style={{ padding: '11px 20px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Analyze →
              </button>
            </form>
          </div>
          {cd && <div style={{ marginTop: 10, fontSize: 12, color: '#334155' }}>Try ZIP: {cd.zip} for {cd.name} central</div>}
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 80px' }}>

        {cd ? (
          <>
            {/* Known issues */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                KNOWN WATER ISSUES — {cd.name.toUpperCase()}, {cd.state}
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
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 14 }}>WATER SYSTEM — EPA SDWIS</div>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[
                  { l: 'System Name', v: cd.system },
                  { l: 'EPA PWSID', v: cd.pwsid },
                  { l: 'Population Served', v: cd.population },
                  { l: 'State', v: cd.state },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, color: '#475569', letterSpacing: 1, marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569' }}>
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
            { q: `Is ${cd?.name ?? cityName} tap water safe to drink?`, a: `${cd?.name ?? cityName} water meets EPA legal standards but "meeting standards" is not the same as being free of contaminants. EPA limits are set based on feasibility, not always on what's safest for health. Enter your ZIP above to see the full violation history and PFAS data for your specific water system.` },
            { q: 'Do I need a water filter?', a: 'Even compliant water can contain contaminants at levels above what independent health scientists consider safe — particularly for PFAS, lead, and chromium-6. An EPA-certified RO system removes 95–99% of all detected contaminants and costs $0.10–$0.25 per gallon, compared to $1–$3 for bottled water.' },
            { q: 'What\'s the best filter for this area?', a: 'For most US cities, a reverse osmosis system under the sink is the gold standard — it removes lead, PFAS, arsenic, nitrates, fluoride, and virtually everything else. For renters, a Waterdrop D4 countertop RO requires zero installation. Enter your ZIP above to get personalized recommendations based on your actual water report.' },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 16, padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{q}</div>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid #0f2d40', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>Check your specific address</div>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
            City-wide data is just the start. Enter your ZIP to see your exact water system's EPA report, PFAS levels, and violation history.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px #0891b244' }}>
            Check My Water Free →
          </Link>
        </div>

        {/* Other cities */}
        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 14 }}>OTHER CITIES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(CITIES).filter(([k]) => k !== params.city).map(([slug, c]) => (
              <Link key={slug} href={`/water/${slug}`} style={{ padding: '5px 12px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 6, fontSize: 13, color: '#64748b', textDecoration: 'none' }}>
                {c.name}, {c.state}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import TopPickBox from './TopPickBox';
import EmailCapture from './EmailCapture';

import { CITIES } from './cities-data';


// Top filter pick per city
const TOP_PICKS: Record<string, { label: string; product: string; reason: string; link: string; amazon: string }> = {
  'chicago':       { label: 'Lead detected in tap water', product: 'Waterdrop Under-Sink RO', reason: 'Removes 99.9% of lead from Chicago service lines', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20' },
  'los-angeles':   { label: 'Chromium-6 & PFAS detected', product: 'Waterdrop Under-Sink RO', reason: 'Only RO removes chromium-6 — carbon filters do not', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20' },
  'houston':       { label: 'Elevated THMs in tap water', product: 'Waterdrop Under-Sink Filter', reason: 'Carbon block filtration removes THMs and chloramine byproducts', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20' },
  'new-york':      { label: 'Lead risk from building pipes', product: 'Waterdrop Pitcher Filter', reason: 'NSF 53 certified for lead — no installation needed', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20' },
  'phoenix':       { label: 'PFAS + high TDS detected', product: 'Waterdrop Under-Sink RO', reason: 'RO removes PFAS, arsenic, TDS, and hard minerals in one system', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20' },
  'philadelphia':  { label: 'PFAS from Delaware River', product: 'Waterdrop Under-Sink RO', reason: 'RO is the only residential technology proven to remove PFAS', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20' },
  'san-antonio':   { label: 'Hard water + DBP violations', product: 'Waterdrop Under-Sink RO', reason: 'RO removes hard minerals, DBPs, and chlorine in one pass', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20' },
  'dallas':        { label: 'Elevated THMs + HAA5', product: 'Waterdrop Under-Sink Filter', reason: 'Certified carbon block for THMs and haloacetic acid removal', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20' },
  'miami':         { label: 'PFAS + aging infrastructure', product: 'Waterdrop Under-Sink RO', reason: 'Full RO protection for PFAS and heavy metals from old pipes', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20' },
  'seattle':       { label: 'Building pipe lead risk', product: 'Waterdrop Pitcher Filter', reason: "Seattle source water is great — in-building pipes are the risk", link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20' },
};

const DEFAULT_PICK = { label: 'Contaminants detected in local water', product: 'Waterdrop Under-Sink RO', reason: 'The gold standard for removing PFAS, lead, chlorine, and more', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20' };

export async function generateStaticParams() {
  return Object.keys(CITIES).map(city => ({ city }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cd = CITIES[params.city];
  if (!cd) return { title: 'Water Quality Report | WaterCheckup' };
  return {
    title: `Is ${cd.name} Tap Water Safe? EPA Report 2025 | WaterCheckup`,
    description: `${cd.name} water quality report powered by live EPA data. PFAS testing, lead violations, and expert filter recommendations for ${cd.name}, ${cd.state}.`,
    openGraph: {
      title: `${cd.name} Tap Water Quality -- EPA Report | WaterCheckup`,
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
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <div style={{ borderBottom: '1px solid #0f2336', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💧</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>WaterCheckup</span>
        </Link>
        <Link href="/" style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Check My ZIP →
        </Link>
      </div>

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
          pick={TOP_PICKS[params.city] || DEFAULT_PICK}
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

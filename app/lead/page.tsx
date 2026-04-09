import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export const metadata: Metadata = {
  title: 'Lead in Tap Water — Health Risks, EPA Limits, Service Lines & Filters That Work | WaterCheckup',
  description:
    'Lead in drinking water has no safe level. Learn how lead enters tap water from service lines and plumbing, what EPA Lead and Copper Rule testing shows, and which certified filters remove lead. Free ZIP lookup with LCR sample data.',
  alternates: { canonical: 'https://watercheckup.com/lead' },
  openGraph: {
    title: 'Lead in Tap Water — Free EPA Data by ZIP | WaterCheckup',
    description:
      'See Lead and Copper Rule tap sampling for your water system. Understand service line risk and pick filters certified for lead removal.',
    images: [{ url: 'https://watercheckup.com/api/og?city=Lead+Guide&score=&grade=&violations=', width: 1200, height: 630 }],
  },
};

const p = { fontSize: 15, color: '#94a3b8', lineHeight: 1.8, margin: '0 0 16px' } as React.CSSProperties;
const h2 = { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px' } as React.CSSProperties;
const label = { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#f59e0b', marginBottom: 10, display: 'block' } as React.CSSProperties;

const LEAD_FACTS = [
  { stat: '0 ppb', desc: 'EPA maximum contaminant level goal (MCLG) for lead — no safe exposure level' },
  { stat: '15 µg/L', desc: '90th percentile action level under the Lead & Copper Rule (system-wide tap sampling)' },
  { stat: '9M+', desc: 'estimated lead service lines still in use in the US (EPA estimates)' },
  { stat: '1986', desc: 'Safe Drinking Water Act banned new lead pipes & high-lead solder; older buildings still at risk' },
];

const PATHWAYS = [
  {
    name: 'Lead service lines (LSL)',
    icon: '🔗',
    desc: 'The pipe connecting your home to the water main may be lead — especially in pre-1950 construction and many Midwest / Northeast cities. When water sits in the line or chemistry changes, lead can dissolve into tap water.',
  },
  {
    name: 'Galvanized iron plumbing',
    icon: '⚙️',
    desc: 'Old galvanized pipes can accumulate lead particles released upstream and release them later. They are treated like lead service lines under modern inventory rules.',
  },
  {
    name: 'Lead solder & brass fixtures',
    icon: '🚰',
    desc: 'Lead solder was legal until 1986. “Lead-free” brass fixtures can still contain small amounts of lead that can leach, especially with soft or acidic water.',
  },
  {
    name: 'Building plumbing — not the treatment plant',
    icon: '🏠',
    desc: 'Treatment plants reduce corrosion, but lead at your tap usually comes from pipes and fixtures on the way to your glass — which is why your home’s age and your utility’s service line inventory matter.',
  },
];

const HEALTH = [
  { who: 'Infants & children', detail: 'Irreversible effects on brain development, learning, and behavior — even at low levels that don’t change taste or color.' },
  { who: 'Pregnancy', detail: 'Lead crosses the placenta; maternal exposure can affect fetal development.' },
  { who: 'Adults', detail: 'Cardiovascular effects, kidney harm, and reproductive risks increase with chronic exposure.' },
];

const FILTERS = [
  {
    rank: 1,
    name: 'Waterdrop G3P800 Under-Sink RO',
    brand: 'Waterdrop',
    price: '~$369',
    badge: 'STRONGEST REMOVAL',
    badgeColor: '#0891b2',
    why: 'Reverse osmosis is the most reliable residential technology for lead — membranes block dissolved lead along with many other metals. NSF/ANSI 58 certified systems are the standard to look for.',
    cert: 'NSF/ANSI 42, 53, 58, 372',
    link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb',
    amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20',
  },
  {
    rank: 2,
    name: 'Clearly Filtered 3.5L Pitcher',
    brand: 'Clearly Filtered',
    price: '~$90',
    badge: 'BEST PITCHER',
    badgeColor: '#059669',
    why: 'Independently certified for lead reduction well beyond basic carbon pitchers — a practical option if you cannot install under-sink RO.',
    cert: 'NSF/ANSI 42, 53, 244, 401, P473',
    link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher',
    amazon: 'https://www.amazon.com/dp/B076B6FXT5?tag=watercheck20-20',
  },
  {
    rank: 3,
    name: 'Aquasana SmartFlow RO',
    brand: 'Aquasana',
    price: '~$449',
    badge: 'MOST CERTIFIED',
    badgeColor: '#d97706',
    why: 'WQA Gold Seal plus multiple NSF standards — strong choice if you want maximum documented contaminant coverage including lead.',
    cert: 'NSF/ANSI 42, 53, 58, 401 + WQA Gold Seal',
    link: 'https://www.aquasana.com/under-sink-water-filters',
    amazon: 'https://www.amazon.com/dp/B0CHZ8VQBB?tag=watercheck20-20',
  },
];

const CITIES_HIGH_LSL = [
  'Chicago', 'Detroit', 'Cleveland', 'Milwaukee', 'Pittsburgh',
  'Philadelphia', 'Baltimore', 'Newark', 'Washington DC', 'Buffalo',
];

export default function LeadPage() {
  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check My ZIP →" />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 100px' }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: 2, marginBottom: 12 }}>LEAD IN DRINKING WATER</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 16px' }}>
            Lead in Tap Water — What It Is, How It Gets In, and What Actually Removes It
          </h1>
          <p style={p}>
            Lead is invisible, tasteless, and odorless. It usually does <strong style={{ color: '#e2e8f0' }}>not</strong> come from the river or reservoir — it leaches from
            <strong style={{ color: '#e2e8f0' }}> lead service lines, older building plumbing, and fixtures</strong> on the way to your tap.
            The EPA&apos;s health goal for lead in drinking water is <strong style={{ color: '#e2e8f0' }}>zero</strong>.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {LEAD_FACTS.map(f => (
              <div key={f.stat} style={{ flex: '1 1 160px', padding: '14px 16px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#fcd34d', marginBottom: 4 }}>{f.stat}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <Link href="/" style={{ display: 'inline-block', padding: '12px 24px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 9, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Check Your ZIP for Lead (EPA LCR Data) →
          </Link>
        </div>

        <div style={{ marginBottom: 48, padding: '24px 26px', background: 'linear-gradient(135deg,#0a1e35,#071525)', border: '1px solid #1a3a5c', borderRadius: 14 }}>
          <span style={label}>WHAT YOUR WATERCHECKUP REPORT SHOWS</span>
          <h2 style={h2}>Lead tap sampling &amp; your utility</h2>
          <p style={p}>
            For public water systems, we pull <strong style={{ color: '#e2e8f0' }}>Lead and Copper Rule (LCR) sample results</strong> from EPA Envirofacts when available —
            so you can see recent system-level tap sampling tied to your ZIP&apos;s water system (not a lab test of your kitchen tap).
          </p>
          <p style={{ ...p, margin: 0 }}>
            Utilities also maintain <strong style={{ color: '#e2e8f0' }}>service line inventories</strong> (lead, non-lead, or unknown) under federal rules.
            Check your utility&apos;s public map or consumer confidence report (CCR) for whether <em>your</em> line is lead — that&apos;s separate from our EPA sample pull but essential context.
          </p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <span style={label}>HOW LEAD ENTERS TAP WATER</span>
          <h2 style={h2}>Pathways from the street to your glass</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PATHWAYS.map(x => (
              <div key={x.name} style={{ display: 'flex', gap: 14, padding: '14px 18px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{x.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{x.name}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>{x.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <span style={label}>HEALTH EFFECTS</span>
          <h2 style={h2}>Why there is no “safe” lead level</h2>
          <p style={p}>Health agencies treat lead as a cumulative hazard — small exposures add up over time. The priority populations are children and pregnant people.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {HEALTH.map(h => (
              <div key={h.who} style={{ padding: '14px 16px', background: '#0d2240', border: '1px solid rgba(245,158,11,0.25)', borderLeft: '3px solid #f59e0b', borderRadius: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fcd34d', marginBottom: 4 }}>{h.who}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{h.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 48, padding: '24px 26px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 14 }}>
          <span style={{ ...label, color: '#f59e0b' }}>LEAD &amp; COPPER RULE (BASICS)</span>
          <h2 style={h2}>Action level vs. the health goal</h2>
          <p style={p}>
            The <strong style={{ color: '#e2e8f0' }}>15 µg/L (ppb) “action level”</strong> applies to a statistical measure of utility tap samples (the 90th percentile), not to every individual tap every day.
            If a system exceeds it, corrosion control and other responses are triggered — but <strong style={{ color: '#e2e8f0' }}>your tap can still have lead</strong> if you have a lead service line or lead-bearing plumbing, even when the system is “in compliance.”
          </p>
          <p style={{ ...p, margin: 0 }}>
            EPA has proposed strengthening the Lead and Copper Rule over time (sampling, line replacement timelines, and communication). Always read your utility&apos;s latest CCR for local status.
          </p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <span style={label}>CITIES WITH DOCUMENTED LSL CHALLENGES</span>
          <h2 style={h2}>Where lead service lines are a known national issue</h2>
          <p style={p}>
            Many systems still have large inventories of lead or unknown service lines. Replacement programs are underway nationwide, but progress varies by city.
            This is not an exhaustive list — your utility inventory is the source of truth.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CITIES_HIGH_LSL.map(c => (
              <span key={c} style={{ padding: '6px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 6, fontSize: 13, color: '#fcd34d', fontWeight: 600 }}>{c}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <span style={label}>WHAT REMOVES LEAD</span>
          <h2 style={h2}>Certified filters — not guesswork</h2>
          <p style={p}>
            Boiling <strong style={{ color: '#e2e8f0' }}>does not</strong> remove lead. Look for <strong style={{ color: '#e2e8f0' }}>NSF/ANSI 53</strong> (certified lead reduction) for carbon systems, or <strong style={{ color: '#e2e8f0' }}>NSF/ANSI 58</strong> for reverse osmosis.
            Replace cartridges on schedule — expired filters lose performance.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FILTERS.map((f, i) => (
              <div key={f.rank} style={{ padding: '18px 20px', background: i === 0 ? 'rgba(8,145,178,0.07)' : '#0d2240', border: i === 0 ? '1px solid rgba(8,145,178,0.35)' : '1px solid #1a3a5c', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: '#94a3b8' }}>#{f.rank}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{f.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, background: f.badgeColor, color: '#fff', padding: '2px 8px', borderRadius: 4 }}>{f.badge}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>{f.brand} · {f.price} · {f.cert}</div>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{f.why}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    <a href={f.link} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', padding: '9px 16px', background: i === 0 ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240', color: i === 0 ? '#fff' : '#94a3b8', textDecoration: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, textAlign: 'center', border: i === 0 ? 'none' : '1px solid #1a3a5c' }}>Buy Direct →</a>
                    <a href={f.amazon} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', padding: '9px 16px', background: '#0d2240', color: '#94a3b8', textDecoration: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, textAlign: 'center', border: '1px solid #1a3a5c' }}>Amazon →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 48, padding: '28px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #f59e0b', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: 2, marginBottom: 10 }}>FREE ZIP LOOKUP</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>See lead-related data for your water system</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 20px' }}>
            Enter your ZIP for a full report — including Lead and Copper Rule sample results when published for your system, open violations, and filter picks matched to your water.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 10, color: '#0f172a', fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>

        <div style={{ marginBottom: 48 }}>
          <span style={label}>FREQUENTLY ASKED QUESTIONS</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: 'Does boiling water remove lead?', a: 'No. Boiling does not remove lead and can concentrate contaminants if water evaporates. Use a certified filter or bottled water from a trusted source, or fix the lead source (line replacement).' },
              { q: 'Does a Brita filter remove lead?', a: 'Some Brita filters are certified for lead reduction for specific standards — check the exact model and its NSF certification listing. Many basic pitchers are not sufficient for high lead risk. NSF/ANSI 53 (lead) or NSF/ANSI 58 (RO) are the certifications to verify.' },
              { q: 'If my utility is “in compliance,” can I still have lead?', a: 'Yes. Compliance is based on system-wide sampling protocols. Lead is highly localized to plumbing and service lines. A lead gooseneck or lead service line at your property can cause exposure even when the system passes LCR sampling.' },
              { q: 'How do I know if I have a lead service line?', a: 'Check your utility’s public service line inventory or map, or inspection guidance they publish. Many utilities offer verification or replacement programs. Your WaterCheckup ZIP report summarizes EPA data for your system but cannot see your private plumbing.' },
              { q: 'Should I test my own tap water?', a: 'If you are pregnant, have young children, or suspect a lead line, a certified lab test of your tap is the most direct answer for your home. Public data is a strong starting point but is not a substitute for sampling your own tap in high-risk situations.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{q}</div>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span style={label}>RELATED GUIDES</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { href: '/pfas', label: 'PFAS in Drinking Water — EPA Limits & Best Filters' },
              { href: '/well', label: 'Well Water Filter Guide — Private Well Risks by State' },
              { href: '/blog/best-water-filter-for-lead-removal', label: 'Blog: Best Water Filters for Lead Removal' },
              { href: '/contaminants', label: 'Water Contaminant Guide' },
              { href: '/', label: 'Check Your ZIP — Full EPA Water Report' },
            ].map(({ href, label: lbl }) => (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 8, textDecoration: 'none', color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
                {lbl} <span style={{ color: '#0891b2' }}>→</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

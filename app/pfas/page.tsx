import type { Metadata } from 'next';
import Link from 'next/link';
import { GuideHero } from '@/components/GuideHero';
import { PFAS_PAGE_HERO, PFAS_PAGE_HERO_ALT } from '@/lib/unsplash-images';
import { SiteHeader } from '../components/SiteHeader';

export const metadata: Metadata = {
  title: 'PFAS in Drinking Water — What It Is, Where It Is, and How to Remove It | WaterCheckup',
  description: 'PFAS "forever chemicals" are detected in 45% of US tap water. Find out if your water is affected, what the health risks are, and which filters actually remove PFAS. Free EPA data lookup.',
  alternates: { canonical: 'https://watercheckup.com/pfas' },
  openGraph: {
    title: 'PFAS in Drinking Water | WaterCheckup',
    description: 'PFAS detected in 45% of US tap water. Check your ZIP code free — EPA PFAS testing data for your exact water system.',
    images: [{ url: 'https://watercheckup.com/api/og?city=PFAS+Guide&score=&grade=&violations=', width: 1200, height: 630 }],
  },
};

const p = { fontSize: 15, color: '#94a3b8', lineHeight: 1.8, margin: '0 0 16px' } as React.CSSProperties;
const h2 = { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px' } as React.CSSProperties;
const label = { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#0891b2', marginBottom: 10, display: 'block' } as React.CSSProperties;

const PFAS_FACTS = [
  { stat: '45%', desc: 'of US tap water contains detectable PFAS — USGS 2023 study' },
  { stat: '12,000+', desc: 'individual PFAS compounds exist. EPA regulates 6.' },
  { stat: '4 ppt', desc: 'EPA\'s 2024 MCL for PFOA and PFOS — the strictest ever set' },
  { stat: '6,151', desc: 'water systems tested in the 2023-2025 federal PFAS monitoring program' },
];

const PFAS_SOURCES = [
  { name: 'Military bases & airports', icon: '✈️', desc: 'PFAS-containing firefighting foam (AFFF) used at military installations and civilian airports has contaminated groundwater across the US. This is the single largest source of PFAS in drinking water.' },
  { name: 'Industrial manufacturing', icon: '🏭', desc: 'Chemical plants, semiconductor manufacturers, and textile mills that use or produce PFAS compounds have contaminated water systems downwind and downstream.' },
  { name: 'Landfills', icon: '🗑️', desc: 'PFAS-containing products — nonstick cookware, food packaging, waterproof clothing — end up in landfills where PFAS leaches into groundwater.' },
  { name: 'Agriculture', icon: '🌾', desc: 'PFAS-contaminated sewage sludge applied to farmland as fertilizer has spread contamination into agricultural groundwater across many states.' },
  { name: 'Firefighting foam', icon: '🧯', desc: 'Local fire departments that trained with AFFF foam have contaminated wells and water systems near training sites across the country.' },
];

const HEALTH_EFFECTS = [
  { effect: 'Cancer', detail: 'Kidney cancer and testicular cancer are most strongly linked to PFAS exposure. Bladder cancer risk is also elevated.' },
  { effect: 'Thyroid disease', detail: 'PFAS interfere with thyroid hormone production and regulation, affecting metabolism, energy, and development.' },
  { effect: 'Immune system suppression', detail: 'PFAS reduce vaccine effectiveness and overall immune response, particularly in children.' },
  { effect: 'Developmental harm', detail: 'Exposure during pregnancy and early childhood affects fetal development, birth weight, and neurological development.' },
  { effect: 'High cholesterol', detail: 'PFAS disrupt lipid metabolism, consistently linked to elevated cholesterol levels in exposed populations.' },
  { effect: 'Liver damage', detail: 'PFAS accumulate in the liver and are linked to elevated liver enzymes and non-alcoholic fatty liver disease.' },
];

type FilterPick = {
  rank: number;
  name: string;
  brand: string;
  price: string;
  removal?: string;
  badge: string;
  badgeColor: string;
  why: string;
  cert: string;
  /** Waterdrop only — other brands are Amazon-only. */
  directLink?: string;
  amazon: string;
};

const FILTERS: FilterPick[] = [
  {
    rank: 1,
    name: 'Waterdrop G3P800 Under-Sink RO',
    brand: 'Waterdrop',
    price: '~$849',
    removal: '>99%',
    badge: 'EDITORS PICK',
    badgeColor: '#0891b2',
    why: 'Reverse osmosis is the gold standard for PFAS removal — the only residential technology proven to remove PFAS at >99%. The G3P800 is NSF 58 certified, tankless, 800 GPD, and removes PFOA, PFOS, GenX, and all 6 EPA-regulated PFAS compounds.',
    cert: 'NSF/ANSI 42, 53, 58, 372',
    directLink: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb',
    amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20',
  },
  {
    rank: 2,
    name: 'Aquasana SmartFlow RO',
    brand: 'Aquasana',
    price: '~$449',
    removal: '>99%',
    badge: 'MOST CERTIFIED',
    badgeColor: '#d97706',
    why: 'WQA Gold Seal plus NSF 42, 53, 58, and 401 — the most certifications of any under-sink RO on the market. Removes PFAS, microplastics, and 90+ contaminants.',
    cert: 'NSF/ANSI 42, 53, 58, 401 + WQA Gold Seal',
    amazon: 'https://www.amazon.com/dp/B0CHZ8VQBB?tag=watercheck20-20',
  },
  {
    rank: 3,
    name: 'Clearly Filtered 3.5L Pitcher',
    brand: 'Clearly Filtered',
    price: '~$90',
    removal: '>99.9%',
    badge: 'BEST PITCHER',
    badgeColor: '#059669',
    why: 'The only pitcher certified to remove PFAS at 99.9%. NSF certified against 365+ contaminants. Best option for renters or anyone who can\'t install an under-sink system.',
    cert: 'NSF/ANSI 42, 53, 244, 401, P473',
    amazon: 'https://www.amazon.com/dp/B076B6FXT5?tag=watercheck20-20',
  },
];

const STATES_HIGH_RISK = [
  'Michigan', 'New York', 'California', 'Colorado', 'Texas',
  'North Carolina', 'New Jersey', 'Pennsylvania', 'Ohio', 'Illinois',
  'Alabama', 'Georgia', 'Florida', 'Massachusetts', 'Virginia',
];

export default function PfasPage() {
  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check My ZIP →" />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 100px' }}>

        <div style={{ marginBottom: 48 }}>
          <GuideHero
            src={PFAS_PAGE_HERO}
            alt={PFAS_PAGE_HERO_ALT}
            eyebrow="PFAS FOREVER CHEMICALS"
            title="PFAS in Drinking Water — What It Is, Where It Is, and What Removes It"
            badge="EPA 2024 federal limits in effect"
            badgeColor="#ef4444"
          />
          <p style={p}>
            PFAS — per- and polyfluoroalkyl substances — are a group of over 12,000 synthetic chemicals that don&apos;t break down in the environment or your body.
            They&apos;ve been manufactured since the 1940s and are now found in the drinking water of an estimated
            <strong style={{ color: '#e2e8f0' }}> 200 million Americans</strong>.
            In 2023 the USGS found PFAS in 45% of US tap water samples. In 2024 the EPA set the first-ever legally enforceable limits.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {PFAS_FACTS.map(f => (
              <div key={f.stat} style={{ flex: '1 1 160px', padding: '14px 16px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#fca5a5', marginBottom: 4 }}>{f.stat}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <Link href="/" style={{ display: 'inline-block', padding: '12px 24px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 9, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Check Your ZIP Code for PFAS →
          </Link>
        </div>

        {/* What are PFAS */}
        <div style={{ marginBottom: 48, padding: '24px 26px', background: 'linear-gradient(135deg,#0a1e35,#071525)', border: '1px solid #1a3a5c', borderRadius: 14 }}>
          <span style={label}>WHAT ARE PFAS?</span>
          <h2 style={h2}>Why they&apos;re called &quot;forever chemicals&quot;</h2>
          <p style={p}>PFAS stands for per- and polyfluoroalkyl substances. The name comes from the carbon-fluorine bond — the strongest bond in organic chemistry. That bond is why PFAS don&apos;t break down. Not in soil. Not in water. Not in your body. They accumulate over a lifetime of exposure.</p>
          <p style={p}>They were invented in the 1940s and put into everything: nonstick cookware, waterproof clothing, food packaging, firefighting foam, stain-resistant carpet, and hundreds of industrial processes. Decades of production and disposal have put PFAS into groundwater, rivers, and tap water across every state.</p>
          <p style={{ ...p, margin: 0 }}>The EPA regulates 6 PFAS compounds. Over 12,000 exist. Most have never been tested in drinking water. The 45% contamination figure only covers the ones we know to look for.</p>
        </div>

        {/* Sources */}
        <div style={{ marginBottom: 48 }}>
          <span style={label}>WHERE PFAS COMES FROM</span>
          <h2 style={h2}>How PFAS gets into drinking water</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PFAS_SOURCES.map(s => (
              <div key={s.name} style={{ display: 'flex', gap: 14, padding: '14px 18px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health effects */}
        <div style={{ marginBottom: 48 }}>
          <span style={label}>HEALTH EFFECTS</span>
          <h2 style={h2}>What PFAS does to your body</h2>
          <p style={p}>PFAS accumulate in blood and organs over time. Health effects are linked to long-term low-level exposure, not single acute events. The science has strengthened considerably since 2015.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {HEALTH_EFFECTS.map(h => (
              <div key={h.effect} style={{ padding: '14px 16px', background: '#0d2240', border: '1px solid rgba(239,68,68,0.2)', borderLeft: '3px solid #ef4444', borderRadius: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fca5a5', marginBottom: 4 }}>{h.effect}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{h.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EPA 2024 rule */}
        <div style={{ marginBottom: 48, padding: '24px 26px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14 }}>
          <span style={{ ...label, color: '#ef4444' }}>EPA 2024 PFAS RULE</span>
          <h2 style={h2}>The first legally enforceable PFAS limits in US history</h2>
          <p style={p}>In April 2024, the EPA finalized the first-ever legally enforceable Maximum Contaminant Levels (MCLs) for PFAS in drinking water:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            {[
              { compound: 'PFOA', limit: '4 ppt', note: 'The health goal is actually zero' },
              { compound: 'PFOS', limit: '4 ppt', note: 'The health goal is actually zero' },
              { compound: 'PFNA', limit: '10 ppt', note: 'Newly regulated 2024' },
              { compound: 'PFHxS', limit: '10 ppt', note: 'Newly regulated 2024' },
              { compound: 'HFPO-DA (GenX)', limit: '10 ppt', note: 'Newly regulated 2024' },
              { compound: 'PFBS mixture', limit: '1 (hazard index)', note: 'Combined limit' },
            ].map(c => (
              <div key={c.compound} style={{ flex: '1 1 120px', padding: '10px 14px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#ef4444' }}>{c.compound}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#f1f5f9' }}>{c.limit}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{c.note}</div>
              </div>
            ))}
          </div>
          <p style={{ ...p, margin: 0 }}>Water systems have until 2027 to comply. Many systems that currently exceed these limits are still legally operating. Enter your ZIP to see if your system has PFAS detected above the new MCLs.</p>
        </div>

        {/* High risk states */}
        <div style={{ marginBottom: 48 }}>
          <span style={label}>HIGHEST RISK STATES</span>
          <h2 style={h2}>Where PFAS contamination is most documented</h2>
          <p style={p}>PFAS contamination has been found in all 50 states, but these states have the highest documented levels based on EPA monitoring data and state testing programs:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {STATES_HIGH_RISK.map(state => (
              <span key={state} style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, fontSize: 13, color: '#fca5a5', fontWeight: 600 }}>{state}</span>
            ))}
          </div>
          <p style={{ ...p, marginTop: 14, marginBottom: 0, fontSize: 13 }}>Risk is especially elevated near military bases, airports, chemical plants, and industrial manufacturing sites regardless of state.</p>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 48 }}>
          <span style={label}>WHAT ACTUALLY REMOVES PFAS</span>
          <h2 style={h2}>The only filters proven to remove PFAS</h2>
          <p style={p}>Not all filters remove PFAS. Standard carbon pitcher filters (Brita, PUR) do not remove PFAS effectively. Reverse osmosis and certified activated carbon block filters are the only residential technologies with documented PFAS removal.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FILTERS.map(f => (
              <div key={f.rank} style={{ padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: '#94a3b8' }}>#{f.rank}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{f.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, background: f.badgeColor, color: '#fff', padding: '2px 8px', borderRadius: 4 }}>{f.badge}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>{f.brand} · {f.price} · PFAS removal: {f.removal} · {f.cert}</div>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{f.why}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    {f.brand === 'Waterdrop' && f.directLink ? (
                      <a href={f.directLink} target="_blank" rel="noopener noreferrer sponsored"
                        style={{ display: 'block', padding: '9px 16px', background: '#0d2240', color: '#94a3b8', textDecoration: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, textAlign: 'center', border: '1px solid #1a3a5c' }}>Buy direct →</a>
                    ) : null}
                    <a href={f.amazon} target="_blank" rel="noopener noreferrer sponsored"
                      style={{ display: 'block', padding: '9px 16px', background: '#0d2240', color: '#94a3b8', textDecoration: 'none', borderRadius: 7, fontSize: 12, fontWeight: f.brand === 'Waterdrop' && f.directLink ? 600 : 700, textAlign: 'center', border: '1px solid #1a3a5c' }}>Amazon →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: '14px 16px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 8, fontSize: 12, color: '#94a3b8' }}>
            ⚠ Filters labeled &quot;NSF certified&quot; without a specific standard number do not necessarily remove PFAS. Look for NSF/ANSI 58 (RO) or NSF/ANSI P473 (PFOA/PFOS specific) on the certification label.
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginBottom: 48, padding: '28px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #ef4444', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>CHECK YOUR WATER</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>Is PFAS in your tap water?</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 20px' }}>Enter your ZIP to see the EPA PFAS testing results for your exact water system — from the 2023-2025 federal monitoring program covering 6,151 systems nationwide.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 48 }}>
          <span style={label}>FREQUENTLY ASKED QUESTIONS</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: 'Does boiling water remove PFAS?', a: 'No. Boiling does not remove PFAS — it actually concentrates them by evaporating water while leaving the chemicals behind. The only way to remove PFAS from drinking water is through reverse osmosis, activated carbon block filtration (certified NSF P473), or distillation.' },
              { q: 'Does a Brita filter remove PFAS?', a: 'Standard Brita pitchers with basic carbon filters do not remove PFAS effectively. Brita\'s Longlast+ filter claims some PFAS reduction but is not independently certified to NSF P473. For confirmed PFAS removal, use a filter certified to NSF/ANSI 58 (RO) or NSF/ANSI P473.' },
              { q: 'What is the safe level of PFAS in drinking water?', a: 'The EPA\'s 2024 MCL is 4 parts per trillion (ppt) for PFOA and PFOS individually. However, the EPA\'s own Maximum Contaminant Level Goal (MCLG) — the health-ideal level — is zero for both. There is no established safe level of PFAS exposure. EWG recommends 1 ppt as a health guideline.' },
              { q: 'How do I know if my water has PFAS?', a: 'Enter your ZIP code at watercheckup.com to see the federal PFAS testing results for your specific water system. The EPA tested 6,151 systems in 2023-2025 under the UCMR5 monitoring program. If your system was tested and PFAS was detected, it will show in your report. Well water owners need a certified lab test — well water is not included in the federal monitoring.' },
              { q: 'Are PFAS in bottled water?', a: 'Yes. Studies have found PFAS in bottled water brands including several major national brands. Bottled water is regulated as a food product under the FDA, which has not yet set PFAS limits for bottled water. A reverse osmosis system at home produces water that is generally cleaner and cheaper than bottled water.' },
              { q: 'Does reverse osmosis remove PFAS?', a: 'Yes. NSF/ANSI 58–certified reverse osmosis systems are designed to reduce a wide range of contaminants, including PFAS, by forcing water through a semipermeable membrane. Performance depends on the specific system and maintenance — replace prefilters and the RO membrane on the schedule the manufacturer recommends.' },
              { q: 'Do refrigerator or faucet filters remove PFAS?', a: 'Most OEM refrigerator filters and basic faucet-mount filters target taste, odor, and chlorine. They are not a substitute for NSF/ANSI 58 (RO) or certified carbon-block systems tested for PFAS. Check the label for explicit NSF standards (58, 53 with lead/PFAS claims, or P473) — marketing language like “reduces contaminants” is not enough.' },
              { q: 'What is the difference between PFOA, PFOS, and GenX?', a: 'PFOA and PFOS are two of the best-studied “long-chain” PFAS historically used in nonstick coatings and firefighting foam. GenX (HFPO-DA) is a newer replacement chemistry. The EPA now regulates six PFAS in drinking water, including PFOA, PFOS, and GenX, because each has distinct chemistry but similar persistence in water and the environment.' },
              { q: 'Can you absorb PFAS from showering or bathing?', a: 'Drinking water is the main exposure route regulators focus on for municipal systems. Dermal absorption from short showers is thought to be minor compared with ingestion, but hot showers aerosolize water — if you have elevated PFAS, a whole-house or shower filter may reduce exposure for sensitive groups. For drinking and cooking, treat at the point of use with certified filtration.' },
              { q: 'Do water softeners remove PFAS?', a: 'No. Ion-exchange water softeners swap calcium and magnesium for sodium (or potassium) to reduce hardness. They are not designed to remove PFAS. Some whole-house systems combine softening with other media — only components certified for PFAS or RO at the kitchen tap should be relied on for drinking water.' },
              { q: 'Is well water safer from PFAS than city water?', a: 'Not automatically. Wells can be contaminated by septic systems, landfills, firefighting training sites, biosolids on farmland, or industrial plumes — all documented PFAS sources. City water is tested under federal programs; private wells are not. If you use a well near a known contamination corridor, lab testing (EPA Method 533 or 537.1) is the only way to know.' },
              { q: 'How long do PFAS stay in the body?', a: 'Elimination half-lives vary by compound — on the order of years for some legacy PFAS in blood. That is why they are called “forever chemicals”: they clear slowly and can accumulate with ongoing exposure. Reducing intake from water and dust helps; the science on reversing long-term body burden is still evolving.' },
              { q: 'What do NSF/ANSI 58 and P473 mean on a filter label?', a: 'NSF/ANSI 58 certifies reverse osmosis systems for structural integrity and contaminant reduction claims the certifier validates. NSF/ANSI P473 specifically covers PFOA and PFOS reduction in drinking water treatment devices. Always read which standard applies — a pitcher certified to P473 is not the same as an under-sink RO certified to 58.' },
              { q: 'Does distillation remove PFAS?', a: 'Distillation can remove many non-volatile contaminants, including PFAS, because they are left behind when water vapor condenses. Practical downsides include energy use, maintenance, and taste. If you choose distillation, use equipment designed for drinking water and follow cleaning instructions so residues do not build up.' },
              { q: 'Should I worry about PFAS if my utility is "in compliance"?', a: 'Legal compliance means your system meets EPA enforceable limits on the schedule the rule requires — it does not mean zero PFAS. Many systems show detections below the new MCLs, or were not yet in violation when data were published. Your ZIP-level report shows what was measured, not just pass/fail language from a brochure.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{q}</div>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        <div>
          <span style={label}>RELATED GUIDES</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { href: '/lead', label: 'Lead in Tap Water — EPA Data, Health Risks, and Best Filters' },
              { href: '/well', label: 'Well Water Filter Guide — Unregulated Risks by State' },
              { href: '/contaminants', label: 'Water Contaminant Guide — Every Major Contaminant Explained' },
              { href: '/quiz', label: 'Take the Filter Quiz — Get Matched to the Right System' },
              { href: '/', label: 'Check Your ZIP Code — Full EPA Water Report' },
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

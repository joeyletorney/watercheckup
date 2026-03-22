'use client';
import { useState } from 'react';

const CONTAMINANTS = [
  {
    name: 'Lead', symbol: 'Pb', category: 'Heavy Metal', severity: 'critical',
    epaLimit: '15 ppb (action level)', healthGoal: 'Zero — no safe level',
    what: 'A toxic heavy metal that leaches into drinking water primarily from aging lead service lines, lead solder (common in homes built before 1986), and brass fixtures. Lead does not come from the water source itself — it enters the water after it leaves the treatment plant.',
    sources: ['Lead service lines connecting homes to the main water supply', 'Lead solder used in plumbing before 1986', 'Brass faucets and fixtures', 'Corroded indoor plumbing in older homes'],
    healthEffects: ['Irreversible brain and nervous system damage in children', 'Reduced IQ, learning disabilities, and behavioral problems', 'Kidney and cardiovascular damage in adults', 'Developmental delays and growth problems in infants', 'No safe level of exposure has ever been established'],
    removes: ['Reverse Osmosis — removes >99%', 'NSF/ANSI 53 certified carbon block filters', 'NSF/ANSI 58 certified RO systems', 'Distillation'],
    color: '#ef4444', icon: '☠️',
  },
  {
    name: 'PFAS', symbol: 'PFOA/PFOS', category: 'Forever Chemicals', severity: 'critical',
    epaLimit: '4 ppt (EPA 2024 rule)', healthGoal: '4 ppt (PFOA & PFOS individually)',
    what: 'Per- and polyfluoroalkyl substances (PFAS) are a group of over 12,000 man-made chemicals used in non-stick cookware coatings, firefighting foam (AFFF), food packaging, stain-resistant fabrics, and industrial processes. They earned the name "forever chemicals" because they don\'t break down in the environment or the human body.',
    sources: ['Military bases and airports using firefighting foam (AFFF)', 'Industrial facilities and chemical plants', 'Non-stick cookware and food packaging manufacturing', 'Landfills receiving PFAS-containing products', 'Agricultural use of PFAS-contaminated sludge as fertilizer'],
    healthEffects: ['Kidney and testicular cancer', 'Thyroid disease and hormone disruption', 'Immune system suppression (reduced vaccine effectiveness)', 'High cholesterol and cardiovascular disease', 'Developmental problems in children and infants', 'Liver damage'],
    removes: ['Reverse Osmosis — removes >99%', 'Granular Activated Carbon (GAC) — removes 60–90%', 'High-pressure membrane filtration', 'Waterdrop G3P800 & iSpring RCC7AK specifically tested for PFAS'],
    color: '#f97316', icon: '🧪',
  },
  {
    name: 'Chlorine', symbol: 'Cl₂', category: 'Disinfectant Byproduct', severity: 'moderate',
    epaLimit: '4 mg/L (4 ppm)', healthGoal: '4 mg/L',
    what: 'Chlorine is intentionally added to municipal water supplies as a disinfectant to kill bacteria, viruses, and other pathogens. While essential for public health, residual chlorine in tap water causes taste and odor issues and reacts with organic matter to form harmful disinfection byproducts (DBPs) like trihalomethanes (THMs).',
    sources: ['Water treatment plants (intentional disinfection)', 'Residual chlorine in distribution pipes', 'Reaction with naturally occurring organic matter in source water'],
    healthEffects: ['Strong taste and odor complaints', 'Skin and eye irritation (especially in showers)', 'Hair damage and dryness from shower exposure', 'Formation of THMs and HAAs (potential carcinogens) as byproducts', 'Respiratory irritation from chlorine vapor in hot showers'],
    removes: ['Activated Carbon filters — removes >95%', 'Reverse Osmosis', 'Whole-house carbon filters (Pelican PC600)', 'Shower filters (AquaBliss SF100, Aquasana AQ-4100)', 'Catalytic carbon for chloramine'],
    color: '#f59e0b', icon: '🔵',
  },
  {
    name: 'Chloramine', symbol: 'NH₂Cl', category: 'Disinfectant', severity: 'moderate',
    epaLimit: '4 mg/L (as Cl₂)', healthGoal: '4 mg/L',
    what: 'Chloramine is formed when water utilities add ammonia to chlorinated water as an alternative disinfectant. It\'s more stable than free chlorine and lasts longer in the distribution system, but it is significantly harder to remove with standard carbon filters and can cause respiratory issues when inhaled in shower steam.',
    sources: ['Municipal water treatment (secondary disinfection)', 'Formed when ammonia reacts with residual chlorine', 'Increasingly common as utilities shift from chlorine to reduce THM formation'],
    healthEffects: ['Respiratory irritation when inhaled as steam', 'Skin rashes and eczema flare-ups', 'Eye and nose irritation', 'Harmful to fish and reptiles (cannot use chloramine water in aquariums)', 'Potentially harmful to dialysis patients'],
    removes: ['Catalytic Activated Carbon (required — standard carbon is not effective)', 'Reverse Osmosis', 'Pelican PC600 whole-house filter (catalytic carbon)', 'Vitamin C shower filters (partial)'],
    color: '#f59e0b', icon: '⚗️',
  },
  {
    name: 'Arsenic', symbol: 'As', category: 'Heavy Metal', severity: 'critical',
    epaLimit: '10 ppb (0.010 mg/L)', healthGoal: 'Zero (MCLG)',
    what: 'Arsenic is a naturally occurring metalloid found in rock and soil formations. It dissolves into groundwater through natural geological processes, and is also released through mining, smelting, and agricultural use of arsenic-based pesticides. It is colorless, odorless, and tasteless — undetectable without testing.',
    sources: ['Natural rock and soil weathering (especially in Western US)', 'Mining and smelting operations', 'Agricultural runoff (older pesticides)', 'Industrial waste and coal ash', 'Naturally high in parts of New England, Midwest, and Southwest'],
    healthEffects: ['Bladder, lung, and skin cancer (long-term exposure)', 'Cardiovascular disease', 'Neurological effects and cognitive impairment', 'Skin lesions and darkening', 'Diabetes and reproductive issues'],
    removes: ['Reverse Osmosis — removes >99%', 'Activated Alumina filters', 'Iron-based media (ferric oxide)', 'Distillation', 'NSF/ANSI 58 certified RO systems'],
    color: '#ef4444', icon: '⚠️',
  },
  {
    name: 'Nitrate', symbol: 'NO₃⁻', category: 'Agricultural Runoff', severity: 'high',
    epaLimit: '10 mg/L (10 ppm)', healthGoal: '10 mg/L',
    what: 'Nitrates are nitrogen-oxygen compounds that enter groundwater primarily from agricultural fertilizers and animal waste. They are a leading cause of water contamination in farming communities across the Midwest and Central US. Nitrates are particularly dangerous for infants under 6 months.',
    sources: ['Agricultural fertilizers and runoff', 'Animal feedlots and manure', 'Septic systems and sewage', 'Natural soil decomposition', 'Industrial waste'],
    healthEffects: ['Blue Baby Syndrome (methemoglobinemia) — life-threatening for infants under 6 months', 'Oxygen deprivation in the blood', 'Potential increased cancer risk with long-term exposure', 'Thyroid disease', 'Adverse pregnancy outcomes'],
    removes: ['Reverse Osmosis — removes >90%', 'Ion Exchange (anion resin)', 'Distillation', 'Note: Standard carbon filters do NOT remove nitrates'],
    color: '#f97316', icon: '🌾',
  },
  {
    name: 'Chromium-6', symbol: 'Cr(VI)', category: 'Industrial Pollutant', severity: 'critical',
    epaLimit: '0.1 mg/L (total chromium)', healthGoal: '0.02 mg/L (CA standard)',
    what: 'Hexavalent chromium (Chromium-6) is a toxic industrial chemical made famous by the Erin Brockovich case in Hinkley, CA. It enters water from industrial discharges, steel manufacturing, and natural geological deposits. The EPA\'s current standard covers total chromium and does not specifically regulate Cr(VI).',
    sources: ['Industrial discharges from steel, leather tanning, and chrome plating', 'Natural geological deposits', 'Coal ash and industrial waste', 'Improper disposal of industrial chemicals'],
    healthEffects: ['Lung, stomach, and nasal cancers', 'Liver and kidney damage', 'Reproductive and developmental harm', 'DNA damage', 'Immune system disruption'],
    removes: ['Reverse Osmosis — removes >95%', 'Strong base anion exchange resin', 'Coagulation and filtration', 'Note: Standard carbon filters are not effective'],
    color: '#ef4444', icon: '🏭',
  },
  {
    name: 'Fluoride', symbol: 'F⁻', category: 'Added Chemical', severity: 'low',
    epaLimit: '4 mg/L (MCL); 2 mg/L (secondary)', healthGoal: '0.7 mg/L (optimal for dental health)',
    what: 'Fluoride is intentionally added to public water supplies at low levels (0.7 mg/L) to prevent tooth decay. At this level it is considered safe. However, excessive fluoride from natural sources in some regions, or from multiple sources of exposure, can cause dental and skeletal fluorosis.',
    sources: ['Municipal water fluoridation (intentional, at 0.7 mg/L)', 'Natural geological deposits (some groundwater)', 'Industrial pollution (rare)'],
    healthEffects: ['At recommended levels: prevents tooth decay', 'Dental fluorosis (white spots/streaking on teeth) from excess exposure in children', 'Skeletal fluorosis (bone and joint damage) from very high long-term exposure', 'Emerging research on thyroid and neurological effects at elevated levels'],
    removes: ['Reverse Osmosis — removes >90%', 'Activated Alumina filters', 'Bone char filters', 'Distillation', 'Note: Standard carbon filters do NOT remove fluoride'],
    color: '#22d3ee', icon: '🦷',
  },
  {
    name: 'Trihalomethanes (THMs)', symbol: 'THMs', category: 'Disinfection Byproduct', severity: 'high',
    epaLimit: '80 ppb (total THMs)', healthGoal: 'As low as possible',
    what: 'Trihalomethanes form when chlorine used to disinfect water reacts with naturally occurring organic matter (decomposed plant material, algae). The four most common THMs are chloroform, bromodichloromethane, dibromochloromethane, and bromoform. They are absorbed through drinking, cooking, and inhalation of shower steam.',
    sources: ['Chemical reaction between chlorine disinfectant and organic matter in water', 'Warm water temperatures accelerate formation', 'Higher levels in surface water systems', 'Shower steam is a significant inhalation exposure route'],
    healthEffects: ['Increased risk of bladder cancer (long-term exposure)', 'Liver and kidney stress', 'Reproductive issues and miscarriage risk', 'Central nervous system effects', 'Greater exposure risk in hot showers than from drinking'],
    removes: ['Activated Carbon filters — highly effective', 'Reverse Osmosis', 'Whole-house carbon systems', 'Shower filters (reduce inhalation exposure significantly)'],
    color: '#f97316', icon: '🧬',
  },
  {
    name: 'Bacteria & E. coli', symbol: 'E. coli', category: 'Microbial', severity: 'critical',
    epaLimit: 'Zero — E. coli must be undetectable', healthGoal: 'Zero (MCLG)',
    what: 'Coliform bacteria, including E. coli, are indicators of fecal contamination in water. Their presence means sewage, animal waste, or other contamination may have entered the water supply. While most coliform bacteria are harmless, E. coli is specifically associated with human and animal feces and can cause serious illness.',
    sources: ['Sewage overflows and leaking septic systems', 'Animal waste runoff (agriculture)', 'Flooding of water infrastructure', 'Aging and cracked distribution pipes', 'Private wells without disinfection'],
    healthEffects: ['Severe gastrointestinal illness (cramps, diarrhea, vomiting)', 'Hemolytic uremic syndrome (HUS) from E. coli O157:H7 — can cause kidney failure', 'Particularly dangerous for elderly, children, and immunocompromised individuals', 'Waterborne disease outbreaks'],
    removes: ['Reverse Osmosis — removes bacteria', 'UV disinfection (most effective for microbial)', 'Ceramic filters with sub-micron pores', 'Boiling (emergency measure)', 'Note: Carbon filters alone do NOT reliably remove bacteria'],
    color: '#ef4444', icon: '🦠',
  },
  {
    name: 'Microplastics', symbol: 'MPs', category: 'Emerging Contaminant', severity: 'moderate',
    epaLimit: 'No EPA limit currently established', healthGoal: 'No established goal',
    what: 'Microplastics are tiny plastic particles less than 5mm in size. They come from the breakdown of larger plastic waste, synthetic fibers from laundry, cosmetic microbeads, and industrial processes. Studies have detected microplastics in tap water worldwide, including in major US cities.',
    sources: ['Breakdown of plastic waste in waterways', 'Synthetic clothing fibers from washing machines', 'Industrial discharge', 'Degradation of plastic pipes and packaging', 'Atmospheric deposition from air pollution'],
    healthEffects: ['Emerging research — long-term effects not yet fully understood', 'May carry toxic chemicals and heavy metals adsorbed to their surface', 'Potential endocrine disruption from plastic additives (phthalates, BPA)', 'Inflammatory responses in tissue', 'Recently found in human blood, lungs, and placentas'],
    removes: ['Reverse Osmosis — removes particles >0.0001 microns', 'Ultrafiltration membranes', 'NSF/ANSI 58 certified RO systems', 'Aquasana (specifically NSF 401 certified for microplastics)'],
    color: '#8b5cf6', icon: '🔬',
  },
  {
    name: 'Copper', symbol: 'Cu', category: 'Heavy Metal', severity: 'moderate',
    epaLimit: '1.3 mg/L (action level)', healthGoal: '1.3 mg/L',
    what: 'Copper enters drinking water primarily from corrosion of household copper plumbing pipes and fittings. It is most problematic in new plumbing (before a protective scale forms) and when water is acidic or low in mineral content (soft water), which is more corrosive to pipes.',
    sources: ['Corrosion of copper plumbing pipes in homes', 'Copper fittings and fixtures', 'More common with soft water or acidic water (low pH)', 'New plumbing installations before protective scale develops'],
    healthEffects: ['Gastrointestinal distress (nausea, vomiting, stomach cramps) at moderate levels', 'Liver and kidney damage from long-term high exposure', 'Wilson\'s disease worsening in genetically susceptible individuals', 'Metallic taste in water'],
    removes: ['Reverse Osmosis — removes >97%', 'NSF/ANSI 53 certified carbon block filters', 'Cation exchange (water softeners)', 'Distillation'],
    color: '#f59e0b', icon: '🪙',
  },
];

const SEV_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  critical: { bg: '#ef444415', text: '#ef4444', border: '#ef444430', label: 'Critical' },
  high:     { bg: '#f9731615', text: '#f97316', border: '#f9731630', label: 'High Risk' },
  moderate: { bg: '#f59e0b15', text: '#f59e0b', border: '#f59e0b30', label: 'Moderate' },
  low:      { bg: '#22d3ee15', text: '#22d3ee', border: '#22d3ee30', label: 'Low Risk' },
};

export default function ContaminantsPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = CONTAMINANTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#091825', color: '#e2e8f0' }}>

      {/* NAV */}
      <div style={{ borderBottom: '1px solid #0f2336', padding: '0 28px', display: 'flex', alignItems: 'center', gap: 16, height: 60, background: '#091825' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 44" width="220" height="44">
            <defs>
              <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0891b2"/>
                <stop offset="100%" stopColor="#06b6d4"/>
              </linearGradient>
              <radialGradient id="dh" cx="38%" cy="28%" r="55%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </radialGradient>
            </defs>
            <path d="M20 2 C20 2 6 15 6 24 C6 31.7 12.3 38 20 38 C27.7 38 34 31.7 34 24 C34 15 20 2 20 2Z" fill="url(#dg)"/>
            <path d="M20 2 C20 2 6 15 6 24 C6 31.7 12.3 38 20 38 C27.7 38 34 31.7 34 24 C34 15 20 2 20 2Z" fill="url(#dh)"/>
            <polyline points="12,24 18,31 28,18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="42" y="30" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="24" fontWeight="800" fill="#f1f5f9">Water</text>
            <text x="106" y="30" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="24" fontWeight="800" fill="#22d3ee">Checkup</text>
          </svg>
        </a>
        <nav style={{ display: 'flex', gap: 4, marginLeft: 24 }}>
          {[['/', 'Home'], ['/contaminants', 'Contaminants'], ['/faq', 'FAQ']].map(([href, label]) => (
            <a key={href} href={href} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 14, fontWeight: href === '/contaminants' ? 700 : 500, color: href === '/contaminants' ? '#22d3ee' : '#64748b' }}>{label}</a>
          ))}
        </nav>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(180deg, #071828 0%, #040d14 100%)', padding: '52px 24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 3, marginBottom: 12 }}>EPA DATA · HEALTH RESEARCH · INDEPENDENT TESTING</div>
        <h1 style={{ fontSize: 38, fontWeight: 900, color: '#f1f5f9', marginBottom: 14 }}>Water Contaminant Guide</h1>
        <p style={{ fontSize: 17, color: '#64748b', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
          What each contaminant is, where it comes from, what it does to your body, and exactly what removes it — based on EPA data and independent research.
        </p>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search contaminants (e.g. Lead, PFAS, Chlorine...)"
          style={{ width: '100%', maxWidth: 460, padding: '14px 18px', background: '#0d2545', border: '1px solid #0f2d40', borderRadius: 10, color: '#f1f5f9', fontSize: 15, outline: 'none' }}
        />
      </div>

      {/* GRID */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '16px 20px 80px' }}>
        <div style={{ fontSize: 13, color: '#334155', marginBottom: 20 }}>Showing {filtered.length} of {CONTAMINANTS.length} contaminants</div>

        {filtered.map(c => {
          const sev = SEV_COLORS[c.severity];
          const isOpen = open === c.name;
          return (
            <div key={c.name} style={{ background: '#0d2240', border: '1px solid #0f2336', borderRadius: 14, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 16px #00000044' }}>

              {/* Summary row — always visible */}
              <button
                onClick={() => setOpen(isOpen ? null : c.name)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: 28, flexShrink: 0 }}>{c.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{c.symbol}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: sev.bg, color: sev.text, border: `1px solid ${sev.border}` }}>{sev.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: '#475569' }}>{c.category}</span>
                    <span style={{ fontSize: 13, color: '#334155' }}>EPA Limit: <strong style={{ color: '#94a3b8' }}>{c.epaLimit}</strong></span>
                  </div>
                </div>
                <span style={{ fontSize: 18, color: '#334155', flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ padding: '0 22px 24px', borderTop: '1px solid #0f2336' }}>
                  <div style={{ paddingTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>

                    <Section title="What Is It?" color={c.color}>
                      <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75 }}>{c.what}</p>
                    </Section>

                    <Section title="Where Does It Come From?" color={c.color}>
                      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {c.sources.map(s => <li key={s} style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>{s}</li>)}
                      </ul>
                    </Section>

                    <Section title="Health Effects" color="#ef4444">
                      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {c.healthEffects.map(h => <li key={h} style={{ fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>{h}</li>)}
                      </ul>
                    </Section>

                    <Section title="What Removes It?" color="#22d3ee">
                      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {c.removes.map(r => <li key={r} style={{ fontSize: 14, color: '#67e8f9', lineHeight: 1.6 }}>{r}</li>)}
                      </ul>
                    </Section>
                  </div>

                  <div style={{ marginTop: 18, padding: '12px 16px', background: '#091825', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <span style={{ fontSize: 13, color: '#475569' }}>Health goal (MCLG): <strong style={{ color: '#94a3b8' }}>{c.healthGoal}</strong></span>
                    <a href="/" style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 7, color: '#fff', fontSize: 13, fontWeight: 700 }}>
                      Check My Water for {c.name} →
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#091825', borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>{title}</div>
      {children}
    </div>
  );
}

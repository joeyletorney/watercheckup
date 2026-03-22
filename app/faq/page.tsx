'use client';
import { useState } from 'react';

const FAQS = [
  {
    category: 'Understanding Your Water',
    items: [
      {
        q: 'Is my tap water safe to drink?',
        a: 'Most U.S. tap water meets EPA legal standards — but "meeting standards" is not the same as being free of contaminants. EPA limits are set based on what\'s technically and economically feasible to achieve, not always what\'s safest for health. The EPA\'s own Maximum Contaminant Level Goals (MCLGs), which represent the health-ideal level, are often zero for the same contaminants that have a non-zero legal limit. Independent organizations like the Environmental Working Group (EWG) regularly find contaminants in compliant tap water at levels above what independent health scientists consider safe. Enter your ZIP code on our home page to see exactly what EPA data shows for your water system.',
      },
      {
        q: 'What is TDS and does it matter?',
        a: 'TDS stands for Total Dissolved Solids — it measures everything dissolved in your water, including minerals (calcium, magnesium, sodium), salts, and metals. A high TDS reading alone does not mean your water is unsafe — most TDS is made up of healthy minerals. However, TDS can include harmful contaminants like lead, arsenic, or nitrates. A TDS meter is a useful screening tool, but it cannot tell you what specific contaminants are present. For that, you need water testing or an EPA water quality report. The EPA secondary standard for TDS is 500 mg/L for aesthetic reasons (taste, odor).',
      },
      {
        q: 'How do I read my water quality report (Consumer Confidence Report)?',
        a: 'Every public water utility in the U.S. must publish an annual Consumer Confidence Report (CCR) by July 1st each year. You can request it from your utility or find it online. Key things to look for: (1) Any contaminants that exceed EPA action levels or MCLs — these are flagged violations. (2) Contaminants that are close to (but don\'t exceed) limits — these are still concerning. (3) The difference between the MCL (legal limit) and the MCLG (health goal) — a wide gap indicates a known health risk. (4) Detection of PFAS, lead, or nitrates — even at compliant levels, these warrant filtration. Our site pulls this EPA data automatically when you enter your ZIP code.',
      },
      {
        q: 'What is the difference between the MCL and the MCLG?',
        a: 'The MCLG (Maximum Contaminant Level Goal) is what the EPA considers safe for health with no margin of risk — it is set purely on health science. The MCL (Maximum Contaminant Level) is the enforceable legal limit — it is set based on what\'s achievable with the best available technology at a reasonable cost. For many of the most dangerous contaminants — including lead, arsenic, PFAS, and chromium-6 — the MCLG is zero, meaning no safe level exists. But the legal MCL allows detectable amounts because removing them completely is difficult. This gap is why filtering your water even when it "passes" EPA standards makes sense.',
      },
    ],
  },
  {
    category: 'Choosing a Filter',
    items: [
      {
        q: 'What is the difference between a carbon filter and a reverse osmosis (RO) system?',
        a: 'Carbon filters (activated carbon or carbon block) work by adsorption — contaminants stick to the surface of the carbon as water flows through. They are excellent at removing chlorine, chloramine, VOCs, taste, odor, and some heavy metals. However, they cannot remove nitrates, fluoride, most PFAS, TDS, or dissolved minerals. Reverse Osmosis (RO) forces water through a semi-permeable membrane with pores so small (0.0001 microns) that only water molecules pass through. RO removes 95–99%+ of virtually all dissolved contaminants including lead, arsenic, nitrates, fluoride, PFAS, TDS, bacteria, and more. RO systems are the gold standard for comprehensive drinking water purification.',
      },
      {
        q: 'Do I need a whole-house filter or an under-sink filter?',
        a: 'It depends on your goals. An under-sink RO system provides the purest possible water at your kitchen tap for drinking and cooking — it is the most comprehensive solution for what you consume. A whole-house system (also called a Point of Entry or POE system) treats all the water entering your home — every tap, shower, washing machine, and appliance. Whole-house systems are ideal if you have chlorine, chloramine, sediment, or iron issues affecting your appliances, plumbing, skin, and hair throughout the house. The best setup is both: a whole-house carbon filter for general protection + an under-sink RO for drinking water.',
      },
      {
        q: 'Do shower filters really work? Is filtering shower water important?',
        a: 'Yes — and it is often overlooked. A 10-minute hot shower can expose you to more chlorine (through inhalation of steam) than drinking 8 glasses of water from the same supply. Chlorine and chloramine vaporize easily in hot water and are absorbed through the lungs and skin. Studies have linked long-term inhalation of chlorinated shower steam to respiratory issues and an increased risk of bladder cancer. Shower filters remove 70–95% of chlorine and chloramine, resulting in softer skin, less hair damage, reduced respiratory irritation, and better air quality in your bathroom. They are especially important for people with sensitive skin, eczema, asthma, or young children.',
      },
      {
        q: 'What is a quick-change (encapsulated) filter and why is it better?',
        a: 'Traditional filter housings require you to unscrew a large plastic housing by hand (or with a wrench), pull out the old filter cartridge, and insert a new one — often a messy, frustrating process. Quick-change or encapsulated filters are all-in-one sealed cartridges that twist or click in and out in seconds, with no mess, no contact with the old filter, and no risk of cross-contamination. Brands like Waterdrop, Aquasana, and some iSpring models use this design. On our site, products marked with the ⚡ Quick-Change badge use this superior filter replacement method.',
      },
      {
        q: 'How often should I change my water filter?',
        a: 'It depends on the filter type and your water quality: Pitcher filters (Brita, PUR, ZeroWater): every 2–3 months or per manufacturer guidelines. Under-sink RO pre/post-carbon filters: every 6–12 months. RO membranes: every 2–3 years with normal use. Whole-house carbon filters: every 6 months to 6 years depending on the system (the Pelican PC600 has a 6-year filter life). Shower filters: every 6 months or 10,000–15,000 gallons. If you notice a change in taste, odor, or your TDS reading rises significantly, change the filter sooner. Always follow the manufacturer schedule — an overdue filter can actually begin releasing contaminants back into the water.',
      },
    ],
  },
  {
    category: 'Specific Contaminants',
    items: [
      {
        q: 'What is PFAS and why is it so dangerous?',
        a: 'PFAS (Per- and Polyfluoroalkyl Substances) are a group of over 12,000 man-made chemicals used in non-stick cookware (Teflon), firefighting foam, food packaging, stain-resistant fabrics, and industrial processes since the 1940s. They are called "forever chemicals" because the carbon-fluorine bond — one of the strongest in chemistry — never breaks down in the environment or the human body. PFAS accumulate in your body over time. Health effects include kidney and testicular cancer, thyroid disruption, immune suppression (including reduced vaccine effectiveness), high cholesterol, and developmental problems in children. In 2024, the EPA set the first-ever enforceable limit for PFAS in drinking water at 4 parts per trillion. Standard carbon pitcher filters do NOT effectively remove PFAS — you need a reverse osmosis system or a specifically PFAS-certified activated carbon system.',
      },
      {
        q: 'Do I need to worry about lead in my water if I live in a newer home?',
        a: 'Possibly, yes. The 1986 Safe Drinking Water Act banned lead solder and reduced lead content in plumbing materials — but "lead-free" under federal law still allows up to 8% lead in faucets and fixtures (revised to 0.25% in 2014 under the Reduction of Lead in Drinking Water Act). Additionally, lead service lines — the pipes connecting your home to the main water supply — can still be made of lead in many cities, regardless of when your home was built. Chicago, for example, has over 400,000 lead service lines still in use. The only way to know is to check your local utility\'s lead service line map or get your water tested. Lead is colorless, odorless, and tasteless — impossible to detect without a test.',
      },
      {
        q: 'Can filters remove fluoride?',
        a: 'Standard activated carbon filters (like Brita and most pitchers) do NOT remove fluoride. To remove fluoride you need: Reverse Osmosis (removes 90–95%), Activated Alumina filters (removes 90%+), Bone char carbon filters, or Distillation. If fluoride removal is your goal, an RO system is the most practical and effective solution. The EPA\'s MCL for fluoride is 4 mg/L, while the optimal level added by utilities is 0.7 mg/L. Most concerns about fluoride involve long-term overconsumption from multiple sources (water + supplements + dental products) particularly in children whose teeth are developing.',
      },
      {
        q: 'Is bottled water safer than tap water?',
        a: 'Not necessarily — and often no. Bottled water is regulated by the FDA, not the EPA, and FDA standards are actually less strict in some areas. About 25–45% of bottled water is simply filtered tap water (including some major brands). Bottled water is not required to disclose its contaminant testing results to consumers, while public utilities must publish annual Consumer Confidence Reports. Additionally, plastic bottles can leach BPA and phthalates into the water, particularly when stored in heat. A certified home filter system provides water that is equal to or better than most bottled water at a fraction of the cost — typically $0.10–$0.25 per gallon vs. $1–$3 per gallon for bottled.',
      },
    ],
  },
  {
    category: 'Our Data & Methodology',
    items: [
      {
        q: 'Where does WaterCheckup\'s data come from?',
        a: 'WaterCheckup pulls real-time data from four authoritative sources: (1) EPA SDWIS (Safe Drinking Water Information System) via the EPA Envirofacts API — this includes water system information, violation history, and lead/copper sampling data for over 150,000 public water systems. (2) UCMR5 (Unregulated Contaminant Monitoring Rule, 5th edition) — the EPA\'s most comprehensive PFAS monitoring database covering 6,151 water systems tested in 2023–2024. (3) EWG Tap Water Atlas — Environmental Working Group\'s database covering 80+ major metro areas with health-based contaminant assessments. (4) USGS Arsenic and Nitrate datasets — geological and agricultural contamination data by region. Your ZIP code is matched to your specific water system (PWSID) and all available data is combined into a single report.',
      },
      {
        q: 'How is the Water Quality Score calculated?',
        a: 'The WaterCheckup score (0–100) is calculated based on: violation history weighted by severity (health-based violations score worse than reporting violations), the number of open vs. resolved violations, detection of high-priority contaminants like PFAS and lead, and how close detected contaminant levels are to EPA limits. A score of 80+ means no significant issues on record. 65–79 indicates elevated contaminants or past violations worth monitoring. Below 65 indicates serious issues — multiple violations, open enforcement actions, or detection of health-critical contaminants. A high score still doesn\'t mean you shouldn\'t filter — it means your utility is compliant, not that your water is contaminant-free.',
      },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: '#091825', color: '#e2e8f0' }}>

      {/* NAV */}
      <div style={{ borderBottom: '1px solid #0f2336', padding: '0 28px', display: 'flex', alignItems: 'center', gap: 16, height: 60, background: '#091825' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.svg" alt="WaterCheckup" height={38} style={{ display: 'block' }} />
        </a>
        <nav style={{ display: 'flex', gap: 4, marginLeft: 24 }}>
          {[['/', 'Home'], ['/contaminants', 'Contaminants'], ['/faq', 'FAQ']].map(([href, label]) => (
            <a key={href} href={href} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 14, fontWeight: href === '/faq' ? 700 : 500, color: href === '/faq' ? '#22d3ee' : '#64748b' }}>{label}</a>
          ))}
        </nav>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(180deg, #071828 0%, #040d14 100%)', padding: '52px 24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 3, marginBottom: 12 }}>40+ YEARS OF WATER EXPERTISE</div>
        <h1 style={{ fontSize: 38, fontWeight: 900, color: '#f1f5f9', marginBottom: 14 }}>Frequently Asked Questions</h1>
        <p style={{ fontSize: 17, color: '#64748b', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
          Straight answers about water quality, contaminants, filters, and what the EPA data actually means for your family.
        </p>
      </div>

      {/* FAQ CONTENT */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '32px 20px 80px' }}>
        {FAQS.map(section => (
          <div key={section.category} style={{ marginBottom: 44 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #0f2336' }}>
              {section.category.toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {section.items.map(item => {
                const isOpen = open === item.q;
                return (
                  <div key={item.q} style={{ background: '#0d2240', border: '1px solid #0f2336', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px #00000033' }}>
                    <button
                      onClick={() => setOpen(isOpen ? null : item.q)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.4 }}>{item.q}</span>
                      <span style={{ fontSize: 20, color: '#334155', flexShrink: 0, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 22px 22px', borderTop: '1px solid #0f2336', paddingTop: 18 }}>
                        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8 }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid #0f2d40', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginTop: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>Ready to check your actual water?</div>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>Enter your ZIP code and get a free report pulled directly from EPA SDWIS, UCMR5, and EWG data.</p>
          <a href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, boxShadow: '0 4px 20px #0891b244' }}>
            Check My Water →
          </a>
        </div>
      </div>
    </div>
  );
}

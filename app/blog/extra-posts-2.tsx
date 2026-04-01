import React from 'react';
import type { Post } from './post-types';

const WATERDROP = 'https://www.waterdrop.com/?ref=anbyjkqb';
const AMAZON_TAG = 'watercheck20-20';

const h2Style: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '40px 0 14px', lineHeight: 1.3 };
const h3Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '28px 0 10px' };
const pStyle: React.CSSProperties = { margin: '0 0 20px', color: '#94a3b8', lineHeight: 1.85 };
const strongStyle: React.CSSProperties = { color: '#e2e8f0', fontWeight: 700 };
const calloutStyle: React.CSSProperties = { margin: '28px 0', padding: '18px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 };
const warnStyle: React.CSSProperties = { margin: '28px 0', padding: '18px 22px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: 10, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 };

export const EXTRA_POSTS_2: Record<string, Post> = {
  'hard-water-explained-scale-softeners-and-your-taps': {
    title: 'Hard Water Explained: Scale, Softeners, and What It Means for Your Taps',
    excerpt:
      'Calcium and magnesium make water “hard.” Here is how hardness affects appliances, whether it is a health risk, and when a softener or RO makes sense.',
    date: '2026-04-04',
    dateDisplay: 'April 4, 2026',
    readTime: '8 min read',
    badge: 'Home',
    badgeColor: '#94a3b8',
    topPick: {
      label: 'Hard water is not a health crisis — but it can wreck appliances',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'For drinking water, RO removes dissolved minerals; pair with a softener if you need whole-home scale control.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=water+softener+whole+house+nsf&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          <strong style={strongStyle}>Hard water</strong> contains dissolved calcium and magnesium (and sometimes iron). It is extremely common — especially in groundwater and in regions with limestone geology.
        </p>
        <h2 style={h2Style}>Is hard water dangerous?</h2>
        <p style={pStyle}>
          For drinking, hard water is generally <strong style={strongStyle}>not a health hazard</strong> — those minerals contribute to dietary intake. The problem is mechanical: scale on fixtures, reduced soap lather, shortened water heater life, and efficiency loss on dishwashers and tankless heaters.
        </p>
        <h2 style={h2Style}>How to read hardness</h2>
        <p style={pStyle}>
          Utilities sometimes report hardness as mg/L CaCO₃ or grains per gallon (gpg). Your CCR may include it; if not, a home test strip or lab panel can quantify it.
        </p>
        <h2 style={h2Style}>Salt softeners vs. salt-free conditioners</h2>
        <p style={pStyle}>
          Traditional ion-exchange <strong style={strongStyle}>salt softeners</strong> remove hardness minerals and replace them with sodium (or potassium if you use potassium chloride). <strong style={strongStyle}>Salt-free</strong> conditioners do not remove hardness the same way — they may reduce scale formation on surfaces for some plumbing; verify claims with third-party data for your water chemistry.
        </p>
        <div style={calloutStyle}>
          <strong style={strongStyle}>Drinking water note: </strong>
          If you need low-sodium drinking water for medical reasons, talk to your doctor — softened water can add sodium at the tap. Many people use RO for drinking and a softener for the rest of the home.
        </div>
        <h2 style={h2Style}>Bottom line</h2>
        <p style={pStyle}>
          Treat hard water when scale is costing you money or comfort. For drinking taste and purity, point-of-use RO is separate from whole-house softening — they solve different problems.
        </p>
      </>
    ),
  },

  'bottled-water-vs-tap-water-cost-safety-and-pfas': {
    title: 'Bottled Water vs. Tap Water: Cost, Safety, and PFAS Reality',
    excerpt:
      'Bottled water is not automatically “purer.” Here is how regulation compares, what PFAS studies found, and when filtering tap water wins.',
    date: '2026-04-05',
    dateDisplay: 'April 5, 2026',
    readTime: '8 min read',
    badge: 'Lifestyle',
    badgeColor: '#38bdf8',
    topPick: {
      label: 'Bottled water can still contain contaminants — read the label',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'RO at home can beat per-bottle cost for households that drink a lot of water.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=reverse+osmosis+under+sink+water+filter&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          Bottled water is convenient, but it is <strong style={strongStyle}>not a guarantee</strong> of better quality than tap. Both tap and bottled products are regulated — but under different frameworks and with different testing frequencies.
        </p>
        <h2 style={h2Style}>Tap water (public systems)</h2>
        <p style={pStyle}>
          Community systems must meet EPA standards, monitor on a schedule, and publish a Consumer Confidence Report. You can look up violations and monitoring data by ZIP on WaterCheckup.
        </p>
        <h2 style={h2Style}>Bottled water</h2>
        <p style={pStyle}>
          FDA regulates bottled water as a food product. Quality depends on the source and bottler. Some brands are filtered municipal water; others are spring or mineral sources. The label matters — “purified” usually means treated, but not necessarily PFAS-free unless tested and verified.
        </p>
        <div style={warnStyle}>
          <strong style={{ color: '#f59e0b' }}>PFAS: </strong>
          Studies and reporting have detected PFAS in some bottled products — not all brands, not all lots. If PFAS is your concern, certified filtration or verified lab results beat assumptions.
        </div>
        <h2 style={h2Style}>Cost and plastic</h2>
        <p style={pStyle}>
          For heavy water drinkers, a certified under-sink system often beats bottled on cost within months. You also reduce plastic waste and hauling cases.
        </p>
        <h2 style={h2Style}>Bottom line</h2>
        <p style={pStyle}>
          Use tap data + filtration when you want control and transparency. Use bottled when you need portability — but do not assume it is automatically safer than tap.
        </p>
      </>
    ),
  },

  'chromium-6-in-drinking-water-should-you-worry': {
    title: 'Chromium-6 in Drinking Water: Should You Worry?',
    excerpt:
      'Chromium-6 gets headlines. Here is how it differs from chromium-3, what EPA regulates, and how to interpret results.',
    date: '2026-04-06',
    dateDisplay: 'April 6, 2026',
    readTime: '7 min read',
    badge: 'Contaminants',
    badgeColor: '#eab308',
    topPick: {
      label: 'EPA regulates total chromium — your filter should match your goal',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'RO is commonly used to reduce dissolved chromium species for drinking water.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=reverse+osmosis+chromium+water+filter+nsf&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          <strong style={strongStyle}>Chromium</strong> occurs in water as trivalent chromium (chromium-3) and hexavalent chromium (chromium-6). Cr-6 is the form most often discussed for long-term health risk at elevated levels in drinking water.
        </p>
        <h2 style={h2Style}>What EPA regulates</h2>
        <p style={pStyle}>
          EPA sets a standard for <strong style={strongStyle}>total chromium</strong> in drinking water. Utilities may also monitor or report additional information depending on state rules and UCMR monitoring cycles. Your CCR is the first place to look for detections.
        </p>
        <h2 style={h2Style}>Hollywood vs. your tap</h2>
        <p style={pStyle}>
          Pop culture made Cr-6 famous, but risk depends on <strong style={strongStyle}>concentration and duration</strong>. If your system is in compliance and you want extra margin, certified filtration for drinking water is a reasonable personal choice.
        </p>
        <div style={calloutStyle}>
          <strong style={strongStyle}>Testing: </strong>
          If you need Cr-6 specifically (not just total chromium), tell the lab explicitly — not every panel includes speciation by default.
        </div>
        <h2 style={h2Style}>Filtration</h2>
        <p style={pStyle}>
          Reverse osmosis and specialized media can reduce chromium for point-of-use drinking water. Always verify <strong style={strongStyle}>NSF certifications</strong> for the exact claim you care about.
        </p>
      </>
    ),
  },

  'nitrate-in-well-water-infants-and-pregnancy': {
    title: 'Nitrate in Well Water: Why Infants and Pregnancy Need Extra Care',
    excerpt:
      'Nitrate is a common well-water issue. Here is how it causes methemoglobinemia, what the EPA limit means, and why RO is often the fix.',
    date: '2026-04-07',
    dateDisplay: 'April 7, 2026',
    readTime: '8 min read',
    badge: 'Wells',
    badgeColor: '#a855f7',
    topPick: {
      label: 'Nitrate above EPA limits is serious for babies — do not boil',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'RO is a standard approach for nitrate reduction for drinking/cooking — confirm with testing.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=nitrate+reverse+osmosis+water+filter&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          <strong style={strongStyle}>Nitrate (NO₃)</strong> in drinking water is odorless and tasteless. It often comes from agricultural runoff, septic systems, and animal waste — especially in rural areas.
        </p>
        <div style={warnStyle}>
          <strong style={{ color: '#ef4444' }}>Infants: </strong>
          High nitrate can cause <strong style={strongStyle}>methemoglobinemia</strong> (“blue baby syndrome”) in infants under six months. Do not use nitrate-contaminated water for formula — and <strong style={strongStyle}>boiling does not remove nitrate</strong> (it can concentrate it).
        </div>
        <h2 style={h2Style}>EPA limit</h2>
        <p style={pStyle}>
          The MCL for nitrate (as nitrogen) is <strong style={strongStyle}>10 mg/L</strong> in public systems. Private wells are not monitored by EPA — owners must test.
        </p>
        <h2 style={h2Style}>Pregnancy</h2>
        <p style={pStyle}>
          Discuss elevated nitrate with your clinician. Many public health agencies recommend caution when nitrate is high or borderline.
        </p>
        <h2 style={h2Style}>Treatment</h2>
        <p style={pStyle}>
          Point-of-use <strong style={strongStyle}>reverse osmosis</strong> is commonly used for nitrate reduction for drinking and cooking. Whole-house systems require proper sizing and maintenance — work with a qualified professional for well water.
        </p>
      </>
    ),
  },

  'how-to-test-your-tap-water-mail-in-labs-explained': {
    title: 'How to Test Your Tap Water: Mail-In Labs, Strips, and What to Order',
    excerpt:
      'Test strips are not enough for lead or PFAS. Here is how to pick a certified lab panel, avoid contamination, and read the results.',
    date: '2026-04-08',
    dateDisplay: 'April 8, 2026',
    readTime: '9 min read',
    badge: 'Testing',
    badgeColor: '#2dd4bf',
    topPick: {
      label: 'Certified labs beat gimmick “TDS” meters for safety questions',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'After you know your targets, RO addresses many drinking-water concerns in one system.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=epa+certified+water+test+kit+laboratory&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          If you drink from a <strong style={strongStyle}>public water system</strong>, your CCR is the baseline. If you want to know what is at <em>your faucet</em> — especially for lead — you need sampling that matches the question.
        </p>
        <h2 style={h2Style}>What strips and TDS meters miss</h2>
        <p style={pStyle}>
          TDS meters measure conductivity — not specific contaminants. Strips can hint at pH and some ions but are not reliable for lead, PFAS, arsenic, or bacteria.
        </p>
        <h2 style={h2Style}>Mail-in lab panels</h2>
        <p style={pStyle}>
          Choose a lab accredited for drinking water methods. Common add-ons: <strong style={strongStyle}>lead</strong> (first-draw vs. flushed), <strong style={strongStyle}>copper</strong>, <strong style={strongStyle}>bacteria</strong>, <strong style={strongStyle}>nitrate</strong> (wells), <strong style={strongStyle}>arsenic</strong>, <strong style={strongStyle}>PFAS</strong> (EPA methods 533/537.1).
        </p>
        <h2 style={h2Style}>Sampling tips</h2>
        <p style={pStyle}>
          For lead, follow the kit instructions exactly — “first draw after 6+ hours without use” is different from a flushed sample. For bacteria, use sterile bottles and timing as directed.
        </p>
        <div style={calloutStyle}>
          <strong style={strongStyle}>Compare to EPA limits: </strong>
          Your report should list results alongside MCLs or health advisories. If you are unsure, ask the lab for a plain-language summary.
        </div>
      </>
    ),
  },

  'refrigerator-water-filters-what-they-actually-remove': {
    title: 'Refrigerator Water Filters: What They Actually Remove',
    excerpt:
      'Fridge filters are convenient — but certification varies wildly. Here is how to read NSF claims and when you still need RO.',
    date: '2026-04-09',
    dateDisplay: 'April 9, 2026',
    readTime: '7 min read',
    badge: 'Filters',
    badgeColor: '#06b6d4',
    topPick: {
      label: 'Match the cartridge to the contaminant — don’t assume “one filter fixes all”',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'For broad contaminant reduction, undersink RO typically outperforms fridge cartridges.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=refrigerator+water+filter+nsf+53+nsf+58&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          Most refrigerator filters use <strong style={strongStyle}>activated carbon</strong> to improve taste and reduce chlorine. Performance depends on the exact cartridge and whether it is NSF-certified for what you care about.
        </p>
        <h2 style={h2Style}>Check NSF labels</h2>
        <p style={pStyle}>
          Look up the model on NSF’s listings. <strong style={strongStyle}>NSF/ANSI 42</strong> is taste/chlorine. <strong style={strongStyle}>NSF/ANSI 53</strong> covers health effects like lead (when certified). <strong style={strongStyle}>NSF/ANSI 58</strong> is RO systems — not typical fridge filters.
        </p>
        <h2 style={h2Style}>Limitations</h2>
        <p style={pStyle}>
          Fridge filters have low flow and limited contact time. They can be excellent for taste and odor — but may not be the right tool for PFAS, nitrates, or high lead.
        </p>
        <h2 style={h2Style}>When to upgrade</h2>
        <p style={pStyle}>
          If your WaterCheckup report shows detections you care about, pair a certified filter with a real plan — often <strong style={strongStyle}>undersink RO for drinking</strong> and the fridge for convenience.
        </p>
      </>
    ),
  },

  'whole-house-water-filter-vs-under-sink-which-to-choose': {
    title: 'Whole-House Water Filter vs. Under-Sink: Which Should You Choose?',
    excerpt:
      'Point-of-entry systems treat everything entering the home; point-of-use treats drinking water. Here is how to decide without overspending.',
    date: '2026-04-10',
    dateDisplay: 'April 10, 2026',
    readTime: '9 min read',
    badge: 'Guides',
    badgeColor: '#22c55e',
    topPick: {
      label: 'Most homes start with RO at the kitchen sink for drinking',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'Targeted, high-performance reduction for the water you consume most.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=whole+house+water+filter+carbon+nsf&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          <strong style={strongStyle}>Whole-house (point-of-entry)</strong> treats water where it enters your home. <strong style={strongStyle}>Under-sink (point-of-use)</strong> treats water at one faucet — usually the kitchen.
        </p>
        <h2 style={h2Style}>Whole-house benefits</h2>
        <p style={pStyle}>
          Reduces chlorine/chloramine taste for showers, laundry, and appliances. Useful for scale control when paired with a softener. Important: whole-house carbon does not automatically make every tap “safe” for every contaminant — flow rates and media volume matter.
        </p>
        <h2 style={h2Style}>Under-sink benefits</h2>
        <p style={pStyle}>
          Higher contact time per gallon at the kitchen sink. RO can deliver strong reduction for drinking and cooking without treating the entire home’s flow.
        </p>
        <div style={calloutStyle}>
          <strong style={strongStyle}>Budget reality: </strong>
          Whole-house + softener + RO is common in high-hardness areas — but many households do fine with RO + shower filter + good maintenance.
        </div>
        <h2 style={h2Style}>Decision framework</h2>
        <p style={pStyle}>
          Start with your water report and goals: <strong style={strongStyle}>skin/hair irritation from chlorine?</strong> → consider whole-house carbon. <strong style={strongStyle}>PFAS/lead/nitrate for drinking?</strong> → prioritize certified RO or targeted POU filters.
        </p>
      </>
    ),
  },

  'boil-water-advisory-what-to-do-and-how-long': {
    title: 'Boil Water Advisory: What to Do, What to Avoid, and How Long It Lasts',
    excerpt:
      'Microbiological outbreaks trigger boil notices. Here is the safe playbook — including why you should not use home RO during a boil advisory.',
    date: '2026-04-11',
    dateDisplay: 'April 11, 2026',
    readTime: '6 min read',
    badge: 'Safety',
    badgeColor: '#ef4444',
    topPick: {
      label: 'Follow local authority instructions first — this article is general guidance',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'After the advisory lifts, sanitize and replace cartridges per manufacturer guidance.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=water+filter+replacement+cartridge+nsf&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          A <strong style={strongStyle}>boil water advisory</strong> usually means the utility suspects or confirms microbial contamination — or a loss of pressure that can let contaminated water into the system.
        </p>
        <div style={warnStyle}>
          <strong style={{ color: '#ef4444' }}>Do this: </strong>
          Bring water to a <strong style={strongStyle}>rolling boil for at least one minute</strong> (three minutes at high altitude per CDC guidance) for drinking, brushing teeth, washing produce, and making ice. Use bottled water if instructed.
        </div>
        <h2 style={h2Style}>What to avoid</h2>
        <p style={pStyle}>
          Do not assume your refrigerator filter, pitcher, or shower filter removes bacteria. <strong style={strongStyle}>Home RO systems are not typically certified as microbiological purifiers</strong> for boil notices — follow utility guidance.
        </p>
        <h2 style={h2Style}>After it lifts</h2>
        <p style={pStyle}>
          Flush taps as directed. Replace filters if your utility or manufacturer recommends it after contamination events.
        </p>
      </>
    ),
  },

  'microplastics-in-drinking-water-what-we-know': {
    title: 'Microplastics in Drinking Water: What We Know (and What We Don’t)',
    excerpt:
      'Microplastics show up in environmental samples worldwide. Here is how they get into water, what research is still settling, and what filters may help.',
    date: '2026-04-12',
    dateDisplay: 'April 12, 2026',
    readTime: '8 min read',
    badge: 'Science',
    badgeColor: '#8b5cf6',
    topPick: {
      label: 'Research is evolving — prioritize certified filters for known contaminants',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'RO can reduce particle load and many dissolved contaminants; microplastic capture is not always labeled separately.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=reverse+osmosis+water+filter+system&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          <strong style={strongStyle}>Microplastics</strong> are plastic particles less than 5 mm in size. They have been found in oceans, air, food — and in tap water studies around the world.
        </p>
        <h2 style={h2Style}>How they enter drinking water</h2>
        <p style={pStyle}>
          Sources include plastic pollution, degradation of larger plastics, synthetic fibers, and industrial discharge. Treatment plants reduce many contaminants but may not eliminate all particles.
        </p>
        <h2 style={h2Style}>Health science status</h2>
        <p style={pStyle}>
          Health agencies are still building the evidence base for long-term human risk at low levels. That uncertainty does not mean “ignore everything else” — lead, PFAS, and bacteria are clearer priorities where present.
        </p>
        <div style={calloutStyle}>
          <strong style={strongStyle}>Practical approach: </strong>
          Address known regulated hazards first (from your CCR/WaterCheckup). If you want extra margin, certified RO for drinking water is a reasonable choice for many households.
        </div>
      </>
    ),
  },

  'arsenic-in-well-water-epa-limit-and-treatment': {
    title: 'Arsenic in Well Water: The EPA Limit and Treatment That Actually Works',
    excerpt:
      'Arsenic is a natural groundwater contaminant in many regions. Here is how to test, when 10 ppb matters, and what treatment options are common.',
    date: '2026-04-13',
    dateDisplay: 'April 13, 2026',
    readTime: '8 min read',
    badge: 'Wells',
    badgeColor: '#a855f7',
    topPick: {
      label: 'Arsenic needs verified treatment — not guesswork',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'RO is a common solution for drinking water when arsenic is elevated — confirm performance with water testing.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=arsenic+water+filter+reverse+osmosis+nsf&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          <strong style={strongStyle}>Arsenic</strong> in groundwater is common in parts of the Southwest, New England, Appalachia, and the Midwest. It is odorless and tasteless — testing is the only way to know your level.
        </p>
        <h2 style={h2Style}>EPA standard</h2>
        <p style={pStyle}>
          The MCL for arsenic in public drinking water is <strong style={strongStyle}>10 μg/L (10 ppb)</strong>. Private wells are not federally regulated — owners must test and treat.
        </p>
        <h2 style={h2Style}>Health notes</h2>
        <p style={pStyle}>
          Long-term exposure to elevated arsenic is associated with increased cancer risk and other health effects. If your well is above the EPA limit, take action for drinking water — not just aesthetics.
        </p>
        <h2 style={h2Style}>Treatment</h2>
        <p style={pStyle}>
          Point-of-use <strong style={strongStyle}>reverse osmosis</strong> is widely used for arsenic reduction. Specialized adsorptive media systems exist for whole-house applications — design and maintenance depend on your chemistry and flow rate.
        </p>
        <div style={warnStyle}>
          <strong style={{ color: '#f59e0b' }}>Retest after install: </strong>
          Always verify treatment with follow-up lab testing at the tap.
        </div>
      </>
    ),
  },
};

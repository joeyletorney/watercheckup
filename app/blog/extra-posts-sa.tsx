import React from 'react';
import type { Post } from './post-types';
import { blogPostDateFields } from '@/lib/blog-post-dates';

const AMAZON_TAG = 'watercheckup-20';

const TOP_3_RO = [

  { product: 'Waterdrop G3P600 RO', brand: 'Waterdrop', price: '~$399', reason: 'Tankless design with smart LED faucet — with strong NSF certification. NSF 42/53/58/372, 600 GPD, removes 99%+ PFAS and radium. Best value for SA homeowners.', link: `https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=anbyjkqb`, amazon: `https://www.amazon.com/dp/B07P1XFYJP?tag=watercheckup-20`, badge: 'BEST VALUE' },
  { product: 'Clearly Filtered Pitcher', brand: 'Clearly Filtered', price: '~$90', reason: 'NSF/ANSI 42 and 372 certified. Broader PFAS, radium, and arsenic figures are published lab tests, not NSF listings. Best no-install option for SA renters.', link: 'https://clearlyfiltered.com/products/clean-water-pitcher', amazon: `https://www.amazon.com/dp/B0DFC22BHT?tag=${AMAZON_TAG}`, badge: 'BEST FOR RENTERS' },
];

const h2Style: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '56px 0 18px', lineHeight: 1.3 };
const h3Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '40px 0 14px' };
const pStyle: React.CSSProperties = { margin: '0 0 20px', color: '#cbd5e1', lineHeight: 1.85 };
const strongStyle: React.CSSProperties = { color: '#e2e8f0', fontWeight: 700 };
const calloutStyle: React.CSSProperties = { margin: '40px 0', padding: '18px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, fontSize: 15, color: '#cbd5e1', lineHeight: 1.75 };
const warnStyle: React.CSSProperties = { margin: '40px 0', padding: '18px 22px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: 10, fontSize: 15, color: '#cbd5e1', lineHeight: 1.75 };
const linkStyle: React.CSSProperties = { color: '#22d3ee', fontWeight: 600, textDecoration: 'none' };

export const EXTRA_POSTS_SA: Record<string, Post> = {

  'san-antonio-water-quality': {
    title: 'San Antonio Water Quality: SAWS Hardness & PFAS',
    excerpt: 'San Antonio water quality from SAWS and EPA data: hardness, radium, and PFAS monitoring. Not a tap test — see the city report and PFAS guide.',
    seo: {
      title: 'San Antonio Water Quality: SAWS Hardness & PFAS',
      description:
        'PFAS in UCMR5 · 272 mg/L hardness · radium from Edwards Aquifer. What SAWS & EPA data show — free guide, no signup.',
      canonical: 'https://watercheckup.com/blog/san-antonio-water-quality',
      openGraph: {
        title: 'San Antonio Water Quality: SAWS Hardness & PFAS',
        description:
          'PFAS in UCMR5 · 272 mg/L hardness · radium from Edwards Aquifer. What SAWS & EPA data show — free guide, no signup.',
      },
    },
    ...blogPostDateFields('san-antonio-water-quality', '2026-05-27'),
    readTime: '9 min read',
    badge: 'San Antonio',
    badgeColor: '#0891b2',
    topPicks: TOP_3_RO,
    content: React.createElement(React.Fragment, null,

      React.createElement('p', { style: pStyle },
        'San Antonio Water System (SAWS) serves 1.5 million residents from the ',
        React.createElement('strong', { style: strongStyle }, 'Edwards Aquifer'),
        ' — a limestone aquifer under the Texas Hill Country. The source water is generally safe by EPA standards, but it comes with a specific set of concerns: extreme hardness, naturally occurring radium, detected PFAS, and elevated sodium. Here\'s what the 2024 SAWS / UCMR5 snapshot shows and what to do about it in 2026. SAWS still has until 2029 to meet the April 2024 PFAS MCLs; hardness is unchanged by that rule. Current drinking-water RO: Waterdrop G3P600 about $399.'
      ),

      React.createElement('p', { style: pStyle },
        'For the scored breakdown with letter grade, contaminant levels, and filter picks, see our ',
        React.createElement('a', { href: '/water/san-antonio', style: linkStyle }, 'San Antonio water quality report'),
        '.'
      ),

      React.createElement('h2', { style: h2Style }, 'San Antonio Water Quality Overview (2024 Data)'),
      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#22d3ee' } }, 'Full report: '),
        'See our ',
        React.createElement('a', { href: '/water/san-antonio', style: linkStyle }, 'San Antonio water quality report'),
        ' for the current Water Safety Score (D+ · 58/88), PFAS detail, and filter picks. SAWS meets federal EPA limits; hardness, PFAS, and radium still matter for long-term exposure.'
      ),

      React.createElement('h3', { style: h3Style }, 'What\'s in San Antonio Tap Water'),
      React.createElement('p', { style: pStyle },
        'Based on the SAWS 2026 Consumer Confidence Report (covering 2024 test data) and EPA UCMR5 monitoring:'
      ),
      React.createElement('ul', { style: { ...pStyle, paddingLeft: 20 } },
        React.createElement('li', null,
          React.createElement('strong', { style: strongStyle }, 'Water hardness: '),
          '272 mg/L — classified as "very hard." One of the highest readings of any major US city. Causes scale on pipes, appliances, and fixtures.'
        ),
        React.createElement('li', null,
          React.createElement('strong', { style: strongStyle }, 'PFAS: '),
          'UCMR5 snapshot for SAWS (TX0150018): PFBA 9.2 ppt, PFBS 3.8 ppt, PFPeA 3.2 ppt. Historical peaks, not current tap readings. None of the six EPA-regulated PFAS sit above April 2024 MCL benchmarks in this snapshot. See the PFAS guide for compound-by-compound context.'
        ),
        React.createElement('li', null,
          React.createElement('strong', { style: strongStyle }, 'Radium (combined): '),
          '3.4 pCi/L — naturally occurring from limestone geology. Below the EPA limit of 5 pCi/L but elevated vs national averages. Removed by reverse osmosis.'
        ),
        React.createElement('li', null,
          React.createElement('strong', { style: strongStyle }, 'Arsenic: '),
          '3.8 ppb — below the EPA limit of 10 ppb but above EWG\'s 0.004 ppb health guideline. Long-term exposure is linked to bladder and lung cancer.'
        ),
        React.createElement('li', null,
          React.createElement('strong', { style: strongStyle }, 'Sodium: '),
          '92 mg/L — elevated due to aquifer mineral content. Relevant for residents on low-sodium diets or with heart conditions. RO reduces sodium significantly.'
        ),
        React.createElement('li', null,
          React.createElement('strong', { style: strongStyle }, 'Disinfection byproducts: '),
          'TTHMs at 32 ppb and HAA5 at 18 ppb — both below EPA limits of 80 ppb and 60 ppb respectively. SAWS has logged DBP violations in past reporting periods.'
        ),
        React.createElement('li', null,
          React.createElement('strong', { style: strongStyle }, 'Lead: '),
          '2.2 ppb (90th percentile) — well below the EPA action level of 15 ppb. Lead risk in SA comes from old home plumbing, not the distribution system.'
        ),
        React.createElement('li', null,
          React.createElement('strong', { style: strongStyle }, 'E. coli: '),
          'None detected. SAWS sampled 390 sites monthly in 2024 with zero positives.'
        ),
      ),

      React.createElement('h2', { style: h2Style }, 'Where San Antonio Water Comes From'),
      React.createElement('p', { style: pStyle },
        'SAWS draws primarily from the ',
        React.createElement('strong', { style: strongStyle }, 'Edwards Aquifer'),
        ', fed by rainfall percolating through Texas Hill Country limestone. This geology is the direct cause of SA\'s hardness, radium, and arsenic — the water dissolves minerals from the rock as it travels underground.'
      ),
      React.createElement('p', { style: pStyle },
        'SAWS also draws supplementally from the Carrizo Aquifer (via the Vista Ridge Pipeline) and surface sources during peak demand. Water quality can vary slightly by neighborhood and season depending on source blend.'
      ),

      React.createElement('h2', { style: h2Style }, 'The Hard Water Problem in San Antonio'),
      React.createElement('div', { style: warnStyle },
        React.createElement('strong', { style: { color: '#f97316' } }, '⚠ At 272 mg/L, San Antonio has some of the hardest tap water in the US. '),
        'This is not a health hazard — but it causes significant real-world problems: scale buildup in pipes, water heaters losing efficiency, spotted dishes, soap that won\'t lather, and appliances with shortened lifespans.'
      ),
      React.createElement('p', { style: pStyle },
        'The standard solution for whole-home hard water is a ',
        React.createElement('strong', { style: strongStyle }, 'salt-based water softener'),
        '. For drinking water specifically, a reverse osmosis system removes hardness minerals at the tap along with PFAS, radium, and arsenic. Most SA homeowners who fully address their water use both.'
      ),

      React.createElement('h2', { style: h2Style }, 'San Antonio Water Contamination: PFAS'),
      React.createElement('p', { style: pStyle },
        'PFAS ("forever chemicals") show up in the UCMR5 snapshot for SAWS (PWSID TX0150018): PFBA 9.2 ppt, PFBS 3.8 ppt, and PFPeA 3.2 ppt. Those are historical peaks. None of the six EPA-regulated PFAS (PFOA, PFOS, PFNA, PFHxS, HFPO-DA) have peaks above April 2024 MCL benchmarks in this file. Full compound notes: ',
        React.createElement('a', { href: '/blog/pfas-in-san-antonio-water', style: linkStyle }, 'PFAS in San Antonio water'),
        '.'
      ),
      React.createElement('p', { style: pStyle },
        'PFAS are not removed by standard pitcher filters (Brita, PUR) or boiling. The only reliable options are ',
        React.createElement('strong', { style: strongStyle }, 'NSF 58-certified reverse osmosis'),
        ' or ',
        React.createElement('strong', { style: strongStyle }, 'NSF P473-certified carbon filters'),
        '. See our full ',
        React.createElement('a', { href: '/blog/what-water-filter-removes-pfas', style: linkStyle }, 'PFAS removal filter guide'),
        '.'
      ),

      React.createElement('h2', { style: h2Style }, 'Is San Antonio Tap Water Safe to Drink?'),
      React.createElement('p', { style: pStyle },
        'By EPA standards: yes. SAWS has no open violations and the water meets all federal legal limits. But "meets EPA standards" and "contaminant-free" are not the same thing. PFAS, radium, and arsenic are all present at levels that exceed independent health guidelines, even if they\'re below legal limits.'
      ),
      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#e2e8f0' } }, 'Bottom line: '),
        'Most people drink SA tap water their whole lives without acute health effects. The concern is long-term cumulative exposure to PFAS, radium, and arsenic — especially for children, pregnant women, and people with compromised immune systems. For these groups, an NSF-certified filter is worth the investment.'
      ),

      React.createElement('h2', { style: h2Style }, 'Best Water Filters for San Antonio'),
      React.createElement('p', { style: pStyle },
        'Given SA\'s specific profile — PFAS, radium, arsenic, extreme hardness, and elevated sodium — reverse osmosis is the most comprehensive solution. It addresses all of SA\'s primary contaminants at the drinking tap. See the ',
        React.createElement('a', { href: '/water/san-antonio', style: linkStyle }, 'San Antonio water report'),
        ' for filter picks ranked for this specific water profile.'
      ),

      React.createElement('h2', { style: h2Style }, 'Frequently Asked Questions'),
      ...[
        { q: 'Is San Antonio tap water safe to drink in 2026?', a: 'SAWS meets all EPA legal standards with no open violations. However, PFAS, radium, and arsenic are present above independent health guidelines. For healthy adults, SA tap water poses low acute risk. For children, pregnant women, or immunocompromised individuals, a certified RO filter is strongly recommended.' },
        { q: 'Why does San Antonio water taste different?', a: 'The Edwards Aquifer water has naturally high mineral content — calcium, magnesium, and sodium — which gives it a distinctive taste. The hardness (272 mg/L) is one of the highest of any major US city. An RO filter removes these minerals and significantly improves taste.' },
        { q: 'Why is San Antonio water so hard?', a: 'Rainwater percolates through Texas Hill Country limestone before reaching the Edwards Aquifer. As it travels through porous rock, it dissolves calcium and magnesium — the minerals that cause hardness. At 272 mg/L, SA water is classified as "very hard."' },
        { q: 'Does San Antonio water have PFAS contamination?', a: 'Yes. The UCMR5 snapshot for SAWS (TX0150018) lists PFBA 9.2 ppt, PFBS 3.8 ppt, and PFPeA 3.2 ppt. Those peaks are not official compliance findings. None of the six EPA-regulated PFAS sit above April 2024 MCL benchmarks in this snapshot. NSF 58 RO or a PFAS-certified pitcher is the residential option if you want reduction at the tap.' },
        { q: 'What is the best water filter for San Antonio water?', a: 'For San Antonio\'s full contaminant profile (PFAS, radium, arsenic, hardness), a reverse osmosis system is the gold standard. For whole-home hard water, pair it with a salt-based softener. Renters can use the Clearly Filtered pitcher (~$90; NSF 42/372, with published lab tests for PFAS/radium/arsenic) — no installation.' },
      ].map(({ q, a }) =>
        React.createElement(React.Fragment, { key: q },
          React.createElement('h3', { style: h3Style }, q),
          React.createElement('p', { style: pStyle }, a),
        )
      ),
    ),
  },

  'pfas-in-san-antonio-water': {
    title: 'PFAS in San Antonio Water: 2026 EPA UCMR5 Data',
    excerpt: 'PFAS in San Antonio water: UCMR5 compounds for SAWS (TX0150018), how they compare with EPA limits, and NSF 58 filter options.',
    seo: {
      title: 'PFAS in San Antonio Water: 2026 EPA UCMR5 Data',
      description:
        'PFAS in San Antonio water: UCMR5 compounds for SAWS (TX0150018), how they compare with EPA limits, and NSF 58 filter options.',
      canonical: 'https://watercheckup.com/blog/pfas-in-san-antonio-water',
      openGraph: {
        title: 'PFAS in San Antonio Water: 2026 EPA UCMR5 Data',
        description:
          'Which PFAS compounds showed up in SAWS UCMR5 monitoring, how they compare with EPA limits, and which NSF filters are built to remove them.',
      },
    },
    ...blogPostDateFields('pfas-in-san-antonio-water', '2026-05-27'),
    readTime: '8 min read',
    badge: 'PFAS',
    badgeColor: '#ef4444',
    topPicks: TOP_3_RO,
    content: React.createElement(React.Fragment, null,

      React.createElement('p', { style: pStyle },
        'PFAS in San Antonio water is documented in EPA UCMR5 monitoring for San Antonio Water System (SAWS, PWSID TX0150018). This article answers that query with the UCMR5 snapshot: historical peaks of PFBA 9.2 ppt, PFBS 3.8 ppt, and PFPeA 3.2 ppt. Those peaks are not current tap readings. The April 2024 PFAS drinking-water limits (PFOA/PFOS 4 ppt) have a 2029 compliance deadline, so a historical peak is not a treated-water violation in 2026. For hardness, radium, and the city safety grade, use the San Antonio water quality report.'
      ),

      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#22d3ee' } }, 'City report: '),
        'For PFAS alongside hardness, radium, and the safety grade, start with the ',
        React.createElement('a', { href: '/water/san-antonio', style: linkStyle }, 'San Antonio tap water safety report'),
        ' and return here for the compound-level UCMR5 notes.'
      ),

      React.createElement('h2', { style: h2Style }, 'What PFAS Were Found in San Antonio Water?'),
      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#f59e0b' } }, 'UCMR5 snapshot for SAWS (TX0150018): '),
        'PFBA 9.2 ppt, PFBS 3.8 ppt, and PFPeA 3.2 ppt. These are historical peaks, not current tap readings or official compliance findings. None of the six EPA-regulated PFAS (PFOA, PFOS, PFNA, PFHxS, HFPO-DA) have peaks above April 2024 MCL benchmarks in this file.'
      ),
      React.createElement('p', { style: pStyle },
        'PFBA is not currently regulated under the EPA\'s April 2024 PFAS rule, which covers six specific compounds. However, it is part of the broader PFAS family of over 12,000 synthetic chemicals. The science on PFBA\'s long-term health effects is less developed than for PFOA and PFOS, but it belongs to the same class of persistent chemicals.'
      ),

      React.createElement('h2', { style: h2Style }, 'How Do San Antonio\'s PFAS Levels Compare?'),
      React.createElement('p', { style: pStyle },
        'Compare the SAWS snapshot with the federal MCLs and with independent health guidelines. Do not treat a historical peak as today\'s tap reading:'
      ),
      React.createElement('ul', { style: { ...pStyle, paddingLeft: 20 } },
        React.createElement('li', null, React.createElement('strong', { style: strongStyle }, 'EPA MCL (PFOA/PFOS): '), '4 ppt — PFBA and PFPeA are not currently subject to this limit; PFBS is used in the Hazard Index, not a standalone 4 ppt MCL'),
        React.createElement('li', null, React.createElement('strong', { style: strongStyle }, 'This snapshot: '), '0 of 6 regulated PFAS above April 2024 MCL benchmarks for TX0150018'),
        React.createElement('li', null, React.createElement('strong', { style: strongStyle }, 'EWG health guideline: '), '1 ppt — independent of EPA MCLs; PFBA 9.2 ppt is above that guideline'),
      ),
      React.createElement('p', { style: pStyle },
        'For hardness, radium, and the scored San Antonio profile next to this PFAS snapshot, see the ',
        React.createElement('a', { href: '/water/san-antonio', style: linkStyle }, 'San Antonio tap water safety report'),
        '.'
      ),

      React.createElement('h2', { style: h2Style }, 'What Are the Health Risks of PFAS in Drinking Water?'),
      React.createElement('p', { style: pStyle },
        'PFAS are called "forever chemicals" because they accumulate in the body and environment rather than breaking down. Peer-reviewed research links long-term PFAS exposure to:'
      ),
      React.createElement('ul', { style: { ...pStyle, paddingLeft: 20 } },
        React.createElement('li', null, 'Increased risk of certain cancers (kidney, testicular)'),
        React.createElement('li', null, 'Thyroid hormone disruption'),
        React.createElement('li', null, 'Reduced vaccine response in children'),
        React.createElement('li', null, 'High cholesterol and cardiovascular effects'),
        React.createElement('li', null, 'Pregnancy complications and low birth weight'),
      ),
      React.createElement('div', { style: warnStyle },
        React.createElement('strong', { style: { color: '#ef4444' } }, '⚠ Who is most at risk: '),
        'Pregnant women, infants and young children, people with thyroid conditions, and anyone with long-term exposure from multiple PFAS sources (water + food + household products). For these groups, filtering PFAS from drinking water is especially important.'
      ),

      React.createElement('h2', { style: h2Style }, 'Does SAWS Treat for PFAS?'),
      React.createElement('p', { style: pStyle },
        'SAWS is not currently required to treat for the unregulated short-chain compounds in this snapshot (PFBA, PFPeA). PFBS is part of the EPA Hazard Index calculation, not a standalone 4 ppt MCL. Check SAWS’s current annual report and notices for anything newer than this UCMR5 file.'
      ),
      React.createElement('p', { style: pStyle },
        'In the meantime, point-of-use filtration at your tap is the most reliable way to reduce PFAS in your drinking water regardless of what the public water system does upstream.'
      ),

      React.createElement('h2', { style: h2Style }, 'What Filters Remove PFAS from San Antonio Water?'),
      React.createElement('p', { style: pStyle },
        React.createElement('strong', { style: strongStyle }, 'The short answer: only reverse osmosis and NSF P473-certified carbon filters.'),
        ' Standard pitcher filters, refrigerator filters, boiling, and water softeners do not remove PFAS.'
      ),
      React.createElement('h3', { style: h3Style }, '1. Reverse Osmosis (Most Effective)'),
      React.createElement('p', { style: pStyle },
        'NSF 58-certified RO systems remove 94–99%+ of PFAS by forcing water through a membrane with pores smaller than PFAS molecules. For San Antonio, RO also removes radium, arsenic, hardness minerals, and sodium — making it the most comprehensive solution for SA\'s full contaminant profile.'
      ),
      React.createElement('h3', { style: h3Style }, '2. NSF P473-Certified Carbon Filters'),
      React.createElement('p', { style: pStyle },
        'High-capacity carbon block filters certified to NSF P473 (specifically for PFOA/PFOS) or NSF 244 can remove significant PFAS through adsorption. The Clearly Filtered pitcher is NSF/ANSI 42 and 372 certified; broader PFAS figures are published lab tests, not NSF listings. It requires no installation — a practical option for renters.'
      ),
      React.createElement('h3', { style: h3Style }, 'What Does NOT Work for PFAS'),
      React.createElement('div', { style: warnStyle },
        React.createElement('strong', { style: { color: '#ef4444' } }, '❌ These do not remove PFAS: '),
        'Standard Brita pitchers, PUR basic pitchers, most refrigerator filters, boiling, UV filters, water softeners, and sediment filters. Boiling is particularly counterproductive — it concentrates PFAS as water evaporates.'
      ),

      React.createElement('h2', { style: h2Style }, 'San Antonio PFAS: Bottom Line'),
      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#e2e8f0' } }, 'Key takeaways: '),
        React.createElement('br', null),
        '• UCMR5 for SAWS (TX0150018): PFBA 9.2 ppt, PFBS 3.8 ppt, PFPeA 3.2 ppt',
        React.createElement('br', null),
        '• 0 of 6 regulated PFAS above April 2024 MCL benchmarks in this snapshot',
        React.createElement('br', null),
        '• SAWS is not currently required to treat for PFBA',
        React.createElement('br', null),
        '• An NSF 58 RO system removes PFAS + radium + arsenic + hardness in one unit',
        React.createElement('br', null),
        '• See the full ',
        React.createElement('a', { href: '/water/san-antonio', style: linkStyle }, 'San Antonio water quality report'),
        ' for filter picks and all 2024 data'
      ),

      React.createElement('h2', { style: h2Style }, 'Frequently Asked Questions'),
      ...[
        { q: 'Does San Antonio tap water have PFAS?', a: 'Yes. The UCMR5 snapshot for SAWS (TX0150018) lists PFBA 9.2 ppt, PFBS 3.8 ppt, and PFPeA 3.2 ppt. Those are historical peaks for this supplier, not a test of your kitchen tap. See the San Antonio city report for the scored profile and filter context.' },
        { q: 'Is the PFAS level in San Antonio water dangerous?', a: 'None of the six EPA-regulated PFAS have peaks above April 2024 MCL benchmarks in this SAWS snapshot. Independent guidelines such as EWG’s 1 ppt are tighter. The EPA health goal (MCLG) for PFOA and PFOS is zero. A historical peak is not an official compliance finding.' },
        { q: 'How do I remove PFAS from San Antonio tap water?', a: 'Use a reverse osmosis system (NSF 58 certified) or a carbon pitcher with published PFAS lab tests. RO is the most comprehensive option — it also removes SA\'s radium, arsenic, and hardness minerals. Renters without the ability to install under-sink systems can use the Clearly Filtered pitcher (NSF/ANSI 42 and 372 certified; broader PFAS figures are lab tests, not NSF listings).' },
        { q: 'Does boiling San Antonio water remove PFAS?', a: 'No. Boiling concentrates PFAS because it evaporates water while leaving the chemicals behind. The remaining water has higher PFAS concentration after boiling, not lower.' },
        { q: 'Does SAWS test for PFAS?', a: 'Yes — SAWS was included in the EPA\'s mandatory UCMR5 PFAS testing program (2023–2025). Results are publicly available. SAWS also conducts its own monitoring. Check the SAWS website or watercheckup.com for current data.' },
      ].map(({ q, a }) =>
        React.createElement(React.Fragment, { key: q },
          React.createElement('h3', { style: h3Style }, q),
          React.createElement('p', { style: pStyle }, a),
        )
      ),
    ),
  },

};

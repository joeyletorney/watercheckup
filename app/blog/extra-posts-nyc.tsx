import React from 'react';
import type { Post } from './post-types';

const AMAZON_TAG = 'watercheck20-20';

const TOP_3_PITCHER = [
  {
    product: 'Clearly Filtered 3.5L Pitcher',
    brand: 'Clearly Filtered',
    price: '~$90',
    reason: 'NSF 42/53/244/401/P473 — removes lead at 99.5% and PFAS at 99.9%. Ideal for NYC renters without under-sink install.',
    link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher',
    amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`,
    badge: 'BEST FOR NYC RENTERS',
  },
  {
    product: 'Waterdrop Pitcher Filter',
    brand: 'Waterdrop',
    price: '~$40',
    reason: '7-stage filtration, 200-gallon filter life. Removes chlorine taste, PFOA/PFOS, and heavy metals. No plumber needed.',
    link: 'https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=anbyjkqb',
    amazon: `https://www.amazon.com/dp/B01JSJFBNE?tag=${AMAZON_TAG}`,
    badge: 'BEST VALUE',
  },
  {
    product: 'ZeroWater 10-Cup Pitcher',
    brand: 'ZeroWater',
    price: '~$40',
    reason: 'NSF 42/53 certified for lead and chromium. Includes TDS meter — useful in NYC where source water is already low-TDS.',
    link: 'https://www.zerowater.com/collections/pitchers',
    amazon: `https://www.amazon.com/dp/B0DWTTYTQN?tag=${AMAZON_TAG}`,
    badge: 'INCLUDES TDS METER',
  },
];

const TOP_3_RO = [
  {
    product: 'Waterdrop G3P800 RO',
    brand: 'Waterdrop',
    price: '~$849',
    reason: 'Tankless RO removes 99%+ PFAS, lead, and DBPs. Strong choice for NYC homeowners who control their plumbing.',
    link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb',
    amazon: `https://www.amazon.com/dp/B0987FCQQW?tag=${AMAZON_TAG}`,
    badge: 'EDITORS PICK',
  },
  {
    product: 'Aquasana SmartFlow RO',
    brand: 'Aquasana',
    price: '~$449',
    reason: 'WQA Gold Seal + NSF 42/53/58/401. Broad certification for PFAS and emerging contaminants.',
    link: 'https://www.aquasana.com/under-sink-water-filters',
    amazon: `https://www.amazon.com/dp/B0CHZ8VQBB?tag=${AMAZON_TAG}`,
    badge: 'MOST CERTIFIED',
  },
  {
    product: 'Epic Smart Shield Under-Sink',
    brand: 'Epic Water Filters',
    price: '~$129',
    reason: 'NSF 401 certified for PFAS without full RO. Good for apartments where RO install is difficult.',
    link: 'https://www.epicwaterfilters.com/products/smart-shield',
    amazon: `https://www.amazon.com/gp/product/B076S1W5QY?tag=${AMAZON_TAG}`,
    badge: 'NO RO REQUIRED',
  },
];

const h2Style: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '40px 0 14px', lineHeight: 1.3 };
const h3Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '28px 0 10px' };
const pStyle: React.CSSProperties = { margin: '0 0 20px', color: '#94a3b8', lineHeight: 1.85 };
const strongStyle: React.CSSProperties = { color: '#e2e8f0', fontWeight: 700 };
const calloutStyle: React.CSSProperties = {
  margin: '28px 0',
  padding: '18px 22px',
  background: '#0d2240',
  border: '1px solid #1a3a5c',
  borderRadius: 10,
  fontSize: 15,
  color: '#94a3b8',
  lineHeight: 1.75,
};
const warnStyle: React.CSSProperties = {
  margin: '28px 0',
  padding: '18px 22px',
  background: '#ef444410',
  border: '1px solid #ef444430',
  borderRadius: 10,
  fontSize: 15,
  color: '#94a3b8',
  lineHeight: 1.75,
};
const linkStyle: React.CSSProperties = { color: '#22d3ee', fontWeight: 700 };

export const EXTRA_POSTS_NYC: Record<string, Post> = {
  'is-new-york-city-tap-water-safe-2026': {
    title: 'Is New York City Tap Water Safe to Drink in 2026?',
    excerpt:
      'NYC has some of the best municipal source water in the country — but building pipes, lead, and PFAS still matter. Here is what the 2026 data shows for residents.',
    seo: {
      title: 'Is New York City Tap Water Safe to Drink in 2026? | WaterCheckup',
      description:
        'NYC tap water is famous for quality — but lead in older buildings and PFAS are real concerns. See EPA data, health risks, and what to do in 2026.',
    },
    date: '2026-05-18',
    dateDisplay: 'May 18, 2026',
    readTime: '9 min read',
    badge: 'NYC',
    badgeColor: '#0891b2',
    topPicks: TOP_3_PITCHER,
    content: React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'p',
        { style: pStyle },
        'New Yorkers love to brag about their tap water — and for good reason. Much of it travels from the ',
        React.createElement('strong', { style: strongStyle }, 'Catskill and Delaware watersheds'),
        ', protected land with minimal industrial runoff. NYCDEP treats and delivers water that routinely ranks among the best of any large U.S. city.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'So is NYC tap water safe in 2026? The honest answer: ',
        React.createElement('strong', { style: strongStyle }, 'yes for most people, most of the time'),
        ' — but “safe” depends on what happens ',
        React.createElement('em', null, 'after'),
        ' the water leaves the reservoir. Lead in building plumbing, disinfection byproducts, and emerging PFAS detections are the issues that actually affect New Yorkers at the faucet.',
      ),

      React.createElement('h2', { style: h2Style }, 'What makes NYC water different'),
      React.createElement(
        'p',
        { style: pStyle },
        'Unlike cities that rely heavily on groundwater or the Colorado River, NYC gets ',
        React.createElement('strong', { style: strongStyle }, 'surface water from protected upstate reservoirs'),
        '. That means lower natural hardness, excellent baseline quality, and no need for the aggressive treatment some Southwest utilities use.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'The NYC Department of Environmental Protection (NYCDEP) serves about ',
        React.createElement('strong', { style: strongStyle }, '9 million residents'),
        ' across five boroughs. Annual water quality reports consistently show compliance with federal Maximum Contaminant Levels (MCLs) for regulated contaminants at the distribution system level.',
      ),
      React.createElement(
        'div',
        { style: calloutStyle },
        React.createElement('strong', { style: strongStyle }, 'The catch: '),
        'Municipal compliance at the street main does not guarantee what comes out of ',
        React.createElement('em', null, 'your'),
        ' kitchen faucet — especially in pre-war buildings with aging pipes.',
      ),

      React.createElement('h2', { style: h2Style }, 'The real NYC risk: lead in building pipes'),
      React.createElement(
        'p',
        { style: pStyle },
        'Lead almost never comes from the Catskill reservoirs. It comes from ',
        React.createElement('strong', { style: strongStyle }, 'lead service lines, lead solder, and brass fixtures'),
        ' inside older buildings — especially those built before 1986, and pre-1961 for lead solder.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'When water sits stagnant in lead plumbing overnight, lead can dissolve into the water you drink first thing in the morning. NYCDEP adds corrosion control to reduce this, but it cannot eliminate lead inside private plumbing.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'If you live in a pre-war co-op, brownstone, or older rental:',
      ),
      React.createElement(
        'ul',
        { style: { ...pStyle, paddingLeft: 22 } },
        React.createElement('li', { style: { marginBottom: 8 } }, 'Run cold water for 30–60 seconds before drinking or cooking'),
        React.createElement('li', { style: { marginBottom: 8 } }, 'Never use hot tap water for drinking or baby formula'),
        React.createElement('li', { style: { marginBottom: 8 } }, 'Use an NSF 53-certified filter certified for lead reduction'),
        React.createElement(
          'li',
          { style: { marginBottom: 8 } },
          'Check ',
          React.createElement(
            'a',
            { href: 'https://www.nyc.gov/site/dep/environment/lead-service-lines.page', style: linkStyle },
            'NYCDEP lead guidance',
          ),
          ' and consider a home lead test if you have young children',
        ),
      ),

      React.createElement('h2', { style: h2Style }, 'PFAS and disinfection byproducts in NYC'),
      React.createElement(
        'p',
        { style: pStyle },
        'NYC water is chlorinated for disinfection — necessary and effective, but it creates ',
        React.createElement('strong', { style: strongStyle }, 'trihalomethanes (TTHMs) and haloacetic acids (HAA5)'),
        ' when chlorine reacts with natural organic matter. These are regulated and typically below EPA limits, but EWG health guidelines are far stricter than federal law.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'PFAS (“forever chemicals”) have also been detected in NYC water at low levels in EPA monitoring and third-party databases. The EPA set enforceable limits for PFOA and PFOS in 2024. NYC utilities are working to meet them — but many health advocates argue even tiny amounts carry long-term risk.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'For a deeper dive on PFAS specifically, read our guide: ',
        React.createElement(
          'a',
          { href: '/blog/pfas-in-new-york-city-water', style: linkStyle },
          'PFAS in New York City Water',
        ),
        '.',
      ),

      React.createElement('h2', { style: h2Style }, 'NYC tap water vs bottled water'),
      React.createElement(
        'p',
        { style: pStyle },
        'Bottled water is not automatically safer. Many brands are purified tap water. NYC tap water costs about ',
        React.createElement('strong', { style: strongStyle }, '$0.01 per gallon'),
        ' from the faucet versus $1–$3 for bottled. Environmentally and financially, filtered NYC tap water is the rational choice for most households.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'The exception: if you are in an older building with known lead plumbing and no filter, bottled or filtered water is prudent until you verify your tap water with a test.',
      ),

      React.createElement('h2', { style: h2Style }, 'How to check your water in 2026'),
      React.createElement(
        'p',
        { style: pStyle },
        'Three steps every NYC resident should take:',
      ),
      React.createElement(
        'ol',
        { style: { ...pStyle, paddingLeft: 22 } },
        React.createElement(
          'li',
          { style: { marginBottom: 10 } },
          React.createElement(
            'strong',
            { style: strongStyle },
            'Read your building age and plumbing.',
          ),
          ' Pre-1986 = elevated lead risk.',
        ),
        React.createElement(
          'li',
          { style: { marginBottom: 10 } },
          React.createElement('strong', { style: strongStyle }, 'Check your ZIP on WaterCheckup.'),
          ' Enter your address to see EPA violation history, PFAS UCMR5 data, and contaminant levels for your utility: ',
          React.createElement('a', { href: '/water/new-york', style: linkStyle }, 'NYC water quality report'),
          '.',
        ),
        React.createElement(
          'li',
          { style: { marginBottom: 10 } },
          React.createElement('strong', { style: strongStyle }, 'Read the annual CCR.'),
          ' NYCDEP publishes a Consumer Confidence Report each year — ',
          React.createElement(
            'a',
            { href: '/blog/how-to-read-your-consumer-confidence-report', style: linkStyle },
            'here is how to read it',
          ),
          '.',
        ),
      ),

      React.createElement('h2', { style: h2Style }, 'Bottom line for 2026'),
      React.createElement(
        'p',
        { style: pStyle },
        React.createElement('strong', { style: strongStyle }, 'NYC tap water is safe to drink for most residents'),
        ' when you account for building-specific risks. The municipal supply is excellent. Your job is to know your building, filter if needed, and not assume “great city water” means zero lead or PFAS at your tap.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'Renters: a certified pitcher filter is the fastest fix. Homeowners: consider under-sink RO or NSF 53 filtration at the kitchen tap. Parents in older buildings: test for lead — no guesswork beats a lab result.',
      ),
    ),
  },

  'pfas-in-new-york-city-water': {
    title: 'PFAS in New York City Water — What Residents Need to Know',
    excerpt:
      'PFAS forever chemicals have been detected in NYC tap water. Here is what the 2026 EPA limits mean, how NYCDEP water compares, and which filters actually remove PFAS.',
    seo: {
      title: 'PFAS in New York City Water — What Residents Need to Know (2026) | WaterCheckup',
      description:
        'PFAS detected in NYC tap water above health guidelines. Learn PFOA/PFOS limits, UCMR5 data, health risks, and NSF-certified filters that remove forever chemicals.',
    },
    date: '2026-05-18',
    dateDisplay: 'May 18, 2026',
    readTime: '8 min read',
    badge: 'PFAS',
    badgeColor: '#0891b2',
    topPicks: TOP_3_RO,
    content: React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'p',
        { style: pStyle },
        'If you live in New York City and have heard about “forever chemicals” in tap water, you are not imagining it. ',
        React.createElement('strong', { style: strongStyle }, 'PFAS compounds have been detected'),
        ' in NYC’s water supply — typically at levels below new federal limits, but often above the far stricter health guidelines published by EWG and state agencies.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'This guide explains what PFAS are, how they get into NYC water, what changed in 2024–2026 regulation, and what you can actually do to reduce exposure at home.',
      ),

      React.createElement('h2', { style: h2Style }, 'What is PFAS?'),
      React.createElement(
        'p',
        { style: pStyle },
        'PFAS (per- and polyfluoroalkyl substances) are a family of thousands of synthetic chemicals used since the 1940s in non-stick cookware, waterproof fabrics, food packaging, and — critically — ',
        React.createElement('strong', { style: strongStyle }, 'aqueous film-forming foam (AFFF)'),
        ' used at airports and military bases for firefighting.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'They are called forever chemicals because the carbon-fluorine bond does not break down easily in the environment or in the human body. They accumulate over time.',
      ),
      React.createElement(
        'div',
        { style: warnStyle },
        React.createElement('strong', { style: { color: '#ef4444' } }, 'Health concerns: '),
        'Kidney and testicular cancer, thyroid disease, immune suppression, elevated cholesterol, pregnancy complications, and developmental effects in children — linked to long-term PFAS exposure in epidemiological studies.',
      ),

      React.createElement('h2', { style: h2Style }, 'How PFAS reaches NYC tap water'),
      React.createElement(
        'p',
        { style: pStyle },
        'NYC’s water comes from upstate reservoirs — not from industrial zones in the five boroughs. But PFAS can still enter the system through:',
      ),
      React.createElement(
        'ul',
        { style: { ...pStyle, paddingLeft: 22 } },
        React.createElement('li', { style: { marginBottom: 8 } }, 'Industrial discharge upstream in the watershed'),
        React.createElement('li', { style: { marginBottom: 8 } }, 'Military and airport sites in the broader region'),
        React.createElement('li', { style: { marginBottom: 8 } }, 'Wastewater treatment plant effluent that returns to source waters'),
        React.createElement('li', { style: { marginBottom: 8 } }, 'Consumer product breakdown in the environment over decades'),
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'Once in water, PFAS is difficult for conventional treatment plants to remove completely. Granular activated carbon and reverse osmosis are the technologies that work — not standard pitcher carbon alone unless certified.',
      ),

      React.createElement('h2', { style: h2Style }, 'EPA limits in 2026: what changed'),
      React.createElement(
        'p',
        { style: pStyle },
        'In April 2024, the EPA finalized enforceable limits for six PFAS compounds, including:',
      ),
      React.createElement(
        'ul',
        { style: { ...pStyle, paddingLeft: 22 } },
        React.createElement('li', { style: { marginBottom: 8 } }, React.createElement('strong', { style: strongStyle }, 'PFOA: 4 ppt')),
        React.createElement('li', { style: { marginBottom: 8 } }, React.createElement('strong', { style: strongStyle }, 'PFOS: 4 ppt')),
        React.createElement('li', { style: { marginBottom: 8 } }, React.createElement('strong', { style: strongStyle }, 'PFNA, PFHxS, GenX, PFBS: 10 ppt')),
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'Utilities nationwide — including NYCDEP — must comply. That is a major step forward. But EWG’s health guidelines for PFOA and PFOS are ',
        React.createElement('strong', { style: strongStyle }, '0.001 ppt'),
        ' — thousands of times lower than the legal limit. “Legal” and “optimal for health” are not the same.',
      ),

      React.createElement('h2', { style: h2Style }, 'What monitoring shows for NYC'),
      React.createElement(
        'p',
        { style: pStyle },
        'EPA’s Unregulated Contaminant Monitoring Rule (UCMR5) and state reporting have detected PFAS compounds in many large U.S. systems, including New York. Levels vary by season, source water blend, and which compounds are measured.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'To see PFAS and other contaminants tied to your utility and ZIP code, use our free report: ',
        React.createElement('a', { href: '/water/new-york', style: linkStyle }, 'New York City water quality data'),
        '. Enter any NYC ZIP (10001, 11201, 10451, etc.) for utility-specific results.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'For context on PFAS nationally, see: ',
        React.createElement('a', { href: '/blog/is-pfas-in-my-tap-water', style: linkStyle }, 'Is PFAS in My Tap Water?'),
        ' and ',
        React.createElement('a', { href: '/blog/what-water-filter-removes-pfas', style: linkStyle }, 'What Water Filter Removes PFAS?'),
        '.',
      ),

      React.createElement('h2', { style: h2Style }, 'Who faces the highest risk in NYC'),
      React.createElement(
        'p',
        { style: pStyle },
        React.createElement('strong', { style: strongStyle }, 'Pregnant women and infants'),
        ' — PFAS crosses the placenta and appears in breast milk. Developing bodies are more vulnerable.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        React.createElement('strong', { style: strongStyle }, 'Families in older buildings'),
        ' — PFAS is one concern; lead from plumbing is another. A filter that handles both (NSF 53 + 401 or RO) is worth the investment.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        React.createElement('strong', { style: strongStyle }, 'Anyone drinking unfiltered tap water daily'),
        ' — cumulative low-dose exposure is what epidemiology is still quantifying. Prudent reduction is reasonable even when levels are below MCL.',
      ),

      React.createElement('h2', { style: h2Style }, 'What actually removes PFAS at home'),
      React.createElement(
        'p',
        { style: pStyle },
        'Not all filters remove PFAS. Look for:',
      ),
      React.createElement(
        'ul',
        { style: { ...pStyle, paddingLeft: 22 } },
        React.createElement(
          'li',
          { style: { marginBottom: 8 } },
          React.createElement('strong', { style: strongStyle }, 'NSF/ANSI 58'),
          ' — reverse osmosis systems (99%+ reduction for many PFAS)',
        ),
        React.createElement(
          'li',
          { style: { marginBottom: 8 } },
          React.createElement('strong', { style: strongStyle }, 'NSF/ANSI 401'),
          ' — emerging contaminants including some PFAS on carbon systems',
        ),
        React.createElement(
          'li',
          { style: { marginBottom: 8 } },
          React.createElement('strong', { style: strongStyle }, 'NSF P473'),
          ' — specific PFAS reduction claims on select pitchers',
        ),
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'Standard Brita filters improve taste but are ',
        React.createElement('strong', { style: strongStyle }, 'not certified for PFAS'),
        '. Do not assume any carbon filter works — verify the certification on the product listing.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'For NYC renters, the ',
        React.createElement('strong', { style: strongStyle }, 'Clearly Filtered pitcher'),
        ' (NSF P473) is a practical no-install option. Homeowners often choose under-sink RO for the strongest reduction across PFAS, lead, and disinfection byproducts.',
      ),

      React.createElement('h2', { style: h2Style }, 'Bottled water and PFAS'),
      React.createElement(
        'p',
        { style: pStyle },
        'Some bottled waters have tested positive for PFAS. Bottled is not PFAS-free by default. Filtered NYC tap water with a certified system is often the better long-term approach — lower cost, less plastic, and you control the maintenance schedule.',
      ),

      React.createElement('h2', { style: h2Style }, 'Bottom line for NYC residents'),
      React.createElement(
        'p',
        { style: pStyle },
        'PFAS in NYC water is a ',
        React.createElement('strong', { style: strongStyle }, 'real but manageable'),
        ' concern in 2026. Federal limits now exist, monitoring is expanding, and NYCDEP is obligated to comply. Your best move: check your ZIP data, use a certified filter if you want extra protection, and stay informed as UCMR5 and state reporting update.',
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'Questions about overall NYC safety beyond PFAS? Read: ',
        React.createElement(
          'a',
          { href: '/blog/is-new-york-city-tap-water-safe-2026', style: linkStyle },
          'Is New York City Tap Water Safe to Drink in 2026?',
        ),
        '.',
      ),
    ),
  },
};

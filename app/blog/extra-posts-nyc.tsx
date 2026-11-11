import React from 'react';
import type { Post } from './post-types';

const AMAZON_TAG = 'watercheckup-20';

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
    amazon: `https://www.amazon.com/dp/B07C3P2RZP?tag=${AMAZON_TAG}`,
    badge: 'BEST VALUE',
  },
  {
    product: 'ZeroWater 10-Cup Pitcher',
    brand: 'ZeroWater',
    price: '~$40',
    reason: 'NSF 42/53 certified for lead and chromium. Includes TDS meter — useful in NYC where source water is already low-TDS.',
    link: 'https://zerowater.com/collections/water-filter-pitchers-dispensers',
    amazon: `https://www.amazon.com/dp/B0DWTTYTQN?tag=${AMAZON_TAG}`,
    badge: 'INCLUDES TDS METER',
  },
];

const TOP_3_RO = [
  {
    product: 'Waterdrop G3P600 RO',
    brand: 'Waterdrop',
    price: '~$439',
    reason: 'Tankless RO removes 99%+ PFAS, lead, and DBPs. Strong choice for NYC homeowners who control their plumbing.',
    link: 'https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=anbyjkqb',
    amazon: `https://www.amazon.com/dp/B07P1XFYJP?tag=${AMAZON_TAG}`,
    badge: 'EDITORS PICK',
  },
    {
    product: 'Waterdrop G3P600 RO',
    brand: 'Waterdrop',
    price: '~$439',
    reason: 'Tankless design with smart LED faucet — with strong NSF certification. NSF 42/53/58/372, 600 GPD, removes 99%+ PFAS, lead, and DBPs. Best value for NYC homeowners.',
    link: `https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=anbyjkqb`,
    amazon: `https://www.amazon.com/dp/B07P1XFYJP?tag=watercheckup-20`,
    badge: 'BEST VALUE',
  },
  {
    product: 'Epic Smart Shield Under-Sink',
    brand: 'Epic Water Filters',
    price: '~$129',
    reason: 'NSF 401 certified for PFAS without full RO. Good for apartments where RO install is difficult.',
    link: 'https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system',
    amazon: `https://www.amazon.com/gp/product/B076S1W5QY?tag=${AMAZON_TAG}`,
    badge: 'NO RO REQUIRED',
  },
];

const h2Style: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '56px 0 18px', lineHeight: 1.3 };
const h3Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '40px 0 14px' };
const pStyle: React.CSSProperties = { margin: '0 0 20px', color: '#cbd5e1', lineHeight: 1.85 };
const strongStyle: React.CSSProperties = { color: '#e2e8f0', fontWeight: 700 };
const calloutStyle: React.CSSProperties = {
  margin: '40px 0',
  padding: '18px 22px',
  background: '#0d2240',
  border: '1px solid #1a3a5c',
  borderRadius: 10,
  fontSize: 15,
  color: '#cbd5e1',
  lineHeight: 1.75,
};
const warnStyle: React.CSSProperties = {
  margin: '40px 0',
  padding: '18px 22px',
  background: '#ef444410',
  border: '1px solid #ef444430',
  borderRadius: 10,
  fontSize: 15,
  color: '#cbd5e1',
  lineHeight: 1.75,
};
const linkStyle: React.CSSProperties = { color: '#22d3ee', fontWeight: 700 };

export const EXTRA_POSTS_NYC: Record<string, Post> = {
  'is-new-york-city-tap-water-safe-2026': {
    title: 'Is New York City Tap Water Safe to Drink in 2026?',
    excerpt:
      'NYC has some of the best municipal source water in the country — but building pipes, lead, and PFAS still matter. Here is what the 2026 data shows for residents.',
    seo: {
      title: 'Is NYC Tap Water Safe in 2026? Lead, PFAS & What to Know',
      description:
        'Great source water — older buildings can still add lead at the tap. PFAS monitoring, DEP context, and filter picks for NYC renters & owners.',
    },
    date: '2026-05-18',
    dateModified: '2026-06-04',
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

      React.createElement(
        'p',
        { style: pStyle },
        'For the scored breakdown with letter grade, PFAS data, and filter picks, see our ',
        React.createElement('a', { href: '/water/new-york', style: linkStyle }, 'New York City water quality report'),
        '.',
      ),

      React.createElement('h2', { style: h2Style }, 'What makes NYC water different'),
      React.createElement(
        'p',
        { style: pStyle },
        'Unlike cities that rely heavily on groundwater or the Colorado River, NYC gets ',
        React.createElement('strong', { style: strongStyle }, 'surface water from protected upstate reservoirs'),
        '. That means lower natural hardness, excellent baseline quality, and no need for the aggressive treatment some Southwest public water systems use.',
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
        'PFAS (“forever chemicals”) have also been detected in NYC water at low levels in EPA monitoring and third-party databases. The EPA set enforceable limits for PFOA and PFOS in 2024. NYC public water systems are working to meet them — but many health advocates argue even tiny amounts carry long-term risk.',
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
          ' Enter your address to see EPA violation history, PFAS UCMR5 data, and contaminant levels for your public water system: ',
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
      'How to verify NYCDEP water results, understand gaps in historical PFAS data, and decide whether household testing or filtration is appropriate.',
    seo: {
      title: 'PFAS in New York City Water — What Residents Need to Know (2026) | WaterCheckup',
      description:
        'Verify NYCDEP supplier information, historical data coverage, and household testing options before choosing filtration.',
    },
    date: '2026-05-18',
    dateDisplay: 'May 18, 2026',
    readTime: '8 min read',
    badge: 'PFAS',
    badgeColor: '#0891b2',
    topPicks: TOP_3_RO,
    content: React.createElement('div', null,
      React.createElement('h2', null, 'What do we know about NYCDEP water?'),
      React.createElement('p', null, 'New York City System is PWSID NY7003493. Our packaged UCMR5 snapshot has no matching record for that supplier. We cannot infer either a detection or a nondetection from that gap, and we do not substitute another New York supplier’s measurements.'),
      React.createElement('p', null, React.createElement('a', { href: 'https://www.nyc.gov/site/dep/water/drinking-water-quality-report.page' }, 'Read NYCDEP’s current drinking-water quality report'), ' for supplier monitoring and sampling dates. A historical individual peak is not an official compliance finding; regulatory determinations use the applicable monitoring and averaging rules.'),
      React.createElement('h2', null, 'What should you do at home?'),
      React.createElement('p', null, 'Confirm the supplier on your water bill. For lead questions, check your building’s service-line and plumbing information. A certified laboratory test is the appropriate next step when you need an address-level answer.'),
      React.createElement('h2', null, 'Do you need a filter?'),
      React.createElement('p', null, 'Choose treatment for a documented concern, not a missing data point. Verify the exact model and cartridge’s current certification for the contaminant you want to reduce, its capacity, and replacement interval. A general NSF standard number alone does not establish every reduction claim.'),
    ),
  },
};

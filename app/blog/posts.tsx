import React from 'react';
import type { Post } from './post-types';
import { EXTRA_POSTS } from './extra-posts';
import { EXTRA_POSTS_2 } from './extra-posts-2';
import { EXTRA_POSTS_3 } from './extra-posts-3';
import { EXTRA_POSTS_4 } from './extra-posts-4';
import { EXTRA_POSTS_5 } from './extra-posts-5';
import { EXTRA_POSTS_NYC } from './extra-posts-nyc';
import { EXTRA_POSTS_SA } from './extra-posts-sa';

const WATERDROP = 'https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=anbyjkqb';
const AMAZON_TAG = 'watercheck20-20';
// Shared top-3 pick sets used across blog posts
const TOP_3_RO = [
  { product: 'Waterdrop G3P600 RO', brand: 'Waterdrop', price: '~$439', reason: 'Tankless design with smart LED faucet — with strong NSF certification. NSF 42/53/58/372 certified, 600 GPD, removes 99%+ PFAS and lead. Best value under-sink RO.', link: `https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=anbyjkqb`, amazon: `https://www.amazon.com/dp/B07P1XFYJP?tag=watercheck20-20`, badge: 'BEST VALUE' },
  { product: 'Waterdrop K19-S Countertop RO', brand: 'Waterdrop', price: '~$249', reason: 'No installation — plug in for NSF-certified RO. Strong pick for renters who need PFAS and lead removal.', link: `https://www.waterdropfilter.com/products/countertop-ro-water-filter-system-wd-k19-s?ref=anbyjkqb`, amazon: `https://www.amazon.com/dp/B0BHQRNGZ8?tag=${AMAZON_TAG}`, badge: 'FOR RENTERS' },
  { product: 'AquaTru Under-Sink RO', brand: 'AquaTru', price: '~$375', reason: 'NSF 42/53/58 certified. Quick-change filters swap in seconds with no tools. Compact tankless design.', link: 'https://www.aquatruwater.com/under-sink-reverse-osmosis-water-purifier', amazon: `https://www.amazon.com/dp/B0GGTSFZMY?tag=${AMAZON_TAG}`, badge: 'EASIEST FILTER CHANGE' },
];
/** Lead blog — #1–3 RO, #4–7 under-counter carbon, #8–10 pitchers (homepage-aligned). */
const TOP_10_LEAD = [
  {
    product: 'Waterdrop G3P600',
    brand: 'Waterdrop',
    price: '~$439',
    reason:
      'Tankless under-sink RO — NSF 42/53/58/372. Removes 99%+ lead and PFAS; smart faucet TDS display. Top RO pick for homeowners.',
    link: WATERDROP,
    amazon: `https://www.amazon.com/dp/B07P1XFYJP?tag=${AMAZON_TAG}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: 'Aquasana SmartFlow RO',
    brand: 'Aquasana',
    price: '~$449',
    reason:
      'WQA Gold Seal plus NSF 42/53/58/401 — broadest certification stack in this price range. Removes 99%+ lead and microplastics.',
    link: 'https://www.aquasana.com/under-sink-water-filters',
    amazon: `https://www.amazon.com/dp/B0CHZ8VQBB?tag=${AMAZON_TAG}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: 'AquaTru Under-Sink RO',
    brand: 'AquaTru',
    price: '~$375',
    reason:
      'NSF 42/53/58 certified tankless RO. Quick-change filters swap in seconds — compact under-sink install without a storage tank.',
    link: 'https://www.aquatruwater.com/under-sink-reverse-osmosis-water-purifier',
    amazon: `https://www.amazon.com/dp/B0GGTSFZMY?tag=${AMAZON_TAG}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: 'Frizzlife MK99',
    brand: 'Frizzlife',
    price: '~$59',
    reason:
      'Under-sink carbon block (not RO). NSF/ANSI 53 for lead — quick-change cartridges, installs in minutes. Best-value under-counter pick.',
    link: 'https://www.frizzlife.com/products/undersink-water-filter-system-mk99',
    amazon: `https://www.amazon.com/dp/B07ZY9RVN2?tag=${AMAZON_TAG}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Frizzlife SK99',
    brand: 'Frizzlife',
    price: '~$126',
    reason:
      'Dual-stage under-sink filter — NSF/ANSI 53 lead reduction (~99.9% on listings) without RO waste water. Quick-change twist-off filters.',
    link: 'https://www.frizzlife.com/products/undersink-water-filter-system-sk99',
    amazon: `https://www.amazon.com/dp/B084HW5BMT?tag=${AMAZON_TAG}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Epic Smart Shield',
    brand: 'Epic Water Filters',
    price: '~$129',
    reason:
      'Compact under-sink system — NSF/ANSI 53 for lead plus NSF/ANSI 401 for emerging contaminants. Strong non-RO option under the counter.',
    link: 'https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system',
    amazon: `https://www.amazon.com/gp/product/B076S1W5QY?tag=${AMAZON_TAG}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Aquasana Claryum 3-Stage',
    brand: 'Aquasana',
    price: '~$200',
    reason:
      'Three-stage under-sink carbon (no RO). NSF/ANSI 42, 53, and 401 on listings — lead, PFAS, and pharmaceuticals without RO waste water.',
    link: 'https://www.aquasana.com/water-filters/under-sink/claryum-3-stage',
    amazon: `https://www.amazon.com/dp/B00CX8R5Q8?tag=${AMAZON_TAG}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'ZeroWater 10-Cup Pitcher',
    brand: 'ZeroWater',
    price: '~$40',
    reason:
      'NSF/ANSI 42 & 53 certified for lead reduction. Includes a TDS meter. Best budget pitcher — no plumbing.',
    link: 'https://www.zerowater.com/collections/pitchers',
    amazon: `https://www.amazon.com/dp/B0DWTTYTQN?tag=${AMAZON_TAG}`,
    badge: 'PITCHER',
  },
  {
    product: 'PUR PLUS 11-Cup Pitcher',
    brand: 'PUR',
    price: '~$42',
    reason:
      'NSF/ANSI 42 & 53 certified. Lead, arsenic, and uranium reduction on listings — widely available at big-box stores.',
    link: 'https://www.pur.com/water-filters/pitcher-filters',
    amazon: `https://www.amazon.com/dp/B09LKTLVNR?tag=${AMAZON_TAG}`,
    badge: 'PITCHER',
  },
  {
    product: 'Waterdrop Pitcher Filter',
    brand: 'Waterdrop',
    price: '~$40',
    reason:
      '7-stage pitcher filtration, 200-gallon filter life. NSF 53 listings for lead and heavy metals — no installation.',
    link: 'https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=anbyjkqb',
    amazon: `https://www.amazon.com/dp/B01JSJFBNE?tag=${AMAZON_TAG}`,
    badge: 'PITCHER',
  },
];
const TOP_3_PITCHER = [
  { product: 'Clearly Filtered 3.5L Pitcher', brand: 'Clearly Filtered', price: '~$90', reason: 'Only pitcher certified to remove PFAS at 99.9%. NSF 42/53/244/401/P473. Handles 365+ contaminants.', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK', outOfStock: true },
  { product: 'Waterdrop Pitcher Filter', brand: 'Waterdrop', price: '~$40', reason: '7-stage filtration, 200-gallon filter life. Removes chlorine, PFOA/PFOS, heavy metals. No installation needed.', link: 'https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=anbyjkqb', amazon: `https://www.amazon.com/dp/B01JSJFBNE?tag=${AMAZON_TAG}`, badge: 'BEST VALUE' },
  { product: 'ZeroWater 10-Cup Pitcher', brand: 'ZeroWater', price: '~$40', reason: 'Reduces TDS to zero. NSF 42/53. Removes lead, chromium, and arsenic. Comes with a TDS testing meter.', link: 'https://www.zerowater.com/collections/pitchers', amazon: `https://www.amazon.com/dp/B0DWTTYTQN?tag=${AMAZON_TAG}`, badge: 'REMOVES TDS' },
];


const h2Style: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '56px 0 18px', lineHeight: 1.3 };
const h3Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '40px 0 14px' };
const pStyle: React.CSSProperties = { margin: '0 0 20px', color: '#cbd5e1', lineHeight: 1.85 };
const strongStyle: React.CSSProperties = { color: '#e2e8f0', fontWeight: 700 };
const calloutStyle: React.CSSProperties = { margin: '40px 0', padding: '18px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, fontSize: 15, color: '#cbd5e1', lineHeight: 1.75 };
const warnStyle: React.CSSProperties = { margin: '40px 0', padding: '18px 22px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: 10, fontSize: 15, color: '#cbd5e1', lineHeight: 1.75 };
const linkStyle: React.CSSProperties = { color: '#22d3ee', fontWeight: 600, textDecoration: 'none' };

const LEAD_FILTER_FAQ = [
  {
    q: 'What is the best water filter for lead removal?',
    a: 'For maximum lead removal, start with an under-sink RO (Waterdrop G3P600, Aquasana SmartFlow, or AquaTru). If you want lead reduction without RO, our under-counter picks are Frizzlife MK99 and SK99, Epic Smart Shield, and Aquasana Claryum 3-Stage — all NSF/ANSI 53 for lead on certified listings. Renters can use NSF 53 pitchers: ZeroWater, PUR PLUS, or Waterdrop pitcher filters.',
  },
  {
    q: 'Do all water filters remove lead?',
    a: 'No. Most standard pitcher filters are not certified to remove lead. You need a filter certified to NSF/ANSI Standard 53 specifically for lead reduction. Always check the certification before buying.',
  },
  {
    q: 'How does lead get into tap water?',
    a: 'Lead almost always enters tap water from aging pipes, lead solder, or brass fittings inside your home — not from the treatment plant. Homes built before 1986 are most at risk.',
  },
  {
    q: 'What NSF certification should I look for in a lead filter?',
    a: 'Look for NSF/ANSI Standard 53, which certifies filters specifically for health-related contaminant reduction including lead. For reverse osmosis systems, also look for NSF/ANSI 58.',
  },
  {
    q: 'Is there a safe level of lead in drinking water?',
    a: 'No. The EPA has set the maximum contaminant level goal for lead at zero, meaning no amount of lead in drinking water is considered safe, particularly for children and pregnant women.',
  },
] as const;

export const POSTS: Record<string, Post> = {
  'is-pfas-in-my-tap-water': {
    title: 'Is PFAS in My Tap Water? What the EPA Data Actually Shows',
    excerpt: 'PFAS "forever chemicals" have been found in 45% of US tap water. Here\'s how to find out if your water is affected — and what to do about it.',
    date: '2026-03-28',
    dateDisplay: 'March 28, 2026',
    readTime: '8 min read',
    badge: 'PFAS',
    badgeColor: '#0891b2',
    topPicks: TOP_3_RO,
    content: React.createElement(React.Fragment, null,
      React.createElement('p', { style: pStyle },
        'In 2023, the US Geological Survey released a landmark study: PFAS "forever chemicals" were detected in ',
        React.createElement('strong', { style: strongStyle }, '45% of US tap water samples'),
        '. Not 4.5%. Forty-five percent. Nearly half of all American homes may have PFAS flowing from their taps right now — and most people have no idea.'
      ),
      React.createElement('p', { style: pStyle },
        'This guide will tell you exactly what PFAS are, where they come from, how to find out if your water is affected, and — most importantly — what actually removes them.'
      ),

      React.createElement('h2', { style: h2Style }, 'What Are PFAS?'),
      React.createElement('p', { style: pStyle },
        'PFAS stands for per- and polyfluoroalkyl substances. There are over 12,000 PFAS compounds, and what they all share is an extremely strong carbon-fluorine bond — the strongest bond in organic chemistry. That\'s why they\'re called "forever chemicals." They don\'t break down in the environment. They don\'t break down in your body. They accumulate.'
      ),
      React.createElement('p', { style: pStyle },
        'PFAS were invented in the 1940s and used in everything: non-stick cookware, waterproof clothing, food packaging, firefighting foam, stain-resistant carpet, and hundreds of industrial processes. Decades of manufacturing and disposal have put PFAS into groundwater, rivers, and ultimately your tap water.'
      ),
      React.createElement('div', { style: warnStyle },
        React.createElement('strong', { style: { color: '#ef4444' } }, '⚠ Health risks linked to PFAS exposure: '),
        'Kidney cancer, testicular cancer, thyroid disease, immune system suppression, hormone disruption, high cholesterol, pregnancy complications, and reduced vaccine effectiveness in children.'
      ),

      React.createElement('h2', { style: h2Style }, 'How PFAS Gets Into Your Tap Water'),
      React.createElement('p', { style: pStyle },
        'The main sources are military bases (AFFF firefighting foam), industrial manufacturing plants, landfills, and wastewater treatment plants that can\'t filter PFAS out. PFAS leach into groundwater and travel long distances — meaning your public water system\'s source water can be contaminated even if there\'s no PFAS facility nearby.'
      ),
      React.createElement('p', { style: pStyle },
        'The EPA finalized its first-ever PFAS drinking water standard in April 2024, setting limits for PFOA and PFOS at ',
        React.createElement('strong', { style: strongStyle }, '4 parts per trillion'),
        ' — down from the previous health advisory of 70 ppt. That\'s an 18x tightening of the standard. It signals how serious the agency now considers this threat.'
      ),

      React.createElement('h2', { style: h2Style }, 'How to Find Out If PFAS Is in Your Water'),
      React.createElement('p', { style: pStyle },
        'There are three ways to check:'
      ),
      React.createElement('h3', { style: h3Style }, '1. Enter Your ZIP on WaterCheckup'),
      React.createElement('p', { style: pStyle },
        'Our free tool pulls live EPA SDWIS data and UCMR5 PFAS monitoring results for your exact water system. Enter your ZIP above and look for PFAS in your contaminant list.'
      ),
      React.createElement('h3', { style: h3Style }, '2. Read Your Annual Water Quality Report (CCR)'),
      React.createElement('p', { style: pStyle },
        'Every public water system is required to send customers an annual Consumer Confidence Report (CCR) by July 1st. Starting with the 2024 reporting year, public water systems must include PFAS results if they\'re above the new EPA limits. Call your public water system and ask for the most recent CCR.'
      ),
      React.createElement('h3', { style: h3Style }, '3. Order a Home Water Test'),
      React.createElement('p', { style: pStyle },
        'A certified lab test for PFAS runs $150-300 and gives you the most granular data. Look for labs certified under EPA Method 533 or 537.1. This is worth doing if you\'re on well water or in a high-risk area near military bases or industrial sites.'
      ),

      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: strongStyle }, '🔬 High-risk areas for PFAS: '),
        'Near military bases (especially those that used AFFF foam), near chemical manufacturing plants (DuPont/Chemours in NC/WV, 3M facilities in MN), agricultural areas where PFAS-contaminated biosolids were applied as fertilizer, and near major airports.'
      ),

      React.createElement('h2', { style: h2Style }, 'What Filters Actually Remove PFAS'),
      React.createElement('p', { style: pStyle },
        'This is where most people get it wrong. Standard water filters do NOT remove PFAS. Here\'s the breakdown:'
      ),
      React.createElement('h3', { style: h3Style }, '❌ Does NOT remove PFAS'),
      React.createElement('p', { style: pStyle },
        'Standard Brita pitcher filters, refrigerator filters, basic faucet-mount filters, and sediment filters do not remove PFAS. They\'re designed for chlorine, taste, and odor — not forever chemicals.'
      ),
      React.createElement('h3', { style: h3Style }, '✅ Does remove PFAS'),
      React.createElement('p', { style: pStyle },
        React.createElement('strong', { style: strongStyle }, 'Reverse osmosis (RO) systems'),
        ' — The most effective technology. RO membranes filter at 0.0001 microns, blocking PFAS molecules. Look for NSF/ANSI 58 certification. Under-sink RO systems like Waterdrop remove 99%+ of PFAS.'
      ),
      React.createElement('p', { style: pStyle },
        React.createElement('strong', { style: strongStyle }, 'Certified activated carbon block filters'),
        ' — Some high-end pitcher and countertop filters like certified countertop RO units are NSF 53/58 certified for PFAS removal. They\'re less effective than RO but better than nothing and require no installation.'
      ),
      React.createElement('p', { style: pStyle },
        React.createElement('strong', { style: strongStyle }, 'Granular activated carbon (GAC)'),
        ' — Used in whole-house systems. Reduces but doesn\'t eliminate PFAS — the contact time matters. Certified GAC systems can achieve meaningful PFAS reduction but RO is superior for drinking water.'
      ),

      React.createElement('h2', { style: h2Style }, 'Our Recommendation'),
      React.createElement('p', { style: pStyle },
        'For drinking and cooking water, a ',
        React.createElement('strong', { style: strongStyle }, 'tankless under-sink RO system'),
        ' is the gold standard. The Waterdrop G3 and G2 series are NSF 58 certified, install under your kitchen sink in about 30 minutes, and produce clean water at the tap. At roughly $0.10 per gallon, it\'s far cheaper than bottled water and far more effective than most pitcher filters.'
      ),
      React.createElement('p', { style: pStyle },
        'If you\'re a renter with no plumbing access, the Waterdrop K19-S countertop RO is the best no-install option with genuine PFAS certification.'
      ),
      React.createElement('p', { style: pStyle },
        'The most important thing: ',
        React.createElement('strong', { style: strongStyle }, 'check your water first'),
        '. Enter your ZIP above to see if PFAS has been detected in your system, at what levels, and how that compares to the new EPA limits.'
      ),
    ),
  },

  'best-water-filter-for-lead-removal': {
    title: 'Water Filters That Remove Lead — Best 10 Picks (2025–2026)',
    excerpt: 'Top 10 NSF 53 lead filters: 3 under-sink RO, 4 under-counter carbon (Frizzlife, Epic, Aquasana), and 3 pitcher picks.',
    seo: {
      title: 'Water Filters That Remove Lead — Best 10 Picks (2025–2026)',
      description:
        'Best water filters for lead: top 3 RO, 4 under-counter carbon (Frizzlife, Epic), 3 NSF 53 pitchers. Ranked by type. Free ZIP check.',
      canonical: 'https://watercheckup.com/blog/best-water-filter-for-lead-removal',
      openGraph: {
        title: 'Water Filters That Remove Lead — Best 10 Picks (2025–2026)',
        description:
          'Best water filters for lead: top 3 RO, 4 under-counter carbon (Frizzlife, Epic), 3 NSF 53 pitchers. Ranked by type. Free ZIP check.',
      },
    },
    date: '2026-03-29',
    dateModified: '2026-06-01',
    dateDisplay: 'March 29, 2026',
    readTime: '10 min read',
    badge: 'Lead',
    badgeColor: '#d97706',
    topPicks: TOP_10_LEAD,
    faq: [...LEAD_FILTER_FAQ],
    content: React.createElement(React.Fragment, null,
      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#67e8f9' } }, 'Start here: '),
        'Check ',
        React.createElement('a', { href: '/', style: linkStyle }, 'lead & PFAS in your ZIP'),
        ' (free EPA report). High-traffic city reports: ',
        React.createElement('a', { href: '/water/san-antonio', style: linkStyle }, 'San Antonio'),
        ', ',
        React.createElement('a', { href: '/water/gaithersburg', style: linkStyle }, 'Gaithersburg'),
        ', ',
        React.createElement('a', { href: '/water/chicago', style: linkStyle }, 'Chicago'),
        '.'
      ),
      React.createElement('p', { style: pStyle },
        'The EPA says it plainly: ',
        React.createElement('strong', { style: strongStyle }, 'there is no safe level of lead in drinking water'),
        '. Even tiny amounts — well below the EPA\'s "action level" — cause measurable IQ loss, behavioral problems, and neurological damage in children. Lead is a neurotoxin with no known threshold for harm.'
      ),
      React.createElement('p', { style: pStyle },
        'And here\'s what makes it especially dangerous: you cannot see it, smell it, or taste it. Lead contamination in tap water is completely invisible without testing or filtration.'
      ),

      React.createElement('p', { style: pStyle },
        'Chicago has 150,000+ lead service lines and Philadelphia has thousands still in use — see our ',
        React.createElement('a', { href: '/water/chicago', style: linkStyle }, 'Chicago water quality report'),
        ' and ',
        React.createElement('a', { href: '/water/philadelphia', style: linkStyle }, 'Philadelphia water quality report'),
        ' for scored breakdowns and NSF-certified filter picks.'
      ),

      React.createElement('h2', { style: h2Style }, 'Where Does Lead Come From?'),
      React.createElement('p', { style: pStyle },
        'Lead almost never comes from the water source itself. It enters your water from lead service lines (the pipes connecting your house to the main), lead solder used in plumbing (legal until 1986), and brass fixtures. The water is actually the vehicle — it picks up lead as it travels through your home\'s plumbing.'
      ),
      React.createElement('div', { style: warnStyle },
        React.createElement('strong', { style: { color: '#d97706' } }, '⚠ Am I at risk? '),
        'If your home was built before 1986, you likely have lead solder in your pipes. If it was built before 1950, you may have lead pipes. Chicago, Detroit, Pittsburgh, Baltimore, Newark, and Philadelphia all have documented lead service line problems affecting hundreds of thousands of homes.'
      ),
      React.createElement('p', { style: pStyle },
        'The EPA estimates there are still over 9 million lead service lines in the US. The Biden administration set a goal to replace all of them within 10 years — but until they\'re replaced, filtration is your only protection.'
      ),

      React.createElement('h2', { style: h2Style }, 'The Only Certification That Matters: NSF/ANSI 53'),
      React.createElement('p', { style: pStyle },
        'This is the most important thing in this article. When buying a filter for lead removal, you must see ',
        React.createElement('strong', { style: strongStyle }, 'NSF/ANSI Standard 53 certification'),
        ' on the label — specifically for lead reduction. Not NSF 42 (that\'s just for taste and chlorine). NSF 53.'
      ),
      React.createElement('p', { style: pStyle },
        'NSF 53 means an independent lab has verified the filter removes at least 99% of lead at the concentrations typically found in tap water. Without this certification, a manufacturer can claim lead removal without any proof.'
      ),
      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: strongStyle }, '🔬 Quick rule: '),
        'If a filter\'s box doesn\'t say "NSF/ANSI 53 — Lead Reduction" somewhere on it, assume it doesn\'t remove lead. Marketing language like "reduces contaminants" means nothing without the NSF stamp.'
      ),

      React.createElement('h2', { style: h2Style }, 'Under-Sink Carbon vs. Under-Sink RO for Lead'),
      React.createElement('p', { style: pStyle },
        'You do not need reverse osmosis to reduce lead at the kitchen tap. ',
        React.createElement('strong', { style: strongStyle }, 'Under-sink carbon filters'),
        ' certified to NSF/ANSI 53 — picks #4–7 in our Top Picks box (Frizzlife MK99, SK99, Epic Smart Shield, Aquasana Claryum) — install under the counter and target lead without RO waste water. Picks #1–3 are under-sink RO for maximum removal; #8–10 are pitcher options for renters.'
      ),

      React.createElement('p', { style: pStyle },
        'Our ranked NSF 53/58 picks (10 options — 3 RO, 4 under-counter carbon, 3 pitchers) are in the ',
        React.createElement('strong', { style: strongStyle }, 'Top Picks'),
        ' box at the top of this guide — from Joe Letorney, 30-year water treatment specialist.'
      ),

      React.createElement('p', { style: pStyle },
        'Concerned about lead in your tap water specifically? Check your city: ',
        React.createElement('a', { href: '/water/san-antonio', style: linkStyle }, 'San Antonio'),
        ' · ',
        React.createElement('a', { href: '/water/new-york', style: linkStyle }, 'New York'),
        ' · ',
        React.createElement('a', { href: '/water/los-angeles', style: linkStyle }, 'Los Angeles'),
        ' · ',
        React.createElement('a', { href: '/water/philadelphia', style: linkStyle }, 'Philadelphia'),
        ' · ',
        React.createElement('a', { href: '/water/phoenix', style: linkStyle }, 'Phoenix'),
        ' · ',
        React.createElement('a', { href: '/water/houston', style: linkStyle }, 'Houston'),
        ' · ',
        React.createElement('a', { href: '/water/chicago', style: linkStyle }, 'Chicago')
      ),

      React.createElement('h2', { style: h2Style }, 'What Doesn\'t Work for Lead'),
      React.createElement('p', { style: pStyle },
        'Boiling water does not remove lead — it actually concentrates it by evaporating water while leaving contaminants behind. Sediment filters don\'t remove dissolved lead. Water softeners don\'t remove lead. Only certified filtration works.'
      ),

      React.createElement('h2', { style: h2Style }, 'How to Test Your Water for Lead'),
      React.createElement('p', { style: pStyle },
        'The only way to know your lead level is to test. You can get an EPA-certified mail-in lead test for $15-30 (search "EPA certified lead water test"). Many cities also offer free lead testing for residents — call your public water system and ask. Renters in older buildings should always test before assuming they\'re safe.'
      ),
      React.createElement('p', { style: pStyle },
        'You can also enter your ZIP above to check if your water system has any documented lead violations — it won\'t show your specific home\'s level but it tells you if your public water system has a known problem.'
      ),

      React.createElement('h2', { style: h2Style }, 'Bottom Line'),
      React.createElement('p', { style: pStyle },
        'If your home was built before 1986, get a filter rated NSF 53 for lead — today. It\'s the single highest-impact thing you can do for your family\'s health and it costs less than a month of bottled water. Don\'t wait for a water crisis to hit your city. Don\'t assume your public water system\'s compliance means you\'re safe. Filter at the tap.'
      ),
      React.createElement('p', { style: pStyle },
        'Also see our ',
        React.createElement('a', { href: '/blog/what-water-filter-removes-pfas', style: linkStyle }, 'PFAS removal water filter guide'),
        ' and run a free ',
        React.createElement('a', { href: '/', style: linkStyle }, 'water quality check by ZIP'),
        ' for your public water system\'s EPA data.'
      ),
    ),
  },

  'what-does-epa-water-violation-mean': {
    title: 'What Does an EPA Water Violation Actually Mean for Your Health?',
    excerpt: 'Your public water system sent a notice. Or you found a violation on EPA\'s database. Here\'s exactly what it means, what the risk is, and what to do.',
    date: '2026-03-30',
    dateDisplay: 'March 30, 2026',
    readTime: '7 min read',
    badge: 'EPA',
    badgeColor: '#7c3aed',
    topPicks: TOP_3_RO,
    content: React.createElement(React.Fragment, null,
      React.createElement('p', { style: pStyle },
        'You got a notice in the mail. Or you ran your water system through a database and saw a red flag. Your public water system has an EPA violation. Now what?'
      ),
      React.createElement('p', { style: pStyle },
        'The first thing to understand: not all violations are created equal. Some mean your water had a dangerous contaminant above the legal limit. Others mean your public water system forgot to file paperwork. Here\'s how to tell the difference — and what to actually do.'
      ),

      React.createElement('h2', { style: h2Style }, 'The Two Types of EPA Violations'),

      React.createElement('h3', { style: h3Style }, '1. Health-Based Violations'),
      React.createElement('p', { style: pStyle },
        'These are the ones that matter for your health. A health-based violation means a contaminant was detected above the EPA\'s Maximum Contaminant Level (MCL) — the legal limit — or that a required treatment technique wasn\'t being used. Examples:'
      ),
      React.createElement('p', { style: pStyle },
        React.createElement('strong', { style: strongStyle }, 'Maximum Contaminant Level (MCL) violations:'),
        ' Nitrates above 10 mg/L, arsenic above 10 ppb, lead above 15 ppb (at the 90th percentile), coliform bacteria detected, disinfection byproducts (THMs above 80 ppb, HAA5 above 60 ppb).'
      ),
      React.createElement('p', { style: pStyle },
        React.createElement('strong', { style: strongStyle }, 'Treatment technique (TT) violations:'),
        ' The public water system failed to properly disinfect water, failed to control corrosion (which causes lead leaching), or failed to filter surface water properly.'
      ),
      React.createElement('div', { style: warnStyle },
        React.createElement('strong', { style: { color: '#ef4444' } }, '⚠ If you received a "Boil Water Advisory" or "Do Not Drink" notice: '),
        'This is a health-based violation at the most serious level. Follow the instructions immediately. Use bottled water for drinking and cooking until the advisory is lifted.'
      ),

      React.createElement('h3', { style: h3Style }, '2. Monitoring and Reporting Violations'),
      React.createElement('p', { style: pStyle },
        'These are administrative violations — the public water system failed to test for something on schedule, or failed to report results to the state on time. They do NOT necessarily mean there\'s a problem with your water. But they do mean you have less information than you should. Take these as a reason to be more vigilant, not an emergency.'
      ),

      React.createElement('h2', { style: h2Style }, 'The Notice You Received'),
      React.createElement('p', { style: pStyle },
        'When a public water system has a health-based violation, federal law requires them to notify customers within a specific timeframe depending on the severity. The notice must tell you:'
      ),
      React.createElement('p', { style: pStyle },
        '• What contaminant exceeded the limit and by how much\n• What the potential health effects are\n• What the public water system is doing to fix it\n• What you can do in the meantime (alternative water sources, boiling, etc.)'
      ),
      React.createElement('p', { style: pStyle },
        'Read the notice carefully. The most important line is the one that tells you what the contaminant is and what the health risk is for different populations (infants, pregnant women, immunocompromised individuals are always at higher risk).'
      ),

      React.createElement('h2', { style: h2Style }, 'Meeting the Legal Limit ≠ Safe'),
      React.createElement('p', { style: pStyle },
        'Here\'s something that surprises most people: ',
        React.createElement('strong', { style: strongStyle }, 'your water can meet all EPA standards and still contain contaminants at levels that independent health scientists consider harmful.'),
      ),
      React.createElement('p', { style: pStyle },
        'EPA limits are set by balancing health risk against what\'s technically and economically feasible to achieve — not purely on what\'s safest. For example, the EPA\'s arsenic limit is 10 ppb, but the WHO recommends 10 ppb as a maximum and notes that even lower is better. The EPA\'s lead "action level" is 15 ppb, but the CDC says there\'s no safe level of lead.'
      ),
      React.createElement('p', { style: pStyle },
        'The Environmental Working Group (EWG) maintains a health guideline database that uses more conservative, health-only thresholds. Many water systems that pass all EPA tests still exceed EWG health guidelines for chromium-6, PFAS, disinfection byproducts, and other contaminants.'
      ),

      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: strongStyle }, '💡 The takeaway: '),
        'A violation is a red flag, but the absence of violations is not a green light. Filtration makes sense even for water systems with clean compliance records — especially for families with infants, pregnant women, or immunocompromised individuals.'
      ),

      React.createElement('h2', { style: h2Style }, 'What to Do After a Violation'),

      React.createElement('h3', { style: h3Style }, 'Short term'),
      React.createElement('p', { style: pStyle },
        'Follow the public water system\'s instructions. If there\'s a boil water advisory, boil. If they say use alternative water, use bottled water for drinking and cooking. Don\'t use tap water for infant formula during a microbiological violation.'
      ),

      React.createElement('h3', { style: h3Style }, 'Medium term'),
      React.createElement('p', { style: pStyle },
        'Install a certified filter appropriate for the contaminant that violated. Nitrate violation? You need an RO system — the only technology that removes nitrates. Lead violation? NSF 53 certified filter or RO. Disinfection byproduct violation? Certified carbon block or RO. PFAS? RO or NSF 58 certified filter.'
      ),

      React.createElement('h3', { style: h3Style }, 'Long term'),
      React.createElement('p', { style: pStyle },
        'Check your water regularly. Enter your ZIP on WaterCheckup to see your public water system\'s current violation history and contaminant levels. Sign up for your public water system\'s alert list if they have one. Read your annual CCR (Consumer Confidence Report) when it arrives.'
      ),

      React.createElement('h2', { style: h2Style }, 'How to Look Up Your Violations'),
      React.createElement('p', { style: pStyle },
        'Enter your ZIP code above to see your water system\'s current EPA SDWIS data — including any active violations, historical violations, and the contaminants your public water system monitors for. It\'s free and pulls directly from EPA\'s database in real time.'
      ),
      React.createElement('p', { style: pStyle },
        'You can also search EPA\'s ECHO database directly at echo.epa.gov, but WaterCheckup presents the same data in a format that\'s actually readable.'
      ),
    ),
  },

  ...EXTRA_POSTS,
  ...EXTRA_POSTS_2,
  ...EXTRA_POSTS_3,
  ...EXTRA_POSTS_SA,
  ...EXTRA_POSTS_4,
  ...EXTRA_POSTS_5,
  ...EXTRA_POSTS_NYC,
};

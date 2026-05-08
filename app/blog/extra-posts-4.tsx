import React from 'react';
import type { Post } from './post-types';

const WATERDROP = 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb';
const AMAZON_TAG = 'watercheck20-20';
// Shared top-3 pick sets used across blog posts
const TOP_3_RO = [
  { product: 'Waterdrop G3P800 RO', brand: 'Waterdrop', price: '~$369', reason: 'Tankless 800 GPD. Removes 99%+ PFAS, lead, arsenic, nitrates. Smart TDS faucet display. 10-stage filtration.', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: `https://www.amazon.com/dp/B0987FCQQW?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK' },
  { product: 'Aquasana SmartFlow RO', brand: 'Aquasana', price: '~$449', reason: 'WQA Gold Seal + NSF 42/53/58/401. Most certifications of any under-sink RO. Removes 90+ contaminants including PFAS.', link: 'https://www.aquasana.com/under-sink-water-filters', amazon: `https://www.amazon.com/dp/B0CHZ8VQBB?tag=${AMAZON_TAG}`, badge: 'MOST CERTIFIED' },
  { product: 'AquaTru Under-Sink RO', brand: 'AquaTru', price: '~$375', reason: 'NSF 42/53/58 certified. Quick-change filters swap in seconds with no tools. Compact tankless design.', link: 'https://www.aquatruwater.com/under-sink-reverse-osmosis-water-purifier', amazon: `https://www.amazon.com/dp/B0GGTSFZMY?tag=${AMAZON_TAG}`, badge: 'EASIEST FILTER CHANGE' },
];
const TOP_3_LEAD = [
  { product: 'Clearly Filtered 3.5L Pitcher', brand: 'Clearly Filtered', price: '~$90', reason: 'NSF 42/53/244/401/P473 — removes lead at 99.5% and PFAS at 99.9%. Best-certified pitcher on the market.', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'BEST FOR LEAD + PFAS' },
  { product: 'Waterdrop G3P800 RO', brand: 'Waterdrop', price: '~$369', reason: 'Under-sink RO removes 99.9% of lead at the tap. Best for homeowners with aging pipes throughout the home.', link: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb', amazon: `https://www.amazon.com/dp/B0987FCQQW?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK' },
  { product: 'ZeroWater 10-Cup Pitcher', brand: 'ZeroWater', price: '~$40', reason: 'NSF 42/53 certified. Reduces lead and chromium to zero. Includes TDS meter. Budget-friendly renter option.', link: 'https://www.zerowater.com/collections/pitchers', amazon: `https://www.amazon.com/dp/B01I2I2R36?tag=${AMAZON_TAG}`, badge: 'BEST VALUE' },
];
const TOP_3_PITCHER = [
  { product: 'Clearly Filtered 3.5L Pitcher', brand: 'Clearly Filtered', price: '~$90', reason: 'Only pitcher certified to remove PFAS at 99.9%. NSF 42/53/244/401/P473. Handles 365+ contaminants.', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK' },
  { product: 'Waterdrop Pitcher Filter', brand: 'Waterdrop', price: '~$40', reason: '7-stage filtration, 200-gallon filter life. Removes chlorine, PFOA/PFOS, heavy metals. No installation needed.', link: 'https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=anbyjkqb', amazon: `https://www.amazon.com/dp/B01JSJFBNE?tag=${AMAZON_TAG}`, badge: 'BEST VALUE' },
  { product: 'ZeroWater 10-Cup Pitcher', brand: 'ZeroWater', price: '~$40', reason: 'Reduces TDS to zero. NSF 42/53. Removes lead, chromium, and arsenic. Comes with a TDS testing meter.', link: 'https://www.zerowater.com/collections/pitchers', amazon: `https://www.amazon.com/dp/B01I2I2R36?tag=${AMAZON_TAG}`, badge: 'REMOVES TDS' },
];


const h2Style: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '40px 0 14px', lineHeight: 1.3 };
const h3Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '28px 0 10px' };
const pStyle: React.CSSProperties = { margin: '0 0 20px', color: '#94a3b8', lineHeight: 1.85 };
const strongStyle: React.CSSProperties = { color: '#e2e8f0', fontWeight: 700 };
const calloutStyle: React.CSSProperties = { margin: '28px 0', padding: '18px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 };
const warnStyle: React.CSSProperties = { margin: '28px 0', padding: '18px 22px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: 10, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 };

export const EXTRA_POSTS_4: Record<string, Post> = {
  'tap-water-safety-during-pregnancy': {
    title: 'Is Tap Water Safe During Pregnancy? What OBs and the EPA Say',
    excerpt: 'Pregnant women face higher risk from lead, nitrates, PFAS, and disinfection byproducts in tap water. Here is what to filter and what to skip.',
    date: '2026-04-18',
    dateDisplay: 'April 18, 2026',
    readTime: '8 min read',
    badge: 'PREGNANCY',
    badgeColor: '#8b5cf6',
    topPicks: TOP_3_RO,
    content: React.createElement(React.Fragment, null,
      React.createElement('p', { style: pStyle },
        'Pregnancy is the single most important time in your life to think carefully about what is in your drinking water. The developing fetus is far more vulnerable to contaminants than an adult -- and many of the chemicals commonly found in US tap water have been linked to pregnancy complications, developmental problems, and long-term health effects in children.'
      ),
      React.createElement('p', { style: pStyle },
        'This is not about fear. It is about knowing which contaminants actually matter, which do not, and what a filtration system can realistically do for you.'
      ),

      React.createElement('h2', { style: h2Style }, 'The four contaminants that matter most during pregnancy'),

      React.createElement('h3', { style: h3Style }, '1. Lead'),
      React.createElement('p', { style: pStyle },
        'There is no safe level of lead exposure during pregnancy. Lead crosses the placental barrier and accumulates in fetal tissue, where it can cause permanent neurological damage, lower IQ, and behavioral problems. The CDC and WHO both confirm there is no established safe threshold.'
      ),
      React.createElement('p', { style: pStyle },
        'The risk is not always from your utility -- lead often leaches from older service lines and building plumbing. If your home was built before 1986, your pipes may contain lead solder or lead fixtures even if your water utility tests clean.'
      ),
      React.createElement('div', { style: warnStyle },
        React.createElement('strong', { style: { color: '#ef4444' } }, 'Key fact: '),
        'Boiling water does NOT remove lead. It concentrates it. The only residential solutions that work are certified RO filtration or NSF 53 certified pitcher filters.'
      ),

      React.createElement('h3', { style: h3Style }, '2. Nitrates'),
      React.createElement('p', { style: pStyle },
        'High nitrate levels in drinking water have been linked to pregnancy complications including preterm birth, low birth weight, and neural tube defects. Nitrates come primarily from agricultural fertilizer runoff and are common in rural and suburban water systems across the Midwest, Plains states, and California.'
      ),
      React.createElement('p', { style: pStyle },
        'The EPA limit for nitrates is 10 mg/L -- but some research suggests adverse effects can occur at lower levels, particularly for pregnant women. If you are in an agricultural area, check your water report specifically for nitrates.'
      ),

      React.createElement('h3', { style: h3Style }, '3. PFAS'),
      React.createElement('p', { style: pStyle },
        'PFAS "forever chemicals" have been linked to pregnancy-induced hypertension, preeclampsia, gestational diabetes, lower birth weight, and reduced immune response in newborns. They have been detected in umbilical cord blood and breast milk, meaning exposure in utero is well documented.'
      ),
      React.createElement('p', { style: pStyle },
        'PFAS are found in 45% of US tap water according to USGS data. Your city page on WaterCheckup shows whether your local system has detected PFAS and at what levels.'
      ),

      React.createElement('h3', { style: h3Style }, '4. Disinfection Byproducts (DBPs)'),
      React.createElement('p', { style: pStyle },
        'Trihalomethanes (THMs) and haloacetic acids (HAAs) form when chlorine reacts with organic matter in source water. Long-term DBP exposure has been associated with increased miscarriage risk, preterm birth, and low birth weight in multiple epidemiological studies. Most US utilities use chlorine or chloramine and therefore produce DBPs -- the question is how much.'
      ),

      React.createElement('h2', { style: h2Style }, 'What does NOT need to filter during pregnancy'),
      React.createElement('p', { style: pStyle },
        'Fluoride at standard US levels (0.7 mg/L) is considered safe during pregnancy by the CDC and WHO. Calcium and magnesium from hard water are not a concern and are actually beneficial. Standard chlorine at utility levels is not a pregnancy risk -- it is the byproducts formed when chlorine reacts with organic matter that are the concern.'
      ),

      React.createElement('h2', { style: h2Style }, 'The best filter for pregnant women'),
      React.createElement('p', { style: pStyle },
        'A reverse osmosis system is the most comprehensive option -- it removes lead, PFAS, nitrates, and DBPs in a single pass. Look for NSF 58 certification for PFAS removal and NSF 53 for lead. Under-sink RO systems from Waterdrop and APEC run $200-400 and require no professional installation.'
      ),
      React.createElement('p', { style: pStyle },
        'For renters or those who cannot install under-sink systems, the Waterdrop D4 countertop RO requires zero plumbing and sits on your counter. A Clearly Filtered pitcher (NSF 53 certified for lead) is another solid option if RO is not feasible.'
      ),
      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#e2e8f0' } }, 'Bottom line: '),
        'Check your city\'s water report at watercheckup.com first. If your system shows lead, nitrates, PFAS, or high DBPs -- and many do -- a certified RO system is the most important $300 you will spend during your pregnancy.'
      ),
    ),
  },
  'best-ro-system-for-pfas-removal': {
    title: 'Best Reverse Osmosis Systems for PFAS Removal in 2025',
    excerpt: 'Not all RO systems are certified to remove PFAS. Here are the ones that actually work, tested against NSF 58 standards, at every budget.',
    date: '2026-04-20',
    dateDisplay: 'April 20, 2026',
    readTime: '7 min read',
    badge: 'BUYING GUIDE',
    badgeColor: '#0891b2',
    topPicks: TOP_3_RO,
    content: React.createElement(React.Fragment, null,
      React.createElement('p', { style: pStyle },
        'PFAS removal is not something you can assume -- you need to verify it. Many water filters marketed as removing "contaminants" have never been tested for PFAS. The certification that matters is ',
        React.createElement('strong', { style: strongStyle }, 'NSF/ANSI Standard 58'),
        ', which specifically tests for PFAS reduction. Here are the systems that actually earn that certification and are worth your money.'
      ),

      React.createElement('h2', { style: h2Style }, 'What to look for before buying'),
      React.createElement('p', { style: pStyle },
        'NSF 58 certification is the non-negotiable baseline. It means the system has been independently tested and verified to reduce PFAS compounds including PFOA, PFOS, and in most cases GenX. Without this certification, you are guessing. Check the manufacturer\'s NSF certification page -- not just their marketing copy.'
      ),
      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#e2e8f0' } }, 'Quick tip: '),
        'Before buying any filter, check your actual PFAS levels at watercheckup.com. If your city shows PFAS at trace levels, a quality pitcher filter may be enough. If you are above EPA limits, go straight to RO.'
      ),

      React.createElement('h2', { style: h2Style }, 'Best under-sink RO systems for PFAS'),

      React.createElement('h3', { style: h3Style }, 'Waterdrop G3P800 -- Best overall'),
      React.createElement('p', { style: pStyle },
        'The G3P800 is tankless, meaning no bulky reservoir under your sink. At 800 gallons per day it runs fast -- no waiting. NSF 58 certified, removes PFAS, lead, nitrates, arsenic, and chloramine byproducts. Runs around $299-349 and installs in under an hour with no plumber needed. This is what most WaterCheckup users end up with.'
      ),

      React.createElement('h3', { style: h3Style }, 'APEC ROES-50 -- Best budget pick'),
      React.createElement('p', { style: pStyle },
        'APEC has been making RO systems since 1989 and the ROES-50 is their flagship under-sink unit. It uses a tank rather than tankless design -- bulkier but extremely reliable. NSF 58 certified, handles PFAS well, runs around $195-220. If you want a proven workhorse at lower cost, this is it.'
      ),

      React.createElement('h3', { style: h3Style }, 'iSpring RCC7AK -- Best for remineralization'),
      React.createElement('p', { style: pStyle },
        'RO strips everything including beneficial minerals, which can make water taste flat. The iSpring RCC7AK adds an alkaline remineralization stage that puts calcium and magnesium back in. NSF 58 certified, PFAS removal verified, runs around $220-250. Good choice if you find straight RO water tastes off.'
      ),

      React.createElement('h2', { style: h2Style }, 'Best countertop RO for renters'),

      React.createElement('h3', { style: h3Style }, 'Waterdrop D4 -- No installation required'),
      React.createElement('p', { style: pStyle },
        'Sits on your counter, plugs into a standard outlet, connects to your faucet with a diverter valve that takes two minutes to install. NSF 58 certified for PFAS removal. Runs around $299. This is the answer for anyone renting or who cannot do under-sink work. Performance is close to full under-sink RO systems.'
      ),

      React.createElement('h2', { style: h2Style }, 'What RO does NOT remove'),
      React.createElement('p', { style: pStyle },
        'RO removes almost everything -- including fluoride, which is added intentionally for dental health. If you have children and want to maintain fluoride benefits, consider fluoride supplements or use filtered water only for drinking, not cooking. RO also wastes some water (typically 2-4 gallons per gallon filtered for modern systems). Factor this into your decision if water conservation matters in your area.'
      ),

      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#e2e8f0' } }, 'Start here: '),
        'Check watercheckup.com for your city first. If your PFAS levels are below the EPA action level, a Clearly Filtered pitcher ($90) may be sufficient. If you are above EPA limits or have children at home, move straight to a certified RO system.'
      ),
    ),
  },
  'moving-to-new-city-water-quality-check': {
    title: 'Moving to a New City? Check the Water Quality First',
    excerpt: 'Water quality varies dramatically city to city. Before you unpack, here is how to check your new city\'s tap water for PFAS, lead, and hard water.',
    date: '2026-04-22',
    dateDisplay: 'April 22, 2026',
    readTime: '6 min read',
    badge: 'MOVING',
    badgeColor: '#10b981',
    topPicks: TOP_3_RO,
    content: React.createElement(React.Fragment, null,
      React.createElement('p', { style: pStyle },
        'Most people moving to a new city spend hours researching neighborhoods, schools, commute times, and cost of living. Almost nobody checks the tap water -- and water quality varies more dramatically across US cities than most people realize.'
      ),
      React.createElement('p', { style: pStyle },
        'The difference between moving to Portland, Oregon (some of the cleanest tap water in the US) and Fayetteville, North Carolina (ground zero for PFAS contamination from the Chemours plant) is enormous. Your skin, your kids, and your long-term health will be affected either way.'
      ),

      React.createElement('h2', { style: h2Style }, 'Step 1: Check the EPA data for your new city'),
      React.createElement('p', { style: pStyle },
        'Start at watercheckup.com and search your new city. You will see the EPA water quality grade, contaminants detected, known issues (PFAS, lead, hard water, disinfection byproducts), and a filter recommendation specific to that city\'s water profile. Takes 60 seconds and tells you exactly what you are moving into.'
      ),

      React.createElement('h2', { style: h2Style }, 'Step 2: Know the red flags by region'),

      React.createElement('h3', { style: h3Style }, 'Southwest (Phoenix, Las Vegas, Tucson, Albuquerque)'),
      React.createElement('p', { style: pStyle },
        'Extremely hard water is the norm -- TDS above 500-700 mg/L. Your skin will feel different, your hair will change, your appliances will scale up faster. Arsenic from natural geology is elevated. PFAS from military bases is present in many systems. An RO system is essentially standard practice here.'
      ),

      React.createElement('h3', { style: h3Style }, 'North Carolina (Charlotte, Raleigh, Fayetteville, Durham)'),
      React.createElement('p', { style: pStyle },
        'North Carolina has the most serious PFAS contamination of any state due to the Chemours Fayetteville Works plant. GenX and dozens of other PFAS compounds have been found in water systems throughout the Cape Fear River basin. If you are moving anywhere in the Piedmont or Coastal Plain, RO filtration is not optional -- it is necessary.'
      ),

      React.createElement('h3', { style: h3Style }, 'Midwest (Iowa, Nebraska, Indiana, Illinois)'),
      React.createElement('p', { style: pStyle },
        'Agricultural nitrate contamination is severe and pervasive. Atrazine (a pesticide herbicide) regularly appears above health guidelines. Des Moines Water Works literally sued upstream counties over nitrate pollution. If you are moving to a Midwest city, check nitrate levels specifically and consider RO.'
      ),

      React.createElement('h3', { style: h3Style }, 'Michigan, Ohio, Pennsylvania (Detroit, Dayton, Pittsburgh, Newark)'),
      React.createElement('p', { style: pStyle },
        'Industrial legacy PFAS contamination from 3M, military bases, and steel production is significant. Lead service lines in older cities are widespread. The Flint crisis put the region on alert -- but Detroit, Toledo, Pittsburgh, and Newark all have their own documented water issues. Test for lead in any pre-1986 home.'
      ),

      React.createElement('h3', { style: h3Style }, 'Pacific Northwest (Portland, Seattle, Spokane)'),
      React.createElement('p', { style: pStyle },
        'Source water quality is excellent -- but the water is naturally soft and slightly acidic, which makes it corrosive to older pipes. Lead leaching from in-building plumbing is the main risk, not the source water itself. If your new home was built before 1986, get a lead test before assuming you are fine.'
      ),

      React.createElement('h2', { style: h2Style }, 'Step 3: What to buy for the first 30 days'),
      React.createElement('p', { style: pStyle },
        'While you are getting settled and figuring out your water situation, a countertop RO system like the Waterdrop D4 is the lowest-friction option -- no installation, sits on the counter, plugs in like an appliance. Once you know what you are dealing with, you can decide whether to upgrade to an under-sink system.'
      ),
      React.createElement('p', { style: pStyle },
        'If you are moving somewhere with hard water (Southwest, Texas, Nevada), a shower filter with KDF media will noticeably help your skin and hair within a week -- a $30-50 improvement you will feel immediately.'
      ),

      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#e2e8f0' } }, 'The 60-second move-in checklist: '),
        '(1) Search your new city at watercheckup.com. (2) If PFAS or lead flagged -- get an RO system before you unpack. (3) If hard water -- get a shower filter week one. (4) If in an agricultural area -- check nitrate levels specifically. That\'s it.'
      ),
    ),
  },

  'what-is-ppm-ppb-ppt-water-quality': {
    title: 'PPM, PPB, PPT: What Those Numbers on Your Water Report Actually Mean',
    excerpt: 'Your water report says lead is 12 ppb or PFAS is 6 ppt. What does that actually mean? Here\'s a plain-English guide with real-world examples anyone can understand.',
    date: '2026-05-06',
    dateDisplay: 'May 6, 2026',
    readTime: '6 min read',
    badge: 'Education',
    badgeColor: '#0891b2',
    topPicks: TOP_3_RO,
    content: React.createElement(React.Fragment, null,
      React.createElement('p', { style: pStyle },
        'You open your water quality report and see numbers like "6.2 ppt PFOA" or "12 ppb lead." You know those sound bad, but what do they actually mean? Is 6 ppt a little? A lot? How do you even picture something that small?'
      ),
      React.createElement('p', { style: pStyle },
        'This guide breaks it down in plain English — with real-world examples that make these microscopic measurements click. No chemistry degree required.'
      ),

      React.createElement('h2', { style: h2Style }, 'The three units: PPM, PPB, and PPT'),
      React.createElement('p', { style: pStyle },
        'All three measure concentration — how much of something is dissolved in your water. Think of it like drops of food coloring in a swimming pool. The units just tell you how many drops, and how big the pool is.'
      ),

      React.createElement('div', { style: { margin: '28px 0', display: 'grid', gap: 12 } },
        ...[
          { unit: 'PPM', full: 'Parts Per Million', pool: '1 drop in a 13-gallon aquarium', color: '#0891b2', context: 'Used for common minerals like calcium, magnesium, and chlorine. Tap water hardness is often 100–400 ppm. Your morning coffee is about 500 ppm dissolved solids. 1 million drops of water = 13 gallons, so 1 ppm = 1 drop per 13 gallons.' },
          { unit: 'PPB', full: 'Parts Per Billion', pool: '1 drop in a 13,000-gallon backyard pool', color: '#f59e0b', context: 'Used for lead, arsenic, and nitrates. 1 billion drops = 13,000 gallons — roughly a standard backyard swimming pool. The EPA lead action level is 15 ppb, meaning 15 drops spread across 15 backyard pools.' },
          { unit: 'PPT', full: 'Parts Per Trillion', pool: '1 drop in 5 Olympic swimming pools', color: '#ef4444', context: 'Used for PFAS "forever chemicals." 1 trillion drops = 13 million gallons — about 20 Olympic pools. The EPA limit for PFOA and PFOS is 4 ppt, meaning just 4 drops dissolved across all 20 of those Olympic pools is already at the legal limit.' },
        ].map(({ unit, full, pool, color, context }) =>
          React.createElement('div', { key: unit, style: { padding: '18px 20px', background: '#0d2240', border: `1px solid ${color}40`, borderLeft: `4px solid ${color}`, borderRadius: 10 } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 } },
              React.createElement('span', { style: { fontSize: 20, fontWeight: 900, color, minWidth: 48 } }, unit),
              React.createElement('span', { style: { fontSize: 13, color: '#64748b' } }, full),
            ),
            React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 } }, `📍 ${pool}`),
            React.createElement('p', { style: { ...pStyle, margin: 0, fontSize: 14 } }, context),
          )
        )
      ),

      React.createElement('h2', { style: h2Style }, 'Real examples that make it click'),

      React.createElement('h3', { style: h3Style }, '🚰 Lead: 15 ppb — the EPA action level'),
      React.createElement('p', { style: pStyle },
        'The EPA requires utilities to take action if lead in tap water exceeds 15 ppb. Here\'s the accurate way to picture it:'
      ),
      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#e2e8f0' } }, '15 ppb = 15 drops spread across 15 backyard swimming pools. '),
        'One drop per pool, fifteen times over. That\'s it. And the EPA says even that is too much for children — because there is no safe level of lead exposure. The CDC says any detectable lead in a child\'s blood can cause irreversible cognitive harm.'
      ),
      React.createElement('p', { style: pStyle },
        'Some cities have tested far above 15 ppb. Flint, Michigan peaked at over 100 ppb during its crisis — that\'s 100 drops across 100 backyard pools. Still sounds abstract, but the damage it caused to thousands of children was anything but.'
      ),

      React.createElement('h3', { style: h3Style }, '☣️ PFAS: 4 ppt — the EPA limit for PFOA and PFOS'),
      React.createElement('p', { style: pStyle },
        'The EPA\'s 2024 limit for PFOA and PFOS is 4 parts per trillion. Here\'s the accurate picture:'
      ),
      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#e2e8f0' } }, '4 ppt = 4 drops spread across 20 Olympic swimming pools. '),
        'Just 4 drops dissolved into 13 million gallons of water — and that\'s already at the legal limit. PFAS are dangerous at these near-undetectable concentrations because they accumulate in your body over a lifetime and never break down.'
      ),
      React.createElement('p', { style: pStyle },
        'To put contamination numbers in perspective: Parkersburg, West Virginia tested at 179 ppt PFOA — 44 times the EPA limit. That\'s like 44 drops per Olympic pool instead of the allowed fraction of a drop. The Cape Fear system in North Carolina hit 490 ppt PFOS — 122 times the limit. These are real communities with real people drinking this water every day.'
      ),

      React.createElement('h3', { style: h3Style }, '🥤 Nitrates: 10 ppm — the EPA limit'),
      React.createElement('p', { style: pStyle },
        'Nitrates from agricultural fertilizer runoff are regulated at 10 ppm — a much larger unit because nitrates are less potent per molecule. At 10 ppm, you\'re talking about 10 drops in a fish tank. Still small, but the "pool" is much smaller than for ppb or ppt measurements — which is why 10 ppm of nitrates is dangerous while 10 ppm of calcium (common in hard water) is completely harmless.'
      ),

      React.createElement('h2', { style: h2Style }, 'Why such tiny amounts matter'),
      React.createElement('p', { style: pStyle },
        'The reason these trace levels matter comes down to two things: ',
        React.createElement('strong', { style: strongStyle }, 'bioaccumulation'),
        ' and ',
        React.createElement('strong', { style: strongStyle }, 'lifetime exposure'),
        '.'
      ),
      React.createElement('p', { style: pStyle },
        'Your body doesn\'t flush lead or PFAS like it does water. Lead binds to bone. PFAS bind to proteins in your blood and accumulate in organs. Every glass you drink adds to the total. A child who drinks water with 15 ppb lead every day for 10 years has been accumulating lead in their developing brain for a decade. The individual daily dose sounds harmless — the lifetime accumulation is not.'
      ),
      React.createElement('p', { style: pStyle },
        'This is also why scientists often argue for limits far below what\'s legally allowed. The EPA sets MCLs based on a combination of health science and what\'s technically feasible for utilities to achieve. The Environmental Working Group\'s health guideline for PFOA is 0.1 ppt — 40 times stricter than the EPA\'s limit of 4 ppt. Both are based on health research. The difference is what regulators believe utilities can practically achieve.'
      ),

      React.createElement('h2', { style: h2Style }, 'How to read your own water report'),
      React.createElement('p', { style: pStyle },
        'When you look at a water quality report — whether from your utility\'s Consumer Confidence Report or from WaterCheckup — here\'s what to focus on:'
      ),
      React.createElement('div', { style: { margin: '16px 0 28px', display: 'flex', flexDirection: 'column' as const, gap: 10 } },
        ...[
          { label: 'Check the unit', text: 'Is the number in ppm, ppb, or ppt? A 6 ppt reading and a 6 ppm reading are a million times different. Always confirm the unit before reacting.' },
          { label: 'Compare to the limit', text: 'Is the detected level above or below the EPA MCL? Above means a legal violation. Below means it\'s within the legal limit — but not necessarily safe by independent health standards.' },
          { label: 'Look for PFAS in ppt', text: 'PFAS are always measured in ppt because they\'re dangerous at such tiny concentrations. Anything above 4 ppt for PFOA or PFOS is above the 2024 EPA limit.' },
          { label: 'Lead is always in ppb', text: 'The EPA action level is 15 ppb. But the CDC and AAP say no level of lead is safe for children. If you see any lead detected, a certified filter is worth it.' },
        ].map(({ label, text }) =>
          React.createElement('div', { key: label, style: { display: 'flex', gap: 14, padding: '14px 16px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 } },
            React.createElement('div', { style: { width: 24, height: 24, borderRadius: '50%', background: '#0891b2', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 } }, '✓'),
            React.createElement('div', null,
              React.createElement('strong', { style: { ...strongStyle, display: 'block', marginBottom: 4 } }, label),
              React.createElement('span', { style: { color: '#94a3b8', fontSize: 14, lineHeight: 1.7 } }, text),
            )
          )
        )
      ),

      React.createElement('h2', { style: h2Style }, 'What actually removes these contaminants'),
      React.createElement('p', { style: pStyle },
        'Understanding the units helps you understand why filters matter — and why not all filters are equal:'
      ),
      React.createElement('div', { style: warnStyle },
        React.createElement('strong', { style: { color: '#fca5a5' } }, 'Standard pitcher filters (basic Brita, PUR) '),
        'remove chlorine taste and some sediment. They do NOT reliably remove lead, PFAS, nitrates, or arsenic. If your water has any of these, a standard pitcher is not enough.',
      ),
      React.createElement('div', { style: calloutStyle },
        React.createElement('strong', { style: { color: '#e2e8f0' } }, 'Reverse osmosis (NSF 58 certified) '),
        'removes 99%+ of PFAS, lead, nitrates, arsenic, and hundreds of other contaminants. It is the only technology proven to reduce PFAS to safe levels at the tap. Under-sink RO or countertop RO (for renters) are both effective options.',
      ),
      React.createElement('p', { style: pStyle },
        'If your water report shows any PFAS above 4 ppt, lead above 5 ppb, or nitrates above 5 ppm — a certified reverse osmosis system is the right call. Use WaterCheckup to see your specific city\'s report, then take the 3-question filter quiz to find the right system for your home.'
      ),
    ),
  },
};

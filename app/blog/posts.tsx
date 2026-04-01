import React from 'react';
import type { Post } from './post-types';
import { EXTRA_POSTS } from './extra-posts';
import { EXTRA_POSTS_2 } from './extra-posts-2';

const WATERDROP = 'https://www.waterdrop.com/?ref=anbyjkqb';
const AMAZON_TAG = 'watercheck20-20';

const h2Style: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '40px 0 14px', lineHeight: 1.3 };
const h3Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '28px 0 10px' };
const pStyle: React.CSSProperties = { margin: '0 0 20px', color: '#94a3b8', lineHeight: 1.85 };
const strongStyle: React.CSSProperties = { color: '#e2e8f0', fontWeight: 700 };
const calloutStyle: React.CSSProperties = { margin: '28px 0', padding: '18px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 };
const warnStyle: React.CSSProperties = { margin: '28px 0', padding: '18px 22px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: 10, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 };

export const POSTS: Record<string, Post> = {
  'is-pfas-in-my-tap-water': {
    title: 'Is PFAS in My Tap Water? What the EPA Data Actually Shows',
    excerpt: 'PFAS "forever chemicals" have been found in 45% of US tap water. Here\'s how to find out if your water is affected — and what to do about it.',
    date: '2026-03-28',
    dateDisplay: 'March 28, 2026',
    readTime: '8 min read',
    badge: 'PFAS',
    badgeColor: '#0891b2',
    topPick: {
      label: 'PFAS detected in 45% of US tap water',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'NSF 58 certified. Removes 99.9% of PFAS compounds including PFOA, PFOS, and GenX.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=under+sink+reverse+osmosis+pfas+nsf+58&tag=${AMAZON_TAG}`,
    },
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
        'The main sources are military bases (AFFF firefighting foam), industrial manufacturing plants, landfills, and wastewater treatment plants that can\'t filter PFAS out. PFAS leach into groundwater and travel long distances — meaning your water utility\'s source water can be contaminated even if there\'s no PFAS facility nearby.'
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
        'Every water utility is required to send customers an annual Consumer Confidence Report (CCR) by July 1st. Starting with the 2024 reporting year, utilities must include PFAS results if they\'re above the new EPA limits. Call your utility and ask for the most recent CCR.'
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
        ' — Some high-end pitcher and countertop filters like the Epic Pure are NSF 53/58 certified for PFAS removal. They\'re less effective than RO but better than nothing and require no installation.'
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
        'If you\'re a renter with no plumbing access, the Epic Pure pitcher is the best no-install option with genuine PFAS certification.'
      ),
      React.createElement('p', { style: pStyle },
        'The most important thing: ',
        React.createElement('strong', { style: strongStyle }, 'check your water first'),
        '. Enter your ZIP above to see if PFAS has been detected in your system, at what levels, and how that compares to the new EPA limits.'
      ),
    ),
  },

  'best-water-filter-for-lead-removal': {
    title: 'Best Water Filters for Lead Removal in 2026 (NSF Certified)',
    excerpt: 'There is no safe level of lead in drinking water. These are the only filters that are actually certified to remove it — ranked by performance and price.',
    date: '2026-03-29',
    dateDisplay: 'March 29, 2026',
    readTime: '10 min read',
    badge: 'Lead',
    badgeColor: '#d97706',
    topPick: {
      label: 'No safe level of lead exists in drinking water',
      product: 'Waterdrop Under-Sink Filter (NSF 53)',
      reason: 'NSF 53 certified for lead. Removes 99.9% from tap. Installs in 30 minutes under your sink.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=under+sink+water+filter+lead+nsf+53+certified&tag=${AMAZON_TAG}`,
    },
    content: React.createElement(React.Fragment, null,
      React.createElement('p', { style: pStyle },
        'The EPA says it plainly: ',
        React.createElement('strong', { style: strongStyle }, 'there is no safe level of lead in drinking water'),
        '. Even tiny amounts — well below the EPA\'s "action level" — cause measurable IQ loss, behavioral problems, and neurological damage in children. Lead is a neurotoxin with no known threshold for harm.'
      ),
      React.createElement('p', { style: pStyle },
        'And here\'s what makes it especially dangerous: you cannot see it, smell it, or taste it. Lead contamination in tap water is completely invisible without testing or filtration.'
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

      React.createElement('h2', { style: h2Style }, 'Best Filters for Lead Removal'),

      React.createElement('h3', { style: h3Style }, '1. Under-Sink Reverse Osmosis — Best Overall'),
      React.createElement('p', { style: pStyle },
        'RO systems remove 99%+ of lead by forcing water through a membrane with pores smaller than any contaminant. The Waterdrop G3 and similar tankless RO systems are NSF 58 certified (which covers lead among hundreds of other contaminants). These install under your kitchen sink and give you clean water at the tap. Cost: $200-400 upfront, ~$0.10/gallon ongoing.'
      ),

      React.createElement('h3', { style: h3Style }, '2. Under-Sink Filter (Non-RO) — Best Mid-Range'),
      React.createElement('p', { style: pStyle },
        'If you want under-sink performance without the RO price, a certified under-sink carbon block filter (NSF 53 for lead) is excellent. Waterdrop, iSpring, and Aquasana all make NSF 53 certified units in the $80-150 range. They don\'t remove as much as RO but they\'re certified for lead and very effective.'
      ),

      React.createElement('h3', { style: h3Style }, '3. Pitcher Filters — Best for Renters'),
      React.createElement('p', { style: pStyle },
        'Most pitcher filters (including standard Brita) are ',
        React.createElement('strong', { style: strongStyle }, 'NOT certified for lead'),
        '. The exceptions: the Brita Longlast+ filter (NSF 53 for lead), Pur Plus pitcher, and Epic Pure pitcher. These are your best no-installation option. Downside: slow filtration and filters need replacing every 2-3 months.'
      ),

      React.createElement('h3', { style: h3Style }, '4. Faucet-Mount Filters — Convenient But Check the Cert'),
      React.createElement('p', { style: pStyle },
        'The PUR PLUS faucet mount is NSF 53 certified for lead and is one of the better options for renters who want faster throughput than a pitcher. The standard Brita faucet filter is NOT certified for lead — only the Brita Elite model is.'
      ),

      React.createElement('h2', { style: h2Style }, 'What Doesn\'t Work for Lead'),
      React.createElement('p', { style: pStyle },
        'Boiling water does not remove lead — it actually concentrates it by evaporating water while leaving contaminants behind. Sediment filters don\'t remove dissolved lead. Water softeners don\'t remove lead. Only certified filtration works.'
      ),

      React.createElement('h2', { style: h2Style }, 'How to Test Your Water for Lead'),
      React.createElement('p', { style: pStyle },
        'The only way to know your lead level is to test. You can get an EPA-certified mail-in lead test for $15-30 (search "EPA certified lead water test"). Many cities also offer free lead testing for residents — call your water utility and ask. Renters in older buildings should always test before assuming they\'re safe.'
      ),
      React.createElement('p', { style: pStyle },
        'You can also enter your ZIP above to check if your water system has any documented lead violations — it won\'t show your specific home\'s level but it tells you if your utility has a known problem.'
      ),

      React.createElement('h2', { style: h2Style }, 'Bottom Line'),
      React.createElement('p', { style: pStyle },
        'If your home was built before 1986, get a filter rated NSF 53 for lead — today. It\'s the single highest-impact thing you can do for your family\'s health and it costs less than a month of bottled water. Don\'t wait for a water crisis to hit your city. Don\'t assume your utility\'s compliance means you\'re safe. Filter at the tap.'
      ),
    ),
  },

  'what-does-epa-water-violation-mean': {
    title: 'What Does an EPA Water Violation Actually Mean for Your Health?',
    excerpt: 'Your water utility sent a notice. Or you found a violation on EPA\'s database. Here\'s exactly what it means, what the risk is, and what to do.',
    date: '2026-03-30',
    dateDisplay: 'March 30, 2026',
    readTime: '7 min read',
    badge: 'EPA',
    badgeColor: '#7c3aed',
    topPick: {
      label: 'EPA violations mean your water exceeded legal limits',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'Removes 1,000+ contaminants including those most commonly cited in EPA violations.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=reverse+osmosis+water+filter+system+under+sink&tag=${AMAZON_TAG}`,
    },
    content: React.createElement(React.Fragment, null,
      React.createElement('p', { style: pStyle },
        'You got a notice in the mail. Or you ran your water system through a database and saw a red flag. Your water utility has an EPA violation. Now what?'
      ),
      React.createElement('p', { style: pStyle },
        'The first thing to understand: not all violations are created equal. Some mean your water had a dangerous contaminant above the legal limit. Others mean your utility forgot to file paperwork. Here\'s how to tell the difference — and what to actually do.'
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
        ' The utility failed to properly disinfect water, failed to control corrosion (which causes lead leaching), or failed to filter surface water properly.'
      ),
      React.createElement('div', { style: warnStyle },
        React.createElement('strong', { style: { color: '#ef4444' } }, '⚠ If you received a "Boil Water Advisory" or "Do Not Drink" notice: '),
        'This is a health-based violation at the most serious level. Follow the instructions immediately. Use bottled water for drinking and cooking until the advisory is lifted.'
      ),

      React.createElement('h3', { style: h3Style }, '2. Monitoring and Reporting Violations'),
      React.createElement('p', { style: pStyle },
        'These are administrative violations — the utility failed to test for something on schedule, or failed to report results to the state on time. They do NOT necessarily mean there\'s a problem with your water. But they do mean you have less information than you should. Take these as a reason to be more vigilant, not an emergency.'
      ),

      React.createElement('h2', { style: h2Style }, 'The Notice You Received'),
      React.createElement('p', { style: pStyle },
        'When a water utility has a health-based violation, federal law requires them to notify customers within a specific timeframe depending on the severity. The notice must tell you:'
      ),
      React.createElement('p', { style: pStyle },
        '• What contaminant exceeded the limit and by how much\n• What the potential health effects are\n• What the utility is doing to fix it\n• What you can do in the meantime (alternative water sources, boiling, etc.)'
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
        'Follow the utility\'s instructions. If there\'s a boil water advisory, boil. If they say use alternative water, use bottled water for drinking and cooking. Don\'t use tap water for infant formula during a microbiological violation.'
      ),

      React.createElement('h3', { style: h3Style }, 'Medium term'),
      React.createElement('p', { style: pStyle },
        'Install a certified filter appropriate for the contaminant that violated. Nitrate violation? You need an RO system — the only technology that removes nitrates. Lead violation? NSF 53 certified filter or RO. Disinfection byproduct violation? Certified carbon block or RO. PFAS? RO or NSF 58 certified filter.'
      ),

      React.createElement('h3', { style: h3Style }, 'Long term'),
      React.createElement('p', { style: pStyle },
        'Check your water regularly. Enter your ZIP on WaterCheckup to see your utility\'s current violation history and contaminant levels. Sign up for your utility\'s alert list if they have one. Read your annual CCR (Consumer Confidence Report) when it arrives.'
      ),

      React.createElement('h2', { style: h2Style }, 'How to Look Up Your Violations'),
      React.createElement('p', { style: pStyle },
        'Enter your ZIP code above to see your water system\'s current EPA SDWIS data — including any active violations, historical violations, and the contaminants your utility monitors for. It\'s free and pulls directly from EPA\'s database in real time.'
      ),
      React.createElement('p', { style: pStyle },
        'You can also search EPA\'s ECHO database directly at echo.epa.gov, but WaterCheckup presents the same data in a format that\'s actually readable.'
      ),
    ),
  },

  ...EXTRA_POSTS,
  ...EXTRA_POSTS_2,
};

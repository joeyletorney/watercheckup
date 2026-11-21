/**
 * Hand-tuned title + meta description for URLs with high impressions / low CTR (GSC).
 * City pages default to `lib/serp-copy.ts`; an entry here wins when present.
 * When set, these replace default blog / rankings / utility / city SEO for SERP snippets.
 *
 * Keep `/blog/best-water-filter-pitcher-2025`. A 2026 slug redirect would
 * abandon a URL that already ranks (GSC position ~8 for Anker pitcher queries).
 * Title, H1, and description are 2026 and mention the Anker review; the path stays.
 */
export type CtrSerpCopy = {
  title: string;
  description: string;
};

export const CTR_SERP_OVERRIDES: Record<string, CtrSerpCopy> = {
  '/blog/san-antonio-water-quality': {
    title: 'San Antonio Water Quality: SAWS Hardness & PFAS',
    description:
      'San Antonio water quality from SAWS and EPA data: hardness, radium, and PFAS monitoring. Not a tap test — see the city report and PFAS guide.',
  },
  '/blog/pfas-in-san-antonio-water': {
    title: 'PFAS in San Antonio Water: 2026 EPA UCMR5 Data',
    description:
      'PFAS in San Antonio water: UCMR5 compounds for SAWS (TX0150018), how they compare with EPA limits, and NSF 58 filter options.',
  },
  '/blog/best-water-filter-for-lead-removal': {
    title: 'Best Water Filter for Lead Removal (2026)',
    description:
      'Best lead removal water filter for home in 2026: NSF/ANSI 53 picks, lead plus PFAS or chlorine, budget options, and verified annual filter costs.',
  },
  '/blog/best-water-filter-hard-water': {
    title: 'Hard Water Filter vs Softener (2026 Guide)',
    description:
      'A hard water filter, water filter for hard water, and hardness water filter are not the same as a softener. Compare filters, softeners, and conditioners.',
  },
  '/blog/best-countertop-water-filter': {
    title: 'Best Countertop Water Filter 2026 (PFAS)',
    description:
      'Best countertop water filter for 2026 — PFAS-free drinking water and taste. Pitcher vs countertop RO, with NSF evidence and replacement-cost assumptions.',
  },
  '/blog/best-shower-filter-2026': {
    title: 'Best Shower Filter 2026: Chlorine vs Chloramine',
    description:
      'Do shower filters work? Compare 2026 picks for chlorine, chloramine, and hard water. NSF 177, ZIP report, and honest limits.',
  },
  '/blog/best-water-filter-pitcher-2025': {
    title: 'Best Water Filter Pitchers 2026 (Incl. Anker Review)',
    description:
      'Best water filter pitchers 2026, including an Anker review — compare certified lead and PFAS claims, cartridge life, and what they actually remove.',
  },
  '/blog/waterdrop-g3p600-vs-aquasana-smartflow': {
    title: 'Aquasana vs Waterdrop (2026): Which Is Better?',
    description:
      'Aquasana vs Waterdrop in 2026: G3P600 is the current buy (~$399). SmartFlow listings were unavailable. Compare flow, NSF claims, and who each filter fits.',
  },
  '/water/gaithersburg': {
    title: 'Gaithersburg, MD Water Quality, Testing & Treatment (2026)',
    description:
      'Gaithersburg water quality (WSSC): water testing, well water, reverse osmosis, and how to choose a treatment company. Not a treatment company.',
  },
  '/water/san-antonio': {
    title: 'San Antonio Water Quality & Contamination (2026)',
    description:
      'San Antonio water quality and contamination: SAWS hardness, PFAS in UCMR5, radium context. Free EPA snapshot — not a tap test. See the PFAS guide.',
  },
  '/water/baltimore': {
    title: 'Baltimore Water Testing: Free & Certified Options (2026)',
    description:
      'City water testing in Baltimore MD: free ZIP snapshot, Ashburton Lab, Maryland certified labs, well vs city water, and cost ranges. Not a lab.',
  },
  '/water/jersey-city': {
    title: 'Is Jersey City Tap Water Safe to Drink? 2026',
    description:
      'Is Jersey City tap water safe to drink? EPA snapshot, lead from older plumbing, and NSF filter picks. A CCR is not a test of your faucet.',
  },
  '/water/indianapolis': {
    title: 'Is Indianapolis Tap Water Safe to Drink? 2026',
    description:
      'Is Indianapolis water safe to drink? Citizens Water EPA snapshot, nitrates, DBPs, lead lines, and NSF filter picks — not a household tap test.',
  },
  '/water/atlanta': {
    title: 'Atlanta Water Contamination: 2026 Tap Report',
    description:
      'Atlanta water contamination context: Chattahoochee source, UCMR5 PFAS, chloramine DBPs. Free 2026 report — not a current alert or tap test.',
  },
  '/utilities/md/annapolis': {
    title: 'Annapolis Well Water Testing: Certified Labs',
    description:
      'Annapolis well water testing: city wells vs a private well, Maryland certified labs, costs, and a free ZIP report. WaterCheckup is not a lab.',
  },
  '/utilities/md/maryland-city-anne-arundel-co': {
    title: 'City Water Testing Anne Arundel County (2026)',
    description:
      'City water testing in Anne Arundel County: Maryland City PWS vs county water vs wells, MDE certified labs, and a free ZIP report.',
  },
  '/utilities/md/town-of-chestertown': {
    title: 'Chestertown MD Water Testing (2026)',
    description:
      'Chestertown MD water testing: not a testing company. Town CCR, 410-778-0500 for lead questions, Maryland certified labs, and a ZIP report.',
  },
  '/worst-lead': {
    title: 'Worst US Cities for Lead in Tap Water (2026)',
    description:
      'The worst US cities for lead in tap water in 2026 — ranked by lead-pipe risk and WaterCheckup score, not measured ppb at every tap. See your city.',
  },
  '/rankings': {
    title: 'Worst Tap Water Rankings 2026: Cities & States',
    description:
      'Worst tap water in America, 2026: city water quality reports and state rankings from EPA PFAS data and safety grades. Free reports, no signup.',
  },
  '/blog/what-water-filter-removes-pfas': {
    title: 'What Filter Removes PFAS? (Most Pitchers Don’t) — 2026',
    description:
      'Only NSF 58 reverse osmosis & P473 pitchers remove PFAS reliably — not standard Brita. Compare top picks + free ZIP report.',
  },
  '/blog/is-new-york-city-tap-water-safe-2026': {
    title: 'Is NYC Tap Water Safe in 2026? Lead, PFAS & What to Know',
    description:
      'Great source water — older buildings can still add lead at the tap. PFAS monitoring, DEP context, and filter picks for NYC renters & owners.',
  },
  '/blog/best-water-filter-gaithersburg-md': {
    title: 'Best Water Filter for Gaithersburg MD: WSSC PFAS Picks',
    description:
      'Gaithersburg WSSC water has PFAS detections, DBPs and older-home lead risk. Compare NSF 58 RO, renter and under-sink picks for 2026.',
  },
  '/pfoa-at-epa-limit': {
    title: 'Cities Where PFOA Hit the EPA 4 ppt Limit (2026)',
    description:
      'Historical UCMR5 peaks compared with compound benchmarks. Supplier identity and sampling context matter; peaks are not official compliance findings.',
  },
  '/utilities/nc/greensboro-townsend': {
    title: 'Is Greensboro Townsend Water Safe? 2026 EPA Report',
    description:
      'Greensboro area public water system: violations snapshot, UCMR5 PFAS testing, population served & certified filter recommendations. Free report.',
  },
};

export function getCtrSerpOverride(path: string): CtrSerpCopy | undefined {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return CTR_SERP_OVERRIDES[normalized];
}

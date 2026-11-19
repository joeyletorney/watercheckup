/**
 * Hand-tuned title + meta description for URLs with high impressions / low CTR (GSC).
 * City pages default to `lib/serp-copy.ts`; an entry here wins when present.
 * When set, these replace default blog / rankings / utility / city SEO for SERP snippets.
 *
 * Keep `/blog/best-water-filter-pitcher-2025`. There is no 2026 slug, and the
 * 2025 URL already ranks near position 7. A 301 would throw that away to
 * cosmetic-year the path. Title and description are 2026; the URL stays.
 */
export type CtrSerpCopy = {
  title: string;
  description: string;
};

export const CTR_SERP_OVERRIDES: Record<string, CtrSerpCopy> = {
  '/blog/san-antonio-water-quality': {
    title: 'Is San Antonio Tap Water Safe? SAWS PFAS & Hardness (2026)',
    description:
      'SAWS meets legal limits, but San Antonio still has PFAS signals, radium context and very hard water. See what the 2026 data means — and which filters help.',
  },
  '/blog/pfas-in-san-antonio-water': {
    title: 'PFAS in San Antonio Water: 2026 EPA Data & What To Do',
    description:
      'Which PFAS compounds showed up in SAWS monitoring, how levels compare with EPA limits, and which NSF filters are built to remove them.',
  },
  '/blog/best-water-filter-for-lead-removal': {
    title: 'Best Water Filter for Lead 2026: Top-Rated Picks',
    description:
      'Top-rated water filters for lead-contaminated areas — pitchers, countertop RO, and NSF 53/58 options with official evidence and 2026 costs.',
  },
  '/blog/best-water-filter-hard-water': {
    title: 'Best Filter for Hard Water 2026: Softener vs RO',
    description:
      'The best filter for hard water in 2026: whole-house softeners vs drinking-water RO vs scale conditioners, with costs, limits, and official guidance.',
  },
  '/blog/best-countertop-water-filter': {
    title: 'Best Countertop Water Filter 2026 (for Taste)',
    description:
      'Best countertop water filter for taste in 2026 — pitcher vs countertop RO, with NSF evidence, setup limits, and replacement-cost assumptions.',
  },
  '/blog/best-shower-filter-2026': {
    title: 'Best Shower Filter 2026: Chlorine vs Chloramine',
    description:
      'Do shower filters work? Compare 2026 picks for chlorine, chloramine, and hard water. NSF 177, ZIP report, and honest limits.',
  },
  '/blog/best-water-filter-pitcher-2025': {
    title: 'Best Water Filter Pitcher 2026: What They Remove',
    description:
      'Best water filter pitcher of 2026, compared by certified lead and PFAS claims — cartridge life, replacement costs, and what they actually remove.',
  },
  '/water/gaithersburg': {
    title: 'Is Gaithersburg Water Safe? 2026 Quality Report',
    description:
      'WSSC Water quality for Gaithersburg, MD: PFAS in UCMR5, DBPs, older-home lead. Well vs city water explained. NSF filter picks — not a treatment company.',
  },
  '/water/san-antonio': {
    title: 'Is San Antonio Tap Water Safe? 2026 PFAS Report',
    description:
      'SAWS tap water: PFAS in UCMR5, hard Edwards Aquifer water, and DBP context. Is San Antonio water safe? See the PFAS guide and NSF filter picks.',
  },
  '/water/baltimore': {
    title: 'Is Baltimore Tap Water Safe? 2026 Quality Report',
    description:
      'Baltimore City DPW: lead pipe risk and PFAS snapshot. A CCR is not a tap test — Ashburton Lab can arrange lead testing. NSF filter picks.',
  },
  '/worst-lead': {
    title: 'Worst US Cities for Lead in Tap Water (2026)',
    description:
      'The worst US cities for lead in tap water in 2026 — ranked by lead-pipe risk and WaterCheckup score, not measured ppb at every tap. See your city.',
  },
  '/rankings': {
    title: 'Worst Tap Water in America: 2026 City Rankings',
    description:
      'See the worst tap water in America for 2026 — city and state rankings from EPA PFAS data and safety grades, plus free reports and filter picks. No signup.',
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

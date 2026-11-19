/**
 * Hand-tuned title + meta description for URLs with high impressions / low CTR (GSC).
 * City pages (`/water/{city}`) use the generated template in `lib/serp-copy.ts` instead.
 * When set, these replace default blog / rankings / utility SEO for SERP snippets.
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
    title: 'Best Water Filters for Lead Removal 2026 — Evidence & Costs',
    description:
      'Compare lead-reduction pitchers, countertop RO and installed filters with official model evidence, installation limits and replacement-cost assumptions.',
  },
  '/blog/best-water-filter-hard-water': {
    title: 'Best Water Filter for Hard Water 2026 — Softener vs RO',
    description:
      'Compare whole-house softeners, drinking-water RO and scale conditioners: official guidance, installation constraints and ownership-cost assumptions.',
  },
  '/blog/best-countertop-water-filter': {
    title: 'Best Countertop Water Filters 2026 — RO & Pitcher Comparison',
    description:
      'Compare countertop RO and a lead-reduction pitcher with official evidence, setup limits, replacement schedules and sourced cost assumptions.',
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
      'Historical UCMR5 peaks compared with compound-specific benchmarks. Supplier identity and sampling context matter; peaks are not official compliance findings.',
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

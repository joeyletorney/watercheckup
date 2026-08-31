/**
 * Hand-tuned title + meta description for URLs with high impressions / low CTR (GSC).
 * When set, these replace priority-city formatting and default blog SEO for SERP snippets.
 */
export type CtrSerpCopy = {
  title: string;
  description: string;
};

export const CTR_SERP_OVERRIDES: Record<string, CtrSerpCopy> = {
  '/water/gaithersburg': {
    title: 'Water Testing Gaithersburg MD — WSSC Tap & Well Tests (2026)',
    description:
      'Need water testing in Gaithersburg? Free WSSC/EPA report for tap water, well water testing guidance, PFAS levels, and NSF-certified filter picks. No login.',
  },
  '/water/san-antonio': {
    title: 'PFAS in San Antonio Water — Contamination & SAWS Report (2026)',
    description:
      'San Antonio water contamination concerns: PFAS in UCMR5, hard Edwards Aquifer water, radium context, and DBPs. Free EPA report — see levels and filter fixes.',
  },
  '/water/raleigh': {
    title: 'Raleigh Water Quality 2026 — PFAS, GenX & THM Report',
    description:
      'Wake County PFAS and GenX concerns, THM violations, and agricultural runoff in Raleigh tap water. Free EPA graded report and NSF filter picks.',
  },
  '/water/phoenix': {
    title: 'Phoenix Tap Water: C- Grade, Chromium-6 & PFAS',
    description:
      'Phoenix water has very hard minerals, 7.4 ppt PFAS and chromium-6 above CA health goals. See the C- grade, contaminant table and filter picks.',
  },
  '/water/baltimore': {
    title: 'Is Baltimore Tap Water Safe? 2026 Lead & PFAS Report | WaterCheckup',
    description:
      'Baltimore has lead service line risk and PFAS concerns. Free EPA water quality report — violation history, lead risk by home age, and NSF-certified filter picks.',
  },
  '/water/chicago': {
    title: 'Chicago Tap Water: B Grade — Lead Lines, PFAS & DBPs',
    description:
      '150,000+ lead service lines, PFAS in monitoring, chloramine byproducts. Free 2026 Chicago water report (75/88) & filter picks.',
  },
  '/water/houston': {
    title: 'Is Houston Tap Water Safe? 2026 PFAS & DBP Report | WaterCheckup',
    description:
      'Houston water has disinfection byproduct concerns and PFAS detections. Free EPA report — contaminant levels, violation history, and the right filter for your home.',
  },
  '/water/new-york': {
    title: 'NYC Tap Water: C Grade — PFOS 106 ppt & Building Lead Risk',
    description:
      'PFOS at 106 ppt in EPA monitoring (26× the 4 ppt limit). Pre-1986 buildings may add lead at the tap. Free 2026 NYC water report & filter picks.',
  },
  '/water/miami': {
    title: 'Miami Tap Water: D Grade — PFOS 33 ppt & PFAS MCL Violations',
    description:
      'MDWASA water: PFOS, PFOA, PFHxS above EPA limits in UCMR5. Biscayne Aquifer source. Free 2026 Miami-Dade graded report & NSF filter picks.',
  },
  '/water/sugar-land': {
    title: 'Sugar Land Tap Water: F Grade — 672 ppt 6:2 FTS Peak',
    description:
      'Highest peak PFAS in large Texas systems: 672 ppt 6:2 FTS, PFOA at EPA limit. Free 2026 Sugar Land UCMR5 report & NSF 58 filter picks.',
  },
  '/water/dallas': {
    title: 'Dallas Tap Water: D Grade — PFAS MCL Violations & DBPs',
    description:
      'PFOA, PFOS & PFHxS above EPA limits in UCMR5. Elevated TTHMs from chloramine treatment. Free 2026 Dallas water report & filter quiz.',
  },
  '/water/los-angeles': {
    title: 'Los Angeles Tap Water: C- Grade — Chromium-6 & 11 ppt PFAS',
    description:
      'Chromium-6 above CA health goals, PFAS in LADWP monitoring, 268 mg/L hardness. Free 2026 LA graded EPA report — no signup.',
  },
  '/water/philadelphia': {
    title: 'Philadelphia Water Quality — PFAS, Lead Lines & DBPs (2026)',
    description:
      'Philly tap water: PFAS from the Delaware River, lead service lines in ~25% of homes, and chloramine DBPs. Free EPA report and NSF filter picks.',
  },
  '/water/columbus': {
    title: 'Columbus OH Tap Water: PFAS MCL Violations — 2026 Report',
    description:
      'Regulated PFAS above EPA limits in UCMR5 (18 ppt peak). Scioto River source. Free 2026 Columbus graded report & certified filter picks.',
  },
  '/water/fort-worth': {
    title: 'Fort Worth Tap Water: 102 ppt PFAS — 2026 Safety Report',
    description:
      'PFHxS & PFOS above EPA MCLs in Trinity basin water. Free 2026 Fort Worth graded report, UCMR5 compound table & NSF filter picks.',
  },
  '/blog/san-antonio-water-quality': {
    title: 'San Antonio Water Quality: PFAS, Hardness & SAWS Data',
    description:
      'SAWS meets legal limits, but San Antonio still has PFAS signals, radium context and very hard water. See what the 2026 data means.',
  },
  '/blog/pfas-in-san-antonio-water': {
    title: 'PFAS in San Antonio Water: 2026 EPA Data & What To Do',
    description:
      'Which PFAS compounds showed up in SAWS monitoring, how levels compare with EPA limits, and which NSF filters are built to remove them.',
  },
  '/water/san-diego': {
    title: 'San Diego Water Quality — PFAS, Hard Water & Chromium-6 (2026)',
    description:
      'San Diego imports 85%+ of its water. See PFAS monitoring, hardness, chromium-6 context, and chloramine DBPs — free EPA report and filter picks.',
  },
  '/blog/best-water-filter-for-lead-removal': {
    title: 'Best Water Filters for Lead Removal 2026 — 10 NSF-Certified Picks',
    description:
      'NSF 53/58 filters that remove lead at the tap — under-sink RO, carbon blocks, and pitchers ranked by certification, not paid placement.',
  },
  '/blog/best-water-filter-hard-water': {
    title: 'Best Water Filters for Hard Water 2026 — Softener vs RO Guide',
    description:
      'Hard water fixes ranked: whole-house softeners for scale, RO for drinking water, and what actually removes minerals vs PFAS and lead.',
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
      'UCMR5 data: Philadelphia 235 ppt, Sugar Land 4.1 ppt at the line, NYC-area PFOS 106 ppt. Free city reports + ZIP lookup — EPA sourced.',
  },
  '/utilities/nc/greensboro-townsend': {
    title: 'Greensboro Townsend Water — EPA Report & PFAS (2026)',
    description:
      'Greensboro area public water system: violations snapshot, UCMR5 PFAS testing, population served & certified filter recommendations. Free report.',
  },
};

export function getCtrSerpOverride(path: string): CtrSerpCopy | undefined {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return CTR_SERP_OVERRIDES[normalized];
}

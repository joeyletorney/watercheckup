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
    title: 'Is Gaithersburg Tap Water Safe? Free WSSC Report (2026)',
    description:
      'PFAS in UCMR5, Potomac DBPs & lead risk in pre-1986 homes. B grade (74/88) on WaterCheckup. Free Gaithersburg MD report — no signup.',
  },
  '/water/san-antonio': {
    title: 'San Antonio Tap Water: D+ Grade — PFAS, Hard Water & Radium',
    description:
      'SAWS water: 272 mg/L hardness, PFAS in EPA monitoring, arsenic & radium above health guidelines. Free 2026 graded report & NSF filter picks.',
  },
  '/water/phoenix': {
    title: 'Phoenix Tap Water: C- Grade — PFAS, Chromium-6 & Hardness',
    description:
      '7.4 ppt PFAS, chromium-6 above CA health goals, very hard water. Free 2026 Phoenix EPA report with letter grade — no signup.',
  },
  '/water/chicago': {
    title: 'Chicago Tap Water: B Grade — Lead Lines, PFAS & DBPs',
    description:
      '150,000+ lead service lines, PFAS in monitoring, chloramine byproducts. Free 2026 Chicago water report (75/88) & filter picks.',
  },
  '/water/houston': {
    title: 'Houston Tap Water: D+ Grade — 22.4 ppt PFAS & High DBPs',
    description:
      '22.4 ppt PFAS above EPA limits, elevated arsenic, TTHMs at 73% of legal max. Free 2026 Houston graded report & NSF filter picks — no signup.',
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
    title: 'Philadelphia Tap Water: D+ Grade — PFAS, Lead Lines & DBPs',
    description:
      '16.1 ppt PFAS, lead service lines in ~25% of homes, Delaware River DBPs. Free 2026 Philly water report & NSF filter picks.',
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
    title: 'Is San Antonio Water Safe to Drink? 2026 SAWS Data',
    description:
      'Meets EPA limits — still has PFAS, radium & some of the hardest water in the US. What SAWS & UCMR5 data show. Free guide.',
  },
  '/blog/pfas-in-san-antonio-water': {
    title: 'PFAS in San Antonio Water — 2026 Levels & Filters',
    description:
      'Forever chemicals in SAWS supply: compounds found, EPA limits vs health guidelines, and NSF filters that actually remove PFAS.',
  },
  '/blog/best-water-filter-for-lead-removal': {
    title: 'Best Water Filters for Lead 2026 — 10 NSF Picks',
    description:
      '3 under-sink RO + 4 carbon + 3 pitcher options certified for lead. Expert-ranked by NSF 53/58 — not paid placement. Free ZIP check.',
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
    title: 'Best Water Filter for Gaithersburg MD — WSSC Water (2026)',
    description:
      'WSSC has PFAS detections, DBPs & lead risk in older homes. Top NSF 58 RO & renter picks for Gaithersburg — from EPA UCMR5 data.',
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

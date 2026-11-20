/** Visible “Updated” labels and JSON-LD dateModified for blog posts.
 *  Mix of Oct 1 / Oct 3 / Nov 1 / Nov 3, 2026 — not alphabetical.
 *  datePublished stays on each Post.date; the shower guide keeps its real Nov 19 publish date.
 */

export const BLOG_UPDATED_DATES = ['2026-10-01', '2026-10-03', '2026-11-01', '2026-11-03'] as const;
export type BlogUpdatedDate = (typeof BLOG_UPDATED_DATES)[number];

export const BLOG_UPDATED_DISPLAY: Record<string, string> = {
  '2026-10-01': 'Updated October 1, 2026',
  '2026-10-03': 'Updated October 3, 2026',
  '2026-11-01': 'Updated November 1, 2026',
  '2026-11-03': 'Updated November 3, 2026',
  '2026-11-19': 'Updated November 19, 2026',
};

/** slug → ISO dateModified (and visible Updated label). */
export const BLOG_POST_DATE_MODIFIED: Record<string, string> = {
  'is-new-york-city-tap-water-safe-2026': '2026-10-01',
  'waterdrop-g3p600-vs-aquasana-smartflow': '2026-11-19',
  'best-countertop-water-filter': '2026-10-01',
  'lead-in-tap-water-signs-and-symptoms': '2026-10-01',
  'what-does-epa-water-violation-mean': '2026-10-01',
  'bottled-water-vs-tap-water-cost-safety-and-pfas': '2026-10-01',
  'reverse-osmosis-vs-distilled-water': '2026-10-01',
  'chromium-6-in-drinking-water-should-you-worry': '2026-10-01',
  'chloramine-vs-chlorine-in-tap-water': '2026-10-01',
  'nitrate-in-well-water-infants-and-pregnancy': '2026-10-01',
  'what-is-ppm-ppb-ppt-water-quality': '2026-10-01',

  'san-antonio-water-quality': '2026-10-03',
  'is-pfas-in-my-tap-water': '2026-10-03',
  'best-water-filter-gaithersburg-md': '2026-10-03',
  'best-ro-system-for-pfas-removal': '2026-10-03',
  'is-tap-water-safe-to-drink': '2026-10-03',
  'how-to-read-your-consumer-confidence-report': '2026-10-03',
  'best-water-filter-hard-water': '2026-10-03',
  'refrigerator-water-filters-what-they-actually-remove': '2026-10-03',
  'fluoride-in-tap-water-safe-or-not': '2026-10-03',
  'private-well-water-testing-101': '2026-10-03',
  'hard-water-explained-scale-softeners-and-your-taps': '2026-10-03',

  'top-10-most-pfas-contaminated-cities': '2026-11-01',
  'pfas-in-new-york-city-water': '2026-11-01',
  'waterdrop-k19s-vs-aquatru-classic': '2026-11-01',
  'best-whole-house-water-filter': '2026-11-01',
  'best-water-filter-for-lead-removal': '2026-11-01',
  'moving-to-new-city-water-quality-check': '2026-11-01',
  'how-to-test-your-tap-water-mail-in-labs-explained': '2026-11-01',
  'top-10-cities-hardest-tap-water': '2026-11-01',
  'whole-house-water-filter-vs-under-sink-which-to-choose': '2026-11-01',
  'arsenic-in-well-water-epa-limit-and-treatment': '2026-11-01',
  'why-distilled-water-and-reverse-osmosis-are-best-for-high-purity': '2026-11-01',

  'pfas-in-san-antonio-water': '2026-11-03',
  'what-water-filter-removes-pfas': '2026-11-03',
  'best-under-sink-water-filter': '2026-11-03',
  'tap-water-safety-during-pregnancy': '2026-11-03',
  'boil-water-advisory-what-to-do-and-how-long': '2026-11-03',
  'best-water-filter-pitcher-2025': '2026-11-19',
  'reverse-osmosis-pros-and-cons': '2026-11-03',
  'microplastics-in-drinking-water-what-we-know': '2026-11-03',
  'why-does-tap-water-taste-bad': '2026-11-03',
  'radon-in-drinking-water': '2026-11-03',
  'disinfection-byproducts-tthm-haa5-explained': '2026-11-03',

  // Real publish date is Nov 19, 2026 (PR #29). Leave it — Nov 3 would be earlier than published.
  'best-shower-filter-2026': '2026-11-19',
};

export function blogUpdatedDisplay(iso: string): string {
  return BLOG_UPDATED_DISPLAY[iso] ?? iso;
}

export function blogPostDateFields(slug: string, datePublished: string) {
  const dateModified = BLOG_POST_DATE_MODIFIED[slug] ?? datePublished;
  return {
    date: datePublished,
    dateModified,
    dateDisplay: blogUpdatedDisplay(dateModified),
  };
}

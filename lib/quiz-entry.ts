const GUIDE_SLUGS = new Set(['best-water-filter-for-lead-removal', 'best-countertop-water-filter', 'best-water-filter-hard-water']);
const ENTRY_POINTS = new Set(['results', 'historical-report', 'water-city', 'buying-guide']);

/** Only controlled context values enter analytics; never forward arbitrary query-string content. */
export function quizEntryContext(params: { get(name: string): string | null }) {
  const from = params.get('from') || '';
  const guide = params.get('guide') || '';
  return { entry_point: ENTRY_POINTS.has(from) ? from : 'direct', origin_guide: from === 'buying-guide' && GUIDE_SLUGS.has(guide) ? guide : '' };
}

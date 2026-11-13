export const GUIDE_STARTING_POINTS: Record<string, { label: string; detail: string }[]> = {
  'best-water-filter-for-lead-removal': [
    { label: 'I want a pitcher', detail: 'Compare a compatible cartridge with a specific lead-reduction claim.' },
    { label: 'I am considering countertop RO', detail: 'Review its model evidence, feed-water limits and ongoing costs.' },
    { label: 'I want an installed system', detail: 'Check the exact claim, fittings and installation requirements.' },
  ],
  'best-countertop-water-filter': [
    { label: 'I prefer a pitcher', detail: 'Start with the pitcher option and its specific reduction claim.' },
    { label: 'I want reverse osmosis', detail: 'Check outlet, counter space, tanks and replacement schedules.' },
    { label: 'I already own a K19-S', detail: 'Review discontinued-model support; this is not a new-unit recommendation.' },
  ],
  'best-water-filter-hard-water': [
    { label: 'I want hardness removal throughout my home', detail: 'Start with salt-based softening, sizing and installation.' },
    { label: 'I only want to treat drinking water', detail: 'Review point-of-use RO separately from whole-home softening.' },
    { label: 'I am comparing scale-management options', detail: 'Understand how a conditioner differs from hardness removal.' },
  ],
};

export function guideQuizHref(slug: string): string {
  const params = new URLSearchParams({ from: 'buying-guide' });
  if (Object.hasOwn(GUIDE_STARTING_POINTS, slug)) params.set('guide', slug);
  return `/quiz?${params.toString()}`;
}

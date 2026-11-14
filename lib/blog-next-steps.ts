/** Only buying guides get the product shortlist. Educational articles offer context first. */
const SHOPPING_GUIDES = new Set([
  'best-water-filter-for-lead-removal', 'best-countertop-water-filter', 'best-water-filter-hard-water',
  'best-water-filter-pitcher-2025', 'best-ro-system-for-pfas-removal', 'best-whole-house-water-filter',
  'best-under-sink-water-filter', 'waterdrop-g3p600-vs-aquasana-smartflow',
  'waterdrop-k19s-vs-aquatru-classic', 'best-water-filter-gaithersburg-md',
  'whole-house-water-filter-vs-under-sink-which-to-choose', 'refrigerator-water-filters-what-they-actually-remove',
  'what-water-filter-removes-pfas', 'reverse-osmosis-pros-and-cons',
  'why-distilled-water-and-reverse-osmosis-are-best-for-high-purity', 'reverse-osmosis-vs-distilled-water',
]);
const WELL_GUIDES = new Set(['private-well-water-testing-101', 'nitrate-in-well-water-infants-and-pregnancy', 'arsenic-in-well-water-epa-limit-and-treatment', 'radon-in-drinking-water']);
const HARDNESS_GUIDES = new Set(['hard-water-explained-scale-softeners-and-your-taps', 'top-10-cities-hardest-tap-water']);
const TESTING = '/blog/how-to-test-your-tap-water-mail-in-labs-explained';
export type ArticleNextSteps = { title: string; description: string; links: { href: string; label: string; detail: string; step: string }[] };

export function articleNextSteps(slug: string): ArticleNextSteps | undefined {
  if (SHOPPING_GUIDES.has(slug)) return undefined;
  if (slug === 'boil-water-advisory-what-to-do-and-how-long') return {
    title: 'Start with the current advisory', description: 'Follow your water supplier or local health department’s instructions, including when the advisory ends. A shopping recommendation does not resolve an active advisory.',
    links: [
      { href: 'https://www.cdc.gov/water-emergency/about/drinking-water-advisories-an-overview.html', label: 'Read CDC advisory guidance', detail: 'Understand the different types of drinking-water advisory.', step: 'advisory_guidance' },
      { href: '/utilities', label: 'Find my water supplier', detail: 'Confirm your supplier and look for its current local notices.', step: 'supplier_directory' },
    ],
  };
  if (WELL_GUIDES.has(slug)) return {
    title: 'Choose testing before treatment', description: 'A public-supplier ZIP report does not measure private-well water. Ask a certified laboratory about the right panel and sampling instructions for your well.',
    links: [
      { href: '/well', label: 'Plan my well-water test', detail: 'Start with the well-water testing guidance and laboratory options.', step: 'well_testing' },
      { href: TESTING, label: 'Understand laboratory testing', detail: 'Compare what a test measures and how samples are collected.', step: 'testing_guide' },
    ],
  };
  if (HARDNESS_GUIDES.has(slug)) return {
    title: 'Match the treatment to the problem', description: 'Hardness and scale call for a different decision from a drinking-water contaminant concern. Start with what you want to change and where you need treatment.',
    links: [
      { href: '/blog/best-water-filter-hard-water', label: 'Compare softeners and filters', detail: 'Review hardness removal, scale management and drinking-water treatment.', step: 'hardness_comparison' },
      { href: '/water-hardness', label: 'Explore hardness by ZIP', detail: 'Use area information as context; confirm hardness at your home before sizing equipment.', step: 'hardness_lookup' },
    ],
  };
  if (slug === 'how-to-test-your-tap-water-mail-in-labs-explained') return {
    title: 'Choose a test for your water source', description: 'Decide what you need measured before buying treatment. Confirm the panel, sampling instructions, laboratory credentials and total price.',
    links: [
      { href: '/well', label: 'I use a private well', detail: 'Review well-water testing and laboratory options.', step: 'well_testing' },
      { href: '/#wc-hero-anchor', label: 'I use a public water supplier', detail: 'Check available supplier records for context; they are not a test of your tap.', step: 'supplier_report' },
      { href: 'https://www.epa.gov/dwlabcert', label: 'Find a certified laboratory', detail: 'Use EPA’s laboratory-certification resources for your state.', step: 'certified_laboratory' },
    ],
  };
  return {
    title: 'Turn this information into a next step', description: 'Check the source and date of the information, then decide whether you need a household test or a treatment comparison. A supplier record does not measure your own tap.',
    links: [
      { href: '/#wc-hero-anchor', label: 'Check my supplier’s records', detail: 'Find available public-water records by ZIP or city.', step: 'supplier_report' },
      { href: TESTING, label: 'Understand tap-water testing', detail: 'See when a household measurement can answer a different question.', step: 'testing_guide' },
      { href: '/quiz', label: 'Help me choose a filter', detail: 'Compare options for your water source, concern and installation needs.', step: 'filter_quiz' },
    ],
  };
}

import type { TopPickRow } from '@/app/blog/post-types';

const WATERDROP_RO =
  'https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=anbyjkqb';
const AMAZON = 'watercheck20-20';

export type BlogPickSegment =
  | 'lead'
  | 'pfas'
  | 'ro'
  | 'undersink'
  | 'countertop'
  | 'pitcher'
  | 'wholeHouse'
  | 'shower'
  | 'faucet'
  | 'well'
  | 'hardWater'
  | 'distillerRo'
  | 'compareG3'
  | 'compareK19';

/** Tab label: “Top 10” when 10+, numbered count for 3–9, “Top recommendations” for 1–2. */
export function getBlogTopPicksHeading(visibleCount: number): string {
  if (visibleCount <= 0) return 'TOP PICKS';
  if (visibleCount <= 2) return 'TOP RECOMMENDATIONS';
  if (visibleCount >= 10) return 'TOP 10 PICKS';
  return `TOP ${visibleCount} PICKS`;
}

const SEGMENT_SUBTITLES: Record<BlogPickSegment, string> = {
  lead: 'Lead removal — under-sink RO, under-counter carbon, and NSF 53 pitchers',
  pfas: 'PFAS removal — NSF 58 RO systems and certified carbon / pitcher options',
  ro: 'NSF-certified reverse osmosis and point-of-use filters for drinking water',
  undersink: 'Under-sink RO and non-RO filters — quick-change, NSF-certified',
  countertop: 'Countertop RO — plug-in, no permanent plumbing',
  pitcher: 'Pitcher filters — NSF 53 lead and PFAS options, no install',
  wholeHouse: 'Whole-house carbon systems — every tap and shower',
  shower: 'Shower filters — chlorine and hardness-related skin & hair relief',
  faucet: 'Faucet-mount filters — renters, no under-sink install',
  well: 'Private well — UV, iron treatment, and drinking-water RO',
  hardWater: 'Hard water — softeners, whole-house carbon, RO, and shower filters',
  distillerRo: 'High-purity water — countertop distillers and NSF 58 RO',
  compareG3: 'Head-to-head — Waterdrop G3P600 vs Aquasana SmartFlow RO',
  compareK19: 'Head-to-head — Waterdrop K19-S vs AquaTru Classic countertop RO',
};

export const TOP_LEAD: TopPickRow[] = [
  {
    product: 'Waterdrop G3P600',
    brand: 'Waterdrop',
    price: '~$439',
    reason:
      'Tankless under-sink RO — NSF 42/53/58/372. Removes 99%+ lead and PFAS; smart faucet TDS display.',
    link: WATERDROP_RO,
    amazon: `https://www.amazon.com/dp/B07P1XFYJP?tag=${AMAZON}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: 'Aquasana SmartFlow RO',
    brand: 'Aquasana',
    price: '~$449',
    reason: 'WQA Gold Seal plus NSF 42/53/58/401 — broad certification stack; 99%+ lead on listings.',
    link: 'https://www.aquasana.com/under-sink-water-filters',
    amazon: `https://www.amazon.com/dp/B0CHZ8VQBB?tag=${AMAZON}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: 'AquaTru Under-Sink RO',
    brand: 'AquaTru',
    price: '~$375',
    reason: 'NSF 42/53/58 tankless RO. Quick-change filters; compact under-sink install.',
    link: 'https://www.aquatruwater.com/under-sink-reverse-osmosis-water-purifier',
    amazon: `https://www.amazon.com/dp/B0GGTSFZMY?tag=${AMAZON}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: 'Frizzlife MK99',
    brand: 'Frizzlife',
    price: '~$59',
    reason: 'Under-sink carbon (not RO). NSF/ANSI 53 for lead — installs in minutes.',
    link: 'https://www.frizzlife.com/products/undersink-water-filter-system-mk99',
    amazon: `https://www.amazon.com/dp/B07ZY9RVN2?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Frizzlife SK99',
    brand: 'Frizzlife',
    price: '~$126',
    reason: 'Dual-stage under-sink — NSF/ANSI 53 lead (~99.9%) without RO waste water.',
    link: 'https://www.frizzlife.com/products/undersink-water-filter-system-sk99',
    amazon: `https://www.amazon.com/dp/B084HW5BMT?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Epic Smart Shield',
    brand: 'Epic Water Filters',
    price: '~$129',
    reason: 'NSF/ANSI 53 for lead plus NSF/ANSI 401 for emerging contaminants — non-RO.',
    link: 'https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system',
    amazon: `https://www.amazon.com/gp/product/B076S1W5QY?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Aquasana Claryum 3-Stage',
    brand: 'Aquasana',
    price: '~$200',
    reason: 'Three-stage under-sink carbon — NSF 42, 53, and 401 on listings; no RO waste.',
    link: 'https://www.aquasana.com/water-filters/under-sink/claryum-3-stage',
    amazon: `https://www.amazon.com/dp/B00CX8R5Q8?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'ZeroWater 10-Cup Pitcher',
    brand: 'ZeroWater',
    price: '~$40',
    reason: 'NSF/ANSI 42 & 53 for lead. Includes TDS meter — best budget pitcher.',
    link: 'https://www.zerowater.com/collections/pitchers',
    amazon: `https://www.amazon.com/dp/B0DWTTYTQN?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
  {
    product: 'PUR PLUS 11-Cup Pitcher',
    brand: 'PUR',
    price: '~$42',
    reason: 'NSF/ANSI 42 & 53 — lead, arsenic, and uranium on certified listings.',
    link: 'https://www.pur.com/water-filters/pitcher-filters',
    amazon: `https://www.amazon.com/dp/B09LKTLVNR?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
  {
    product: 'Waterdrop Pitcher Filter',
    brand: 'Waterdrop',
    price: '~$40',
    reason: '7-stage pitcher; NSF 53 listings for lead and heavy metals.',
    link: 'https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=anbyjkqb',
    amazon: `https://www.amazon.com/dp/B01JSJFBNE?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
];

export const TOP_PFAS: TopPickRow[] = [
  {
    product: 'Waterdrop G3P600',
    brand: 'Waterdrop',
    price: '~$439',
    reason: 'Tankless under-sink RO — NSF 58. Removes 99%+ PFAS, lead, and arsenic; smart TDS faucet.',
    link: WATERDROP_RO,
    amazon: `https://www.amazon.com/dp/B07P1XFYJP?tag=${AMAZON}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: 'Aquasana SmartFlow RO',
    brand: 'Aquasana',
    price: '~$449',
    reason: 'WQA Gold Seal + NSF 42/53/58/401 — strong PFAS and microplastic coverage.',
    link: 'https://www.aquasana.com/under-sink-water-filters',
    amazon: `https://www.amazon.com/dp/B0CHZ8VQBB?tag=${AMAZON}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: 'AquaTru Under-Sink RO',
    brand: 'AquaTru',
    price: '~$375',
    reason: 'NSF 42/53/58; quick-change filters; compact tankless under-sink RO.',
    link: 'https://www.aquatruwater.com/under-sink-reverse-osmosis-water-purifier',
    amazon: `https://www.amazon.com/dp/B0GGTSFZMY?tag=${AMAZON}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: 'Waterdrop D6',
    brand: 'Waterdrop',
    price: '~$399',
    reason: '600 GPD tankless RO — NSF 42/53/58; fast fill, twist-off cartridges.',
    link: 'https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-system-wd-d6?ref=anbyjkqb',
    amazon: `https://www.amazon.com/dp/B08746G2XX?tag=${AMAZON}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: 'Frizzlife PD1000-TAM4',
    brand: 'Frizzlife',
    price: '~$799',
    reason: '1000 GPD tankless RO — NSF 58/372; top flow rate for large households.',
    link: 'https://www.frizzlife.com/products/reverse-osmosis-system-pd1000',
    amazon: `https://www.amazon.com/dp/B0BK8ZRY2K?tag=${AMAZON}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: 'Waterdrop K19-S Countertop RO',
    brand: 'Waterdrop',
    price: '~$249',
    reason: 'Plug-in NSF 58 RO — 99%+ PFAS and lead; best for renters.',
    link: 'https://www.waterdropfilter.com/products/countertop-ro-water-filter-system-wd-k19-s?ref=anbyjkqb',
    amazon: `https://www.amazon.com/dp/B0BHQRNGZ8?tag=${AMAZON}`,
    badge: 'COUNTERTOP RO',
  },
  {
    product: 'AquaTru Classic',
    brand: 'AquaTru',
    price: '~$475',
    reason: 'Countertop NSF 42/53/58/401 — PFAS, nitrates, fluoride; no plumbing.',
    link: 'https://www.aquatruwater.com/aquatru-classic/',
    amazon: `https://www.amazon.com/dp/B0CQS3HQ8F?tag=${AMAZON}`,
    badge: 'COUNTERTOP RO',
  },
  {
    product: 'Epic Smart Shield',
    brand: 'Epic Water Filters',
    price: '~$129',
    reason: 'Non-RO under-sink — NSF 401 + strong PFAS reduction claims on listings.',
    link: 'https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system',
    amazon: `https://www.amazon.com/gp/product/B076S1W5QY?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Clearly Filtered 3.5L Pitcher',
    brand: 'Clearly Filtered',
    price: '~$90',
    reason: 'Rare NSF P473 / 401 pitcher — 99.9% PFAS on published claims.',
    link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher',
    amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON}`,
    badge: 'PITCHER',
    outOfStock: true,
  },
  {
    product: 'ZeroWater 10-Cup Pitcher',
    brand: 'ZeroWater',
    price: '~$40',
    reason: 'NSF 42/53 — budget pitcher; TDS meter included.',
    link: 'https://www.zerowater.com/collections/pitchers',
    amazon: `https://www.amazon.com/dp/B0DWTTYTQN?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
];

export const TOP_RO: TopPickRow[] = TOP_PFAS;

export const TOP_UNDERSINK: TopPickRow[] = [
  TOP_PFAS[0],
  TOP_PFAS[1],
  TOP_PFAS[2],
  TOP_PFAS[3],
  TOP_PFAS[4],
  {
    product: 'Frizzlife SK99',
    brand: 'Frizzlife',
    price: '~$126',
    reason: 'NSF 42/53/401 — lead and PFAS without full RO; quick-change cartridges.',
    link: 'https://www.frizzlife.com/products/undersink-water-filter-system-sk99',
    amazon: `https://www.amazon.com/dp/B084HW5BMT?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Frizzlife MK99',
    brand: 'Frizzlife',
    price: '~$59',
    reason: 'Best-value under-sink carbon — NSF 53 lead; under 2-minute install.',
    link: 'https://www.frizzlife.com/products/undersink-water-filter-system-mk99',
    amazon: `https://www.amazon.com/dp/B07ZY9RVN2?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  TOP_PFAS[7],
  {
    product: 'Aquasana Claryum 3-Stage',
    brand: 'Aquasana',
    price: '~$200',
    reason: 'Three-stage carbon under-sink — NSF 42/53/401 without RO waste.',
    link: 'https://www.aquasana.com/water-filters/under-sink/claryum-3-stage',
    amazon: `https://www.amazon.com/dp/B00CX8R5Q8?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  TOP_PFAS[5],
];

export const TOP_COUNTERTOP: TopPickRow[] = [
  TOP_PFAS[5],
  TOP_PFAS[6],
];

export const TOP_PITCHER: TopPickRow[] = [
  {
    product: 'Clearly Filtered 3.5L Pitcher',
    brand: 'Clearly Filtered',
    price: '~$90',
    reason: 'NSF 42/53/244/401/P473 — broadest pitcher certification for PFAS and lead.',
    link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher',
    amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON}`,
    badge: 'PITCHER',
    outOfStock: true,
  },
  {
    product: 'ZeroWater 10-Cup Pitcher',
    brand: 'ZeroWater',
    price: '~$40',
    reason: 'NSF 42/53 — lead, chromium, arsenic; TDS to zero; includes meter.',
    link: 'https://www.zerowater.com/collections/pitchers',
    amazon: `https://www.amazon.com/dp/B0DWTTYTQN?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
  {
    product: 'PUR PLUS 11-Cup Pitcher',
    brand: 'PUR',
    price: '~$42',
    reason: 'NSF 42/53 — lead, arsenic, uranium on listings; widely available.',
    link: 'https://www.pur.com/water-filters/pitcher-filters',
    amazon: `https://www.amazon.com/dp/B09LKTLVNR?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
  {
    product: 'Waterdrop Pitcher Filter',
    brand: 'Waterdrop',
    price: '~$40',
    reason: '7-stage pitcher — chlorine, PFOA/PFOS, heavy metals; 200-gallon life.',
    link: 'https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=anbyjkqb',
    amazon: `https://www.amazon.com/dp/B01JSJFBNE?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
];

export const TOP_WHOLE_HOUSE: TopPickRow[] = [
  {
    product: 'Aquasana Rhino EQ-1000',
    brand: 'Aquasana',
    price: '~$999',
    reason: 'WQA Gold Seal + NSF 42/61 — chlorine, chloramine, PFAS, THMs at every tap and shower.',
    link: 'https://www.aquasana.com/whole-house-water-filters',
    amazon: `https://www.amazon.com/dp/B00XAJJVHQ?tag=${AMAZON}`,
    badge: 'WHOLE HOUSE',
  },
  {
    product: 'iSpring WGB32B 3-Stage',
    brand: 'iSpring',
    price: '~$420',
    reason: 'Popular DIY whole-house sediment + dual carbon — NSF 42; strong value entry point.',
    link: 'https://www.ispringwatersystems.com/products/wgb32b',
    amazon: `https://www.amazon.com/gp/product/B008GNRMYK?tag=${AMAZON}`,
    badge: 'WHOLE HOUSE',
  },
  {
    product: 'Express Water WH300SCKS',
    brand: 'Express Water',
    price: '~$548',
    reason: 'NSF 42/61 — pressure gauges included; chloramine and chlorine at every tap.',
    link: 'https://www.expresswater.com',
    amazon: `https://www.amazon.com/dp/B01LFMTYBM?tag=${AMAZON}`,
    badge: 'WHOLE HOUSE',
  },
  {
    product: 'Waterdrop WHF3T-PG',
    brand: 'Waterdrop',
    price: '~$370',
    reason: 'Transparent housings + pressure gauge; NSF 42 sediment and carbon chain.',
    link: 'https://www.waterdropfilter.com/collections/whole-house-water-filters?ref=anbyjkqb',
    amazon: `https://www.amazon.com/dp/B0FYCRPXLZ?tag=${AMAZON}`,
    badge: 'WHOLE HOUSE',
  },
];

export const TOP_SHOWER: TopPickRow[] = [
  {
    product: 'AquaBliss High Output SF100',
    brand: 'AquaBliss',
    price: '~$35',
    reason: 'KDF/GAC media — reduces chlorine and scale feel; installs in minutes; universal fit.',
    link: 'https://www.aquabliss.com/products/sf100',
    amazon: `https://www.amazon.com/dp/B01MUBU0YC?tag=${AMAZON}`,
    badge: 'SHOWER',
  },
  {
    product: 'AquaTru Shower Filter',
    brand: 'AquaTru',
    price: '~$149',
    reason: 'NSF/ANSI 177 on listings — high chlorine reduction; quick-change cartridge.',
    link: 'https://www.aquatruwater.com/shower-filter',
    amazon: `https://www.amazon.com/dp/B0FLHFTGYD?tag=${AMAZON}`,
    badge: 'SHOWER',
  },
];

export const TOP_FAUCET: TopPickRow[] = [
  {
    product: 'PUR PLUS Faucet Mount FM2000B',
    brand: 'PUR',
    price: '~$35',
    reason: 'NSF 42/53 — lead, arsenic, mercury; one-click on/off; no permanent install.',
    link: 'https://www.pur.com/water-filters/faucet-filters',
    amazon: `https://www.amazon.com/dp/B009V9K6BY?tag=${AMAZON}`,
    badge: 'FAUCET',
  },
  {
    product: 'Brita Complete Faucet Filtration',
    brand: 'Brita',
    price: '~$30',
    reason: 'NSF 42/53 — lead, chlorine, chloramine; 3-way diverter; tool-free attach.',
    link: 'https://www.brita.com/faucet-filters/',
    amazon: `https://www.amazon.com/dp/B00006IV0P?tag=${AMAZON}`,
    badge: 'FAUCET',
  },
];

export const TOP_WELL: TopPickRow[] = [
  {
    product: 'HQUA-OWS-12 UV Sterilizer',
    brand: 'HQUA',
    price: '~$149',
    reason: 'NSF/ANSI 55 Class B UV — bacteria, viruses, cysts for private wells; no chemicals.',
    link: 'https://www.hquatech.com',
    amazon: `https://www.amazon.com/dp/B01N2YMU3O?tag=${AMAZON}`,
    badge: 'WELL / UV',
  },
  {
    product: 'iSpring WCFM500K Iron & Sulfur',
    brand: 'iSpring',
    price: '~$2,299',
    reason: 'Whole-house media for iron, manganese, and rotten-egg sulfur on well water.',
    link: 'https://www.ispringwatersystems.com',
    amazon: `https://www.amazon.com/gp/product/B08TMZYYQY?tag=${AMAZON}`,
    badge: 'WELL',
  },
  TOP_PFAS[0],
  TOP_PFAS[1],
  TOP_UNDERSINK[5],
  TOP_UNDERSINK[6],
];

export const TOP_HARD_WATER: TopPickRow[] = [
  {
    product: 'Fleck 5600SXT 48,000 Grain',
    brand: 'Fleck',
    price: '~$649',
    reason: 'NSF/ANSI 44 salt softener — removes hardness at every tap; metered valve.',
    link: 'https://flecksystems.com',
    amazon: `https://www.amazon.com/s?k=Fleck+5600SXT+48000+grain+water+softener&tag=${AMAZON}`,
    badge: 'SOFTENER',
  },
  {
    product: 'Aquasure Harmony 48,000 Grain',
    brand: 'Aquasure',
    price: '~$600',
    reason: 'NSF/ANSI 44 — digital metered head; common DIY softener kit.',
    link: 'https://www.aquasureusa.com',
    amazon: `https://www.amazon.com/s?k=Aquasure+Harmony+AS-HS48D+48000+grain+water+softener&tag=${AMAZON}`,
    badge: 'SOFTENER',
  },
  TOP_WHOLE_HOUSE[0],
  TOP_WHOLE_HOUSE[1],
  TOP_SHOWER[0],
  TOP_SHOWER[1],
  TOP_PFAS[0],
];

export const TOP_DISTILLER_RO: TopPickRow[] = [
  {
    product: 'CO-Z 4L Stainless Distiller',
    brand: 'CO-Z',
    price: '~$119',
    reason: 'Countertop steam distillation — near-zero TDS; strong value vs premium distillers.',
    link: 'https://www.amazon.com/dp/B078GHJ921',
    amazon: `https://www.amazon.com/dp/B078GHJ921?tag=${AMAZON}`,
    badge: 'DISTILLER',
  },
  TOP_PFAS[0],
  TOP_PFAS[1],
  TOP_PFAS[2],
  TOP_PFAS[5],
  TOP_PFAS[6],
];

export const TOP_COMPARE_G3: TopPickRow[] = [TOP_PFAS[0], TOP_PFAS[1]];

export const TOP_COMPARE_K19: TopPickRow[] = [TOP_PFAS[5], TOP_PFAS[6]];

const PICKS_BY_SEGMENT: Record<BlogPickSegment, TopPickRow[]> = {
  lead: TOP_LEAD,
  pfas: TOP_PFAS,
  ro: TOP_RO,
  undersink: TOP_UNDERSINK,
  countertop: TOP_COUNTERTOP,
  pitcher: TOP_PITCHER,
  wholeHouse: TOP_WHOLE_HOUSE,
  shower: TOP_SHOWER,
  faucet: TOP_FAUCET,
  well: TOP_WELL,
  hardWater: TOP_HARD_WATER,
  distillerRo: TOP_DISTILLER_RO,
  compareG3: TOP_COMPARE_G3,
  compareK19: TOP_COMPARE_K19,
};

/** Slug → segment; unlisted slugs fall back to post.topPicks or `ro`. */
export const BLOG_SLUG_PICK_SEGMENT: Record<string, BlogPickSegment> = {
  'best-water-filter-for-lead-removal': 'lead',
  'lead-in-tap-water-signs-and-symptoms': 'lead',
  'is-pfas-in-my-tap-water': 'pfas',
  'what-water-filter-removes-pfas': 'pfas',
  'pfas-in-san-antonio-water': 'pfas',
  'pfas-in-new-york-city-water': 'pfas',
  'best-ro-system-for-pfas-removal': 'pfas',
  'bottled-water-vs-tap-water-cost-safety-and-pfas': 'pfas',
  'top-10-most-pfas-contaminated-cities': 'pfas',
  'best-water-filter-pitcher-2025': 'pitcher',
  'is-new-york-city-tap-water-safe-2026': 'pitcher',
  'best-countertop-water-filter': 'countertop',
  'waterdrop-k19s-vs-aquatru-classic': 'compareK19',
  'best-under-sink-water-filter': 'undersink',
  'waterdrop-g3p600-vs-aquasana-smartflow': 'compareG3',
  'best-water-filter-gaithersburg-md': 'undersink',
  'best-whole-house-water-filter': 'wholeHouse',
  'whole-house-water-filter-vs-under-sink-which-to-choose': 'wholeHouse',
  'chloramine-vs-chlorine-in-tap-water': 'wholeHouse',
  'hard-water-explained-scale-softeners-and-your-taps': 'hardWater',
  'best-water-filter-hard-water': 'hardWater',
  'top-10-cities-hardest-tap-water': 'hardWater',
  'moving-to-new-city-water-quality-check': 'shower',
  'san-antonio-water-quality': 'pfas',
  'tap-water-safety-during-pregnancy': 'pfas',
  'private-well-water-testing-101': 'well',
  'nitrate-in-well-water-infants-and-pregnancy': 'well',
  'arsenic-in-well-water-epa-limit-and-treatment': 'well',
  'refrigerator-water-filters-what-they-actually-remove': 'faucet',
  'reverse-osmosis-pros-and-cons': 'distillerRo',
  'why-distilled-water-and-reverse-osmosis-are-best-for-high-purity': 'distillerRo',
  'reverse-osmosis-vs-distilled-water': 'distillerRo',
};

const MAX_PICKS = 10;

export function getTopPicksForSegment(segment: BlogPickSegment): TopPickRow[] {
  return (PICKS_BY_SEGMENT[segment] ?? TOP_RO).slice(0, MAX_PICKS);
}

export function resolveBlogTopPicks(
  slug: string,
  postPicks?: TopPickRow[],
  badge?: string
): TopPickRow[] {
  const segment =
    BLOG_SLUG_PICK_SEGMENT[slug] ?? (badge ? inferSegmentFromBadge(badge) : undefined);
  if (segment) return getTopPicksForSegment(segment);
  if (postPicks?.length) return postPicks.slice(0, MAX_PICKS);
  return getTopPicksForSegment('ro');
}

export function getTopPicksSubtitle(slug: string, picks: TopPickRow[]): string | undefined {
  const segment = BLOG_SLUG_PICK_SEGMENT[slug];
  if (segment && SEGMENT_SUBTITLES[segment]) return SEGMENT_SUBTITLES[segment];
  const visible = picks.filter((p) => !p.outOfStock).length;
  if (visible <= 2) return 'NSF-certified filters we recommend for this guide';
  return undefined;
}

export function inferSegmentFromBadge(badge: string): BlogPickSegment {
  const b = badge.toLowerCase();
  if (b.includes('lead')) return 'lead';
  if (b.includes('pfas')) return 'pfas';
  if (b.includes('well')) return 'well';
  if (b.includes('hard')) return 'hardWater';
  return 'ro';
}

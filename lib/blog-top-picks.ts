import type { TopPickRow } from '@/app/blog/post-types';
import { attachProductImages } from '@/lib/filter-product-images';
import { WATERDROP_G3P600_URL, WATERDROP_PT07_URL } from '@/lib/waterdrop-buy';

const WATERDROP_RO = WATERDROP_G3P600_URL;
const AMAZON = 'watercheckup-20';

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
  shower: 'Shower filters — chlorine and chloramine reduction for skin and hair',
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
    price: '~$399',
    reason:
      'Tankless under-sink RO — NSF 42/53/58/372. Removes 99%+ lead and PFAS; smart faucet TDS display.',
    link: WATERDROP_RO,
    amazon: `https://www.amazon.com/dp/B07P1XFYJP?tag=${AMAZON}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: "Frizzlife SK99-NEW",
    brand: "Frizzlife",
    price: "Check current price",
    reason: "Direct-connect carbon filtration for municipal cold water. Uses the existing faucet; no RO drain or electrical outlet. Does not reduce dissolved salts or soften water. Verify the exact cartridge’s listed reduction claims.",
    link: "https://www.frizzlife.com/products/sk99-new",
    amazon: "https://www.amazon.com/dp/B08NDYVZV5?tag=watercheckup-20",
    badge: "DIRECT-CONNECT CARBON",
  },
  {
    product: "Epic Smart Shield",
    brand: "Epic Water Filters",
    price: "Check current price",
    reason: "Carbon-block under-sink filter connecting to the existing cold-water line. No RO drain or dedicated faucet. Not reverse osmosis or a softener; check the exact model’s performance data for your concern.",
    link: "https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system",
    amazon: "https://www.amazon.com/dp/B076S1W5QY?tag=watercheckup-20",
    badge: "DIRECT-CONNECT CARBON",
  },
  {
    product: 'Frizzlife MK99',
    brand: 'Frizzlife',
    price: 'Check current price',
    reason: 'Under-sink carbon (not RO). NSF/ANSI 53 for lead — installs in minutes.',
    link: 'https://www.frizzlife.com/products/mk99',
    amazon: `https://www.amazon.com/dp/B07MFYQBTX?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Frizzlife SK99-NEW',
    brand: 'Frizzlife',
    price: '~$126',
    reason: 'IAPMO certified to NSF/ANSI 42, 53, and 372. Dual-stage under-sink carbon without RO waste water.',
    link: 'https://www.frizzlife.com/products/sk99-new',
    amazon: `https://www.amazon.com/dp/B08NDYVZV5?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Epic Smart Shield',
    brand: 'Epic Water Filters',
    price: 'Check current price',
    reason: 'NSF/ANSI 53 for lead plus NSF/ANSI 401 for emerging contaminants — non-RO. Amazon and brand prices often differ; check the live listing.',
    link: 'https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system',
    amazon: `https://www.amazon.com/gp/product/B076S1W5QY?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Aquasana Claryum 3-Stage Max Flow (AQ-6300M)',
    brand: 'Aquasana',
    price: '~$170',
    reason: 'Three-stage under-sink carbon — NSF 42, 53, and 401 on listings; no RO waste.',
    link: 'https://www.aquasana.com/under-sink-water-filters/claryum-3-stage-max-flow/chrome-100391705.html',
    amazon: `https://www.amazon.com/dp/B0FN9Y9JSP?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'ZeroWater 10-Cup Pitcher',
    brand: 'ZeroWater',
    price: '~$23',
    reason: 'NSF/ANSI 42 & 53 for lead. Includes TDS meter — best budget pitcher.',
    link: 'https://zerowater.com/collections/water-filter-pitchers-dispensers',
    amazon: `https://www.amazon.com/dp/B0DWTTYTQN?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
  {
    product: 'PUR PLUS 11-Cup Pitcher',
    brand: 'PUR',
    price: 'Check current price',
    reason: 'NSF/ANSI 42 & 53 — lead, arsenic, and uranium on certified listings.',
    link: 'https://www.pur.com/shop/pitchers/11-cup-pitcher-ppt111/',
    amazon: `https://www.amazon.com/dp/B09LKTLVNR?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
  {
    product: 'Waterdrop PT-07B Pitcher',
    brand: 'Waterdrop',
    price: 'Check current price',
    reason: 'Certified NSF/ANSI 42 and 372 only. Not NSF 53; PFOA/PFOS reduction is third-party lab testing, not certified lead reduction.',
    link: WATERDROP_PT07_URL,
    amazon: `https://www.amazon.com/dp/B07C3P2RZP?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
];

export const TOP_PFAS: TopPickRow[] = [
  {
    product: 'Waterdrop G3P600',
    brand: 'Waterdrop',
    price: '~$399',
    reason: 'Tankless under-sink RO — NSF 58. Removes 99%+ PFAS, lead, and arsenic; smart TDS faucet.',
    link: WATERDROP_RO,
    amazon: `https://www.amazon.com/dp/B07P1XFYJP?tag=${AMAZON}`,
    badge: 'UNDER-SINK RO',
  },
  {
    product: "Frizzlife SK99-NEW",
    brand: "Frizzlife",
    price: "Check current price",
    reason: "Direct-connect carbon filtration for municipal cold water. Uses the existing faucet; no RO drain or electrical outlet. Does not reduce dissolved salts or soften water. Verify the exact cartridge’s listed reduction claims.",
    link: "https://www.frizzlife.com/products/sk99-new",
    amazon: "https://www.amazon.com/dp/B08NDYVZV5?tag=watercheckup-20",
    badge: "DIRECT-CONNECT CARBON",
  },
  {
    product: "Epic Smart Shield",
    brand: "Epic Water Filters",
    price: "Check current price",
    reason: "Carbon-block under-sink filter connecting to the existing cold-water line. No RO drain or dedicated faucet. Not reverse osmosis or a softener; check the exact model’s performance data for your concern.",
    link: "https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system",
    amazon: "https://www.amazon.com/dp/B076S1W5QY?tag=watercheckup-20",
    badge: "DIRECT-CONNECT CARBON",
  },
  {
    product: "Waterdrop G3P600",
    brand: "Waterdrop",
    price: "Check current price",
    reason: "Tankless kitchen reverse osmosis. Needs an outlet, dedicated faucet and drain connection. Match the exact model’s listed reduction claims to your concern.",
    link: "https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=anbyjkqb",
    amazon: "https://www.amazon.com/dp/B07P1XFYJP?tag=watercheckup-20",
    badge: "UNDER-SINK RO",
  },
  {
    product: 'Frizzlife PD1000-TAM4 + MWT3 / IMC-1 Bundle',
    brand: 'Frizzlife',
    price: 'Check current price',
    reason: 'Certified NSF/ANSI 372 (lead-free). Third-party tested to NSF/ANSI 42/53/58 methods — not NSF 58 certified. 1000 GPD tankless RO.',
    link: 'https://www.frizzlife.com/products/pd1000-tam4',
    amazon: '',
    badge: 'UNDER-SINK RO',
  },
  {
    product: "AquaTru Classic Countertop RO",
    brand: "AquaTru",
    price: "Check current price",
    reason: "Countertop reverse osmosis without plumbing changes. Requires an outlet, manual tank refills and cleaning. Check the exact Classic model’s performance data and replacement costs.",
    link: "https://aquatru.com/products/countertop-reverse-osmosis-water-purifier",
    amazon: "https://www.amazon.com/dp/B0CQS3HQ8F?tag=watercheckup-20",
    badge: "COUNTERTOP RO",
  },
  {
    product: 'AquaTru Classic',
    brand: 'AquaTru',
    price: '~$380',
    reason: 'Countertop NSF 42/53/58/401 — PFAS, nitrates, fluoride; no plumbing.',
    link: 'https://aquatru.com/products/countertop-reverse-osmosis-water-purifier',
    amazon: `https://www.amazon.com/dp/B0CQS3HQ8F?tag=${AMAZON}`,
    badge: 'COUNTERTOP RO',
  },
  {
    product: 'Epic Smart Shield',
    brand: 'Epic Water Filters',
    price: 'Check current price',
    reason: 'Non-RO under-sink — NSF 401 + strong PFAS reduction claims on listings. Amazon and brand prices often differ; check the live listing.',
    link: 'https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system',
    amazon: `https://www.amazon.com/gp/product/B076S1W5QY?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Clearly Filtered 10-Cup Pitcher',
    brand: 'Clearly Filtered',
    price: '~$90',
    reason: 'NSF/ANSI 42 and 372 certified. Broader PFAS, lead, and 53/401/P473 figures are published lab tests, not NSF listings.',
    link: 'https://clearlyfiltered.com/products/clean-water-pitcher',
    amazon: `https://www.amazon.com/dp/B0DFC22BHT?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
  {
    product: 'ZeroWater 10-Cup Pitcher',
    brand: 'ZeroWater',
    price: '~$23',
    reason: 'NSF 42/53 — budget pitcher; TDS meter included.',
    link: 'https://zerowater.com/collections/water-filter-pitchers-dispensers',
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
    product: 'Frizzlife SK99-NEW',
    brand: 'Frizzlife',
    price: '~$126',
    reason: 'IAPMO certified to NSF/ANSI 42, 53, and 372. Quick-change carbon — not NSF 401.',
    link: 'https://www.frizzlife.com/products/sk99-new',
    amazon: `https://www.amazon.com/dp/B08NDYVZV5?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  {
    product: 'Frizzlife MK99',
    brand: 'Frizzlife',
    price: 'Check current price',
    reason: 'Best-value under-sink carbon — NSF 53 lead; under 2-minute install.',
    link: 'https://www.frizzlife.com/products/mk99',
    amazon: `https://www.amazon.com/dp/B07MFYQBTX?tag=${AMAZON}`,
    badge: 'UNDER-COUNTER',
  },
  TOP_PFAS[7],
  {
    product: 'Aquasana Claryum 3-Stage Max Flow (AQ-6300M)',
    brand: 'Aquasana',
    price: '~$170',
    reason: 'Three-stage carbon under-sink — NSF 42/53/401 without RO waste.',
    link: 'https://www.aquasana.com/under-sink-water-filters/claryum-3-stage-max-flow/chrome-100391705.html',
    amazon: `https://www.amazon.com/dp/B0FN9Y9JSP?tag=${AMAZON}`,
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
    product: 'Clearly Filtered 10-Cup Pitcher',
    brand: 'Clearly Filtered',
    price: '~$90',
    reason: 'NSF/ANSI 42 and 372 certified. Broader PFAS, lead, and 53/401/P473 figures are published lab tests, not NSF listings.',
    link: 'https://clearlyfiltered.com/products/clean-water-pitcher',
    amazon: `https://www.amazon.com/dp/B0DFC22BHT?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
  {
    product: 'ZeroWater 10-Cup Pitcher',
    brand: 'ZeroWater',
    price: '~$23',
    reason: 'NSF 42/53 — lead, chromium, arsenic; TDS to zero; includes meter.',
    link: 'https://zerowater.com/collections/water-filter-pitchers-dispensers',
    amazon: `https://www.amazon.com/dp/B0DWTTYTQN?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
  {
    product: 'PUR PLUS 11-Cup Pitcher',
    brand: 'PUR',
    price: 'Check current price',
    reason: 'NSF 42/53 — lead, arsenic, uranium on listings; widely available.',
    link: 'https://www.pur.com/shop/pitchers/11-cup-pitcher-ppt111/',
    amazon: `https://www.amazon.com/dp/B09LKTLVNR?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
  {
    product: 'Waterdrop PT-07B Pitcher',
    brand: 'Waterdrop',
    price: 'Check current price',
    reason: 'Certified NSF/ANSI 42 and 372 only. Not NSF 53; PFOA/PFOS reduction is third-party lab testing, not certified lead reduction.',
    link: WATERDROP_PT07_URL,
    amazon: `https://www.amazon.com/dp/B07C3P2RZP?tag=${AMAZON}`,
    badge: 'PITCHER',
  },
];

export const TOP_WHOLE_HOUSE: TopPickRow[] = [
  {
    product: 'Aquasana Whole House WH-1000-B',
    brand: 'Aquasana',
    price: "Check current price",
    reason: "Whole-house chlorine-focused system. Confirm WH-1000-B package contents, installation and the current performance sheet. Do not assume PFAS or chloramine reduction.",
    link: 'https://www.aquasana.com/whole-house-water-filters/rhino/probypass-100365536.html',
    amazon: `https://www.amazon.com/dp/B00XAJJVHQ?tag=${AMAZON}`,
    badge: 'WHOLE HOUSE',
  },
  {
    product: 'iSpring WGB32B 3-Stage',
    brand: 'iSpring',
    price: '~$359',
    reason: 'Popular DIY whole-house sediment + dual carbon — NSF 42; strong value entry point.',
    link: 'https://www.amazon.com/dp/B008GNRMYK?tag=watercheckup-20',
    amazon: `https://www.amazon.com/gp/product/B008GNRMYK?tag=${AMAZON}`,
    badge: 'WHOLE HOUSE',
  },
  {
    product: 'Express Water WH300SCKS',
    brand: 'Express Water',
    price: '~$500',
    reason: 'NSF-certified filters — pressure gauges included; chloramine and chlorine at every tap.',
    link: 'https://www.expresswater.com/products/heavy-metal-whole-house',
    amazon: `https://www.amazon.com/dp/B01LFMTYBM?tag=${AMAZON}`,
    badge: 'WHOLE HOUSE',
  },
  {
    product: 'Waterdrop WHF3T-PG',
    brand: 'Waterdrop',
    price: '~$270',
    reason: 'NSF/ANSI 372 (lead-free materials); chlorine reduction is manufacturer / third-party lab data. Transparent housings + pressure gauge.',
    link: 'https://www.waterdropfilter.com/products/whole-house-water-filter-for-tap-water-wd-whf3t-pg?ref=anbyjkqb',
    amazon: '',
    badge: 'WHOLE HOUSE',
  },
];

export const TOP_SHOWER: TopPickRow[] = [
  {
    product: 'AquaBliss SF100 Daily Revitalize',
    brand: 'AquaBliss',
    price: '~$28',
    reason:
      'Calcium sulfite, redox (KDF-style) media, activated carbon, plus vitamin C, tourmaline, and zeolite. About $28 on Amazon (sale; brand about $37). Not a softener, not NSF/ANSI 177, and not a chloramine specialist — confirm fit.',
    link: 'https://aquabliss.com/products/sf100-shower-filter',
    amazon: `https://www.amazon.com/dp/B01MUBU0YC?tag=${AMAZON}`,
    badge: 'BUDGET CHLORINE',
  },
  {
    product: 'AquaTru Shower Filter',
    brand: 'AquaTru',
    price: '~$104',
    reason:
      'Copper-zinc alloy (comparable to KDF), calcium sulfite, and catalytic carbon. IAPMO R&T certified to NSF/ANSI 177 for free chlorine (confirm exact model; chloramine reduction is a maker claim). About $104 on Amazon or $149 from the brand. Cartridge about 90 days; replacement about $39.95. Not a softener.',
    link: 'https://aquatru.com/products/aquatru-shower',
    amazon: `https://www.amazon.com/dp/B0FLHFTGYD?tag=${AMAZON}`,
    badge: 'IAPMO NSF 177',
  },
  {
    product: 'Sonaki Vitamin C Inline Shower Filter SUF-100v',
    brand: 'Sonaki',
    price: '~$83',
    reason:
      'Vitamin C (ascorbic acid) inline filter, model SUF-100v (VitaPure 100). About $83 on Amazon or $79 from the brand. Cartridge life 4–6 weeks. Not NSF/ANSI 177 certified. Confirm shower-arm fit.',
    link: 'https://www.sonaki.com/products/sonaki-inline-vitamin-c-shower-filter',
    amazon: `https://www.amazon.com/dp/B01BLO3FAU?tag=${AMAZON}`,
    badge: 'CHLORAMINE',
  },
];

export const TOP_FAUCET: TopPickRow[] = [
  {
    product: 'PUR PLUS Vertical Faucet Filter (Stainless Steel)',
    brand: 'PUR',
    price: '~$60',
    reason: 'NSF 42/53 — lead, arsenic, mercury; one-click on/off; no permanent install.',
    link: 'https://www.pur.com/shop/faucet-systems/',
    amazon: `https://www.amazon.com/dp/B009V9K6BY?tag=${AMAZON}`,
    badge: 'FAUCET',
  },
  {
    product: 'Brita Elite Advanced Faucet Filter',
    brand: 'Brita',
    price: '~$30',
    reason: 'NSF 42/53 — lead, chlorine, chloramine; 3-way diverter; tool-free attach.',
    link: 'https://www.brita.com/faucet-systems/',
    amazon: `https://www.amazon.com/dp/B00006IV0P?tag=${AMAZON}`,
    badge: 'FAUCET',
  },
];

export const TOP_WELL: TopPickRow[] = [
  {
    product: 'HQUA-OWS-12 UV Sterilizer',
    brand: 'HQUA',
    price: '~$200',
    reason: 'UV sterilizer for private-well bacteria, viruses, and cysts; no chemicals. NSF/ANSI 55 listing not confirmed.',
    link: 'https://www.hquatech.com/products/uv-water-sterilizer/hqua-ows-12/',
    amazon: `https://www.amazon.com/dp/B01N2YMU3O?tag=${AMAZON}`,
    badge: 'WELL / UV',
  },
  {
    product: 'iSpring WCFM500K Iron & Sulfur',
    brand: 'iSpring',
    price: '~$1,870',
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
    price: 'Check current price',
    reason: 'NSF/ANSI 44 salt softener — removes hardness at every tap; metered valve.',
    link: 'https://flecksystems.com',
    amazon: `https://www.amazon.com/s?k=Fleck+5600SXT+48000+grain+water+softener&tag=${AMAZON}`,
    badge: 'SOFTENER',
  },
  {
    product: 'Aquasure Harmony 48,000 Grain',
    brand: 'Aquasure',
    price: 'Check current price',
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
    link: 'https://www.amazon.com/dp/B078GHJ921?tag=watercheckup-20',
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

export const TOP_COMPARE_K19: TopPickRow[] = [TOP_PFAS[6], TOP_PFAS[8]];

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
  'best-shower-filter-2026': 'shower',
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

/**
 * Per-guide Top 3 that matches the products each article actually recommends.
 * Pitcher guide omits PT-07B: brand collection currently lists it sold out, and
 * the article leads with Brita Elite OB06, Clearly Filtered, and ZeroWater.
 */
export const GUIDE_TOP3_OVERRIDES: Record<string, TopPickRow[]> = {
  'best-water-filter-pitcher-2025': [
    {
      product: 'Brita Elite OB06 in a compatible pitcher',
      brand: 'Brita',
      price: 'Check current price',
      reason:
        'Documented NSF/ANSI 53-style lead reduction on the OB06 sheet in listed pitcher systems. Buy the Elite cartridge, not Original.',
      link: 'https://www.brita.com/products/brita-elite-replacement-filters/',
      amazon: '',
      badge: 'BEST OVERALL',
    },
    {
      product: 'Clearly Filtered 10-Cup Pitcher',
      brand: 'Clearly Filtered',
      price: '~$90',
      reason:
        'NSF/ANSI 42 and 372 certified. Broader PFAS, lead, and 53/401/P473 figures are published lab tests, not NSF listings.',
      link: 'https://clearlyfiltered.com/products/clean-water-pitcher',
      amazon: `https://www.amazon.com/dp/B0DFC22BHT?tag=${AMAZON}`,
      badge: 'BROADER LAB TESTS',
    },
    {
      product: 'ZeroWater 10-Cup Pitcher',
      brand: 'ZeroWater',
      price: '~$23',
      reason: 'NSF 42/53 — lead, chromium, arsenic; TDS meter included. Budget pitcher with a certified lead claim.',
      link: 'https://zerowater.com/collections/water-filter-pitchers-dispensers',
      amazon: `https://www.amazon.com/dp/B0DWTTYTQN?tag=${AMAZON}`,
      badge: 'BUDGET NSF 53',
    },
  ],
  'best-ro-system-for-pfas-removal': [
    {
      product: 'Waterdrop G3P600',
      brand: 'Waterdrop',
      price: '~$399',
      reason:
        'Tankless under-sink RO — NSF 42/53/58/372. 600 GPD, 2:1 pure-to-drain, smart TDS faucet. Best overall RO in this guide.',
      link: WATERDROP_RO,
      amazon: `https://www.amazon.com/dp/B07P1XFYJP?tag=${AMAZON}`,
      badge: 'BEST OVERALL',
    },
    {
      product: 'APEC ROES-50',
      brand: 'APEC',
      price: '~$145',
      reason:
        '5-stage under-sink RO with tank. NSF/ANSI 58 and 372 on the current Amazon listing. Budget workhorse from this guide.',
      link: `https://www.amazon.com/dp/B00I0ZGOZM?tag=${AMAZON}`,
      amazon: `https://www.amazon.com/dp/B00I0ZGOZM?tag=${AMAZON}`,
      badge: 'BEST BUDGET',
    },
    {
      product: 'AquaTru Classic Countertop RO',
      brand: 'AquaTru',
      price: '~$380',
      reason: 'Countertop NSF 42/53/58/401 — no plumbing. No-install RO for renters from this guide.',
      link: 'https://aquatru.com/products/countertop-reverse-osmosis-water-purifier',
      amazon: `https://www.amazon.com/dp/B0CQS3HQ8F?tag=${AMAZON}`,
      badge: 'NO-INSTALL RO',
    },
  ],
  'best-under-sink-water-filter': [
    {
      product: 'Waterdrop G3P600',
      brand: 'Waterdrop',
      price: '~$399',
      reason:
        'Tankless under-sink RO — NSF 42/53/58/372. Best overall when PFAS, lead, or dissolved solids are the concern.',
      link: WATERDROP_RO,
      amazon: `https://www.amazon.com/dp/B07P1XFYJP?tag=${AMAZON}`,
      badge: 'BEST OVERALL',
    },
    {
      product: 'Frizzlife SK99-NEW',
      brand: 'Frizzlife',
      price: '~$126',
      reason:
        'IAPMO certified to NSF/ANSI 42, 53, and 372. Direct-connect carbon — no RO drain. Best budget under-sink when you do not need RO.',
      link: 'https://www.frizzlife.com/products/sk99-new',
      amazon: `https://www.amazon.com/dp/B08NDYVZV5?tag=${AMAZON}`,
      badge: 'BEST BUDGET',
    },
    {
      product: 'Epic Smart Shield',
      brand: 'Epic Water Filters',
      price: 'Check current price',
      reason:
        'Carbon-block under-sink filter on the existing cold-water line. No RO drain or dedicated faucet. Amazon and brand prices often differ.',
      link: 'https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system',
      amazon: `https://www.amazon.com/dp/B076S1W5QY?tag=${AMAZON}`,
      badge: 'DIRECT-CONNECT CARBON',
    },
  ],
};

export function hasExplicitTopPicks(slug: string): boolean {
  return Boolean(GUIDE_TOP3_OVERRIDES[slug]?.length);
}

export function getTopPicksForSegment(segment: BlogPickSegment): TopPickRow[] {
  return attachProductImages((PICKS_BY_SEGMENT[segment] ?? TOP_RO).slice(0, MAX_PICKS));
}

export function resolveBlogTopPicks(
  slug: string,
  postPicks?: TopPickRow[],
  badge?: string
): TopPickRow[] {
  const override = GUIDE_TOP3_OVERRIDES[slug];
  if (override?.length) return attachProductImages(override.slice(0, MAX_PICKS));
  const segment =
    BLOG_SLUG_PICK_SEGMENT[slug] ?? (badge ? inferSegmentFromBadge(badge) : undefined);
  if (segment) return getTopPicksForSegment(segment);
  if (postPicks?.length) return attachProductImages(postPicks.slice(0, MAX_PICKS));
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

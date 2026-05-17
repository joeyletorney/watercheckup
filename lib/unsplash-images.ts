/** Curated Unsplash CDN URLs (images.unsplash.com). */

export const unsplash = (photoPath: string, w: number, h: number) =>
  `https://images.unsplash.com/${photoPath}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

/** Homepage hero — water pouring into glass */
export const HOME_HERO_IMAGE = unsplash('photo-1548839140-29a749e1cf4d', 760, 570);
export const HOME_HERO_ALT = 'Clean drinking water in a glass';

/** About page */
export const ABOUT_WATER_TESTING = unsplash('photo-1584820927498-cfe5211fd8bf', 520, 520);
export const ABOUT_WATER_TESTING_ALT = 'Laboratory water quality testing and analysis';
export const ABOUT_WATER_TEXTURE = unsplash('photo-1559827260-f84ed364b977', 1600, 900);
export const ABOUT_WATER_TEXTURE_ALT = 'Calm water surface texture';
export const ABOUT_FILTER_SYSTEM = unsplash('photo-1585771724684-38269d6639fd', 800, 500);
export const ABOUT_FILTER_SYSTEM_ALT = 'Under-sink water filtration system';

/** City pages — tap / glass */
export const CITY_TAP_HERO = unsplash('photo-1548839140-29a749e1cf4d', 1200, 420);
export function cityTapHeroAlt(cityLabel: string) {
  return `Tap water quality report for ${cityLabel}`;
}

/** State pages — reservoir landscape */
export const STATE_WATER_HERO = unsplash('photo-1505118380757-91f5f5632de0', 1200, 420);
export function stateWaterHeroAlt(stateName: string) {
  return `${stateName} drinking water sources and reservoir landscape`;
}

/** Blog default featured */
export const BLOG_DEFAULT_FEATURED = unsplash('photo-1563453392212-326f5e854473', 1200, 600);
export const BLOG_DEFAULT_FEATURED_ALT = 'Glass of clean drinking water';

/** Contaminant guide images */
export const CONTAMINANT_CONTAMINATION = unsplash('photo-1611273426858-450d8e3c9fce', 800, 450);
export const CONTAMINANT_CONTAMINATION_ALT = 'Environmental water quality and contamination concerns';
export const CONTAMINANT_NATURAL_WATER = unsplash('photo-1505118380757-91f5f5632de0', 800, 450);
export const CONTAMINANT_NATURAL_WATER_ALT = 'Natural surface water source';

const CONTAMINANT_IMAGE_BY_NAME: Record<string, { src: string; alt: string }> = {
  PFAS: { src: CONTAMINANT_CONTAMINATION, alt: 'Industrial area near water — PFAS contamination context' },
  Lead: { src: CONTAMINANT_CONTAMINATION, alt: 'Aging plumbing and water infrastructure — lead in tap water' },
  'Chromium-6': { src: CONTAMINANT_CONTAMINATION, alt: 'Industrial water pollution — chromium-6 context' },
  Arsenic: { src: CONTAMINANT_NATURAL_WATER, alt: 'Natural groundwater and surface water — arsenic sources' },
  'Volatile organic compounds': { src: CONTAMINANT_CONTAMINATION, alt: 'Industrial solvents and water contamination' },
  'Pesticides & herbicides': { src: CONTAMINANT_NATURAL_WATER, alt: 'Agricultural runoff into water supplies' },
};

export function getContaminantImage(name: string) {
  const match = CONTAMINANT_IMAGE_BY_NAME[name];
  if (match) return match;
  return { src: CONTAMINANT_CONTAMINATION, alt: `${name} in drinking water — water quality guide` };
}

/** Water hardness */
export const HARDNESS_HERO = unsplash('photo-1548839140-29a749e1cf4d', 1200, 400);
export const HARDNESS_HERO_ALT = 'Tap water and household water quality';
export const HARDNESS_SOFTENER = unsplash('photo-1585771724684-38269d6639fd', 800, 480);
export const HARDNESS_SOFTENER_ALT = 'Residential water softener and filtration system';

/** Homepage — How it works step thumbnails */
export const HOW_IT_ZIP = unsplash('photo-1521208910042-0b6be2146e5f', 400, 280);
export const HOW_IT_DATA = unsplash('photo-1473771396169-704ce5480010', 400, 280);
export const HOW_IT_FILTER = unsplash('photo-1585771724684-38269d6639fd', 400, 280);

/** Homepage — contaminants section background */
export const HOME_CONTAMINANTS_BG = unsplash('photo-1567788833790-966eccf2fb13', 1400, 800);
export const HOME_CONTAMINANTS_BG_ALT = 'Water droplet on a clean surface';

/** Footer wave accent */
export const FOOTER_WAVE = unsplash('photo-1559827260-f84ed364b977', 1100, 120);
export const FOOTER_WAVE_ALT = 'Subtle water wave texture';

/** Blog featured images — topic-tagged pool (deterministic fallback by slug) */
const BLOG_BY_BADGE: Record<string, string> = {
  PFAS: 'photo-1521208910042-0b6be2146e5f',
  Lead: 'photo-1563453392214-2f3273af6298',
  Filters: 'photo-1614027683568-74cbf27a2abf',
  EPA: 'photo-1473771396169-704ce5480010',
  Health: 'photo-1558618666-fcd25c85cd64',
  Well: 'photo-1507666664345-c49223375aca',
  THM: 'photo-1602143407151-7111542de6e8',
  Hardness: 'photo-1432404009762-c54dab2e995e',
  RO: 'photo-1614027683568-74cbf27a2abf',
  Pitcher: 'photo-1559592413-7c0e743b3e0e',
  Fluoride: 'photo-1548839140-29a749e1cf4d',
  Nitrate: 'photo-1567788833790-966eccf2fb13',
  Microplastics: 'photo-1473771396169-704ce5480010',
  Bottled: 'photo-1558618666-fcd25c85cd64',
  Moving: 'photo-1521208910042-0b6be2146e5f',
  Science: 'photo-1567788833790-966eccf2fb13',
  Cities: 'photo-1507666664345-c49223375aca',
};

const BLOG_IMAGE_POOL = [
  'photo-1563453392212-326f5e854473',
  'photo-1548839140-29a749e1cf4d',
  'photo-1521208910042-0b6be2146e5f',
  'photo-1559827260-f84ed364b977',
  'photo-1567788833790-966eccf2fb13',
  'photo-1432404009762-c54dab2e995e',
  'photo-1614027683568-74cbf27a2abf',
  'photo-1602143407151-7111542de6e8',
  'photo-1473771396169-704ce5480010',
  'photo-1507666664345-c49223375aca',
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (Math.imul(31, h) + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getBlogFeaturedImageUrl(slug: string, badge?: string): string {
  const path = (badge && BLOG_BY_BADGE[badge]) || BLOG_IMAGE_POOL[hashSlug(slug) % BLOG_IMAGE_POOL.length];
  return unsplash(path, 1200, 600);
}

/** @deprecated Use cityTapHeroAlt */
export const CITY_HERO_IMAGE = unsplash('photo-1548839140-29a749e1cf4d', 160, 160);
export function cityHeroAlt(cityLabel: string) {
  return cityTapHeroAlt(cityLabel);
}

/** @deprecated Use ABOUT_WATER_TEXTURE */
export const ABOUT_WATER_BG = ABOUT_WATER_TEXTURE;
export const ABOUT_WATER_BG_ALT = ABOUT_WATER_TEXTURE_ALT;

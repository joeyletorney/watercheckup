/** Curated Unsplash CDN URLs (images.unsplash.com). Unsplash Source API is retired. */

const unsplash = (photoPath: string, w: number, h: number) =>
  `https://images.unsplash.com/${photoPath}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

/** Homepage hero — glass of clean water */
export const HOME_HERO_IMAGE = unsplash('photo-1548839140-29a749e1cf4d', 760, 570);
export const HOME_HERO_ALT = 'Clean drinking water in a glass';

/** About page — subtle water texture background */
export const ABOUT_WATER_BG = unsplash('photo-1559827260-f84ed364b977', 1600, 900);
export const ABOUT_WATER_BG_ALT = 'Calm water surface texture';

/** City pages — compact tap / glass visual */
export const CITY_HERO_IMAGE = unsplash('photo-1548839140-29a749e1cf4d', 160, 160);
export function cityHeroAlt(cityLabel: string) {
  return `Tap water and drinking water quality in ${cityLabel}`;
}

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
  'photo-1548839140-29a749e1cf4d',
  'photo-1521208910042-0b6be2146e5f',
  'photo-1559827260-f84ed364b977',
  'photo-1567788833790-966eccf2fb13',
  'photo-1432404009762-c54dab2e995e',
  'photo-1614027683568-74cbf27a2abf',
  'photo-1602143407151-7111542de6e8',
  'photo-1473771396169-704ce5480010',
  'photo-1507666664345-c49223375aca',
  'photo-1558618666-fcd25c85cd64',
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (Math.imul(31, h) + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getBlogFeaturedImageUrl(slug: string, badge?: string): string {
  const path = (badge && BLOG_BY_BADGE[badge]) || BLOG_IMAGE_POOL[hashSlug(slug) % BLOG_IMAGE_POOL.length];
  return unsplash(path, 800, 400);
}

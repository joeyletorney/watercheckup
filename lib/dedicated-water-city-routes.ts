/** City slugs with `app/water/[slug]/page.tsx` — exclude from `/water/[city]` static generation */
export const DEDICATED_WATER_CITY_SLUGS = ['san-antonio', 'houston', 'phoenix', 'sugar-land'] as const;

export function isDedicatedWaterCitySlug(slug: string): boolean {
  return (DEDICATED_WATER_CITY_SLUGS as readonly string[]).includes(slug);
}

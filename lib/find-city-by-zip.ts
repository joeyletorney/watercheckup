import { CITIES, WATER_CITY_SLUGS } from "@/app/water/[city]/cities-data";

export function findCitySlugByZip(zip5: string): string | undefined {
  const z = zip5.trim();
  if (!/^\d{5}$/.test(z)) return undefined;
  for (const slug of WATER_CITY_SLUGS) {
    if (CITIES[slug]?.zip === z) return slug;
  }
  return undefined;
}

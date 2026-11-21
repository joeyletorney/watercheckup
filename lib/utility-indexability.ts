import type { UtilityJsonRecord } from '@/lib/utilities-data';
import { SEO_INDEX_UTILITY_SLUGS } from '@/lib/city-water-testing';

const SEO_INDEX_SLUG_SET = new Set<string>(SEO_INDEX_UTILITY_SLUGS);

/** Municipal community systems whose city names contain college/temple/etc. */
const MUNICIPAL_SYSTEM_NAME =
  /\b(city of|town of|village of|borough of|township of|county of|city water|town water|municipal|public utilities|water (department|dept\.?|works|district|authority|utility|utilities|supply|bureau)|college station|university city)\b/i;

const NON_COMMUNITY_NAME =
  /\b(school|church|chapel|temple|synagogue|mosque|gas station|gasoline|fuel|trailer|mobile home|\bmhp\b|manufactured home|campground|rv park|golf|cafe|caf[eé]|restaurant|diner|mart\b|store\b|hotel|motel|inn\b|lodge|daycare|day care|elementary|high school|middle school|university of|college of|ko[a]\b|truck stop|plaza|casino)\b/i;

/** Community systems with a real service population stay indexable. */
export const MIN_INDEXABLE_UTILITY_POPULATION = 500;

export function shouldIndexUtility(
  u: Pick<UtilityJsonRecord, 'name' | 'populationServed'> & { slug?: string },
): boolean {
  if (u.slug && SEO_INDEX_SLUG_SET.has(u.slug.toLowerCase())) return true;
  const pop = u.populationServed ?? 0;
  if (pop > 0 && pop < MIN_INDEXABLE_UTILITY_POPULATION) return false;
  if (MUNICIPAL_SYSTEM_NAME.test(u.name)) return true;
  if (NON_COMMUNITY_NAME.test(u.name)) return false;
  return true;
}

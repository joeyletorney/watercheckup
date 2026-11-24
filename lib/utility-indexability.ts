import type { UtilityJsonRecord } from '@/lib/utilities-data';
import { SEO_INDEX_UTILITY_SLUGS } from '@/lib/city-water-testing';

const SEO_INDEX_SLUG_SET = new Set<string>(SEO_INDEX_UTILITY_SLUGS);

/** EPA SDWIS non-community / transient type codes. */
export const NON_COMMUNITY_PWS_TYPES = new Set(['TNCWS', 'NTNCWS']);

/** Municipal community systems whose city names contain college/temple/etc. */
const MUNICIPAL_SYSTEM_NAME =
  /\b(city of|town of|village of|borough of|township of|county of|city water|town water|municipal|public utilities|water (department|dept\.?|works|district|authority|utility|utilities|supply|bureau)|college station|university city)\b/i;

/**
 * Name stand-ins for TNCWS / NTNCWS and tiny commercial systems.
 * `utilities.json` does not currently store PWS_TYPE_CODE; names + population
 * approximate those types until the next SDWA fetch lands `pwsType`.
 */
const NON_COMMUNITY_NAME =
  /\b(school|church|chapel|temple|synagogue|mosque|gas station|gasoline|fuel|trailer|mobile home|\bmhp\b|manufactured home|campground|rv park|\brvs?\b|golf|cafe|caf[eé]|restaurant|diner|mart\b|store\b|hotel|motel|inn\b|lodge|daycare|day care|child care|childcare|preschool|pre-school|elementary|high school|middle school|university of|college of|ko[a]\b|truck stop|plaza|casino|strip mall|shopping (center|mall|plaza)|\bmall\b|convenience|rest area|rest stop|cinema|theater|theatre|marina|country club|service station|truckstop)\b/i;

/** Community systems below this served population are treated as too thin to index. */
export const MIN_INDEXABLE_UTILITY_POPULATION = 500;

export type UtilityIndexInput = Pick<UtilityJsonRecord, 'name' | 'populationServed'> & {
  slug?: string;
  pwsType?: string | null;
};

/**
 * Indexable = real municipal / community water systems that a household might search.
 *
 * Noindex, follow when any of:
 * 1. SDWIS type is TNCWS or NTNCWS (when `pwsType` is present)
 * 2. Population served is missing, 0, or below 500 (tiny / non-residential scale)
 * 3. Name matches a non-community / transient / commercial pattern, unless the
 *    name is clearly municipal (City of / water district / etc.)
 *
 * Allowlisted Maryland testing pages stay indexable regardless.
 */
export function shouldIndexUtility(u: UtilityIndexInput): boolean {
  if (u.slug && SEO_INDEX_SLUG_SET.has(u.slug.toLowerCase())) return true;
  const type = (u.pwsType ?? '').trim().toUpperCase();
  if (NON_COMMUNITY_PWS_TYPES.has(type)) return false;
  const pop = u.populationServed ?? 0;
  if (pop < MIN_INDEXABLE_UTILITY_POPULATION) return false;
  if (MUNICIPAL_SYSTEM_NAME.test(u.name)) return true;
  if (NON_COMMUNITY_NAME.test(u.name)) return false;
  return true;
}

/** Paginated or filtered state directory URLs should not compete with page 1. */
export function shouldIndexUtilityDirectoryPage(page: number, query = ''): boolean {
  return page <= 1 && query.trim().length === 0;
}

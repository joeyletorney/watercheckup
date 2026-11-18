import type { UtilityJsonRecord } from '@/lib/utilities-data';

const NON_COMMUNITY_NAME =
  /\b(school|church|chapel|temple|synagogue|mosque|gas station|gasoline|fuel|trailer|mobile home|\bmhp\b|manufactured home|campground|rv park|golf|cafe|caf[eé]|restaurant|diner|mart\b|store\b|hotel|motel|inn\b|lodge|daycare|day care|elementary|high school|middle school|university|college|ko[a]\b|truck stop|plaza|casino)\b/i;

/** Community systems with a real service population stay indexable. */
export const MIN_INDEXABLE_UTILITY_POPULATION = 500;

export function shouldIndexUtility(u: Pick<UtilityJsonRecord, 'name' | 'populationServed'>): boolean {
  const pop = u.populationServed ?? 0;
  if (pop > 0 && pop < MIN_INDEXABLE_UTILITY_POPULATION) return false;
  if (NON_COMMUNITY_NAME.test(u.name)) return false;
  return true;
}

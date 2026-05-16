import { CITIES, WATER_CITY_SLUGS } from '@/app/water/[city]/cities-data';

export type CityRecord = (typeof CITIES)[string];

export { CITIES, WATER_CITY_SLUGS };

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  DC: 'Washington DC',
};

/** URL slug for a state (matches `app/water/state/[city]` hub segments, e.g. `texas`). */
export function stateAbbrToSlug(abbr: string): string {
  const name = STATE_NAMES[abbr.toUpperCase()];
  if (!name) return abbr.toLowerCase().replace(/\s+/g, '-');
  return name.toLowerCase().replace(/\s+/g, '-');
}

const SLUG_TO_ABBR: Record<string, string> = {};
for (const [abbr, name] of Object.entries(STATE_NAMES)) {
  SLUG_TO_ABBR[name.toLowerCase().replace(/\s+/g, '-')] = abbr;
}
SLUG_TO_ABBR['washington-dc'] = 'DC';
SLUG_TO_ABBR['dc'] = 'DC';

export function stateSlugToAbbr(stateSlug: string): string | null {
  const key = stateSlug.toLowerCase().trim();
  return SLUG_TO_ABBR[key] ?? null;
}

export function getCityByStateAndCitySlug(
  stateSlug: string,
  citySlug: string,
): { slug: string; data: CityRecord } | null {
  const abbr = stateSlugToAbbr(stateSlug);
  if (!abbr) return null;
  const data = CITIES[citySlug];
  if (!data || data.state !== abbr) return null;
  return { slug: citySlug, data };
}

/** Params for `app/water/[state]/[city]` static generation. */
export function allStateCityParams(): { state: string; city: string }[] {
  return Object.entries(CITIES).map(([slug, cd]) => ({
    state: stateAbbrToSlug(cd.state),
    city: slug,
  }));
}

export function listCitySlugsForStateSlug(stateSlug: string): string[] {
  const abbr = stateSlugToAbbr(stateSlug);
  if (!abbr) return [];
  return Object.entries(CITIES)
    .filter(([, cd]) => cd.state === abbr)
    .map(([slug]) => slug);
}

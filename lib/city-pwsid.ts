/**
 * Canonical EPA SDWIS community-system IDs for city pages.
 *
 * City identity must NOT follow zip-lookup.json. That file prefers the largest
 * nearby supplier and is how Boston/Worcester inherited Raynham Center
 * (MA4245000) and Rochester inherited a North Salem school (NY5907717).
 *
 * IDs were checked against the packaged EPA ECHO SDWA catalog in
 * data/utilities.json (name, state, population, community system).
 */

export const CITY_PWSID_OVERRIDES: Record<string, string> = {
  chicago: 'IL0316000',
  'los-angeles': 'CA1910067',
  houston: 'TX1010013',
  'new-york': 'NY7003493',
  phoenix: 'AZ0407025',
  philadelphia: 'PA1510001',
  'san-antonio': 'TX0150018',
  seattle: 'WA5377050',
  denver: 'CO0116001',
  boston: 'MA3035000',
  atlanta: 'GA1210001',
  'san-francisco': 'CA3810011',
  detroit: 'MI0001800',
  minneapolis: 'MN1270024',
  portland: 'OR4100657',
  'las-vegas': 'NV0000090',
  nashville: 'TN0000494',
  baltimore: 'MD0300002',
  gaithersburg: 'MD0150005',
  rockville: 'MD0150003',
  'silver-spring': 'MD0150005',
  bethesda: 'MD0150005',
  memphis: 'TN0000450',
  louisville: 'KY0560258',
  cleveland: 'OH1801212',
  pittsburgh: 'PA5020038',
  indianapolis: 'IN5249004',
  charlotte: 'NC0160010',
  raleigh: 'NC0392010',
  omaha: 'NE3105507',
  'kansas-city': 'MO1010415',
  'new-orleans': 'LA1071009',
  tampa: 'FL6290327',
  'st-louis': 'MO6010715',
  'salt-lake-city': 'UTAH18026',
  albuquerque: 'NM3510701',
  tucson: 'AZ0410112',
  jacksonville: 'FL2161328',
  'san-diego': 'CA3710020',
  'san-jose': 'CA4310011',
  'washington-dc': 'DC0000002',
  cincinnati: 'OH3102612',
  milwaukee: 'WI2410100',
  buffalo: 'NY1400422',
  anchorage: 'AK2210906',
  honolulu: 'HI0000331',
  'baton-rouge': 'LA1033005',
  richmond: 'VA4760100',
  'el-paso': 'TX0710002',
  'oklahoma-city': 'OK1020902',
  mesa: 'AZ0407095',
  'virginia-beach': 'VA3810900',
  'long-beach': 'CA1910065',
  'colorado-springs': 'CO0121150',
  wichita: 'KS2017308',
  arlington: 'TX2200001',
  bakersfield: 'CA1510031',
  aurora: 'CO0103005',
  anaheim: 'CA3010001',
  'corpus-christi': 'TX1780003',
  riverside: 'CA3310031',
  lexington: 'KY0340250',
  stockton: 'CA3910001',
  'st-paul': 'MN1620026',
  greensboro: 'NC0241010',
  toledo: 'OH4801411',
  newark: 'NJ0714001',
  plano: 'TX0430007',
  henderson: 'NV0000076',
  orlando: 'FL3480962',
  chandler: 'AZ0407090',
  laredo: 'TX2400001',
  madison: 'WI1130224',
  durham: 'NC0332010',
  lubbock: 'TX1520002',
  garland: 'TX0570010',
  'winston-salem': 'NC0234010',
  scottsdale: 'AZ0407098',
  norfolk: 'VA3710100',
  'jersey-city': 'NJ0906001',
  irving: 'TX0570050',
  'chula-vista': 'CA3710025',
  gilbert: 'AZ0407092',
  reno: 'NV0000190',
  'fort-wayne': 'IN5202020',
  'st-petersburg': 'FL6521715',
  'glendale-az': 'AZ0407093',
  hialeah: 'FL4130604',
  fremont: 'CA0110001',
  boise: 'ID4010016',
  birmingham: 'AL0000738',
  rochester: 'NY2704518',
  spokane: 'WA5383100',
  'des-moines': 'IA7727031',
  fayetteville: 'NC0326010',
  tacoma: 'WA5386800',
  akron: 'OH7700011',
  'little-rock': 'AR0000465',
  huntsville: 'AL0000882',
  worcester: 'MA2348000',
  knoxville: 'TN0000366',
  providence: 'RI1592024',
  'grand-rapids': 'MI0002790',
  dayton: 'OH5700722',
  jackson: 'MS0250008',
  savannah: 'GA0510003',
  'columbia-sc': 'SC4010001',
  'fort-lauderdale': 'FL4060486',
  lincoln: 'NE3110926',
  'ann-arbor': 'MI0000220',
  'cape-coral': 'FL5360325',
  tallahassee: 'FL1370655',
  cary: 'NC0392020',
  'fort-collins': 'CO0135291',
  'peoria-az': 'AZ0407096',
  tempe: 'AZ0407100',
  'west-palm-beach': 'FL4501559',
  'sioux-falls': 'SD4600294',
  hartford: 'CT0640011',
  stamford: 'CT1350011',
  fargo: 'ND0900336',
  provo: 'UTAH25006',
  modesto: 'CA5010010',
  'glendale-ca': 'CA1910043',
  brownsville: 'TX0310001',
  mcallen: 'TX1080006',
  chattanooga: 'TN0000107',
  'springfield-mo': 'MO5010754',
  murfreesboro: 'TN0000791',
  montgomery: 'AL0001070',
  alexandria: 'VA6510010',
  lakewood: 'CO0116001',
  parkersburg: 'WV3305407',
  'portsmouth-nh': 'NH1951010',
  'portland-me': 'ME0091300',
  'sugar-land': 'TX0790005',
  miami: 'FL4130871',
  'fort-worth': 'TX2200012',
  columbus: 'OH2504412',
  dallas: 'TX0570004',
  sacramento: 'CA3410020',
  pensacola: 'FL1170525',
  fresno: 'CA1010007',
  austin: 'TX2270001',
  'fairfax-county': 'VA6059501',
};

/**
 * Regional community systems that legitimately serve more than one city page.
 * Every other shared PWSID is treated as a mapping bug.
 */
export const ALLOWED_SHARED_PWSIDS: Record<string, readonly string[]> = {
  MD0150005: ['gaithersburg', 'silver-spring', 'bethesda'],
  CO0116001: ['denver', 'lakewood'],
};

export const MIN_CITY_SYSTEM_POPULATION = 3300;

/**
 * Resolve the EPA PWSID for a city page from the canonical map, then the
 * city record. Never borrow a ZIP-map neighbor to fill a coverage gap.
 */
export function resolveCityPwsid(slug: string, fallbackPwsid: string, _zip?: string): string {
  return CITY_PWSID_OVERRIDES[slug] ?? fallbackPwsid;
}

const NON_COMMUNITY_CITY_NAME =
  /\b(school|church|chapel|temple|synagogue|mosque|gas station|gasoline|trailer|mobile home|\bmhp\b|campground|golf|cafe|restaurant|mart\b|store\b|hotel|motel|daycare|day care|elementary|high school|middle school)\b/i;

export type CityPwsidIssue = {
  slug: string;
  pwsid: string;
  reason: string;
};

function parseCityPopulation(pop: string): number {
  const t = String(pop || '').trim().toLowerCase().replace(/,/g, '');
  if (!t) return 0;
  if (t.endsWith('m')) return (parseFloat(t) || 0) * 1e6;
  if (t.endsWith('k')) return (parseFloat(t) || 0) * 1e3;
  return parseFloat(t.replace(/[^0-9.]/g, '')) || 0;
}

/** Guard used by tests: unique community PWSIDs except documented regional systems. */
export function auditCityPwsidMappings(
  cities: Record<string, { pwsid: string; system: string; population: string }>,
): CityPwsidIssue[] {
  const issues: CityPwsidIssue[] = [];
  const byPwsid = new Map<string, string[]>();

  for (const [slug, city] of Object.entries(cities)) {
    const pwsid = resolveCityPwsid(slug, city.pwsid).toUpperCase();
    const list = byPwsid.get(pwsid) ?? [];
    list.push(slug);
    byPwsid.set(pwsid, list);

    if (NON_COMMUNITY_CITY_NAME.test(city.system)) {
      issues.push({ slug, pwsid, reason: `maps to a non-community-looking system name: ${city.system}` });
    }
    const pop = parseCityPopulation(city.population);
    if (pop > 0 && pop < MIN_CITY_SYSTEM_POPULATION) {
      issues.push({
        slug,
        pwsid,
        reason: `population ${pop} is below the community-system floor of ${MIN_CITY_SYSTEM_POPULATION}`,
      });
    }
    if (city.pwsid && city.pwsid.toUpperCase() !== pwsid) {
      issues.push({
        slug,
        pwsid,
        reason: `cities-data pwsid ${city.pwsid} disagrees with canonical ${pwsid}`,
      });
    }
  }

  for (const [pwsid, slugs] of Array.from(byPwsid.entries())) {
    if (slugs.length < 2) continue;
    const allowed = new Set((ALLOWED_SHARED_PWSIDS[pwsid] ?? []).map((s: string) => s.toLowerCase()));
    const unexpected = slugs.filter((s: string) => !allowed.has(s.toLowerCase()));
    if (unexpected.length) {
      issues.push({
        slug: unexpected.join(','),
        pwsid,
        reason: `shared by ${slugs.join(', ')} without an allowlist entry`,
      });
    }
  }

  return issues;
}

import zipLookupRaw from './zip-lookup.json';
import ucmr5Raw from './ucmr5.json';

const ZIP_LOOKUP = zipLookupRaw as Record<string, { p: string }>;
const UCMR5_PWSIDS = new Set(Object.keys(ucmr5Raw as Record<string, unknown>));

/**
 * Correct EPA PWSIDs for city slugs where cities-data.ts had duplicate/wrong IDs
 * (e.g. multiple AZ cities on AZ0404008) or anchor ZIP is missing from zip-lookup.
 */
export const CITY_PWSID_OVERRIDES: Record<string, string> = {
  gilbert: 'AZ0407092',
  bakersfield: 'CA1510031',
  modesto: 'CA5010010',
  'ann-arbor': 'MI0000220',
  minneapolis: 'MN1270024',
  cincinnati: 'OH3102612',
  columbus: 'OH2504412',
  cleveland: 'OH1801212',
  akron: 'OH7700011',
  toledo: 'OH4801411',
  dayton: 'OH5700722',
  raleigh: 'NC0392010',
  greensboro: 'NC0241010',
  durham: 'NC0332010',
  fayetteville: 'NC0326010',
  lincoln: 'NE3110926',
  tampa: 'FL6290327',
  jacksonville: 'FL2161328',
  orlando: 'FL3480962',
  hialeah: 'FL4130604',
  'fort-lauderdale': 'FL4060486',
  tallahassee: 'FL1370655',
  'st-petersburg': 'FL6521715',
  norfolk: 'VA3710100',
  alexandria: 'VA6510010',
  arlington: 'TX2200001',
  lubbock: 'TX1520002',
  irving: 'TX0570050',
  pittsburgh: 'PA5020038',
  'san-antonio': 'TX0150018',
  'new-york': 'NY7003493',
  chandler: 'AZ0407090',
  fremont: 'CA0110001',
  'glendale-az': 'AZ0407093',
  'glendale-ca': 'CA1910043',
  'long-beach': 'CA1910065',
  'san-francisco': 'CA3810011',
  scottsdale: 'AZ0407025',
  tempe: 'AZ0407098',
  tucson: 'AZ0410112',
  'cape-coral': 'FL5360325',
  charlotte: 'NC0160010',
  denver: 'CO0116001',
  lakewood: 'CO0116001',
  'winston-salem': 'NC0234010',
  mesa: 'AZ0407095',
  aurora: 'CO0116001',
  'colorado-springs': 'CO0121150',
  spokane: 'WA5383100',
  tacoma: 'WA5386800',
  seattle: 'WA5377050',
  'west-palm-beach': 'FL4504393',
  buffalo: 'NY1400422',
};

/**
 * Resolve EPA PWSID for city PFAS/CCR display.
 * Prefer anchor-ZIP utility when UCMR5 exists; otherwise fall back to cities-data PWSID
 * when the ZIP maps to a system with no UCMR5 filing (e.g. Chicago IL0316000 → IL0310660).
 */
export function resolveCityPwsid(slug: string, fallbackPwsid: string, zip?: string): string {
  if (CITY_PWSID_OVERRIDES[slug]) return CITY_PWSID_OVERRIDES[slug];
  const fromZip = zip ? ZIP_LOOKUP[zip]?.p : undefined;
  if (fromZip && UCMR5_PWSIDS.has(fromZip)) return fromZip;
  if (fromZip && UCMR5_PWSIDS.has(fallbackPwsid)) return fallbackPwsid;
  return fromZip ?? fallbackPwsid;
}

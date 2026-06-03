/**
 * Correct EPA PWSIDs for city slugs where cities-data.ts had duplicate/wrong IDs
 * (e.g. multiple TX cities on Sugar Land's TX0790005, OH cities on Newton Falls OH7802311).
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
};

export function resolveCityPwsid(slug: string, fallbackPwsid: string): string {
  return CITY_PWSID_OVERRIDES[slug] ?? fallbackPwsid;
}

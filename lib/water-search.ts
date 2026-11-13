/** Curated city aliases use a representative ZIP; an entered ZIP remains the closer lookup. */
// Boston, Houston and Los Angeles anchors are mapped to the named suppliers in zip-lookup.json.
const CITY_ZIP_MAP: Record<string, { zip: string; city: string; state: string }> = {
  'chicago': { zip: '60601', city: 'Chicago', state: 'IL' },
  'los angeles': { zip: '90012', city: 'Los Angeles', state: 'CA' },
  'la': { zip: '90012', city: 'Los Angeles', state: 'CA' },
  'houston': { zip: '77002', city: 'Houston', state: 'TX' },
  'new york': { zip: '10001', city: 'New York City', state: 'NY' },
  'nyc': { zip: '10001', city: 'New York City', state: 'NY' },
  'new york city': { zip: '10001', city: 'New York City', state: 'NY' },
  'phoenix': { zip: '85001', city: 'Phoenix', state: 'AZ' },
  'philadelphia': { zip: '19101', city: 'Philadelphia', state: 'PA' },
  'philly': { zip: '19101', city: 'Philadelphia', state: 'PA' },
  'san antonio': { zip: '78201', city: 'San Antonio', state: 'TX' },
  'dallas': { zip: '75201', city: 'Dallas', state: 'TX' },
  'miami': { zip: '33101', city: 'Miami', state: 'FL' },
  'seattle': { zip: '98101', city: 'Seattle', state: 'WA' },
  'denver': { zip: '80201', city: 'Denver', state: 'CO' },
  'boston': { zip: '02108', city: 'Boston', state: 'MA' },
  'atlanta': { zip: '30301', city: 'Atlanta', state: 'GA' },
  'san francisco': { zip: '94102', city: 'San Francisco', state: 'CA' },
  'sf': { zip: '94102', city: 'San Francisco', state: 'CA' },
  'detroit': { zip: '48201', city: 'Detroit', state: 'MI' },
  'minneapolis': { zip: '55401', city: 'Minneapolis', state: 'MN' },
  'portland': { zip: '97201', city: 'Portland', state: 'OR' },
  'las vegas': { zip: '89101', city: 'Las Vegas', state: 'NV' },
  'nashville': { zip: '37201', city: 'Nashville', state: 'TN' },
  'baltimore': { zip: '21201', city: 'Baltimore', state: 'MD' },
  'memphis': { zip: '38101', city: 'Memphis', state: 'TN' },
  'louisville': { zip: '40201', city: 'Louisville', state: 'KY' },
  'cleveland': { zip: '44101', city: 'Cleveland', state: 'OH' },
  'pittsburgh': { zip: '15201', city: 'Pittsburgh', state: 'PA' },
  'indianapolis': { zip: '46201', city: 'Indianapolis', state: 'IN' },
  'indy': { zip: '46201', city: 'Indianapolis', state: 'IN' },
  'columbus': { zip: '43201', city: 'Columbus', state: 'OH' },
  'charlotte': { zip: '28201', city: 'Charlotte', state: 'NC' },
  'raleigh': { zip: '27601', city: 'Raleigh', state: 'NC' },
  'omaha': { zip: '68101', city: 'Omaha', state: 'NE' },
  'kansas city': { zip: '64101', city: 'Kansas City', state: 'MO' },
  'new orleans': { zip: '70112', city: 'New Orleans', state: 'LA' },
  'nola': { zip: '70112', city: 'New Orleans', state: 'LA' },
  'tampa': { zip: '33601', city: 'Tampa', state: 'FL' },
  'st louis': { zip: '63101', city: 'St. Louis', state: 'MO' },
  'saint louis': { zip: '63101', city: 'St. Louis', state: 'MO' },
  'sacramento': { zip: '95814', city: 'Sacramento', state: 'CA' },
  'salt lake city': { zip: '84101', city: 'Salt Lake City', state: 'UT' },
  'slc': { zip: '84101', city: 'Salt Lake City', state: 'UT' },
  'albuquerque': { zip: '87101', city: 'Albuquerque', state: 'NM' },
  'abq': { zip: '87101', city: 'Albuquerque', state: 'NM' },
  'tucson': { zip: '85701', city: 'Tucson', state: 'AZ' },
  'jacksonville': { zip: '32201', city: 'Jacksonville', state: 'FL' },
  'austin': { zip: '78701', city: 'Austin', state: 'TX' },
  'san diego': { zip: '92101', city: 'San Diego', state: 'CA' },
  'san jose': { zip: '95101', city: 'San Jose', state: 'CA' },
  'washington': { zip: '20001', city: 'Washington DC', state: 'DC' },
  'washington dc': { zip: '20001', city: 'Washington DC', state: 'DC' },
  'dc': { zip: '20001', city: 'Washington DC', state: 'DC' },
  'cincinnati': { zip: '45201', city: 'Cincinnati', state: 'OH' },
  'milwaukee': { zip: '53201', city: 'Milwaukee', state: 'WI' },
  'buffalo': { zip: '14201', city: 'Buffalo', state: 'NY' },
  'anchorage': { zip: '99501', city: 'Anchorage', state: 'AK' },
  'honolulu': { zip: '96801', city: 'Honolulu', state: 'HI' },
  'baton rouge': { zip: '70801', city: 'Baton Rouge', state: 'LA' },
  'richmond': { zip: '23219', city: 'Richmond', state: 'VA' },
  'parkersburg': { zip: '26101', city: 'Parkersburg', state: 'WV' },
  'portsmouth nh': { zip: '03801', city: 'Portsmouth', state: 'NH' },
  'portland me': { zip: '04101', city: 'Portland', state: 'ME' },
};

export type WaterSearchMatch = { zip: string; inputType: 'zip' | 'city' };
export function resolveWaterSearch(input: string): WaterSearchMatch | null {
  const value = input.trim();
  const zip = /^(\d{5})(?:-\d{4})?$/.exec(value);
  if (zip) return { zip: zip[1], inputType: 'zip' };
  const name = value.toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ');
  const direct = Object.hasOwn(CITY_ZIP_MAP, name) ? CITY_ZIP_MAP[name] : undefined;
  if (direct) return { zip: direct.zip, inputType: 'city' };
  const qualified = /^(.*) ([a-z]{2})$/.exec(name);
  const city = qualified && Object.hasOwn(CITY_ZIP_MAP, qualified[1]) ? CITY_ZIP_MAP[qualified[1]] : undefined;
  return city && city.state.toLowerCase() === qualified?.[2] ? { zip: city.zip, inputType: 'city' } : null;
}

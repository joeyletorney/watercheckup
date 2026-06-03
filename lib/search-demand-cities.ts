/** Cities with strong Search Console impression volume — used for internal linking. */
export const SEARCH_DEMAND_CITIES = [
  {
    slug: 'san-antonio',
    name: 'San Antonio',
    state: 'TX',
    href: '/water/san-antonio',
    stat: '272 mg/L hardness · PFAS in UCMR5',
    queryHooks: ['San Antonio water quality', 'PFAS in San Antonio water', 'water contamination'],
  },
  {
    slug: 'gaithersburg',
    name: 'Gaithersburg',
    state: 'MD',
    href: '/water/gaithersburg',
    stat: 'WSSC Water · PFAS & testing context',
    queryHooks: ['Gaithersburg water quality', 'water testing Gaithersburg MD', 'WSSC tap water'],
  },
] as const;

export const SEARCH_DEMAND_EXTRA_LINKS = [
  { href: '/worst-hardness', label: 'Hardest tap water rankings' },
  { href: '/water-hardness', label: 'Hardness by ZIP' },
  { href: '/worst-pfas-cities', label: 'PFAS MCL city list' },
  { href: '/rankings', label: 'State rankings table' },
] as const;

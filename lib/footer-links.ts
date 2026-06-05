/** Sitewide footer link columns — only real, live routes. */

export type FooterLink = {
  href: string;
  label: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
  viewAll?: FooterLink;
};

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Check your water',
    links: [
      { href: '/', label: 'Search by ZIP' },
      { href: '/quiz', label: 'Filter quiz' },
      { href: '/utilities', label: 'Water utilities' },
      { href: '/epa/ccr-finder', label: 'Find your CCR' },
      { href: '/water-hardness', label: 'Hardness by ZIP' },
      { href: '/sample-report', label: 'Sample report' },
      { href: '/water/houston', label: 'Houston, TX' },
      { href: '/water/san-antonio', label: 'San Antonio, TX' },
      { href: '/water/phoenix', label: 'Phoenix, AZ' },
      { href: '/water/new-york', label: 'New York, NY' },
      { href: '/water/chicago', label: 'Chicago, IL' },
      { href: '/water/los-angeles', label: 'Los Angeles, CA' },
    ],
    viewAll: { href: '/water', label: 'All city reports' },
  },
  {
    title: 'Rankings & issues',
    links: [
      { href: '/worst', label: 'Rankings hub' },
      { href: '/worst-cities', label: 'Worst cities (safety score)' },
      { href: '/best-cities', label: 'Best cities' },
      { href: '/rankings', label: 'State rankings' },
      { href: '/pfas', label: 'PFAS guide' },
      { href: '/lead', label: 'Lead in tap water' },
      { href: '/worst-pfas-cities', label: 'PFAS MCL cities' },
      { href: '/pfoa-at-epa-limit', label: 'PFOA at EPA limit' },
      { href: '/worst-lead', label: 'Lead pipe risk cities' },
      { href: '/worst-hardness', label: 'Hardest water cities' },
    ],
  },
  {
    title: 'Filters & guides',
    links: [
      { href: '/quiz', label: 'Pick a filter (quiz)' },
      { href: '/pfas', label: 'Filters for PFAS' },
      { href: '/lead', label: 'Filters for lead' },
      { href: '/well', label: 'Well water filters' },
      { href: '/blog/best-countertop-water-filter', label: 'Best countertop filters' },
      { href: '/blog/best-whole-house-water-filter', label: 'Best whole-house filters' },
      { href: '/blog/best-water-filter-for-lead-removal', label: 'Best for lead removal' },
    ],
    viewAll: { href: '/blog', label: 'Blog & guides' },
  },
  {
    title: 'About WaterCheckup',
    links: [
      { href: '/faq', label: 'FAQ' },
      { href: '/methodology', label: 'Data & scoring' },
      { href: '/contaminants', label: 'Contaminants guide' },
      { href: '/about', label: 'About us' },
      { href: '/contact', label: 'Contact' },
      { href: '/utilities/claim', label: 'For public water systems' },
    ],
  },
];

export const FOOTER_LEGAL_LINKS: FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
];

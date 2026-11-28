import { latestBlogLinks } from '@/lib/blog-hub-links';

export type HubLink = {
  href: string;
  label: string;
};

/** Money + EEAT pages that Search Console shows as not indexed or under-crawled. */
export const PRIORITY_GUIDE_LINKS: HubLink[] = [
  { href: '/lead', label: 'Lead in tap water' },
  { href: '/pfas', label: 'PFAS in tap water' },
  { href: '/best-water-filter', label: 'Best water filter by city' },
  { href: '/faq', label: 'Water quality FAQ' },
  { href: '/about/joe-letorney', label: 'Meet Joe Letorney' },
];

export const PRIORITY_PLACE_LINKS: HubLink[] = [
  { href: '/water/honolulu', label: 'Honolulu, HI' },
  { href: '/water/gaithersburg', label: 'Gaithersburg water testing' },
  { href: '/water/parkersburg', label: 'Parkersburg, WV' },
  { href: '/water/state/maryland', label: 'Maryland tap water' },
  { href: '/water/state/west-virginia', label: 'West Virginia tap water' },
  { href: '/water/state/hawaii', label: 'Hawaii tap water' },
  { href: '/water/state/california', label: 'California tap water' },
  { href: '/water/state/texas', label: 'Texas tap water' },
  { href: '/rankings', label: 'Best tap water by city' },
  { href: '/worst-cities', label: 'Worst drinking water by city' },
  { href: '/water', label: 'All city reports' },
];

export function crawlHubLinks(): { guides: HubLink[]; places: HubLink[]; latestBlog: HubLink[] } {
  return {
    guides: PRIORITY_GUIDE_LINKS,
    places: PRIORITY_PLACE_LINKS,
    latestBlog: latestBlogLinks(4).map((post) => ({ href: post.href, label: post.label })),
  };
}

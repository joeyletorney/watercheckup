import { latestBlogLinks } from '@/lib/blog-hub-links';

export type HubLink = {
  href: string;
  label: string;
};

/** Money + EEAT pages that Search Console shows as not indexed or under-crawled. */
export const PRIORITY_GUIDE_LINKS: HubLink[] = [
  { href: '/lead', label: 'Lead in tap water' },
  { href: '/pfas', label: 'PFAS in tap water' },
  { href: '/faq', label: 'Water quality FAQ' },
  { href: '/about/joe-letorney', label: 'Meet Joe Letorney' },
];

export const PRIORITY_PLACE_LINKS: HubLink[] = [
  { href: '/water/honolulu', label: 'Honolulu, HI' },
  { href: '/water/state/maryland', label: 'Maryland tap water' },
  { href: '/water/state/hawaii', label: 'Hawaii tap water' },
  { href: '/water/state/california', label: 'California tap water' },
  { href: '/water/state/texas', label: 'Texas tap water' },
  { href: '/water', label: 'All city reports' },
];

export function crawlHubLinks(): { guides: HubLink[]; places: HubLink[]; latestBlog: HubLink[] } {
  return {
    guides: PRIORITY_GUIDE_LINKS,
    places: PRIORITY_PLACE_LINKS,
    latestBlog: latestBlogLinks(4).map((post) => ({ href: post.href, label: post.label })),
  };
}

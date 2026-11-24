import { SITE_ORIGIN } from '@/lib/site-url';

export type BreadcrumbCrumb = {
  name: string;
  path: string;
};

function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_ORIGIN}${path === '/' ? '' : path}`;
}

/**
 * BreadcrumbList JSON-LD in the format Google's rich-result parser associates
 * with a visible name. Putting `name` on both the ListItem and the nested
 * WebPage item avoids GSC's "Unnamed item" warning, which appears when `item`
 * is only a URL string.
 */
export function breadcrumbListJsonLd(crumbs: BreadcrumbCrumb[]) {
  const itemListElement = crumbs
    .map((crumb) => ({
      name: crumb.name.replace(/\s+/g, ' ').trim(),
      path: crumb.path,
    }))
    .filter((crumb) => crumb.name.length > 0)
    .map((crumb, index) => {
      const url = absoluteUrl(crumb.path || '/');
      return {
        '@type': 'ListItem' as const,
        position: index + 1,
        name: crumb.name,
        item: {
          '@type': 'WebPage' as const,
          '@id': url,
          name: crumb.name,
        },
      };
    });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

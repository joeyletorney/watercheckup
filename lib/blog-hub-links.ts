import { BLOG_POST_DATE_MODIFIED } from '@/lib/blog-post-dates';

/** Short labels for hub / footer links. Unknown slugs title-case the slug. */
const BLOG_HUB_LABELS: Record<string, string> = {
  'drinking-water-alerts-november-2026': 'Drinking water alerts this week',
  'best-shower-filter-2026': 'Best shower filters 2026',
  'is-new-york-city-tap-water-safe-2026': 'Is NYC tap water safe?',
  'lead-in-tap-water-signs-and-symptoms': 'Lead in tap water: signs',
  'best-water-filter-pitcher-2025': 'Best water filter pitchers',
  'best-under-sink-water-filter': 'Best under-sink filters',
  'best-ro-system-for-pfas-removal': 'Best RO for PFAS',
  'why-does-tap-water-taste-bad': 'Why tap water tastes bad',
  'fluoride-in-tap-water-safe-or-not': 'Fluoride in tap water',
  'waterdrop-g3p600-vs-aquasana-smartflow': 'Waterdrop vs Aquasana',
  'best-water-filter-for-lead-removal': 'Best filters for lead',
  'best-water-filter-hard-water': 'Hard water filter guide',
  'top-10-most-pfas-contaminated-cities': 'Top PFAS-contaminated cities',
  'what-water-filter-removes-pfas': 'Filters that remove PFAS',
};

function labelForSlug(slug: string): string {
  if (BLOG_HUB_LABELS[slug]) return BLOG_HUB_LABELS[slug];
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export type BlogHubLink = {
  href: string;
  slug: string;
  date: string;
  label: string;
};

/** Latest blog posts by dateModified, then slug — for crawl-hub internal links. */
export function latestBlogLinks(limit = 4): BlogHubLink[] {
  return Object.entries(BLOG_POST_DATE_MODIFIED)
    .sort((a, b) => b[1].localeCompare(a[1]) || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([slug, date]) => ({
      href: `/blog/${slug}`,
      slug,
      date,
      label: labelForSlug(slug),
    }));
}

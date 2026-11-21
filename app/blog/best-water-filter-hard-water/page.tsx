import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { BlogCommercialComparison } from '@/components/BlogCommercialComparison';
import { CommercialGuideArticle, COMMERCIAL_GUIDES } from '../commercial-guide-data';
import { getCtrSerpOverride } from '@/lib/ctr-serp-seo';
import { withoutBrandSuffix } from '@/lib/serp-copy';
import { AuthorReviewBadge } from '@/components/AuthorReviewBadge';
import { PageFaq } from '@/components/PageFaq';
import { AUTHOR_PAGE_URL } from '@/lib/site-stats';

const SLUG = 'best-water-filter-hard-water';
const guide = COMMERCIAL_GUIDES[SLUG];
const DATE_PUBLISHED = '2026-10-03';
const DATE_MODIFIED = '2026-10-03';
const ctr = getCtrSerpOverride(`/blog/${SLUG}`);
const hardWaterTitle = withoutBrandSuffix(ctr?.title ?? guide.title);
const hardWaterDescription = ctr?.description ?? guide.excerpt;
export const metadata: Metadata = {
  title: hardWaterTitle,
  description: hardWaterDescription,
  alternates: { canonical: `https://watercheckup.com/blog/${SLUG}` },
  openGraph: {
    title: hardWaterTitle,
    description: hardWaterDescription,
    type: 'article',
    publishedTime: DATE_PUBLISHED,
    modifiedTime: DATE_MODIFIED,
  },
};

const HARD_WATER_FAQS = [
  {
    question: 'Is a hard water filter the same as a water softener?',
    answer:
      'No. A hard water filter (including a water filter for hard water or a hardness water filter) usually means carbon, sediment, or reverse osmosis at one tap. A salt-based softener exchanges calcium and magnesium throughout the home. A scale conditioner tries to reduce scale without removing hardness ions. They do different jobs.',
  },
  {
    question: 'Does a fridge filter work as a water filter for hard water?',
    answer:
      'A refrigerator filter is typically NSF/ANSI 42 for chlorine taste. It does not soften water or remove calcium and magnesium the way a salt-based softener does. Hard water can also shorten fridge-filter life. Use a softener or conditioner for scale, and a drinking-water RO only if you also need dissolved-solids reduction at that tap.',
  },
  {
    question: 'What does a hardness water filter actually remove?',
    answer:
      '“Hardness water filter” is a search phrase, not one product type. Carbon does not remove hardness minerals. Reverse osmosis can lower hardness at the drinking tap within its feed-water limits (AquaTru Classic lists a 10 gpg maximum). Whole-house softening is still the treatment for showers, laundry, and the water heater.',
  },
];

export default function BestFilterHardWaterPage() {
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: hardWaterTitle,
    description: hardWaterDescription,
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    author: { '@type': 'Person', name: 'Joe Letorney', url: AUTHOR_PAGE_URL },
  };
  return <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
    <SiteHeader variant="inner" showCta ctaLabel="Check your water →" ctaHref="/" />
    <article style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px', lineHeight: 1.8 }}>
      <nav aria-label="Breadcrumb"><Link href="/">Home</Link> › <Link href="/blog">Blog</Link> › Hard water</nav>
      <h1 style={{ fontSize: 32, lineHeight: 1.2 }}>{hardWaterTitle}</h1>
      <AuthorReviewBadge />
      <p>
        A hard water filter, a water filter for hard water, and a hardness water filter are not the same product as a
        water softener or a scale conditioner. Filters (carbon, sediment, reverse osmosis) treat taste, particles, or
        dissolved solids at one tap. Softeners exchange calcium and magnesium throughout the house. Conditioners aim to
        reduce scale without removing hardness ions. Pick by the job, not the search phrase.
      </p>
      <p style={{ fontSize: 13 }}>Updated October 3, 2026 · Official source review · Some site links may be affiliate links. Softener kits are check-current-price; drinking-water RO (AquaTru Classic about $380) does not soften showers.</p>
      <BlogCommercialComparison slug={SLUG} />
      <CommercialGuideArticle slug={SLUG} />
      <PageFaq faqs={HARD_WATER_FAQS} pageUrl={`https://watercheckup.com/blog/${SLUG}`} />
      <p><Link href="/blog/best-water-filter-for-lead-removal">Compare lead-removal options</Link> · <Link href="/blog/best-countertop-water-filter">Compare countertop filters</Link> · <Link href="/blog/best-shower-filter-2026">Shower filters for chlorine (not hardness)</Link></p>
      <p><Link href="/">Review your utility water report →</Link></p>
    </article>
  </div>;
}

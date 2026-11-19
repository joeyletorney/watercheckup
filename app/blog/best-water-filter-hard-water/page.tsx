import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { BlogCommercialComparison } from '@/components/BlogCommercialComparison';
import { CommercialGuideArticle, COMMERCIAL_GUIDES } from '../commercial-guide-data';
import { getCtrSerpOverride } from '@/lib/ctr-serp-seo';
import { withoutBrandSuffix } from '@/lib/serp-copy';

const SLUG = 'best-water-filter-hard-water';
const guide = COMMERCIAL_GUIDES[SLUG];
const DATE_PUBLISHED = '2026-10-03';
const DATE_MODIFIED = '2026-10-03';
const ctr = getCtrSerpOverride(`/blog/${SLUG}`);
const hardWaterTitle = withoutBrandSuffix(ctr?.title ?? guide.title);
export const metadata: Metadata = {
  title: hardWaterTitle,
  description: ctr?.description ?? guide.excerpt,
  alternates: { canonical: `https://watercheckup.com/blog/${SLUG}` },
  openGraph: {
    title: hardWaterTitle,
    description: ctr?.description ?? guide.excerpt,
    type: 'article',
    publishedTime: DATE_PUBLISHED,
    modifiedTime: DATE_MODIFIED,
  },
};

export default function BestFilterHardWaterPage() {
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt,
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
  };
  return <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
    <SiteHeader variant="inner" showCta ctaLabel="Check your water →" ctaHref="/" />
    <article style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px', lineHeight: 1.8 }}>
      <nav aria-label="Breadcrumb"><Link href="/">Home</Link> › <Link href="/blog">Blog</Link> › Hard water</nav>
      <h1 style={{ fontSize: 32, lineHeight: 1.2 }}>{guide.title}</h1>
      <p>{guide.excerpt}</p>
      <p style={{ fontSize: 13 }}>Updated October 3, 2026 · Official source review · Some site links may be affiliate links. Softener kits are check-current-price; drinking-water RO (AquaTru Classic about $380) does not soften showers.</p>
      <BlogCommercialComparison slug={SLUG} />
      <CommercialGuideArticle slug={SLUG} />
      <p><Link href="/blog/best-water-filter-for-lead-removal">Compare lead-removal options</Link> · <Link href="/blog/best-countertop-water-filter">Compare countertop filters</Link> · <Link href="/blog/best-shower-filter-2026">Shower filters for chlorine (not hardness)</Link></p>
      <p><Link href="/">Review your utility water report →</Link></p>
    </article>
  </div>;
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { BlogCommercialComparison } from '@/components/BlogCommercialComparison';
import { CommercialGuideArticle, COMMERCIAL_GUIDES } from '../commercial-guide-data';
import { getCtrSerpOverride } from '@/lib/ctr-serp-seo';

const SLUG = 'best-water-filter-hard-water';
const guide = COMMERCIAL_GUIDES[SLUG];
const ctr = getCtrSerpOverride(`/blog/${SLUG}`);
export const metadata: Metadata = {
  title: { absolute: ctr?.title ?? guide.title },
  description: ctr?.description ?? guide.excerpt,
  alternates: { canonical: `https://watercheckup.com/blog/${SLUG}` },
  openGraph: { title: ctr?.title ?? guide.title, description: ctr?.description ?? guide.excerpt },
};

export default function BestFilterHardWaterPage() {
  return <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
    <SiteHeader variant="inner" showCta ctaLabel="Check your water →" ctaHref="/" />
    <article style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px', lineHeight: 1.8 }}>
      <nav aria-label="Breadcrumb"><Link href="/">Home</Link> › <Link href="/blog">Blog</Link> › Hard water</nav>
      <h1 style={{ fontSize: 32, lineHeight: 1.2 }}>{guide.title}</h1>
      <p>{guide.excerpt}</p>
      <p style={{ fontSize: 13 }}>Updated November 11, 2026 · Official source review · Some site links may be affiliate links</p>
      <BlogCommercialComparison slug={SLUG} />
      <CommercialGuideArticle slug={SLUG} />
      <p><Link href="/blog/best-water-filter-for-lead-removal">Compare lead-removal options</Link> · <Link href="/blog/best-countertop-water-filter">Compare countertop filters</Link></p>
      <p><Link href="/">Review your utility water report →</Link></p>
    </article>
  </div>;
}

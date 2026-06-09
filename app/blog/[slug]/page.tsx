import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POSTS } from '../posts';
import { SiteHeader } from '../../components/SiteHeader';
import { BlogFeaturedImage } from '@/components/BlogFeaturedImage';
import { getBlogFeaturedImageUrl } from '@/lib/unsplash-images';
import { BLOG_AUTHOR_BYLINE, VIEW_ALL_WATER_SYSTEMS_LINK } from '@/lib/site-stats';
import { buildFaqPageSchema } from '@/lib/build-faq-schema';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { BlogTopPicks } from '@/components/BlogTopPicks';
import { getTopPicksSubtitle, resolveBlogTopPicks } from '@/lib/blog-top-picks';
import { getCtrSerpOverride } from '@/lib/ctr-serp-seo';

export async function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = POSTS[params.slug];
  if (!post) return { title: 'Post Not Found | WaterCheckup' };

  const ctr = getCtrSerpOverride(`/blog/${params.slug}`);
  const docTitle = ctr?.title ?? post.seo?.title ?? post.title;
  const docDescription = ctr?.description ?? post.seo?.description ?? post.excerpt;
  const ogTitle = ctr?.title ?? post.seo?.openGraph?.title ?? docTitle;
  const ogDescription = ctr?.description ?? post.seo?.openGraph?.description ?? docDescription;
  const canonical = post.seo?.canonical ?? `https://watercheckup.com/blog/${params.slug}`;
  const ogImageTitle = post.title;
  const ogImageExcerpt = post.excerpt;

  return {
    /* Root layout title.template — use absolute when `seo.title` is set so it is not doubled */
    title: ctr?.title ?? post.seo?.title ? { absolute: ctr?.title ?? post.seo!.title } : post.title,
    description: docDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      publishedTime: post.date,
      authors: ['Joe Letorney'],
      images: [
        {
          url: `https://watercheckup.com/api/og/blog?title=${encodeURIComponent(ogImageTitle)}&badge=${encodeURIComponent(post.badge ?? '')}&excerpt=${encodeURIComponent(ogImageExcerpt ?? '')}`,
          width: 1200,
          height: 630,
          alt: ogImageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [`https://watercheckup.com/api/og/blog?title=${encodeURIComponent(ogImageTitle)}&badge=${encodeURIComponent(post.badge ?? '')}&excerpt=${encodeURIComponent(ogImageExcerpt ?? '')}`],
    },
  };
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = POSTS[params.slug];
  if (!post) notFound();

  const topPicks = resolveBlogTopPicks(params.slug, post.topPicks, post.badge);
  const topPicksSubtitle = getTopPicksSubtitle(params.slug, topPicks);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://watercheckup.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://watercheckup.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://watercheckup.com/blog/${params.slug}` },
    ],
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.dateModified ?? post.date,
    author: {
      '@type': 'Person',
      name: 'Joe Letorney',
      url: 'https://watercheckup.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WaterCheckup',
      url: 'https://watercheckup.com',
      logo: { '@type': 'ImageObject', url: 'https://watercheckup.com/icon.png' },
    },
    image: [getBlogFeaturedImageUrl(params.slug, post.badge)],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://watercheckup.com/blog/${params.slug}`,
    },
  };

  const pageUrl = `https://watercheckup.com/blog/${params.slug}`;
  const faqLd = post.faq?.length
    ? buildFaqPageSchema(
        post.faq.map(({ q, a }) => ({ name: q, text: a })),
        pageUrl
      )
    : null;

  return (
    <div className="wc-reading-layout" style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      ) : null}
      <SiteHeader variant="inner" showCta />

      <article className="wc-reading-panel">
        <nav className="wc-reading-breadcrumb" aria-label="Breadcrumb">
          <Link prefetch href="/">Home</Link>
          {' · '}
          <Link prefetch href="/blog">Blog</Link>
          {' · '}
          <span>{post.badge}</span>
        </nav>

        <BlogFeaturedImage slug={params.slug} title={post.title} badge={post.badge} />

        <header style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, padding: '3px 10px', borderRadius: 4, background: post.badgeColor + '22', color: post.badgeColor, border: `1px solid ${post.badgeColor}44` }}>
              {post.badge}
            </span>
            <span className="wc-reading-meta">{post.dateDisplay}</span>
            <span className="wc-reading-meta">·</span>
            <span className="wc-reading-meta">{post.readTime}</span>
          </div>
          <h1 className="wc-reading-title">{post.title}</h1>
          <p className="wc-reading-meta" style={{ margin: '0 0 12px' }}>
            By <Link prefetch href="/about">{BLOG_AUTHOR_BYLINE.name}</Link>
            {' | '}
            {BLOG_AUTHOR_BYLINE.credentials}
          </p>
          <p className="wc-reading-excerpt">{post.excerpt}</p>
        </header>

        {/* Check ZIP CTA — top (slug-specific copy for high-impression posts) */}
        {(() => {
          const ctaBySlug: Record<string, { headline: string; sub: string; href: string; btn: string }> = {
            'best-water-filter-for-lead-removal': {
              headline: 'Is there lead in your tap water?',
              sub: 'Free EPA report by ZIP — see lead risk and NSF 53 filter matches.',
              href: '/',
              btn: 'Check lead in my ZIP →',
            },
            'what-water-filter-removes-pfas': {
              headline: 'Is PFAS in your tap water?',
              sub: 'Free ZIP report — UCMR5 PFAS data and filter picks for your utility.',
              href: '/',
              btn: 'Check PFAS in my ZIP →',
            },
          };
          const cta = ctaBySlug[params.slug] ?? {
            headline: 'Is your water affected?',
            sub: 'Check the EPA report for your exact ZIP code — free, instant.',
            href: '/',
            btn: 'Check My ZIP →',
          };
          return (
            <div className="wc-reading-cta">
              <div>
                <div className="wc-reading-cta__title">{cta.headline}</div>
                <div className="wc-reading-cta__sub">{cta.sub}</div>
              </div>
              <Link prefetch href={cta.href} className="wc-reading-cta__btn">
                {cta.btn}
              </Link>
            </div>
          );
        })()}

        <BlogTopPicks picks={topPicks} subtitle={topPicksSubtitle} />

        <div className="wc-reading-prose" style={{ fontSize: 16 }}>
          {post.content}
        </div>

        {(params.slug === 'best-water-filter-for-lead-removal' ||
          params.slug === 'what-water-filter-removes-pfas') && (
          <NewsletterSignup
            source={`blog-${params.slug}`}
            title="Get alerts when EPA data changes for your ZIP"
            description="Weekly digest: new PFAS readings, violations, and boil-water notices — matched to your area."
            compact
            variant="light"
          />
        )}

        {post.faq && post.faq.length > 0 && (
          <section id="faq" className="wc-reading-faq" style={{ marginTop: 96 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px', lineHeight: 1.3 }}>
              Frequently asked questions
            </h2>
            {post.faq.map(({ q, a }) => (
              <div key={q} style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.4 }}>{q}</h3>
                <p style={{ fontSize: 15, margin: 0, lineHeight: 1.85 }}>{a}</p>
              </div>
            ))}
          </section>
        )}

        <div className="wc-reading-inset" style={{ marginTop: 96 }}>
          <div className="wc-reading-inset__label">MORE GUIDES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(POSTS).filter(([slug]) => slug !== params.slug).map(([slug, p]) => (
              <Link prefetch key={slug} href={`/blog/${slug}`} className="wc-reading-link-card">
                <span className="wc-reading-link-card__title">{p.title}</span>
                <span className="wc-reading-link-card__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="wc-reading-inset wc-reading-inset--accent" style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div className="wc-reading-inset__label" style={{ color: '#0369a1' }}>NOT SURE WHICH FILTER?</div>
            <div className="wc-reading-inset__title">Take the 3-question filter quiz</div>
            <p className="wc-reading-inset__text" style={{ marginTop: 8, marginBottom: 0 }}>
              Match a certified filter to your water source, concern, and home situation.
            </p>
          </div>
          <Link prefetch href="/quiz" className="wc-reading-cta__btn">
            Find My Filter →
          </Link>
        </div>

        <div className="wc-reading-inset" style={{ marginTop: 72 }}>
          <div className="wc-reading-inset__label">CHECK YOUR CITY&apos;S WATER</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 12 }}>
            {[
              { slug: 'san-antonio', name: 'San Antonio water quality' },
              { slug: 'gaithersburg', name: 'Gaithersburg water quality' },
              { slug: 'chicago', name: 'Chicago, IL' },
              { slug: 'houston', name: 'Houston, TX' },
              { slug: 'los-angeles', name: 'Los Angeles, CA' },
              { slug: 'phoenix', name: 'Phoenix, AZ' },
              { slug: 'philadelphia', name: 'Philadelphia, PA' },
              { slug: 'dallas', name: 'Dallas, TX' },
              { slug: 'miami', name: 'Miami, FL' },
              { slug: 'boston', name: 'Boston, MA' },
              { slug: 'seattle', name: 'Seattle, WA' },
              { slug: 'denver', name: 'Denver, CO' },
              { slug: 'new-york', name: 'New York, NY' },
            ].map(({ slug, name }) => (
              <Link
                prefetch
                key={slug}
                href={`/water/${slug}`}
                style={{
                  display: 'block',
                  padding: '10px 14px',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#334155',
                }}
              >
                {name} →
              </Link>
            ))}
          </div>
          <Link prefetch href="/utilities" style={{ fontSize: 13, color: '#0369a1', textDecoration: 'none', fontWeight: 600 }}>
            {VIEW_ALL_WATER_SYSTEMS_LINK}
          </Link>
        </div>

        <div className="wc-reading-inset wc-reading-inset--accent" style={{ marginTop: 72, textAlign: 'center' }}>
          <div className="wc-reading-inset__title" style={{ marginBottom: 8 }}>Check your exact water report</div>
          <p className="wc-reading-inset__text" style={{ marginBottom: 20 }}>
            Live EPA data, PFAS results, and violation history for your ZIP — free.
          </p>
          <Link prefetch href="/" className="wc-reading-cta__btn" style={{ display: 'inline-block' }}>
            Check My Water Free →
          </Link>
        </div>
      </article>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/SiteHeader';
import { AuthorReviewBadge } from '@/components/AuthorReviewBadge';
import { CityFilterTechMatrix } from '@/components/CityFilterTechMatrix';
import { CityFilterPagePicks } from '@/components/CityFilterPagePicks';
import { ConversionNextStep } from '@/components/ConversionNextStep';
import { PageFaq } from '@/components/PageFaq';
import { ScoreGradeDisclaimer } from '@/components/ScoreGradeDisclaimer';
import { breadcrumbListJsonLd } from '@/lib/breadcrumb-schema';
import {
  cityFilterPagePath,
  CITY_FILTER_HUB_PATH,
  filterPagePfasSummary,
  filterPageSafeSummary,
  getCityFilterPage,
  listCityFilterPageSlugs,
} from '@/lib/city-filter-pages';
import { formatMeasuredLevel, isMeasuredContaminant } from '@/lib/city-filter-picks';
import { SITE_ORIGIN } from '@/lib/site-url';
import { AUTHOR_PAGE_URL } from '@/lib/site-stats';

export function generateStaticParams() {
  return listCityFilterPageSlugs().map((city) => ({ city }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const page = getCityFilterPage(slug);
  if (!page) return { title: 'Best Water Filter' };
  const canonical = `${SITE_ORIGIN}${cityFilterPagePath(slug)}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
    },
    twitter: {
      title: page.title,
      description: page.description,
    },
  };
}

export default async function CityBestWaterFilterPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const page = getCityFilterPage(slug);
  if (!page) notFound();

  const path = cityFilterPagePath(slug);
  const cityHref = `/water/${slug}`;
  const stateHref = `/water/state/${page.stateSlug}`;
  const measured = page.rows.filter(isMeasuredContaminant);
  const breadcrumbLd = breadcrumbListJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Best water filters', path: CITY_FILTER_HUB_PATH },
    { name: page.h1, path },
  ]);
  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.h1,
    url: `${SITE_ORIGIN}${path}`,
    description: page.description,
    author: {
      '@type': 'Person',
      name: 'Joe Letorney',
      url: AUTHOR_PAGE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WaterCheckup',
      url: SITE_ORIGIN,
    },
  };

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>
        <nav style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 14 }}>
          <Link prefetch href="/" style={{ color: '#a8b4c4', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link prefetch href={CITY_FILTER_HUB_PATH} style={{ color: '#a8b4c4', textDecoration: 'none' }}>
            Best water filters
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#cbd5e1' }}>{page.displayName}</span>
        </nav>

        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
          CITY FILTER GUIDE · {page.state}
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
          {page.h1}
        </h1>
        <AuthorReviewBadge />
        <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 18px' }}>
          NSF-certified picks matched to measured contaminants for {page.system} (PWSID {page.pwsid}),
          serving {page.population} residents. This is not a household tap test.
        </p>
        <p style={{ fontSize: 14, margin: '0 0 28px' }}>
          <Link prefetch href={cityHref} style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
            Full {page.displayName} water quality report →
          </Link>
          {' · '}
          <Link prefetch href={stateHref} style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
            {page.stateName} cities
          </Link>
        </p>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', lineHeight: 1.3 }}>
            Is {page.displayName} tap water safe?
          </h2>
          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 12px' }}>
            {filterPageSafeSummary(page)}
          </p>
          <ScoreGradeDisclaimer style={{ marginBottom: 14 }} />
          {page.issues.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {page.issues.map((issue) => (
                <span
                  key={issue}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '4px 10px',
                    background: '#0d2240',
                    border: '1px solid #1a3a5c',
                    borderRadius: 6,
                    color: '#e2e8f0',
                  }}
                >
                  {issue}
                </span>
              ))}
            </div>
          )}
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
            For the safety-score methodology, PFAS table, and CCR context, use the{' '}
            <Link prefetch href={cityHref} style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
              {page.displayName} tap water report
            </Link>
            . This page covers which filter type and NSF listing match those measurements.
          </p>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', lineHeight: 1.3 }}>
            Contaminants detected in {page.displayName} water
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, margin: '0 0 16px' }}>
            Figures below come from this city&apos;s packaged UCMR5 PFAS snapshot, CCR/EWG averages, and
            utility hardness profile. Levels are historical peaks or averages — not a reading at your faucet.
          </p>
          <div style={{ border: '1px solid #1a3a5c', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            {measured.map((row, idx) => {
              const level = formatMeasuredLevel(row);
              return (
                <div
                  key={`${row.name}-${idx}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 12,
                    padding: '12px 16px',
                    borderBottom: idx < measured.length - 1 ? '1px solid #0f2336' : 'none',
                    background: idx % 2 ? '#071828' : '#0d2240',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{row.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                      {row.source}
                      {row.limit != null ? ` · comparison limit ${row.limit} ${row.unit}` : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#67e8f9', whiteSpace: 'nowrap' }}>
                    {level || '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', lineHeight: 1.3 }}>
            Which NSF certification you need in {page.displayName}
          </h2>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 16px' }}>
            Match the listing on the exact model and replacement cartridge — a standard number on the box is
            not proof of every reduction claim.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {page.certs.map((cert) => (
              <div
                key={cert.code}
                style={{ padding: '14px 16px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: '#67e8f9', marginBottom: 6 }}>{cert.code}</div>
                <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>{cert.why}</p>
              </div>
            ))}
          </div>
          <CityFilterTechMatrix rows={page.rows} cityName={page.displayName} />
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', lineHeight: 1.3 }}>
            Best water filters for {page.displayName}
          </h2>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 16px' }}>
            These are existing WaterCheckup catalog picks. Amazon links use tag watercheckup-20; Waterdrop
            links use ref anbyjkqb. Prices move — check the live listing.
          </p>
          <CityFilterPagePicks cityName={page.displayName} citySlug={slug} picks={page.picks} />
        </section>

        {page.hasLeadSection && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', lineHeight: 1.3 }}>
              Lead in {page.displayName} tap water
            </h2>
            {page.leadFacts.slice(0, 2).map((fact) => (
              <p key={fact} style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 12px' }}>
                {fact}
              </p>
            ))}
            <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 12px' }}>
              Lead often enters water after the treatment plant — from a service line or household plumbing.
              NSF/ANSI 53 or NSF/ANSI 58 is the drinking-water listing to check. A citywide report cannot
              verify the pipe material at your address.
            </p>
            <p style={{ fontSize: 14, margin: 0 }}>
              <Link prefetch href="/lead" style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
                Lead in tap water guide →
              </Link>
              {' · '}
              <Link
                prefetch
                href="/blog/best-water-filter-for-lead-removal"
                style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}
              >
                Best filters for lead
              </Link>
            </p>
          </section>
        )}

        {page.hasPfasSection && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', lineHeight: 1.3 }}>
              PFAS in {page.displayName} tap water
            </h2>
            <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 12px' }}>
              {filterPagePfasSummary(page)}
            </p>
            {page.pfas && page.pfas.compounds.length > 0 && (
              <div style={{ border: '1px solid #1a3a5c', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
                {page.pfas.compounds.map(([name, level], idx) => (
                  <div
                    key={`${name}-${idx}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 12,
                      padding: '10px 16px',
                      borderBottom: idx < page.pfas!.compounds.length - 1 ? '1px solid #0f2336' : 'none',
                      background: '#071828',
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{name}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#67e8f9' }}>{level.toFixed(1)} ppt</span>
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 12px' }}>
              When PFAS is listed, NSF/ANSI 58 reverse osmosis is the practical residential listing. NSF P473
              is the PFAS protocol — confirm whether the exact model is listed or only lab-tested to that
              method.
            </p>
            <p style={{ fontSize: 14, margin: 0 }}>
              <Link prefetch href="/pfas" style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
                PFAS in tap water guide →
              </Link>
              {' · '}
              <Link
                prefetch
                href="/blog/what-water-filter-removes-pfas"
                style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}
              >
                Filters that remove PFAS
              </Link>
            </p>
          </section>
        )}

        <ConversionNextStep page={path} headingId="wc-filter-city-next" />

        <PageFaq faqs={page.faqs} pageUrl={`${SITE_ORIGIN}${path}`} heading="Frequently asked questions" />

        {page.nearby.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>
              Nearby {page.stateName} filter guides
            </h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {page.nearby.map((near) => (
                <li key={near.slug}>
                  <Link
                    prefetch
                    href={cityFilterPagePath(near.slug)}
                    style={{
                      display: 'inline-block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#67e8f9',
                      textDecoration: 'none',
                      padding: '6px 10px',
                      background: 'rgba(8,145,178,0.12)',
                      borderRadius: 8,
                    }}
                  >
                    Best filter for {near.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { AuthorReviewBadge } from '@/components/AuthorReviewBadge';
import { breadcrumbListJsonLd } from '@/lib/breadcrumb-schema';
import {
  cityFilterPagePath,
  CITY_FILTER_HUB_PATH,
  listCityFilterPageSlugs,
  listCityFilterPagesByState,
} from '@/lib/city-filter-pages';
import { clipMeta, SERP_DESCRIPTION_MAX, SERP_TITLE_MAX } from '@/lib/serp-copy';
import { SITE_ORIGIN } from '@/lib/site-url';

const TITLE = 'Best Water Filter by City (2026)';
const DESCRIPTION = clipMeta(
  'NSF 53, 58, 401, and P473 filter picks for the largest U.S. cities, matched to each city’s measured PFAS, lead, and contaminant data. Not a tap test.',
  SERP_DESCRIPTION_MAX,
);

export const metadata: Metadata = {
  title: TITLE.length <= SERP_TITLE_MAX ? TITLE : clipMeta(TITLE, SERP_TITLE_MAX),
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_ORIGIN}${CITY_FILTER_HUB_PATH}` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_ORIGIN}${CITY_FILTER_HUB_PATH}`,
  },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default function BestWaterFilterHubPage() {
  const groups = listCityFilterPagesByState();
  const count = listCityFilterPageSlugs().length;
  const breadcrumbLd = breadcrumbListJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Best water filters', path: CITY_FILTER_HUB_PATH },
  ]);

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
        <nav style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 14 }}>
          <Link prefetch href="/" style={{ color: '#a8b4c4', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#cbd5e1' }}>Best water filters</span>
        </nav>

        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
          CITY FILTER GUIDES
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
          Best Water Filter by City
        </h1>
        <AuthorReviewBadge />
        <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 16px' }}>
          {count} city guides — one page per city, and only where WaterCheckup already has measured
          contaminant data (UCMR5 PFAS, CCR/EWG averages, or a utility hardness profile). We do not
          publish a page for a city with no numbers, and we do not add a second “is tap water safe”
          URL on top of the existing city reports.
        </p>
        <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 28px' }}>
          Each guide maps that city’s detections to NSF/ANSI 53, 58, 401, and P473, then to catalog
          picks with existing affiliate links. Lead and PFAS sections appear only when this snapshot
          actually contains that data.{' '}
          <Link prefetch href="/water" style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
            City water quality reports
          </Link>
          {' still answer “is the tap water safe.”'}
        </p>

        {groups.map((group) => (
          <section key={group.state} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px' }}>
              <Link
                prefetch
                href={`/water/state/${group.stateSlug}`}
                style={{ color: '#f1f5f9', textDecoration: 'none' }}
              >
                {group.stateName}
              </Link>
            </h2>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 8,
              }}
            >
              {group.cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    prefetch
                    href={cityFilterPagePath(city.slug)}
                    style={{
                      display: 'block',
                      padding: '10px 12px',
                      background: '#0d2240',
                      border: '1px solid #1a3a5c',
                      borderRadius: 8,
                      color: '#67e8f9',
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontSize: 14,
                    }}
                  >
                    {city.name}
                    <span style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>
                      {city.population} · {group.state}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

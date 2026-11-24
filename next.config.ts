import type { NextConfig } from 'next';

const STATE_SLUGS = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california',
  'colorado', 'connecticut', 'delaware', 'florida', 'georgia',
  'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
  'kansas', 'kentucky', 'louisiana', 'maine', 'maryland',
  'massachusetts', 'michigan', 'minnesota', 'mississippi',
  'missouri', 'montana', 'nebraska', 'nevada', 'new-hampshire',
  'new-jersey', 'new-mexico', 'new-york', 'north-carolina',
  'north-dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania',
  'rhode-island', 'south-carolina', 'south-dakota', 'tennessee',
  'texas', 'utah', 'vermont', 'virginia', 'washington',
  'west-virginia', 'wisconsin', 'wyoming', 'washington-dc', 'dc',
];

/** `/water/ca` → `/water/state/california` (no 2-letter city slug clashes). */
const STATE_ABBR_TO_SLUG: Record<string, string> = {
  al: 'alabama', ak: 'alaska', az: 'arizona', ar: 'arkansas', ca: 'california',
  co: 'colorado', ct: 'connecticut', de: 'delaware', fl: 'florida', ga: 'georgia',
  hi: 'hawaii', id: 'idaho', il: 'illinois', in: 'indiana', ia: 'iowa',
  ks: 'kansas', ky: 'kentucky', la: 'louisiana', me: 'maine', md: 'maryland',
  ma: 'massachusetts', mi: 'michigan', mn: 'minnesota', ms: 'mississippi',
  mo: 'missouri', mt: 'montana', ne: 'nebraska', nv: 'nevada', nh: 'new-hampshire',
  nj: 'new-jersey', nm: 'new-mexico', ny: 'new-york', nc: 'north-carolina',
  nd: 'north-dakota', oh: 'ohio', ok: 'oklahoma', or: 'oregon', pa: 'pennsylvania',
  ri: 'rhode-island', sc: 'south-carolina', sd: 'south-dakota', tn: 'tennessee',
  tx: 'texas', ut: 'utah', vt: 'vermont', va: 'virginia', wa: 'washington',
  wv: 'west-virginia', wi: 'wisconsin', wy: 'wyoming', dc: 'washington-dc',
};

const nextConfig: NextConfig = {
  reactStrictMode: false,
  reactCompiler: true,
  crossOrigin: "anonymous",
  // cacheComponents: true,
  poweredByHeader: false,
  enablePrerenderSourceMaps: true,
  turbopack: {},
  experimental: {
    cssChunking: true,
    optimizeCss: true,
    scrollRestoration: true,
    useCache: true,
    prefetchInlining: true,
  },
  images: {
    remotePatterns: [
      'images.unsplash.com',
      'm.media-amazon.com',
      'cdn.shopify.com',
      'images.ctfassets.net',
      'www.waterdropfilter.com',
      'www.aquasana.com',
      'www.epicwaterfilters.com',
      'www.pur.com',
      'shop.culligan.com',
      'www.ispringwatersystems.com',
      'www.expresswater.com',
      'www.hquatech.com',
      '123filter-com.b-cdn.net',
      'flecksystems.com',
      'cdn11.bigcommerce.com',
    ].map((hostname) => ({
      protocol: 'https' as const,
      hostname,
      pathname: '/**',
    })),
  },
  /** Default 60s — many ZIP/city pages exceed that on 2-core Vercel builders and get SIGTERM. */
  // staticPageGenerationTimeout: 180,
  async rewrites() {
    return STATE_SLUGS.filter((slug) => slug !== 'new-york').map((slug) => ({
      source: `/water/${slug}`,
      destination: `/water/state/${slug}`,
    }));
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host' as const, value: 'www.watercheckup.com' }],
        destination: 'https://watercheckup.com/',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host' as const, value: 'www.watercheckup.com' }],
        destination: 'https://watercheckup.com/:path*',
        permanent: true,
      },
      {
        source: '/blog/waterdrop-g3p800-vs-aquasana-smartflow',
        destination: '/blog/waterdrop-g3p600-vs-aquasana-smartflow',
        permanent: true,
      },
      ...Object.entries(STATE_ABBR_TO_SLUG).map(([abbr, slug]) => ({
        source: `/water/${abbr}`,
        destination: `/water/state/${slug}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;

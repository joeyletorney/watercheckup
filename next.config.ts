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
    return STATE_SLUGS.map((slug) => ({
      source: `/water/${slug}`,
      destination: `/water/state/${slug}`,
    }));
  },
  async redirects() {
    return [
      {
        source: '/blog/waterdrop-g3p800-vs-aquasana-smartflow',
        destination: '/blog/waterdrop-g3p600-vs-aquasana-smartflow',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

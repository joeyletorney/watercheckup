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

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.waterdropfilter.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.aquasana.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.epicwaterfilters.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.pur.com', pathname: '/**' },
      { protocol: 'https', hostname: 'shop.culligan.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.ctfassets.net', pathname: '/**' },
      { protocol: 'https', hostname: 'www.ispringwatersystems.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.expresswater.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.hquatech.com', pathname: '/**' },
      { protocol: 'https', hostname: '123filter-com.b-cdn.net', pathname: '/**' },
      { protocol: 'https', hostname: 'flecksystems.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn11.bigcommerce.com', pathname: '/**' },
      { protocol: 'https', hostname: 'm.media-amazon.com', pathname: '/**' },
    ],
  },
  /** Default 60s — many ZIP/city pages exceed that on 2-core Vercel builders and get SIGTERM. */
  staticPageGenerationTimeout: 180,
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

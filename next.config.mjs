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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
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
};

export default nextConfig;

import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { SITE_FAQ_SCHEMA } from '@/lib/site-faq-schema';
import { SITE_HOME_META_DESCRIPTION } from '@/lib/site-stats';

export const metadata: Metadata = {
  title: "WaterCheckup — See What's Really In Your Tap Water",
  description: SITE_HOME_META_DESCRIPTION,
  alternates: {
    canonical: 'https://watercheckup.com',
  },
  openGraph: {
    title: "WaterCheckup — See What's Really In Your Tap Water",
    description: SITE_HOME_META_DESCRIPTION,
  },
};

const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WaterCheckup',
  url: 'https://watercheckup.com',
  description: 'Free water quality database covering all 50 states, all for free. Check PFAS, lead, EPA violations, and filter recommendations by ZIP code.',
  author: {
    '@type': 'Person',
    name: 'Joe Letorney',
    url: 'https://watercheckup.com/about',
    jobTitle: 'Water Treatment Expert',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://watercheckup.com/results/{search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_FAQ_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }}
      />
      <HomeClient />
    </>
  );
}

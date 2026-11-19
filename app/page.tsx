import type { Metadata } from 'next';
import HomeLanding from './HomeLanding';
import { SITE_FAQ_SCHEMA } from '@/lib/site-faq-schema';
import { HOME_SEO_DESCRIPTION, HOME_SEO_TITLE } from '@/lib/serp-copy';

export const metadata: Metadata = {
  title: HOME_SEO_TITLE,
  description: HOME_SEO_DESCRIPTION,
  alternates: {
    canonical: 'https://watercheckup.com',
  },
  openGraph: {
    title: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
  },
  twitter: {
    title: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
  },
};

export default async function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_FAQ_SCHEMA) }}
      />
      <HomeLanding />
    </>
  );
}

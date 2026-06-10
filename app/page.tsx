import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { SITE_FAQ_SCHEMA } from '@/lib/site-faq-schema';
import { SITE_HOME_META_DESCRIPTION } from '@/lib/site-stats';

export const metadata: Metadata = {
  title: 'Free Tap Water Report by ZIP — PFAS, Lead & Grade | WaterCheckup',
  description: SITE_HOME_META_DESCRIPTION,
  alternates: {
    canonical: 'https://watercheckup.com',
  },
  openGraph: {
    title: 'Free Tap Water Report by ZIP — PFAS, Lead & Safety Grade',
    description: SITE_HOME_META_DESCRIPTION,
  },
};

export default async function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_FAQ_SCHEMA) }}
      />
      <HomeClient />
    </>
  );
}

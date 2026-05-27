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

export default function HomePage() {
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

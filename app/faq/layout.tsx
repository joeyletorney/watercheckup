import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { buildFaqPageSchema } from '@/lib/build-faq-schema';
import { FAQ_PAGE_URL, faqSchemaEntities } from '@/lib/faq-content';

const FAQ_DESCRIPTION =
  'Answers about tap water safety, EPA limits vs health goals, the 0–88 Water Safety Score, PFAS, lead, filters, and how to read your Consumer Confidence Report.';

export const metadata: Metadata = {
  title: 'FAQ — Tap Water Safety, PFAS, Lead & Filters',
  description: FAQ_DESCRIPTION,
  alternates: {
    canonical: FAQ_PAGE_URL,
  },
  openGraph: {
    title: 'WaterCheckup FAQ — Tap Water Safety & Filters',
    description: FAQ_DESCRIPTION,
    url: FAQ_PAGE_URL,
    type: 'website',
  },
};

const faqJsonLd = buildFaqPageSchema(faqSchemaEntities(), FAQ_PAGE_URL);

export default function FaqLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}

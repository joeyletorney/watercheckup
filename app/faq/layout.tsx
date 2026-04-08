import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Answers about tap water safety, EPA limits vs health goals, PFAS, lead, filters, and how to read your Consumer Confidence Report.',
  alternates: {
    canonical: 'https://watercheckup.com/faq',
  },
};

export default function FaqLayout({ children }: { children: ReactNode }) {
  return children;
}

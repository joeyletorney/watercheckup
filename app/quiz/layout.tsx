import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Filter Quiz',
  description:
    'Short quiz to narrow down the best water filter type for your home — under-sink RO, pitcher, countertop, or whole-house options.',
  alternates: {
    canonical: 'https://watercheckup.com/quiz',
  },
};

export default function QuizLayout({ children }: { children: ReactNode }) {
  return children;
}

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'What Water Filter Do I Need? — 3-Question Quiz | WaterCheckup',
  description:
    'Answer 3 questions about your water source, biggest concern, and home setup — compare published model evidence, installation needs and upkeep. Free, no login.',
  alternates: {
    canonical: 'https://watercheckup.com/quiz',
  },
  openGraph: {
    title: 'What Water Filter Do I Need? — 3-Question Quiz',
    description: 'Answer 3 questions about your water source, biggest concern, and home setup — compare published model evidence, installation needs and upkeep. Free, no login.',
  },
};

export default function QuizLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

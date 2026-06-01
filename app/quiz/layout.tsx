import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'What Water Filter Do I Need? — 3-Question Quiz | WaterCheckup',
  description:
    'Answer 3 questions about your water source, biggest concern, and home setup — we match you to the right NSF-certified filter. Free, no login.',
  alternates: {
    canonical: 'https://watercheckup.com/quiz',
  },
  openGraph: {
    title: 'What Water Filter Do I Need? — 3-Question Quiz',
    description: 'Answer 3 questions about your water source, biggest concern, and home setup — we match you to the right NSF-certified filter. Free, no login.',
  },
};

export default function QuizLayout({ children }: { children: ReactNode }) {
  return children;
}

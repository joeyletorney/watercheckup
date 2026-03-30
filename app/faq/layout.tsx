import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Water Quality FAQ — Tap Water Safety Questions Answered',
  description: 'Expert answers to the most common tap water safety questions. Learn about PFAS, lead, chloramine, TDS, water hardness, and how to choose the right certified water filter for your home.',
  keywords: ['water quality FAQ', 'is tap water safe', 'PFAS water filter', 'lead in tap water', 'water hardness', 'water filter guide', 'chloramine water', 'TDS water quality'],
  openGraph: {
    title: 'Water Quality FAQ | WaterCheckup',
    description: 'Expert answers about tap water safety, PFAS, lead, chloramine, and choosing the right NSF-certified water filter.',
    url: 'https://watercheckup.com/faq',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Water Quality FAQ | WaterCheckup',
    description: 'Expert answers about tap water safety, PFAS, lead, and water filter selection.',
  },
  alternates: {
    canonical: 'https://watercheckup.com/faq',
  },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Drinking Water Contaminants Guide — Lead, PFAS, Arsenic & More',
  description: 'Complete guide to 20+ drinking water contaminants. Health effects, EPA limits, and which NSF-certified filters remove lead, PFAS, arsenic, nitrates, chloramine, fluoride, and more.',
  keywords: ['drinking water contaminants', 'PFAS health effects', 'lead in water health risks', 'arsenic drinking water', 'nitrates water safety', 'chloramine water', 'fluoride water filter', 'water contaminant guide'],
  openGraph: {
    title: 'Drinking Water Contaminants Guide | WaterCheckup',
    description: 'Complete guide to 20+ drinking water contaminants — health effects, EPA limits, and certified filter solutions for lead, PFAS, arsenic, and more.',
    url: 'https://watercheckup.com/contaminants',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drinking Water Contaminants Guide | WaterCheckup',
    description: 'Health effects, EPA limits, and filter solutions for lead, PFAS, arsenic, nitrates, and 20+ more contaminants.',
  },
  alternates: {
    canonical: 'https://watercheckup.com/contaminants',
  },
}

export default function ContaminantsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

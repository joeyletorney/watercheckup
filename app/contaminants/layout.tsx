import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Contaminants',
  description:
    'Plain-language guide to common drinking water contaminants — lead, PFAS, nitrates, disinfection byproducts — and how certified filters remove them.',
  alternates: {
    canonical: 'https://watercheckup.com/contaminants',
  },
};

export default function ContaminantsLayout({ children }: { children: ReactNode }) {
  return children;
}

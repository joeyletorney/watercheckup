import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "WaterCheckup — See What's Really In Your Tap Water",
  description:
    'Analyze local water quality by address, spot contaminants, and get personalized filter picks backed by EPA SDWIS & UCMR data — free, no account.',
  alternates: {
    canonical: 'https://watercheckup.com',
  },
  openGraph: {
    title: "WaterCheckup — See What's Really In Your Tap Water",
    description:
      'Know what your family is drinking. Instant analysis from federal water data, contaminant insights, and filter recommendations for your area.',
  },
};

export default function HomePage() {
  return <HomeClient />;
}

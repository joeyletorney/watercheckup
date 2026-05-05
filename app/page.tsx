import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'WaterCheckup — Is Your Tap Water Safe?',
  description:
    'PFAS found in 45% of US tap water. Check your city\'s real EPA violation history, PFAS levels, and lead risk — free in seconds, no account needed. 135+ cities covered.',
  alternates: {
    canonical: 'https://watercheckup.com',
  },
  openGraph: {
    title: 'WaterCheckup — Is Your Tap Water Actually Safe?',
    description: 'PFAS found in 45% of US tap water. Check your exact EPA report — violations, PFAS levels, lead risk — free, no account.',
  },
};

export default function HomePage() {
  return <HomeClient />;
}

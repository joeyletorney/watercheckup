import type { Metadata } from 'next';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import { EpaIframeShell } from '../components/EpaIframeShell';

const FYLCCR_ENTRY = 'https://sdwis.epa.gov/fylccr';

export const metadata: Metadata = {
  title: 'EPA Find Your Local CCR | WaterCheckup',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://watercheckup.com/epa/ccr-finder' },
};

export default function EpaCcrFinderEmbedPage({ searchParams }: { searchParams: { return?: string } }) {
  const back =
    typeof searchParams.return === 'string' && searchParams.return.startsWith('/') && !searchParams.return.startsWith('//')
      ? searchParams.return
      : '/';

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check another ZIP →" ctaHref="/" />
      <EpaIframeShell
        src={FYLCCR_ENTRY}
        title="EPA — Find Your Local CCR"
        subtitle="Search EPA’s Consumer Confidence Report finder by state, county, or system name. Not every utility files a link here."
        backHref={back}
        backLabel="← Back to your report"
      />
      <SiteFooter />
    </div>
  );
}

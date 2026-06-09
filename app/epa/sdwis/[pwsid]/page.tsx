import type { Metadata } from 'next';
import { SiteHeader } from '../../../components/SiteHeader';
import { EpaIframeShell } from '../../components/EpaIframeShell';

export const metadata: Metadata = {
  title: 'EPA federal water system record | WaterCheckup',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://watercheckup.com/epa/sdwis' },
};

export default async function EpaSdwisEmbedPage(
  props: {
    params: Promise<{ pwsid: string }>;
    searchParams: Promise<{ return?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const pwsid = decodeURIComponent(params.pwsid);
  const src = `https://sdwis.epa.gov/ords/sfdw_pub/f?p=SDWIS_FED_REPORTS_PUBLIC:PWS_SEARCH::::::PWSID:${encodeURIComponent(pwsid)}`;
  const back =
    typeof searchParams.return === 'string' && searchParams.return.startsWith('/') && !searchParams.return.startsWith('//')
      ? searchParams.return
      : '/';

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check another ZIP →" ctaHref="/" />
      <EpaIframeShell
        src={src}
        title={`EPA SDWIS · ${pwsid}`}
        subtitle="Federal violations and related records reported to EPA for this public water system ID."
        backHref={back}
        backLabel="← Back to your report"
      />
    </div>
  );
}

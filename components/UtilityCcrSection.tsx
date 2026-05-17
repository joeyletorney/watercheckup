import Link from 'next/link';
import type { UtilityCcrContent } from '@/lib/utilities-data';

const EPA_CCR_PORTAL_URL = 'https://cfpub.epa.gov/ccr';
const DEFAULT_REPORT_YEAR = 2026;

type Props = {
  utilityName: string;
  isClaimed: boolean;
  ccr?: UtilityCcrContent | null;
  reportYear?: number;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function UtilityCcrSection({
  utilityName,
  isClaimed,
  ccr,
  reportYear = DEFAULT_REPORT_YEAR,
}: Props) {
  const published = isClaimed && ccr;

  return (
    <section className="wc-utility-ccr-section" aria-labelledby="utility-ccr-heading">
      <h2 id="utility-ccr-heading" className="wc-utility-ccr-section__title">
        Official Consumer Confidence Report (CCR)
      </h2>

      {published ? (
        <div className="wc-utility-ccr-section__published">
          <div className="wc-utility-ccr-section__badge-row">
            <span className="wc-utility-ccr-section__verified">✅ Verified by WaterCheckup</span>
          </div>
          <p className="wc-utility-ccr-section__meta">
            Report year <strong>{ccr.reportYear}</strong>
            {ccr.lastUpdated ? (
              <>
                {' '}
                · Last updated <strong>{formatDate(ccr.lastUpdated)}</strong>
              </>
            ) : null}
          </p>
          <p className="wc-utility-ccr-section__publisher">Published by {utilityName}</p>
          <p className="wc-utility-ccr-section__findings">{ccr.keyFindings}</p>
          {ccr.pdfUrl ? (
            <a
              href={ccr.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wc-utility-ccr-section__pdf-link"
            >
              View full CCR (PDF) →
            </a>
          ) : null}
        </div>
      ) : isClaimed ? (
        <div className="wc-utility-ccr-section__claimed-pending">
          <div className="wc-utility-ccr-section__badge-row">
            <span className="wc-utility-ccr-section__verified">✅ Verified by WaterCheckup</span>
          </div>
          <p className="wc-utility-ccr-section__publisher">Published by {utilityName}</p>
          <p className="wc-utility-ccr-section__findings">
            This listing is operator-verified. The full {reportYear} CCR summary and PDF will appear here once your team
            publishes them through WaterCheckup.
          </p>
          <Link href="/utilities/claim" className="wc-utility-ccr-section__claim-link">
            Update your CCR →
          </Link>
        </div>
      ) : (
        <>
          <div className="wc-utility-ccr-section__unpublished-banner">
            <p className="wc-utility-ccr-section__banner-lead">
              <span aria-hidden>📋</span> The official {reportYear} CCR for <strong>{utilityName}</strong> has not yet
              been published on WaterCheckup.
            </p>
            <p className="wc-utility-ccr-section__operator-prompt">
              Are you the water operator for <strong>{utilityName}</strong>? Publish your official CCR here for free —
              your customers are already finding this page.
            </p>
            <Link href="/utilities/claim" className="wc-utility-ccr-section__claim-cta">
              Claim This Listing Free →
            </Link>
          </div>
          <p className="wc-utility-ccr-section__residents">
            <strong>Residents:</strong> Your utility is required by EPA to publish an annual CCR by July 1st each year.
            Contact <strong>{utilityName}</strong> directly to request a copy, or check the EPA&apos;s national CCR portal
            at{' '}
            <a href={EPA_CCR_PORTAL_URL} target="_blank" rel="noopener noreferrer">
              cfpub.epa.gov/ccr
            </a>
            .
          </p>
        </>
      )}
    </section>
  );
}

import { JourneyLink } from './JourneyLink';

export function ReportNextSteps({ zip, historicalOnly, supplierReportHref = 'https://www.epa.gov/ccr' }: {
  zip: string; historicalOnly: boolean; supplierReportHref?: string;
}) {
  const reportStatus = historicalOnly ? 'historical_only' : 'current_records_available';
  const quizHref = `/quiz?from=${historicalOnly ? 'historical-report' : 'results'}&zip=${encodeURIComponent(zip)}`;
  return <section className="wc-report-next-steps" aria-labelledby="wc-report-next-heading">
    <h2 id="wc-report-next-heading">What to do next</h2>
    <p>First, confirm the listed supplier serves your home. Historical detections alone do not establish that treatment is necessary.</p>
    <div className="wc-report-next-grid">
      <article>
        <h3>Check supplier records</h3>
        <p>Start with the supplier’s current water quality report and any local instructions.</p>
        <JourneyLink href={supplierReportHref} eventName="report_next_step" step="supplier_report" page="zip-report" reportStatus={reportStatus}>Find your supplier’s current water quality report →</JourneyLink>
      </article>
      <article>
        <h3>Understand your tap</h3>
        <p>A supplier report cannot measure your plumbing. Learn how to choose a lab panel for a specific question.</p>
        <JourneyLink href="/blog/how-to-test-your-tap-water-mail-in-labs-explained" eventName="report_next_step" step="testing_guide" page="zip-report" reportStatus={reportStatus}>How to choose a lab panel for your tap →</JourneyLink>
      </article>
      <article>
        <h3>Compare filters</h3>
        <p>Choose your own concern, water source and home setup in the three-question quiz.</p>
        <JourneyLink href={quizHref} eventName="report_next_step" step="compare_filters" page="zip-report" reportStatus={reportStatus}>Compare filters for my needs →</JourneyLink>
      </article>
    </div>
    <JourneyLink className="wc-report-well-link" href="/well" eventName="report_next_step" step="well_guide" page="zip-report" reportStatus={reportStatus}>Using a private well? Start with well-water testing guidance →</JourneyLink>
  </section>;
}

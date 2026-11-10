import Link from 'next/link';
import { getCityPfasData } from '@/lib/ucmr5-city-pfas';
import { getUcmrSnapshotLabel } from '@/lib/water-data-meta';

/** A short answer before grades, editorial copy, or shopping recommendations. */
export function ReportEvidenceSummary({ supplier, pwsid, hardness }: {
  supplier: string; pwsid: string; hardness?: number;
}) {
  const pfas = getCityPfasData(pwsid);
  return <section aria-label="Understand this report" style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12, padding: '20px 22px', marginBottom: 28 }}>
    <h2 style={{ margin: '0 0 10px', color: '#f1f5f9', fontSize: 20 }}>What this report tells you</h2>
    <p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 10px' }}>
      <strong>{supplier}</strong> · EPA system ID {pwsid}. Confirm this is the supplier on your water bill.
    </p>
    <p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 10px' }}>
      {!pfas ? 'PFAS coverage: this packaged snapshot has no matching record. That does not establish either detection or nondetection.'
        : pfas.compounds.length === 0 ? 'PFAS coverage: this snapshot lists no reportable detections. That does not mean every compound is absent or that your tap was tested.'
        : `Historical PFAS monitoring: ${pfas.compounds.length} compounds detected; ${pfas.violations} compound peaks above April 2024 comparison benchmarks. These are not official compliance findings.`}
      {' '}Snapshot label: {getUcmrSnapshotLabel()}.
    </p>
    {hardness != null && <p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 10px' }}>Taste and scale: the separately sourced utility profile lists hardness at {hardness} mg/L as CaCO₃. Hardness does not reduce the health-related index.</p>}
    <p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 10px' }}>Your next step: read the supplier’s current annual report. If you need an answer about your household plumbing or private well, use a certified laboratory test. Choose a filter only for a documented concern and verify the exact model’s reduction claims.</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <a href={`https://echo.epa.gov/sdwa/facility-info?p_pwsid=${encodeURIComponent(pwsid)}`} target="_blank" rel="noreferrer" style={{ color: '#67e8f9' }}>Official EPA system record</a>
      <Link href="/utilities" style={{ color: '#67e8f9' }}>Different supplier? Find your system</Link>
      <Link href="/methodology" style={{ color: '#67e8f9' }}>Sources and limitations</Link>
    </div>
  </section>;
}

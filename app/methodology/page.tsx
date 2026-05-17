import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export const metadata: Metadata = {
  title: 'Data Sources & Methodology | WaterCheckup',
  description:
    'How WaterCheckup combines EPA SDWIS, UCMR5 PFAS monitoring, Lead & Copper Rule sampling, EPA enforcement data, and EWG health guidelines into a plain-language ZIP-level water quality report.',
  alternates: { canonical: 'https://watercheckup.com/methodology' },
  openGraph: {
    title: 'Data Sources & Methodology | WaterCheckup',
    description: 'A full breakdown of the 5 EPA datasets WaterCheckup uses to generate water quality reports — including how the score is calculated and what it does and does not mean.',
  },
};

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '40px 0 12px', lineHeight: 1.3 };
const h3: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: '#e2e8f0', margin: '24px 0 8px' };
const p: React.CSSProperties = { fontSize: 15, color: '#94a3b8', lineHeight: 1.8, margin: '0 0 18px' };
const tag: React.CSSProperties = { display: 'inline-block', fontSize: 10, fontWeight: 800, letterSpacing: 1, padding: '2px 8px', borderRadius: 4, background: 'rgba(8,145,178,0.12)', border: '1px solid rgba(8,145,178,0.3)', color: '#38bdf8', marginRight: 8, verticalAlign: 'middle' };
const card: React.CSSProperties = { marginBottom: 16, padding: '18px 20px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10 };
const warn: React.CSSProperties = { marginBottom: 20, padding: '16px 20px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: 10, fontSize: 14, color: '#94a3b8', lineHeight: 1.75 };

export default function MethodologyPage() {
  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 100px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>TRUST & TRANSPARENCY</p>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', lineHeight: 1.15, margin: '0 0 16px' }}>
          Data sources & methodology
        </h1>
        <p style={{ ...p, fontSize: 16 }}>
          WaterCheckup pulls from the same public federal databases that water utilities report to. We merge them by ZIP code, translate the results into plain language, and match them to filter recommendations. We are not a laboratory and we do not sample your tap.
        </p>
        <p style={{ ...p, marginBottom: 36 }}>
          This page explains every data source we use, how the Water Quality Score is calculated, and what our reports do — and don't — tell you.
        </p>

        {/* ── THE 6 DATA SOURCES ── */}
        <h2 style={h2}>Our 6 data sources</h2>

        <div style={card}>
          <span style={tag}>SOURCE 1</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>EPA SDWIS — Safe Drinking Water Information System</span>
          <p style={{ ...p, margin: '10px 0 0' }}>
            SDWIS is the EPA's master registry of all 150,000+ public water systems in the United States. It tracks every reported violation — health-based, monitoring, and reporting — along with enforcement actions, penalties, and compliance status. We query SDWIS live for every ZIP search so you always see the most current violation record on file. A "violation" means a utility exceeded an EPA limit or failed to properly test and report. Most violations are monitoring failures (late or missing tests), but health-based violations for things like PFAS, nitrates, or disinfection byproducts are the ones that matter most.
          </p>
          <p style={{ fontSize: 12, color: '#475569', margin: '8px 0 0' }}>
            Source: <a href="https://echo.epa.gov/" target="_blank" rel="noreferrer" style={{ color: '#22d3ee' }}>EPA ECHO / SDWIS public API</a>
          </p>
        </div>

        <div style={card}>
          <span style={tag}>SOURCE 2</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>EPA UCMR5 — Unregulated Contaminant Monitoring Rule (2023–2025)</span>
          <p style={{ ...p, margin: '10px 0 0' }}>
            The UCMR is how EPA tests for contaminants that don't yet have federal limits. UCMR5 is the fifth round and is the most comprehensive PFAS dataset ever collected — utilities were required to test for 29 PFAS compounds between 2023 and 2025 and report results to EPA. We ship a snapshot of the UCMR5 results database inside the app and match it to your water system by PWSID. This is how we show you specific PFAS compound levels (in parts per trillion) even before your utility is required to include them in their annual water quality report.
          </p>
          <p style={{ fontSize: 12, color: '#475569', margin: '8px 0 0' }}>
            Source: <a href="https://www.epa.gov/dwucmr" target="_blank" rel="noreferrer" style={{ color: '#22d3ee' }}>EPA UCMR5 public dataset</a>
          </p>
        </div>

        <div style={card}>
          <span style={tag}>SOURCE 3</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>EPA Lead & Copper Rule — Tap Sampling Results</span>
          <p style={{ ...p, margin: '10px 0 0' }}>
            Lead doesn't come from source water — it leaches from aging lead service lines and in-home plumbing into your tap. The EPA's Lead & Copper Rule requires utilities to collect tap samples from high-risk homes (typically those with older plumbing) and report the 90th percentile result. We surface these results alongside a flag if the action level of 15 ppb has been approached or exceeded. Keep in mind: sampling is done at a limited number of high-risk homes, not at every tap. Your home's actual lead exposure depends on its plumbing age and whether your service line is lead.
          </p>
        </div>

        <div style={card}>
          <span style={tag}>SOURCE 4</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>EPA Lead Service Line Inventory</span>
          <p style={{ ...p, margin: '10px 0 0' }}>
            As of October 2024, all US water utilities are required by federal rule to publish an inventory of their lead service lines. We pull this data where available to flag whether your utility has a significant number of known lead lines still in service. This is a utility-level number — it tells you whether lead line risk exists in your system, not whether your specific address is affected. For address-level lookup tools, we link to city-specific resources where they exist (e.g. Chicago, NYC, Philadelphia).
          </p>
        </div>

        <div style={card}>
          <span style={tag}>SOURCE 5</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>EPA ECHO Enforcement & Compliance History</span>
          <p style={{ ...p, margin: '10px 0 0' }}>
            Beyond violation records, ECHO tracks formal enforcement actions, inspection history, and penalty data. A utility can have an open violation and still be working toward compliance — or it can have a history of repeat violations that suggest a systemic problem. We use enforcement history to contextualize the violation record and flag utilities with patterns of non-compliance that a raw violation count might underrepresent.
          </p>
          <p style={{ fontSize: 12, color: '#475569', margin: '8px 0 0' }}>
            Source: <a href="https://echo.epa.gov/" target="_blank" rel="noreferrer" style={{ color: '#22d3ee' }}>EPA ECHO Enforcement and Compliance History Online</a>
          </p>
        </div>

        <div style={card}>
          <span style={tag}>SOURCE 6</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>EWG Health Guidelines — where available</span>
          <p style={{ ...p, margin: '10px 0 0' }}>
            The EPA's legal limits (MCLs) are set with economic and technical feasibility in mind, not pure health science. The Environmental Working Group publishes independent health guidelines for many contaminants that are often much stricter than EPA limits — for example, the EWG health guideline for PFOA is 0.1 ppt, compared to EPA's legal limit of 4 ppt. We use EWG health guidelines as a secondary layer to show when your water may be technically "within limits" but still above a stricter independent health benchmark. This context is clearly labeled as a health guideline, not a legal limit.
          </p>
          <p style={{ fontSize: 12, color: '#475569', margin: '8px 0 0' }}>
            Source: <a href="https://www.ewg.org/tapwater/" target="_blank" rel="noreferrer" style={{ color: '#22d3ee' }}>EWG Tap Water Database</a>
          </p>
        </div>

        {/* ── SCORE ── */}
        <h2 style={h2}>How the Water Quality Score is calculated</h2>
        <p style={p}>
          Every ZIP report includes a Water Quality Score from 0–100 and a letter grade (A–F). The score is a summary of the regulatory and monitoring signals described above — it is not a lab test result and it is not a medical assessment. Here's how it works:
        </p>
        <h3 style={h3}>Starting point</h3>
        <p style={p}>No public municipal water supply scores above 88. Even "clean" water has chlorine, disinfection byproducts, and trace unmonitored contaminants that federal testing doesn't fully capture. This floors the grade — no utility gets a perfect score.</p>
        <h3 style={h3}>Deductions</h3>
        <p style={p}>Points are deducted for: open health-based violations (−15 to −40 depending on severity), PFAS detections above the EPA MCL of 4 ppt (−25), multiple PFAS compound detections (−6 to −12), confirmed lead tap sample exceedances, and the number and type of issues flagged in the report. Monitoring/reporting violations count less than health-based violations.</p>
        <h3 style={h3}>Grade bands</h3>
        <div style={{ marginBottom: 20 }}>
          {[['A', '90–100', 'No open violations. No PFAS above limits. Clean record.', '#22d3ee'],
            ['B', '80–89', 'Minor monitoring issues only. No health-based violations.', '#22d3ee'],
            ['C', '65–79', 'PFAS detected or moderate concerns. Worth filtering.', '#f59e0b'],
            ['D', '50–64', 'Health-based violations or PFAS above EPA MCL.', '#f87171'],
            ['F', '0–49', 'Serious ongoing violations or multiple PFAS exceedances.', '#ef4444'],
          ].map(([grade, range, desc, color]) => (
            <div key={grade as string} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color as string}18`, border: `1px solid ${color as string}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: color as string, flexShrink: 0 }}>{grade}</div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{range}</span>
                <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 8 }}>{desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── LIMITATIONS ── */}
        <h2 style={h2}>Important limitations</h2>
        <div style={warn}>
          <strong style={{ color: '#f87171' }}>What our reports don't tell you:</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Whether your specific home's plumbing adds contaminants (especially lead). In-home plumbing can leach lead regardless of what your utility reports.</li>
            <li>Whether your private well is contaminated — SDWIS only covers public water systems. Well users should test annually through a certified lab.</li>
            <li>Contaminants that aren't federally regulated and haven't been tested under UCMR. There are thousands of chemicals in use that EPA hasn't set limits for.</li>
            <li>Very recent changes — EPA violation data can lag 30–90 days behind real-world events. A boil water advisory issued this week may not yet be in SDWIS.</li>
            <li>Whether your bottled water is any safer — bottled water is regulated by FDA under different rules and isn't systematically tested for PFAS.</li>
          </ul>
        </div>

        <h2 style={h2}>Data freshness</h2>
        <p style={p}>
          SDWIS violation data is queried live from the EPA ECHO API each time you search — it reflects whatever EPA has on file at that moment. UCMR5 PFAS data is a snapshot packaged into the app (the federal dataset was finalized in 2025 and updates infrequently). Lead pipe inventory data is pulled from federal reporting as of late 2024. Each report includes data freshness notes where we can surface them.
        </p>
        <p style={p}>
          For the most current data, always cross-reference the official EPA links included in your report, and call your utility directly if you have concerns about recent events.
        </p>

        <h2 style={h2}>Who we are</h2>
        <p style={p}>
          WaterCheckup is an independent water quality information service. We are not affiliated with the EPA, the EWG, or any water utility. We earn revenue through affiliate links to water filters — our recommendations are based on certifications and third-party test data, not paid placements. The affiliate relationship does not influence which data we surface or how we calculate scores.
        </p>

        <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid #0f2336', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#22d3ee', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>← Check my water</Link>
          <Link href="/faq" style={{ color: '#94a3b8', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>FAQ →</Link>
          <a href="https://echo.epa.gov/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>EPA ECHO →</a>
          <a href="https://www.epa.gov/dwucmr" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>EPA UCMR →</a>
        </div>
      </main>
    </div>
  );
}

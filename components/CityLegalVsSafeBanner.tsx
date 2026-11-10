/** EWG-style framing: EPA legal compliance ≠ health guideline safety */
export function CityLegalVsSafeBanner({ cityName }: { cityName: string }) {
  return (
    <div
      style={{
        padding: '16px 20px',
        background: 'rgba(245,158,11,0.08)',
        border: '1px solid rgba(245,158,11,0.35)',
        borderRadius: 12,
        marginBottom: 20,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24', letterSpacing: 1, marginBottom: 8 }}>
        UNDERSTAND THE COMPARISON
      </div>
      <p style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.75, margin: 0 }}>
        This {cityName} report distinguishes historical measurements, official violation records, and independent health guidelines. These measures answer different questions. A historical peak above a benchmark does not establish a legal violation, and a missing record does not establish that a contaminant is absent. Review the source and sample context before choosing a test or filter.
      </p>
    </div>
  );
}

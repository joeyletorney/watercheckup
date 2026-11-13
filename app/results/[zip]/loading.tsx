export default function LoadingWaterReport() {
  return <section role="status" aria-live="polite" aria-busy="true" className="wc-page" style={{ minHeight: '60vh', color: '#e2e8f0' }}>
    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Looking up your water report…</h1>
    <p style={{ lineHeight: 1.7 }}>Matching your ZIP to supplier records and checking available data. Some federal sources can take a few seconds.</p>
    <div aria-hidden="true" style={{ height: 180, borderRadius: 14, background: '#0b1e36', border: '1px solid #155e75', marginTop: 24 }} />
  </section>;
}

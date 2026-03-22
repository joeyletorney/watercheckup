export default function Home() {
  return (
    <div style={{ fontFamily: 'monospace', background: '#050e17', color: '#22d3ee', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>💧</div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>WATERCHECKUP API</div>
      <div style={{ fontSize: 13, color: '#475569' }}>Real EPA SDWIS data for any US ZIP code</div>
      <div style={{ fontSize: 12, color: '#334155', marginTop: 8 }}>Endpoint: <span style={{ color: '#0891b2' }}>/api/water?zip=XXXXX</span></div>
    </div>
  )
}

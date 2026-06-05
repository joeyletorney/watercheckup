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
        LEGAL DOES NOT ALWAYS MEAN SAFE
      </div>
      <p style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.75, margin: 0 }}>
        {cityName} water may meet federal EPA limits while still showing contaminants above independent health
        guidelines (EWG, state advisories). EPA MCLs are often set on treatment feasibility — not a &quot;zero
        risk&quot; threshold. Compare levels below to health guidelines and state/U.S. utility averages, then see
        which filter technologies address your profile.
      </p>
    </div>
  );
}

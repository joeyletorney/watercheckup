import { SITE_COMPARISON_ROWS } from '@/lib/site-stats';

const cellStyle = (type: 'yes' | 'no' | 'warn') => {
  const colors = { yes: '#4ade80', no: '#f87171', warn: '#fbbf24' };
  const icons = { yes: '✓', no: '—', warn: '~' };
  return { color: colors[type], icon: icons[type] };
};

export function HomeComparisonTable() {
  return (
    <section style={{ marginBottom: 96 }} aria-labelledby="wc-compare-heading">
      <div className="wc-home-section-eyebrow" style={{ marginBottom: 12 }}>
        VS OTHER SITES
      </div>
      <h2 id="wc-compare-heading" style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 22px' }}>
        WaterCheckup vs typical ZIP lookup tools
      </h2>
      <div style={{ overflowX: 'auto', border: '1px solid #1a3a5c', borderRadius: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#071828' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#94a3b8', fontWeight: 700 }}>Feature</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#67e8f9', fontWeight: 800 }}>WaterCheckup</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#94a3b8', fontWeight: 700 }}>Typical aggregators</th>
            </tr>
          </thead>
          <tbody>
            {SITE_COMPARISON_ROWS.map((row) => {
              const wc = cellStyle(row.watercheckup.type);
              const o = cellStyle(row.others.type);
              return (
                <tr key={row.feature} style={{ borderTop: '1px solid #1a3a5c' }}>
                  <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 600 }}>{row.feature}</td>
                  <td style={{ padding: '12px 16px', color: wc.color }}>
                    <span style={{ marginRight: 6 }}>{wc.icon}</span>
                    {row.watercheckup.text || 'Yes'}
                  </td>
                  <td style={{ padding: '12px 16px', color: o.color }}>
                    <span style={{ marginRight: 6 }}>{o.icon}</span>
                    {row.others.text || (row.others.type === 'yes' ? 'Yes' : row.others.type === 'no' ? 'No' : 'Varies')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

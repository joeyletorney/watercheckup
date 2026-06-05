import type { ContaminantRow } from '@/lib/water-contaminants';
import { getContaminantFilterTech } from '@/lib/contaminant-filter-tech';

function CellMark({ on }: { on: boolean }) {
  return (
    <span style={{ fontSize: 14, fontWeight: 800, color: on ? '#22d3ee' : '#475569' }}>
      {on ? '✓' : '—'}
    </span>
  );
}

type Props = {
  rows: ContaminantRow[];
  cityName: string;
};

/** Educational contaminant × filter-technology matrix (EWG-style), before product picks */
export function CityFilterTechMatrix({ rows, cityName }: Props) {
  const detected = rows.filter(r => r.level != null && r.level > 0);
  if (!detected.length) return null;

  const priority = detected.filter(
    r => r.severity === 'high' || r.severity === 'moderate' || (r.ewgTimesOver ?? 0) >= 1,
  );
  const matrixRows = (priority.length ? priority : detected).slice(0, 12);

  return (
    <div
      style={{
        padding: '20px 22px',
        background: '#071828',
        border: '1px solid #1a3a5c',
        borderRadius: 12,
        marginBottom: 24,
        overflowX: 'auto',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>
        WHICH FILTER TECHNOLOGY WORKS FOR {cityName.toUpperCase()}?
      </div>
      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.55 }}>
        Reference matrix — not specific brands. NSF-certified carbon blocks, reverse osmosis (NSF 58), and ion-exchange
        softeners address different contaminants. Product picks below match this profile.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(160px, 1.4fr) 72px 72px 88px',
          gap: 0,
          minWidth: 420,
        }}
      >
        {['Contaminant', 'Carbon', 'RO', 'Ion exch.'].map((h, i) => (
          <div
            key={h}
            style={{
              padding: '10px 12px',
              fontSize: 11,
              fontWeight: 800,
              color: '#a8b4c4',
              letterSpacing: 0.5,
              background: '#040d14',
              borderBottom: '1px solid #1a3a5c',
              textAlign: i > 0 ? 'center' : 'left',
            }}
          >
            {h}
          </div>
        ))}
        {matrixRows.map((row, idx) => {
          const tech = {
            carbon: row.filterCarbon ?? getContaminantFilterTech(row.name).carbon,
            ro: row.filterRo ?? getContaminantFilterTech(row.name).ro,
            ionExchange: row.filterIonExchange ?? getContaminantFilterTech(row.name).ionExchange,
          };
          return (
            <div key={row.name} style={{ display: 'contents' }}>
              <div
                style={{
                  padding: '10px 12px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#e2e8f0',
                  borderBottom: idx < matrixRows.length - 1 ? '1px solid #0f2336' : 'none',
                }}
              >
                {row.name}
              </div>
              <div
                style={{
                  padding: '10px 12px',
                  textAlign: 'center',
                  borderBottom: idx < matrixRows.length - 1 ? '1px solid #0f2336' : 'none',
                }}
              >
                <CellMark on={tech.carbon} />
              </div>
              <div
                style={{
                  padding: '10px 12px',
                  textAlign: 'center',
                  borderBottom: idx < matrixRows.length - 1 ? '1px solid #0f2336' : 'none',
                }}
              >
                <CellMark on={tech.ro} />
              </div>
              <div
                style={{
                  padding: '10px 12px',
                  textAlign: 'center',
                  borderBottom: idx < matrixRows.length - 1 ? '1px solid #0f2336' : 'none',
                }}
              >
                <CellMark on={tech.ionExchange} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

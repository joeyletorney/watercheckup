import type { ContaminantRow } from '@/lib/water-contaminants';

const SEVERITY_COLOR: Record<string, string> = {
  high: '#ef4444',
  moderate: '#f59e0b',
  low: '#22d3ee',
};

const STATUS_LABEL: Record<string, string> = {
  high: 'High concern',
  moderate: 'Moderate',
  low: 'Lower concern',
};

type Props = {
  cityName: string;
  rows: ContaminantRow[];
  sourceNote?: string;
};

export function CityContaminantTable({ cityName, rows, sourceNote }: Props) {
  if (!rows.length) return null;

  return (
    <div
      style={{
        padding: '20px 22px',
        background: '#0d2240',
        border: '1px solid #1a3a5c',
        borderRadius: 12,
        marginBottom: 20,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>
        CONTAMINANTS IN {cityName.toUpperCase()} WATER
      </div>
      {sourceNote ? (
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.55 }}>{sourceNote}</p>
      ) : null}

      {rows.map((c, i) => {
        const color = SEVERITY_COLOR[c.severity] ?? '#a8b4c4';
        const levelStr =
          c.level != null
            ? `${c.level} ${c.unit}${c.limit != null ? ` (EPA limit ${c.limit} ${c.unit})` : ''}`
            : '—';
        return (
          <div
            key={`${c.name}-${i}`}
            style={{
              padding: '14px 0',
              borderBottom: i < rows.length - 1 ? '1px solid #0f2336' : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{c.name}</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>{levelStr}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: `${color}20`,
                    color,
                  }}
                >
                  {STATUS_LABEL[c.severity] ?? c.severity}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#a8b4c4', margin: 0, lineHeight: 1.6 }}>{c.note}</p>
          </div>
        );
      })}

      <p style={{ fontSize: 12, color: '#64748b', margin: '14px 0 0', lineHeight: 1.5 }}>
        For your exact tap, use a ZIP report — home plumbing can differ from utility averages.
      </p>
    </div>
  );
}

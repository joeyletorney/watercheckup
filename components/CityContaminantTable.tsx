import type { ContaminantRow } from '@/lib/water-contaminants';
import { filterTechSummary } from '@/lib/contaminant-filter-tech';

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

function formatAvg(value: number, unit: string): string {
  const d = unit === 'ppm' ? 2 : unit === 'ppt' || unit === 'ppb' ? 2 : 1;
  return `${value.toFixed(d)} ${unit}`;
}

type Props = {
  cityName: string;
  stateCode?: string;
  rows: ContaminantRow[];
  sourceNote?: string;
};

export function CityContaminantTable({ cityName, stateCode, rows, sourceNote }: Props) {
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
        const tech =
          c.filterCarbon != null
            ? { carbon: c.filterCarbon, ro: c.filterRo!, ionExchange: c.filterIonExchange! }
            : null;

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
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>{levelStr}</span>
                {(c.ewgTimesOver ?? 0) >= 1 && c.ewgGuidelineLabel ? (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: '#7c1d1d44',
                      color: '#fca5a5',
                    }}
                  >
                    {c.ewgTimesOver}× health guideline
                  </span>
                ) : null}
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

            {(c.nationalAvg != null || c.stateAvg != null) && (
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.5 }}>
                {c.nationalAvg != null ? (
                  <span>U.S. utility avg: {formatAvg(c.nationalAvg, c.unit)}</span>
                ) : null}
                {c.nationalAvg != null && c.stateAvg != null ? ' · ' : null}
                {c.stateAvg != null && stateCode ? (
                  <span>{stateCode} utility avg: {formatAvg(c.stateAvg, c.unit)}</span>
                ) : null}
              </p>
            )}

            {c.ewgGuidelineLabel ? (
              <p style={{ fontSize: 12, color: '#fbbf24', margin: '0 0 6px', lineHeight: 1.5 }}>
                {c.ewgGuidelineLabel}
              </p>
            ) : null}

            {c.healthEffects ? (
              <p style={{ fontSize: 13, color: '#a8b4c4', margin: '0 0 6px', lineHeight: 1.6 }}>
                {c.healthEffects}
              </p>
            ) : (
              <p style={{ fontSize: 13, color: '#a8b4c4', margin: '0 0 6px', lineHeight: 1.6 }}>{c.note}</p>
            )}

            {tech ? (
              <p style={{ fontSize: 12, color: '#67e8f9', margin: 0, fontWeight: 600 }}>
                Removes with: {filterTechSummary(tech)}
              </p>
            ) : null}
          </div>
        );
      })}

      <p style={{ fontSize: 12, color: '#64748b', margin: '14px 0 0', lineHeight: 1.5 }}>
        U.S. and state averages from EWG Tap Water Atlas utilities in our database. For your exact tap, use a ZIP
        report — home plumbing can differ from utility averages.
      </p>
    </div>
  );
}

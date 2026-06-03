import { computeWaterScore, type CityPfasSnapshot } from '@/lib/city-water-score';

type Stat = { label: string; value: string; color: string };

type Props = {
  urgency: 'high' | 'medium' | 'low';
  issues: string[];
  pfas: CityPfasSnapshot;
  summary: string;
  stats?: Stat[];
};

/** Score + grade block for dedicated `/water/{city}` routes */
export function CityDedicatedScoreHero({ urgency, issues, pfas, summary, stats }: Props) {
  const ws = computeWaterScore(urgency, issues, pfas);

  return (
    <div
      style={{
        display: 'flex',
        gap: 20,
        alignItems: 'center',
        padding: '20px 24px',
        background: '#071828',
        border: `2px solid ${ws.scoreColor}30`,
        borderRadius: 16,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: ws.scoreColor, lineHeight: 1 }}>{ws.score}</div>
        <div style={{ fontSize: 13, color: '#a8b4c4' }}>/ 88</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: ws.gradeColor }}>{ws.grade}</div>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: ws.scoreColor, marginBottom: 6 }}>{ws.label}</div>
        <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>{summary}</p>
      </div>
      {stats && stats.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          {stats.map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center', padding: '8px 16px', background: '#0d2240', borderRadius: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color }}>{value}</div>
              <div style={{ fontSize: 13, color: '#a8b4c4' }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

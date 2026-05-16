'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { StateRankingRowSerializable } from '@/lib/water-rankings';

type SortKey = 'rank' | 'state' | 'grade' | 'atRisk' | 'safe' | 'worst';

const thBase: CSSProperties = {
  padding: '12px 10px',
  color: '#94a3b8',
  fontWeight: 800,
  fontSize: 10,
  letterSpacing: 0.8,
  borderBottom: '1px solid #1a3a5c',
  textAlign: 'left',
  cursor: 'pointer',
  userSelect: 'none',
  whiteSpace: 'nowrap',
};

function compare(a: StateRankingRowSerializable, b: StateRankingRowSerializable, key: SortKey, dir: number): number {
  let va: string | number;
  let vb: string | number;
  switch (key) {
    case 'rank':
      va = a.rank;
      vb = b.rank;
      break;
    case 'state':
      va = a.stateName;
      vb = b.stateName;
      break;
    case 'grade': {
      const order = (g: string) => {
        if (g === '—') return -1;
        const m: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, F: 4 };
        return m[g] ?? 99;
      };
      va = order(a.grade);
      vb = order(b.grade);
      break;
    }
    case 'atRisk':
      va = a.citiesAtRisk;
      vb = b.citiesAtRisk;
      break;
    case 'safe':
      va = a.citiesSafe;
      vb = b.citiesSafe;
      break;
    case 'worst':
      va = a.worstContaminant;
      vb = b.worstContaminant;
      break;
    default:
      return 0;
  }
  if (typeof va === 'number' && typeof vb === 'number') {
    if (va !== vb) return dir * (va - vb);
    return a.stateName.localeCompare(b.stateName);
  }
  const s = String(va).localeCompare(String(vb));
  if (s !== 0) return dir * s;
  return a.rank - b.rank;
}

export function RankingsTable({ rows }: { rows: StateRankingRowSerializable[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState(1);

  const sorted = useMemo(() => {
    const out = [...rows];
    out.sort((a, b) => compare(a, b, sortKey, sortDir));
    return out;
  }, [rows, sortKey, sortDir]);

  function header(label: string, key: SortKey) {
    const active = sortKey === key;
    return (
      <th
        style={{ ...thBase, color: active ? '#67e8f9' : '#94a3b8' }}
        onClick={() => {
          if (sortKey === key) setSortDir((d) => -d);
          else {
            setSortKey(key);
            setSortDir(key === 'state' || key === 'worst' ? 1 : key === 'rank' || key === 'grade' ? 1 : -1);
          }
        }}
      >
        {label}
        {active ? (sortDir > 0 ? ' ▲' : ' ▼') : ''}
      </th>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #1a3a5c' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#071828' }}>
            {header('RANK', 'rank')}
            {header('STATE', 'state')}
            {header('GRADE', 'grade')}
            {header('CITIES AT RISK', 'atRisk')}
            {header('CITIES SAFE', 'safe')}
            {header('WORST CONTAMINANT', 'worst')}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.stateAbbr} style={{ borderBottom: '1px solid #0f2336' }}>
              <td style={{ padding: '11px 10px', color: '#cbd5e1', fontWeight: 700 }}>{r.rank}</td>
              <td style={{ padding: '11px 10px' }}>
                {r.totalCities > 0 ? (
                  <Link href={`/water/state/${r.stateSlug}`} style={{ color: '#f1f5f9', fontWeight: 700, textDecoration: 'none' }}>
                    {r.stateName}
                  </Link>
                ) : (
                  <span style={{ color: '#64748b' }}>{r.stateName}</span>
                )}
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                  {r.totalCities > 0 ? `${r.totalCities} tracked` : 'No city data'}
                </div>
              </td>
              <td style={{ padding: '11px 10px' }}>
                <span style={{ fontWeight: 900, color: r.gradeColor, fontSize: 15 }}>{r.grade}</span>
                {r.totalCities > 0 && (
                  <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>({r.pctAtRisk}% at risk)</span>
                )}
              </td>
              <td style={{ padding: '11px 10px', color: r.citiesAtRisk > 0 ? '#f87171' : '#64748b' }}>{r.citiesAtRisk}</td>
              <td style={{ padding: '11px 10px', color: '#67e8f9' }}>{r.citiesSafe}</td>
              <td style={{ padding: '11px 10px', color: '#cbd5e1', fontSize: 12 }}>{r.worstContaminant}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

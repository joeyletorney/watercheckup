import Link from 'next/link';
import type { ContaminantRow } from '@/lib/water-contaminants';
import { getStateUtilityCount } from '@/lib/utilities-data';
import { USPS_STATE_NAMES } from '@/lib/us-state-names';

type Props = {
  cityName: string;
  stateCode: string;
  pwsid: string;
  rows: ContaminantRow[];
  pfasCompoundCount?: number;
};

function findLevel(rows: ContaminantRow[], name: string): string | null {
  const row = rows.find(r => r.name === name && r.level != null);
  if (!row || row.level == null) return null;
  return `${row.level} ${row.unit}`;
}

/** Tap Score–style local context stats above contaminant detail */
export function CityLocalWaterStats({
  cityName,
  stateCode,
  pwsid,
  rows,
  pfasCompoundCount = 0,
}: Props) {
  const stateLower = stateCode.toLowerCase();
  const utilityCount = getStateUtilityCount(stateLower);
  const stateLabel = USPS_STATE_NAMES[stateCode.toUpperCase()] ?? stateCode;
  const tthm = findLevel(rows, 'Total Trihalomethanes (TTHMs)');
  const haa5 = findLevel(rows, 'Haloacetic Acids (HAA5)');

  const stats = [
    utilityCount > 0
      ? { label: `Public water systems in ${stateLabel}`, value: utilityCount.toLocaleString() }
      : null,
    { label: 'EPA PWSID (this report)', value: pwsid },
    tthm ? { label: 'TTHMs (utility avg.)', value: tthm } : null,
    haa5 ? { label: 'HAA5 (utility avg.)', value: haa5 } : null,
    pfasCompoundCount > 0
      ? { label: 'PFAS compounds (UCMR5)', value: String(pfasCompoundCount) }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  if (!stats.length) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 10,
        marginBottom: 20,
      }}
    >
      {stats.map(({ label, value }) => (
        <div
          key={label}
          style={{
            padding: '12px 14px',
            background: 'rgba(8,145,178,0.06)',
            border: '1px solid rgba(8,145,178,0.22)',
            borderRadius: 10,
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
            {label}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#67e8f9', lineHeight: 1.2 }}>{value}</div>
        </div>
      ))}
      {utilityCount > 0 ? (
        <div
          style={{
            padding: '12px 14px',
            background: 'rgba(8,145,178,0.06)',
            border: '1px solid rgba(8,145,178,0.22)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Link
            href={`/utilities/${stateLower}`}
            style={{ fontSize: 12, fontWeight: 700, color: '#67e8f9', textDecoration: 'none' }}
          >
            Browse {stateLabel} utilities →
          </Link>
        </div>
      ) : null}
    </div>
  );
}

import type { ComparisonCell } from '@/lib/site-stats';

const ICON: Record<ComparisonCell['type'], string> = {
  yes: '✅',
  no: '❌',
  warn: '⚠️',
};

export function ComparisonCellDisplay({ cell }: { cell: ComparisonCell }) {
  return (
    <span className="wc-compare-cell">
      <span className={`wc-compare-icon wc-compare-icon--${cell.type}`} aria-hidden>
        {ICON[cell.type]}
      </span>
      {cell.text ? <span className="wc-compare-cell-text">{cell.text}</span> : null}
    </span>
  );
}

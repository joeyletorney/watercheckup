import Link from 'next/link';

export type CityRankingListItem = {
  slug: string;
  name: string;
  state: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  rightLabel: string;
  rightColor?: string;
};

type Props = {
  items: CityRankingListItem[];
  startRank?: number;
  highlightTop?: number;
};

export function CityRankingList({ items, startRank = 1, highlightTop = 5 }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 64, marginBottom: 64 }}>
      {items.map((item, i) => {
        const rank = startRank + i;
        const color = item.badgeColor ?? '#94a3b8';
        const isTop = i < highlightTop;
        return (
          <Link key={item.slug} prefetch href={`/water/${item.slug}`} style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: isTop ? '18px 20px' : '14px 16px',
                background: '#071828',
                border: `1px solid ${isTop ? `${color}50` : `${color}25`}`,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: isTop ? 22 : 17,
                  fontWeight: 900,
                  color: isTop ? color : '#94a3b8',
                  minWidth: 32,
                  textAlign: 'center',
                }}
              >
                #{rank}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontSize: isTop ? 16 : 14, fontWeight: 800, color: '#f1f5f9' }}>
                    {item.name}, {item.state}
                  </span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 5,
                        background: `${color}20`,
                        color,
                        letterSpacing: 0.5,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.subtitle && <div style={{ fontSize: 13, color: '#a8b4c4' }}>{item.subtitle}</div>}
              </div>
              <div
                style={{
                  fontSize: isTop ? 15 : 14,
                  fontWeight: 800,
                  color: item.rightColor ?? '#f87171',
                  flexShrink: 0,
                  textAlign: 'right',
                }}
              >
                {item.rightLabel}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

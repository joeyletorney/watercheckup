import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';
import { AffiliateLink } from '@/components/AffiliateLink';
import type { CityFilterPick } from '@/lib/city-filter-picks';

type Props = {
  cityName: string;
  citySlug: string;
  picks: CityFilterPick[];
};

export function CityFilterPagePicks({ cityName, citySlug, picks }: Props) {
  if (!picks.length) return null;

  return (
    <div style={{ marginBottom: 64 }}>
      <AffiliateDisclosure />
      <div
        style={{
          padding: '20px 22px',
          background: 'linear-gradient(135deg,#071828,#04111e)',
          border: '1px solid #0891b2',
          borderRadius: 14,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, color: '#67e8f9', letterSpacing: 2, marginBottom: 14 }}>
          FILTER PICKS FOR {cityName.toUpperCase()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {picks.map((pick, i) => (
            <div
              key={pick.productId}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                padding: '14px 16px',
                background: i === 0 ? 'rgba(8,145,178,0.08)' : 'rgba(255,255,255,0.02)',
                borderRadius: 10,
                border: i === 0 ? '1px solid rgba(8,145,178,0.3)' : '1px solid #0f2336',
              }}
            >
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#cbd5e1' }}>#{i + 1}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{pick.product}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: 1,
                      background: i === 0 ? '#0891b2' : '#1e3a5f',
                      color: '#fff',
                      padding: '2px 7px',
                      borderRadius: 4,
                    }}
                  >
                    {pick.badge}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 2 }}>
                  {pick.brand}
                  {pick.certs.length ? ` · ${pick.certs.join(', ')}` : ''}
                </div>
                <p style={{ fontSize: 13, color: '#cbd5e1', margin: '6px 0 0', lineHeight: 1.55 }}>{pick.reason}</p>
              </div>
              <AffiliateLink
                href={pick.href}
                product={pick.product}
                destination={pick.destination}
                page="best-water-filter"
                brand={pick.brand}
                city={citySlug}
                productId={String(pick.productId)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="wc-buy-cta"
              >
                {pick.buyLabel}
              </AffiliateLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { TRUSTED_FILTER_CATEGORIES } from '@/lib/trusted-filter-categories';
import {
  clearlyFilteredDirectUrl,
  isClearlyFilteredBrand,
  isWaterdropBrand,
  resolveAffiliateAmazonUrl,
  waterdropDirectUrl,
} from '@/lib/waterdrop-buy';

export type TrustedFilterProduct = {
  id: number;
  name: string;
  brand: string;
  price: number;
  cert?: string[];
  catLabel?: string;
  amazon?: string;
  brandLink?: string;
  outOfStock?: boolean;
};

function certLine(certs?: string[]) {
  if (!certs?.length) return '';
  return certs
    .slice(0, 4)
    .map((c) => c.replace('NSF/ANSI ', 'NSF ').replace('NSF ', 'NSF '))
    .join(' · ');
}

function brandSiteLabel(brand: string): string {
  if (brand === 'Clearly Filtered') return 'ClearlyFiltered.com →';
  return 'Brand site →';
}

function PickBuyButtons({ p }: { p: TrustedFilterProduct }) {
  if (p.outOfStock) {
    return p.brandLink ? (
      <a
        href={p.brandLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#f59e0b',
          padding: '7px 12px',
          borderRadius: 7,
          textDecoration: 'none',
          border: '1px solid rgba(245,158,11,0.35)',
          background: 'rgba(245,158,11,0.08)',
        }}
      >
        Often out of stock — {brandSiteLabel(p.brand)}
      </a>
    ) : (
      <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>Often out of stock — check brand site</span>
    );
  }

  const direct = isWaterdropBrand(p.brand) ? waterdropDirectUrl(p.id) : undefined;
  const clearlyDirect = isClearlyFilteredBrand(p.brand)
    ? clearlyFilteredDirectUrl(p.brandLink)
    : undefined;
  const amazon = resolveAffiliateAmazonUrl(p.brand, p.amazon);

  if (isClearlyFilteredBrand(p.brand) && clearlyDirect) {
    return (
      <a
        href={clearlyDirect}
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: '#0f172a',
          padding: '7px 12px',
          borderRadius: 7,
          textDecoration: 'none',
          background: 'linear-gradient(135deg,#10b981,#059669)',
        }}
      >
        ClearlyFiltered.com →
      </a>
    );
  }

  if (isWaterdropBrand(p.brand) && direct) {
    return (
      <a
        href={direct}
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: '#0f172a',
          padding: '7px 12px',
          borderRadius: 7,
          textDecoration: 'none',
          background: 'linear-gradient(135deg,#22d3ee,#06b6d4)',
        }}
      >
        Waterdrop.com →
      </a>
    );
  }

  if (p.brandLink && !amazon) {
    return (
      <a
        href={p.brandLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: '#0f172a',
          padding: '7px 12px',
          borderRadius: 7,
          textDecoration: 'none',
          background: 'linear-gradient(135deg,#f59e0b,#d97706)',
        }}
      >
        {brandSiteLabel(p.brand)}
      </a>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {amazon ? (
        <a
          href={amazon}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#cbd5e1',
            padding: '7px 12px',
            borderRadius: 7,
            textDecoration: 'none',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          Amazon →
        </a>
      ) : null}
    </div>
  );
}

type Props = {
  productsById: Record<number, TrustedFilterProduct | undefined>;
};

export function TrustedFilterCategories({ productsById }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div style={{ marginBottom: 96 }}>
      <div className="wc-home-section-eyebrow" style={{ marginBottom: 6 }}>
        MOST TRUSTED FILTERS
      </div>
      <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.55, margin: '0 0 18px' }}>
        Pick a category to see our top certified options — compare a short list, then choose what fits your home.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TRUSTED_FILTER_CATEGORIES.map((cat) => {
          const open = openId === cat.id;
          const picks = cat.productIds
            .map((id) => productsById[id])
            .filter((p): p is TrustedFilterProduct => !!p);

          return (
            <div
              key={cat.id}
              style={{
                borderRadius: 12,
                border: `1px solid ${open ? `${cat.accent}55` : `${cat.accent}30`}`,
                borderTop: `2px solid ${cat.accent}`,
                background: 'linear-gradient(165deg,rgba(7,24,40,0.95),rgba(4,14,32,0.92))',
                overflow: 'hidden',
              }}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : cat.id)}
                aria-expanded={open}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '16px 18px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: '#e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }} aria-hidden>
                    {cat.emoji}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: 13, color: '#a8b4c4' }}>
                      {picks.length} expert picks · {cat.summary}
                    </div>
                  </div>
                </div>
                <span style={{ color: cat.accent, fontSize: 18, flexShrink: 0 }} aria-hidden>
                  {open ? '▾' : '▸'}
                </span>
              </button>

              {open && picks.length > 0 ? (
                <div
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    padding: '8px 14px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {picks.map((p, idx) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: idx === 0 ? `${cat.accent}10` : 'rgba(255,255,255,0.02)',
                        border: idx === 0 ? `1px solid ${cat.accent}35` : '1px solid #0f2336',
                      }}
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: cat.accent }}>#{idx + 1}</span>
                            {idx === 0 ? (
                              <span
                                style={{
                                  fontSize: 9,
                                  fontWeight: 800,
                                  letterSpacing: 1,
                                  color: cat.accent,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: `${cat.accent}18`,
                                  border: `1px solid ${cat.accent}40`,
                                }}
                              >
                                TOP PICK
                              </span>
                            ) : null}
                            {p.catLabel ? (
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>{p.catLabel}</span>
                            ) : null}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0', marginBottom: 2 }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: 12, color: '#a8b4c4', marginBottom: 4 }}>
                            {p.brand}
                            {certLine(p.cert) ? ` · ${certLine(p.cert)}` : ''}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b', marginBottom: 8 }}>
                            ${p.price}
                          </div>
                          <PickBuyButtons p={p} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 4px 0', lineHeight: 1.5 }}>
                    Ranked by NSF/WQA certifications, fit for this category, and value — not paid placement order.
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <p
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: '#cbd5e1',
          marginTop: 12,
          lineHeight: 1.55,
          maxWidth: 720,
        }}
      >
        * Affiliate links — we may earn a commission at no cost to you. Our recommendations are based on certifications and data, not paid placements.
      </p>
    </div>
  );
}

'use client';

import Image from 'next/image';

export const FILTER_REC_IMAGE = '/watersplash.jpg';
export const FILTER_REC_ALT = 'Clean water splash — certified water filter recommendations';

const BANNER_STYLES = `
  .wc-filter-rec-banner {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 12px;
    margin-bottom: 20px;
  }
  @media (min-width: 768px) {
    .wc-filter-rec-banner {
      height: 300px;
    }
  }
  .wc-filter-rec-accent-wrap {
    overflow: hidden;
  }
  .wc-filter-rec-accent {
    display: block;
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 12px;
    margin: 0 0 16px;
    object-fit: cover;
  }
  @media (min-width: 768px) {
    .wc-filter-rec-accent {
      float: right;
      width: 400px;
      max-width: 400px;
      margin: 0 0 16px 24px;
    }
  }
`;

export function FilterRecommendationsBanner({ style }: { style?: React.CSSProperties }) {
  return (
    <>
      <style>{BANNER_STYLES}</style>
      <div className="wc-filter-rec-banner" style={style} aria-label="Certified filter recommendations">
        <Image
          src={FILTER_REC_IMAGE}
          alt={FILTER_REC_ALT}
          fill
          priority
          sizes="(max-width: 960px) 100vw, 960px"
          style={{ objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
          }}
          aria-hidden
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 24px',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(22px, 4vw, 30px)',
              fontWeight: 900,
              color: '#f1f5f9',
              lineHeight: 1.15,
              margin: '0 0 10px',
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            Certified Filter Recommendations
          </h2>
          <p
            style={{
              fontSize: 'clamp(14px, 2.2vw, 17px)',
              color: '#e2e8f0',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: 480,
              textShadow: '0 1px 8px rgba(0,0,0,0.35)',
            }}
          >
            Matched to what&apos;s actually in your water
          </p>
        </div>
      </div>
    </>
  );
}

export function FilterRecommendationsAccent() {
  return (
    <>
      <style>{BANNER_STYLES}</style>
      <Image
        src={FILTER_REC_IMAGE}
        alt={FILTER_REC_ALT}
        width={400}
        height={267}
        className="wc-filter-rec-accent"
        style={{ objectFit: 'cover' }}
      />
    </>
  );
}

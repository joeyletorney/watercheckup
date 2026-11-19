import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';
import { BlogTopPicks } from '@/components/BlogTopPicks';
import { getTopPicksForSegment } from '@/lib/blog-top-picks';

const PAGE = '/blog/best-shower-filter-2026';

/** Skimmable TikTok landing block: honest one-screen answer plus tracked picks. */
export function ShowerGuideQuickPicks() {
  return (
    <div id="top-picks" style={{ margin: '0 0 40px' }}>
      <div
        style={{
          margin: '0 0 24px',
          padding: '18px 22px',
          background: '#0d2240',
          border: '1px solid #1a3a5c',
          borderRadius: 10,
          fontSize: 15,
          color: '#cbd5e1',
          lineHeight: 1.75,
        }}
      >
        <strong style={{ color: '#e2e8f0', fontWeight: 700 }}>Quick answer. </strong>
        Shower filters can reduce <strong style={{ color: '#e2e8f0', fontWeight: 700 }}>free chlorine</strong> when
        they use KDF or carbon media. <strong style={{ color: '#e2e8f0', fontWeight: 700 }}>Vitamin C</strong> reduces
        chloramine better than KDF at shower contact times. They do{' '}
        <strong style={{ color: '#e2e8f0', fontWeight: 700 }}>not</strong> remove lead or PFAS, and they do{' '}
        <strong style={{ color: '#e2e8f0', fontWeight: 700 }}>not</strong> soften hard water. NSF/ANSI 177 is the
        shower-filter chlorine standard — confirm the exact model. Check your ZIP first: many cities use chloramine,
        not chlorine.
        <ul style={{ margin: '12px 0 0', paddingLeft: 20 }}>
          <li>
            <strong style={{ color: '#e2e8f0', fontWeight: 700 }}>Chlorine, budget: </strong>
            AquaBliss SF100 (KDF/GAC)
          </li>
          <li>
            <strong style={{ color: '#e2e8f0', fontWeight: 700 }}>Chlorine, NSF 177 listings: </strong>
            AquaTru Shower Filter
          </li>
          <li>
            <strong style={{ color: '#e2e8f0', fontWeight: 700 }}>Chloramine: </strong>
            vitamin C (Sonaki-style) — not a KDF-only cartridge
          </li>
        </ul>
      </div>
      <BlogTopPicks
        picks={getTopPicksForSegment('shower')}
        subtitle="Shower filters — chlorine, chloramine, and what they cannot do"
        page={PAGE}
      />
      <AffiliateDisclosure style={{ marginTop: 8 }} />
    </div>
  );
}

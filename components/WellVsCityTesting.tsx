import Link from 'next/link';
import type { WellVsCityGuide } from '@/lib/well-vs-city-testing';

type Props = {
  guide: WellVsCityGuide;
};

/** Visible well-vs-city testing block for city pages without a custom testing guide. */
export function WellVsCityTesting({ guide }: Props) {
  return (
    <section style={{ margin: '0 0 72px', padding: '22px 24px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
        {guide.eyebrow}
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.25, margin: '0 0 12px' }}>
        {guide.title}
      </h2>
      <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 18px' }}>{guide.intro}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
        {guide.sections.map((section) => (
          <div key={section.heading} style={{ padding: '16px 18px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0', margin: '0 0 8px', lineHeight: 1.35 }}>
              {section.heading}
            </h3>
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>{section.body}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {guide.links.map((link) => {
          const style = {
            fontSize: 13,
            fontWeight: 700,
            color: '#67e8f9',
            textDecoration: 'none',
            padding: '7px 10px',
            background: 'rgba(8,145,178,0.12)',
            borderRadius: 8,
          } as const;
          return link.external ? (
            <a key={`${link.href}-${link.label}`} href={link.href} target="_blank" rel="noopener noreferrer" style={style}>
              {link.label} →
            </a>
          ) : (
            <Link prefetch key={`${link.href}-${link.label}`} href={link.href} style={style}>
              {link.label} →
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default WellVsCityTesting;

import Link from 'next/link';
import type { CityLocalSearchIntent } from '@/lib/city-water-testing';

type Props = {
  guide: CityLocalSearchIntent;
};

/**
 * Reusable “How to test your water in <place>” block for city and utility pages.
 */
export function HowToTestYourWater({ guide }: Props) {
  return (
    <section style={{ margin: '0 0 72px', padding: '22px 24px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
        {guide.eyebrow}
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.25, margin: '0 0 12px' }}>
        {guide.title}
      </h2>
      <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 18px' }}>
        {guide.intro}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
        {guide.sections.map((section) => (
          <div key={section.heading} style={{ padding: '16px 18px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0', margin: '0 0 8px', lineHeight: 1.35 }}>
              {section.heading}
            </h3>
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>
              {section.body}
            </p>
            {section.sources && section.sources.length > 0 ? (
              <p style={{ fontSize: 13, margin: '10px 0 0', lineHeight: 1.7 }}>
                {section.sources.map((source, index) => (
                  <span key={`${source.href}-${source.label}`}>
                    {index > 0 ? ' · ' : null}
                    {source.external ? (
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#67e8f9', fontWeight: 600, textDecoration: 'none' }}
                      >
                        {source.label} →
                      </a>
                    ) : (
                      <Link
                        prefetch
                        href={source.href}
                        style={{ color: '#67e8f9', fontWeight: 600, textDecoration: 'none' }}
                      >
                        {source.label} →
                      </Link>
                    )}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {guide.links.map((link) => {
          const external = /^https?:\/\//.test(link.href);
          const style = {
            fontSize: 13,
            fontWeight: 700,
            color: '#67e8f9',
            textDecoration: 'none',
            padding: '7px 10px',
            background: 'rgba(8,145,178,0.12)',
            borderRadius: 8,
          } as const;
          return external ? (
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

export default HowToTestYourWater;

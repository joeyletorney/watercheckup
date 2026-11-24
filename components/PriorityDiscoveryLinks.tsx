import Link from 'next/link';
import { crawlHubLinks } from '@/lib/internal-hub-links';

type Props = {
  title?: string;
  /** Extra classes or compact padding for rankings / water hub. */
  compact?: boolean;
};

/**
 * Visible internal links for pages Google has not indexed or recrawled.
 * Intended below the fold on crawl hubs — not in the homepage hero.
 */
export function PriorityDiscoveryLinks({
  title = 'Guides, states, and latest reports',
  compact = false,
}: Props) {
  const { guides, places, latestBlog } = crawlHubLinks();
  const groups = [
    { heading: 'Guides', links: guides },
    { heading: 'Places', links: places },
    { heading: 'Latest from the blog', links: latestBlog },
  ];

  return (
    <section
      aria-label={title}
      style={{
        margin: compact ? '0 0 40px' : '0 0 56px',
        padding: compact ? '16px 18px' : '20px 22px',
        background: 'rgba(8,145,178,0.08)',
        border: '1px solid rgba(8,145,178,0.28)',
        borderRadius: 14,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: '#67e8f9',
          letterSpacing: 1.4,
          marginBottom: 14,
        }}
      >
        {title.toUpperCase()}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 18,
        }}
      >
        {groups.map((group) => (
          <div key={group.heading}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>
              {group.heading}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {group.links.map((link) => (
                <li key={`${group.heading}-${link.href}`}>
                  <Link
                    prefetch
                    href={link.href}
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#67e8f9',
                      textDecoration: 'none',
                      lineHeight: 1.45,
                    }}
                  >
                    {link.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

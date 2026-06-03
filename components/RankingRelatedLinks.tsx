import Link from 'next/link';

type LinkItem = { href: string; label: string; desc: string };

const DEFAULT_LINKS: LinkItem[] = [
  { href: '/worst', label: 'All rankings hub', desc: 'PFAS, lead, hardness, states, and more' },
  { href: '/rankings', label: 'State rankings', desc: 'Compare all 50 states by UCMR5 risk share' },
  { href: '/', label: 'Check your ZIP', desc: 'Live EPA compliance score for your utility' },
];

type Props = {
  links?: LinkItem[];
  title?: string;
};

export function RankingRelatedLinks({ links = DEFAULT_LINKS, title = 'More rankings' }: Props) {
  return (
    <div style={{ marginTop: 72 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              display: 'block',
              padding: '14px 16px',
              background: '#0d2240',
              border: '1px solid #1a3a5c',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>{l.label} →</div>
            <div style={{ fontSize: 13, color: '#a8b4c4' }}>{l.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

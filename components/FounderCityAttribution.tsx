import Link from 'next/link';

export function FounderCityAttribution() {
  return (
    <p
      style={{
        margin: '32px 0 0',
        paddingTop: 24,
        borderTop: '1px solid #1a3a5c',
        fontSize: 13,
        color: '#64748b',
        lineHeight: 1.65,
        textAlign: 'center',
      }}
    >
      Data reviewed by{' '}
      <Link href="/about" style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
        Joe Letorney
      </Link>
      , 30-year water treatment specialist →
    </p>
  );
}

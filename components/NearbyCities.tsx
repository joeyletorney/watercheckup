import Link from 'next/link';

export type NearbyCityItem = {
  name: string;
  slug: string;
  state: string;
};

type Props = {
  currentSlug: string;
  currentState: string;
  allCities: NearbyCityItem[];
  maxResults?: number;
};

/**
 * Renders a "Nearby / Related Cities" internal linking module.
 * Priority: same state first, then fills remaining slots with other cities.
 */
export function NearbyCities({
  currentSlug,
  currentState,
  allCities,
  maxResults = 8,
}: Props) {
  const sameState = allCities.filter(
    (c) => c.state === currentState && c.slug !== currentSlug
  );
  const others = allCities.filter(
    (c) => c.state !== currentState && c.slug !== currentSlug
  );
  const combined = [...sameState, ...others].slice(0, maxResults);

  if (combined.length === 0) return null;

  return (
    <section style={{ marginTop: 48 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#cbd5e1',
          letterSpacing: 2,
          margin: '0 0 14px',
        }}
      >
        WATER QUALITY IN NEARBY CITIES
      </h2>
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 10,
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {combined.map((c) => (
          <li key={c.slug}>
            <Link
              prefetch
              href={`/water/${c.slug}`}
              style={{
                display: 'block',
                padding: '12px 14px',
                background: '#0d2240',
                border: '1px solid #1a3a5c',
                borderRadius: 8,
                textDecoration: 'none',
                color: '#22d3ee',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {c.name}, {c.state}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NearbyCities;

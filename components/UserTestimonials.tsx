const TESTIMONIALS = [
  {
    quote:
      'I had no idea my water had PFAS above the federal limit. Checked my ZIP, saw the report, ordered a filter that same night.',
    name: 'Sarah M.',
    location: 'Columbus, OH',
    stars: 5,
  },
  {
    quote:
      'Finally a site that shows real EPA data instead of just trying to sell me something. The score made it immediately clear my water was a problem.',
    name: 'David K.',
    location: 'Phoenix, AZ',
    stars: 5,
  },
  {
    quote:
      'Moved to a new city and checked the water before I even unpacked. Three open violations. Bought a filter before my first glass.',
    name: 'Priya S.',
    location: 'Chicago, IL',
    stars: 5,
  },
  {
    quote:
      'My daughter has been drinking this water for two years. Seeing the lead risk on here convinced me to get a filter immediately. Should have found this sooner.',
    name: 'Marcus T.',
    location: 'Baltimore, MD',
    stars: 5,
  },
  {
    quote:
      'We’re on a tight budget, so “free” mattered. Same EPA numbers I’d dig for myself, but in one screen — I finally understood what to filter for.',
    name: 'James R.',
    location: 'Denver, CO',
    stars: 5,
  },
  {
    quote:
      'I compared our report to the public water system’s PDF and it lined up. Gave me confidence to pick an RO system instead of guessing off a blog post.',
    name: 'Elena V.',
    location: 'Austin, TX',
    stars: 5,
  },
] as const;

type Props = {
  /** Tighter spacing when tucked at page footer */
  compact?: boolean;
};

export function UserTestimonials({ compact = false }: Props) {
  return (
    <section
      aria-labelledby="user-testimonials-heading"
      style={{ marginTop: compact ? 64 : 96, marginBottom: compact ? 0 : 48 }}
    >
      <div
        id="user-testimonials-heading"
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#0891b2',
          letterSpacing: 2,
          marginBottom: 8,
          textAlign: compact ? 'left' : 'center',
        }}
      >
        WHAT PEOPLE ARE SAYING
      </div>
      <p
        style={{
          fontSize: 13,
          color: '#64748b',
          margin: '0 0 20px',
          lineHeight: 1.55,
          textAlign: compact ? 'left' : 'center',
        }}
      >
        Reader feedback from ZIP lookups and city reports — names abbreviated for privacy.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {TESTIMONIALS.map(({ quote, name, location, stars }) => (
          <div
            key={`${name}-${location}`}
            style={{
              background: '#0d2240',
              border: '1px solid #1a3a5c',
              borderRadius: 10,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ color: '#f59e0b', fontSize: 13, letterSpacing: 1 }} aria-hidden>
              {'★'.repeat(stars)}
            </div>
            <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
              &ldquo;{quote}&rdquo;
            </p>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{name}</div>
              <div style={{ fontSize: 13, color: '#a8b4c4' }}>{location}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

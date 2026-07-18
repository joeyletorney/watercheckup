type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  slug: string;
  faqs: FAQItem[];
};

/**
 * Visible FAQ block + matching FAQPage schema.
 * Usage: <CityFAQ slug="gaithersburg" faqs={gaithersburgFAQs} />
 */
export function CityFAQ({ slug, faqs }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://watercheckup.com/water/${slug}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <section style={{ marginBottom: 72 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#0891b2',
          letterSpacing: 2,
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: '1px solid #0f2336',
        }}
      >
        FREQUENTLY ASKED QUESTIONS
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {faqs.map((f) => (
          <div
            key={f.question}
            style={{
              padding: '18px 20px',
              background: '#0d2240',
              border: '1px solid #1a3a5c',
              borderRadius: 12,
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>
              {f.question}
            </h3>
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>{f.answer}</p>
          </div>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}

export default CityFAQ;

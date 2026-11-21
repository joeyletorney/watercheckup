import { buildFaqPageSchema } from '@/lib/build-faq-schema';

export type PageFaqItem = { question: string; answer: string };

type Props = {
  faqs: PageFaqItem[];
  pageUrl: string;
  heading?: string;
};

/** Visible FAQ answers plus a single FAQPage JSON-LD block. */
export function PageFaq({ faqs, pageUrl, heading = 'Frequently asked questions' }: Props) {
  if (!faqs.length) return null;
  const schema = buildFaqPageSchema(
    faqs.map((faq) => ({ name: faq.question, text: faq.answer })),
    pageUrl,
  );

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
        {heading.toUpperCase()}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {faqs.map((faq) => (
          <div
            key={faq.question}
            style={{
              padding: '18px 20px',
              background: '#0d2240',
              border: '1px solid #1a3a5c',
              borderRadius: 12,
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>
              {faq.question}
            </h3>
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>{faq.answer}</p>
          </div>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}

export default PageFaq;

/** Normalize FAQ text for JSON-LD (Google can flag smart quotes / odd Unicode). */
function normalizeSchemaText(text: string): string {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .trim();
}

/** Single FAQPage JSON-LD block — one per page (Google rejects duplicates). */
export function buildFaqPageSchema(
  mainEntity: { name: string; text: string }[],
  pageUrl: string
) {
  const baseUrl = pageUrl.replace(/#.*$/, '').replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${baseUrl}#faq`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': baseUrl,
    },
    mainEntity: mainEntity.map(({ name, text }) => ({
      '@type': 'Question',
      name: normalizeSchemaText(name),
      acceptedAnswer: {
        '@type': 'Answer',
        text: normalizeSchemaText(text),
      },
    })),
  };
}

/** Single FAQPage JSON-LD block — one per page (Google rejects duplicates). */
export function buildFaqPageSchema(
  mainEntity: { name: string; text: string }[],
  id?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(id ? { '@id': id } : {}),
    mainEntity: mainEntity.map(({ name, text }) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text },
    })),
  };
}

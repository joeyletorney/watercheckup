type Props = {
  headline: string;
  slug: string;
  datePublished: string;
  dateModified: string;
};

/**
 * Article JSON-LD tied to the site author.
 * Usage:
 * <ArticleSchema
 *   headline="Gaithersburg Water Quality 2026 — WSSC Tap Water Report"
 *   slug="gaithersburg"
 *   datePublished="2026-01-01"
 *   dateModified="2026-07-17"
 * />
 */
export function ArticleSchema({ headline, slug, datePublished, dateModified }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    url: `https://watercheckup.com/water/${slug}`,
    author: {
      '@type': 'Person',
      name: 'Joe Letorney',
      url: 'https://watercheckup.com/about',
    },
    datePublished,
    dateModified,
    publisher: {
      '@type': 'Organization',
      name: 'WaterCheckup.com',
      url: 'https://watercheckup.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default ArticleSchema;

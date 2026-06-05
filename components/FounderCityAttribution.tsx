import { AuthorReviewBadge } from '@/components/AuthorReviewBadge';

export function FounderCityAttribution() {
  return (
    <div
      style={{
        margin: '32px 0 0',
        paddingTop: 24,
        borderTop: '1px solid #1a3a5c',
        textAlign: 'center',
      }}
    >
      <AuthorReviewBadge style={{ marginBottom: 0 }} />
    </div>
  );
}

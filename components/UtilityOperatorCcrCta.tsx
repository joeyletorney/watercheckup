import Link from 'next/link';

type Variant = 'public water system-footer' | 'city-footer' | 'state-directory';

type Props = {
  variant: Variant;
  utilityName?: string;
};

export function UtilityOperatorCcrCta({ variant, utilityName }: Props) {
  if (variant === 'state-directory') {
    return (
      <p className="wc-public water system-operator-cta wc-public water system-operator-cta--directory">
        Is your public water system listed?{' '}
        <Link prefetch href="/utilities/claim">Claim your free listing →</Link>
      </p>
    );
  }

  if (variant === 'city-footer') {
    return (
      <p className="wc-public water system-operator-cta wc-public water system-operator-cta--city">
        Water public water system operators:{' '}
        <Link prefetch href="/utilities/claim">Publish your official CCR on WaterCheckup free →</Link>
      </p>
    );
  }

  return (
    <p className="wc-public water system-operator-cta wc-public water system-operator-cta--public water system-footer">
      {utilityName ? (
        <>
          Water operator for {utilityName}?{' '}
          <Link prefetch href="/utilities/claim">Claim this listing and publish your 2026 CCR →</Link>
        </>
      ) : (
        <>
          Water public water system operator?{' '}
          <Link prefetch href="/utilities/claim">Claim your free listing →</Link>
        </>
      )}
    </p>
  );
}

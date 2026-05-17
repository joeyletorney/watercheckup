import Link from 'next/link';

type Variant = 'utility-footer' | 'city-footer' | 'state-directory';

type Props = {
  variant: Variant;
  utilityName?: string;
};

export function UtilityOperatorCcrCta({ variant, utilityName }: Props) {
  if (variant === 'state-directory') {
    return (
      <p className="wc-utility-operator-cta wc-utility-operator-cta--directory">
        Is your utility listed?{' '}
        <Link href="/utilities/claim">Claim your free listing →</Link>
      </p>
    );
  }

  if (variant === 'city-footer') {
    return (
      <p className="wc-utility-operator-cta wc-utility-operator-cta--city">
        Water utility operators:{' '}
        <Link href="/utilities/claim">Publish your official CCR on WaterCheckup free →</Link>
      </p>
    );
  }

  return (
    <p className="wc-utility-operator-cta wc-utility-operator-cta--utility-footer">
      {utilityName ? (
        <>
          Water operator for {utilityName}?{' '}
          <Link href="/utilities/claim">Claim this listing and publish your 2026 CCR →</Link>
        </>
      ) : (
        <>
          Water utility operator?{' '}
          <Link href="/utilities/claim">Claim your free listing →</Link>
        </>
      )}
    </p>
  );
}

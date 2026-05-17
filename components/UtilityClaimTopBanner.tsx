import Link from 'next/link';

type Props = {
  utilityName: string;
  reportYear?: number;
};

const DEFAULT_REPORT_YEAR = 2026;

export function UtilityClaimTopBanner({ utilityName, reportYear = DEFAULT_REPORT_YEAR }: Props) {
  return (
    <div className="wc-utility-claim-top-banner" role="note">
      <p>
        Water operator for <strong>{utilityName}</strong>? Claim this free listing and publish your {reportYear} CCR
        where your customers are already looking.{' '}
        <Link href="/utilities/claim">Claim Free →</Link>
      </p>
    </div>
  );
}

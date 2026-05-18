import Link from 'next/link';

import { getDaysUntilCcr2027 } from '@/lib/ccr-2027-deadline';

export function Ccr2027UrgencyBanner() {
  const days = getDaysUntilCcr2027();
  const dayLabel = days === 1 ? 'day' : 'days';

  return (
    <div className="wc-ccr-2027-urgency" role="note">
      <p>
        <span className="wc-ccr-2027-urgency__icon" aria-hidden>
          ⚠️
        </span>{' '}
        <strong>2027 CCR Deadline:</strong> {days} {dayLabel} away —{' '}
        <Link href="/utilities/claim">Publish your compliant CCR here for free →</Link>
      </p>
    </div>
  );
}

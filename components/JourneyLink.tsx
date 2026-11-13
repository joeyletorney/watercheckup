'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof Link> & {
  eventName: 'report_next_step' | 'guide_next_step' | 'guide_option_selected';
  step: string;
  page: string;
  reportStatus?: 'historical_only' | 'current_records_available';
};

export function JourneyLink({ eventName, step, page, reportStatus, onClick, ...props }: Props) {
  return <Link {...props} onClick={event => {
    window.gtag?.('event', eventName, { step, page, ...(reportStatus ? { report_status: reportStatus } : {}), transport_type: 'beacon' });
    onClick?.(event);
  }} />;
}

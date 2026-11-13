'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function GaPageView({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (!measurementId || typeof window.gtag !== 'function') return;
    // Track paths only: claim and other query strings may contain personal data.
    const path = pathname;
    if (prev.current === path) return;
    const location = `${window.location.origin}${pathname}`;
    const referrer = prev.current ? `${window.location.origin}${prev.current}` : document.referrer.split('?')[0].split('#')[0];
    // Update defaults too, so later quiz/click events do not inherit query-string personal data.
    window.gtag('set', { page_location: location, page_referrer: referrer });
    window.gtag('event', 'page_view', {
      send_to: measurementId,
      page_referrer: referrer,
      page_path: path,
      page_title: typeof document !== 'undefined' ? document.title : '',
      page_location: location,
    });
    prev.current = path;
  }, [pathname, measurementId]);

  return null;
}

'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function GaPageView({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (!measurementId || typeof window.gtag !== 'function') return;
    // Track paths only: claim and other query strings may contain personal data.
    const path = pathname;
    if (prev.current === path) return;
    prev.current = path;
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: typeof document !== 'undefined' ? document.title : '',
      page_location: typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : '',
    });
  }, [pathname, searchParams, measurementId]);

  return null;
}

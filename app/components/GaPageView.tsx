'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function GaPageView({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (!measurementId || typeof window.gtag !== 'function') return;
    const q = searchParams?.toString();
    const path = q ? `${pathname}?${q}` : pathname;
    if (prev.current === path) return;
    prev.current = path;
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: typeof document !== 'undefined' ? document.title : '',
      page_location: typeof window !== 'undefined' ? window.location.href : '',
    });
  }, [pathname, searchParams, measurementId]);

  return null;
}

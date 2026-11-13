'use client';

import { useEffect } from 'react';
import { trackWebVital } from '@/lib/web-vitals-tracking';

export function WebVitals() {
  useEffect(() => {
    let cancelled = false;
    const entryPath = window.location.pathname;
    const load = () => {
      void import('web-vitals').then(({ onCLS, onINP, onLCP }) => {
        if (cancelled) return;
        const report = (metric: Parameters<typeof trackWebVital>[0]) => trackWebVital(metric, entryPath);
        onCLS(report);
        onINP(report);
        onLCP(report);
      }).catch(() => { /* Measurement must not interrupt the visitor's journey. */ });
    };
    const timeout = window.setTimeout(load, 0);
    return () => { cancelled = true; window.clearTimeout(timeout); };
  }, []);
  return null;
}

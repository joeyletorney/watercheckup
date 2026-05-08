'use client';

import { useEffect, useRef, useState } from 'react';

/** Adds class when element enters viewport — pair with `.wc-reveal` / `.wc-showcase-section` CSS. */
export function useRevealOnScroll<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px', ...options }
    );

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- observer opts are stable for our usage
  }, []);

  return { ref, visible };
}

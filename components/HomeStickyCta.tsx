'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function HomeStickyCta() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById('wc-hero-anchor');
    if (!hero || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  return visible ? <div className="wc-home-sticky-cta">
    <span>Ready to compare filters?</span><Link href="#find-a-filter">Find a Filter →</Link>
  </div> : null;
}

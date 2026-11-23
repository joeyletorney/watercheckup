'use client';

import { useEffect, useState } from 'react';
import { WaterSearch } from '@/components/WaterSearch';

export function HomeStickyCta() {
  const [heroGone, setHeroGone] = useState(false);
  const [repeatVisible, setRepeatVisible] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observers: IntersectionObserver[] = [];
    const hero = document.getElementById('wc-hero-anchor');
    if (hero) {
      const heroObserver = new IntersectionObserver(([entry]) => setHeroGone(!entry.isIntersecting), { threshold: 0 });
      heroObserver.observe(hero);
      observers.push(heroObserver);
    }
    const repeat = document.getElementById('wc-zip-repeat');
    if (repeat) {
      const repeatObserver = new IntersectionObserver(([entry]) => setRepeatVisible(entry.isIntersecting), { threshold: 0.2 });
      repeatObserver.observe(repeat);
      observers.push(repeatObserver);
    }
    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return heroGone && !repeatVisible ? (
    <div className="wc-home-sticky-cta">
      <WaterSearch variant="compact" idPrefix="wc-sticky" />
    </div>
  ) : null;
}

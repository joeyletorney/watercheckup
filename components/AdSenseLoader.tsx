'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export const ADSENSE_CLIENT = 'ca-pub-7279843802894649';

let requested = false;

function idleArm(callback: () => void): () => void {
  const run = () => callback();
  const onIdle =
    typeof window.requestIdleCallback === 'function'
      ? window.requestIdleCallback(run, { timeout: 4000 })
      : window.setTimeout(run, 2500);
  return () => {
    if (typeof window.cancelIdleCallback === 'function' && typeof onIdle === 'number') {
      window.cancelIdleCallback(onIdle);
    } else {
      clearTimeout(onIdle as number);
    }
  };
}

/** Load AdSense only after idle or first interaction — never in the global layout. */
export function AdSenseLoader() {
  const [load, setLoad] = useState(requested);

  useEffect(() => {
    if (requested) {
      setLoad(true);
      return;
    }
    const arm = () => {
      requested = true;
      setLoad(true);
    };
    const cancelIdle = idleArm(arm);
    window.addEventListener('pointerdown', arm, { once: true, passive: true });
    window.addEventListener('keydown', arm, { once: true });
    window.addEventListener('scroll', arm, { once: true, passive: true });
    return () => {
      cancelIdle();
      window.removeEventListener('pointerdown', arm);
      window.removeEventListener('keydown', arm);
      window.removeEventListener('scroll', arm);
    };
  }, []);

  if (!load) return null;
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}

/** Existing page ad placeholder. Loads AdSense on this page only. */
export function AdSenseSlot({ slotId }: { slotId: string }) {
  return (
    <>
      <AdSenseLoader />
      <div
        id={slotId}
        style={{ margin: '0 0 20px', minHeight: 90, background: 'transparent', textAlign: 'center' }}
        aria-label="Advertisement"
      />
    </>
  );
}

'use client';

import { useEffect } from 'react';
import { trackAffiliateClick } from '@/lib/affiliate-tracking';

/** Cover sponsored links in server-rendered articles; explicit product handlers keep their richer metadata. */
export function AffiliateClickFallback() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.type === 'auxclick' && event.button !== 1) return;
      const target = event.target;
      const anchor = target instanceof Element ? target.closest<HTMLAnchorElement>('a[rel~="sponsored"]') : null;
      if (!anchor || (event.type === 'click' && anchor.dataset.wcAffiliateTracked === 'true')) return;
      let url: URL;
      try { url = new URL(anchor.href); } catch { return; }
      if (url.protocol !== 'https:' || url.origin === window.location.origin) return;
      const card = anchor.closest('article, li') || anchor.parentElement?.parentElement;
      const product = card?.querySelector('h3, h2')?.textContent?.trim() || anchor.getAttribute('aria-label') || anchor.textContent?.trim() || 'Sponsored link';
      const amazon = /(^|\.)amazon\.com$/.test(url.hostname);
      const simplelab = /(^|\.)(mytapscore\.com|simplelab\.com)$/.test(url.hostname) || (url.hostname.endsWith('awin1.com') && url.searchParams.get('awinmid') === '92253');
      trackAffiliateClick({
        product: product.slice(0, 100),
        destination: amazon ? 'amazon' : simplelab ? 'simplelab' : 'direct',
        brand: amazon ? 'Amazon' : simplelab ? 'Tap Score' : url.hostname,
        page: window.location.pathname,
        linkDomain: url.hostname,
      });
    };
    document.addEventListener('click', onClick);
    document.addEventListener('auxclick', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('auxclick', onClick);
    };
  }, []);
  return null;
}

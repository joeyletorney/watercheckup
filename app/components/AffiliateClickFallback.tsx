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
      const labeled = (anchor.getAttribute('data-product') || card?.querySelector('[data-product]')?.getAttribute('data-product') || '').trim();
      const heading = card?.querySelector('h3, h2, strong')?.textContent?.trim() || '';
      const product = (
        labeled
        || heading
        || anchor.getAttribute('aria-label')?.trim()
        || anchor.textContent?.trim()
        || url.pathname.split('/').filter(Boolean).pop()?.replace(/[-_]+/g, ' ')
        || url.hostname.replace(/^www\./, '')
        || 'unknown'
      ).slice(0, 100);
      const linkUrl = (anchor.getAttribute('data-affiliate-href') || '').trim() || url.href;
      const amazon = /(^|\.)amazon\.com$/.test(url.hostname);
      const simplelab = /(^|\.)(mytapscore\.com|simplelab\.com)$/.test(url.hostname) || (url.hostname.endsWith('awin1.com') && url.searchParams.get('awinmid') === '92253');
      trackAffiliateClick({
        product,
        destination: amazon ? 'amazon' : simplelab ? 'simplelab' : 'direct',
        brand: amazon ? 'Amazon' : simplelab ? 'Tap Score' : url.hostname,
        page: window.location.pathname,
        href: linkUrl,
        linkUrl,
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

import type { CSSProperties } from 'react';

/** ~1in gap between major page sections (matches --wc-section-gap in globals.css). */
export const WC_SECTION_GAP_PX = 96;

/** Shared dark-theme prose + section spacing for static guide pages. */
export const siteProse = {
  section: { marginBottom: WC_SECTION_GAP_PX } as CSSProperties,
  label: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 2,
    color: '#0891b2',
    marginBottom: 14,
    display: 'block',
  } as CSSProperties,
  h2: {
    fontSize: 22,
    fontWeight: 800,
    color: '#f1f5f9',
    margin: '0 0 18px',
  } as CSSProperties,
  p: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 1.85,
    margin: '0 0 22px',
  } as CSSProperties,
};

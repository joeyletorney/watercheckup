'use client';

import Link from 'next/link';
import { useRevealOnScroll } from './useRevealOnScroll';

/** Minimal tap vs filtered illustration — not literal lab data. */
function SimpleTapVsFiltered() {
  return (
    <div className="wc-simple-compare">
      <div className="wc-simple-compare-row">
        <span className="wc-simple-compare-label">Tap water</span>
        <div className="wc-simple-compare-track">
          <div className="wc-simple-compare-fill wc-simple-compare-fill--tap" />
        </div>
        <span className="wc-simple-compare-hint">Varies by city &amp; pipes</span>
      </div>
      <div className="wc-simple-compare-arrow">→</div>
      <div className="wc-simple-compare-row">
        <span className="wc-simple-compare-label">Filtered</span>
        <div className="wc-simple-compare-track">
          <div className="wc-simple-compare-fill wc-simple-compare-fill--filtered" />
        </div>
        <span className="wc-simple-compare-hint">Right filter for what tests found</span>
      </div>
    </div>
  );
}

export function HomeVisualShowcase() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`wc-showcase-trim ${visible ? 'wc-showcase-trim--visible' : ''}`}
      aria-labelledby="wc-showcase-trim-heading"
    >
      <h2 id="wc-showcase-trim-heading" className="wc-showcase-trim-title">
        Official records, plain English
      </h2>
      <p className="wc-showcase-trim-text">
        We pull from published drinking-water data—not scary rumors—then turn it into a score and filter ideas for{' '}
        <strong>your</strong> ZIP.
      </p>

      <div className="wc-showcase-trim-card">
        <p className="wc-showcase-trim-card-lead">Why filtration matters</p>
        <SimpleTapVsFiltered />
        <p className="wc-showcase-trim-disclaimer">Illustration only — your report uses real levels for your area.</p>
      </div>

      <p className="wc-showcase-trim-linkwrap">
        <Link href="/methodology">How we analyze water →</Link>
      </p>
    </section>
  );
}

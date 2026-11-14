'use client';

import { useState } from 'react';
import { estimateOwnershipCost, COUNTERTOP_COST_SCHEDULES } from '@/lib/filter-ownership-cost';
import { AffiliateLink } from './AffiliateLink';
import { JourneyLink } from './JourneyLink';

type Product = {
  id: 'brita' | 'aquatru'; name: string; fit: string; constraint: string; source: string; costSource: string;
  merchant: { href: string; label: string; brand: string; sponsored: boolean };
};
const PAGE = '/blog/best-countertop-water-filter';
const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

export function FilterComparisonTool({ products }: { products: Product[] }) {
  const [usage, setUsage] = useState('1');
  const [prices, setPrices] = useState<Record<string, string>>({ brita: '', aquatru: '' });
  const [included, setIncluded] = useState<Record<string, string>>({ brita: '', aquatru: '' });
  const [calculated, setCalculated] = useState(false);
  const [submitted, setSubmitted] = useState({ usage: '1', prices, included });
  const [error, setError] = useState('');
  const dirty = usage !== submitted.usage || products.some(p => prices[p.id] !== submitted.prices[p.id] || included[p.id] !== submitted.included[p.id]);
  return <section id="compare-costs" className="wc-cost-tool" aria-labelledby="cost-tool-heading">
    <p className="wc-cost-eyebrow">COMPARE TWO NO-PLUMBING OPTIONS</p>
    <h2 id="cost-tool-heading">Which setup fits your home and budget?</h2>
    <p>A compatible pitcher with the Elite OB06 cartridge is the simpler setup. AquaTru Classic adds powered reverse osmosis, tanks and more maintenance. Check each model’s exact reduction claims against your concern before choosing.</p>
    <details className="wc-cost-inputs"><summary>Personalize costs: water use, purchase price and included filters</summary>
    <noscript><p>Enable JavaScript to adjust costs. The default comparison and estimates remain available.</p></noscript>
    <form onSubmit={event => {
      event.preventDefault();
      if (!event.currentTarget.reportValidity()) return;
      const next = { usage, prices: { ...prices }, included: { ...included } };
      if (products.some(p => !estimateOwnershipCost(COUNTERTOP_COST_SCHEDULES[p.id], { gallonsPerDay: Number(usage), purchasePrice: prices[p.id].trim() === '' ? null : Number(prices[p.id]), starterIncluded: included[p.id] === '' ? null : included[p.id] === 'yes' }))) {
        setError('Check your water use and prices, then calculate again.'); return;
      }
      setSubmitted(next); setCalculated(true); setError('');
      window.gtag?.('event', 'comparison_calculate', { page: PAGE, comparison: 'brita_elite_aquatru_classic', transport_type: 'beacon' });
    }}>
      <label className="wc-cost-usage" htmlFor="cost-daily-use">Household drinking and cooking water (US gallons/day)
        <input id="cost-daily-use" type="number" inputMode="decimal" min="0.1" max="10" step="0.1" required value={usage} onChange={e => setUsage(e.target.value)} aria-describedby="cost-usage-help" />
      </label>
      <p id="cost-usage-help">Start with 1 gallon/day as an illustration, or enter your own use. This is finished drinking water, not whole-home use or RO feed water. 1 US gallon is about 3.8 liters.</p>
      <div className="wc-cost-products">{products.map(product => <fieldset key={product.id}>
        <legend>{product.name}</legend>
        <p className="wc-cost-fit">{product.fit}</p>
        <dl><div><dt>Installation and daily use</dt><dd>{product.constraint}</dd></div>
          <div><dt>Evidence to check</dt><dd><a href={product.source}>Read the exact model’s published evidence →</a></dd></div>
        </dl>
        <label htmlFor={`cost-price-${product.id}`}>Purchase price you found (USD, optional)
          <input id={`cost-price-${product.id}`} type="number" inputMode="decimal" min="0" max="20000" step="0.01" placeholder="Enter price" value={prices[product.id]} onChange={e => setPrices({ ...prices, [product.id]: e.target.value })} aria-describedby={`cost-price-help-${product.id}`} />
        </label>
        <p id={`cost-price-help-${product.id}`} className="wc-cost-hint">{product.id === 'brita' ? 'Use the compatible pitcher plus Elite cartridge price. The Brita link below is for replacement cartridges only. Enter 0 if you already own the pitcher.' : 'Use the exact Classic unit/bundle price. The merchant price is not supplied by this calculator.'}</p>
        <label htmlFor={`cost-included-${product.id}`}>Does that purchase include one fresh {product.id === 'brita' ? 'Elite cartridge' : 'set of all three Classic filters'}?
          <select id={`cost-included-${product.id}`} value={included[product.id]} onChange={e => setIncluded({ ...included, [product.id]: e.target.value })}>
            <option value="">I haven’t checked yet</option><option value="yes">Yes</option><option value="no">No</option>
          </select>
        </label>
      </fieldset>)}</div>
      <button className="wc-cost-calculate" type="submit">Calculate filter costs →</button>
      {error && <p role="alert">{error}</p>}
    </form>
    </details>
    <p className="wc-cost-status" role="status">{dirty ? 'Inputs changed. Calculate again to update the results.' : calculated ? 'Results updated for both options.' : 'Results below use 1 gallon/day. Add a price and confirm included filters for a first-year total.'}</p>
    <div className="wc-cost-results">{products.map(product => {
      const estimate = estimateOwnershipCost(COUNTERTOP_COST_SCHEDULES[product.id], { gallonsPerDay: Number(submitted.usage), purchasePrice: submitted.prices[product.id].trim() === '' ? null : Number(submitted.prices[product.id]), starterIncluded: submitted.included[product.id] === '' ? null : submitted.included[product.id] === 'yes' })!;
      return <article key={product.id} aria-labelledby={`cost-result-${product.id}`}>
        <h3 id={`cost-result-${product.id}`}>{product.name}</h3>
        <dl>
          <div><dt>First-year unit + filter purchases</dt><dd className={estimate.firstYearTotalCents === null ? 'wc-cost-pending' : 'wc-cost-total'}>{estimate.firstYearTotalCents === null ? 'Add a price and confirm included filters' : money(estimate.firstYearTotalCents)}</dd></div>
          <div><dt>Filter packs to buy in the first year</dt><dd>{estimate.firstYearFiltersCents === null ? 'Confirm what your purchase includes' : money(estimate.firstYearFiltersCents)}</dd></div>
          <div><dt>Long-term annual filter allowance</dt><dd className="wc-cost-total">{money(estimate.annualAllowanceCents)}<span> / year</span></dd></div>
        </dl>
        <details><summary>How this estimate is calculated</summary>
          <p>At {submitted.usage} US gallons/day, replace at the gallon limit or time limit, whichever comes first. First-year purchases round up to whole packs and count replacements before day 365. Unused cartridges carry into later years.</p>
          <ul>{COUNTERTOP_COST_SCHEDULES[product.id].map((filter, i) => <li key={filter.name}>{filter.name}: {money(filter.packPriceCents)} per {filter.packSize === 1 ? 'filter' : `${filter.packSize}-pack`}; {filter.gallons} gallons or {filter.months} months per cartridge. {estimate.cartridges[i].firstYearPacks !== null ? `${estimate.cartridges[i].firstYearPacks} pack(s) to buy in year one.` : ''}</li>)}</ul>
          <p>The annual allowance spreads cartridge costs over their rated life. It is not a prediction of next year’s checkout spending. Actual water quality and manufacturer instructions can require earlier changes.</p>
          <a href={product.costSource}>Check current cartridge prices →</a>
        </details>
        {product.merchant.sponsored
          ? <AffiliateLink className="wc-cost-buy" href={product.merchant.href} product={product.name} brand={product.merchant.brand} page={PAGE} destination="amazon" rel="sponsored noopener noreferrer" target="_blank">{product.merchant.label}</AffiliateLink>
          : <JourneyLink className="wc-cost-buy" href={product.merchant.href} eventName="guide_next_step" step="manufacturer_reference" page={PAGE}>{product.merchant.label}</JourneyLink>}
        {product.id === 'brita' && <p className="wc-cost-hint">Manufacturer reference; cartridges only. A compatible pitcher is separate.</p>}
      </article>;
    })}</div>
    <p className="wc-cost-exclusions"><strong>Budget estimate, not a complete ownership quote.</strong> Tax, shipping, water/sewer, electricity, cleaning, installation and pretreatment are extra. Bundles and discounts may change spending. No contaminant performance or savings is calculated. Document review; no hands-on testing claimed. Cartridge prices checked November 13, 2026.</p>
  </section>;
}

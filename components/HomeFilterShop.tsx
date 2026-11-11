'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AffiliateLink } from './AffiliateLink';
import { HOME_SHOPPING_CATEGORIES, homeShoppingProduct } from '@/lib/home-shopping';

function ProductPhoto({ product }: { product: NonNullable<ReturnType<typeof homeShoppingProduct>> }) {
  const [failed, setFailed] = useState(false);
  return <div className="wc-shop-product-image">{failed ? <span style={{ color: '#17384c', fontWeight: 800, fontSize: 13 }}>{product.brand}</span> : <Image src={product.img} alt={product.name} width={160} height={140} sizes="(max-width: 767px) 88px, 160px" onError={() => setFailed(true)} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />}</div>;
}

export function HomeFilterShop() {
  const [categoryId, setCategoryId] = useState<string>('no-install');
  const category = HOME_SHOPPING_CATEGORIES.find(c => c.id === categoryId)!;
  return <section id="find-a-filter" className="wc-shop" aria-labelledby="wc-shop-heading">
    <div className="wc-shop-heading-row"><div><p className="wc-home-section-eyebrow">FIND A FILTER</p><h2 id="wc-shop-heading">Choose what fits your home</h2><p>Start with installation, then check the exact model’s reduction claims for your concern.</p></div><Link href="/quiz" className="wc-shop-quiz">Help me choose: 3-question quiz →</Link></div>
    <div className="wc-shop-choices" role="group" aria-label="Filter installation options">{HOME_SHOPPING_CATEGORIES.map(c => <button key={c.id} type="button" aria-pressed={c.id === categoryId} aria-controls="wc-shop-products" onClick={() => setCategoryId(c.id)}>{c.label}</button>)}</div>
    <p className="wc-shop-category-note">{category.description} <Link href={category.guide}>Read the buying guide →</Link></p>
    <p className="wc-shop-disclosure">As an Amazon Associate I earn from qualifying purchases. Check current prices, model and availability on Amazon.</p>
    <div id="wc-shop-products" className="wc-shop-products" aria-label={category.label}>
      {category.picks.map(pick => {
        const product = homeShoppingProduct(pick.id);
        if (!product) return null;
        return <article className="wc-shop-card" key={pick.id}>
          <ProductPhoto key={product.id} product={product} />
          <div className="wc-shop-product-info"><p className="wc-shop-fit"><strong>Good for:</strong> {pick.fit}</p><h3>{product.name}</h3></div>
          <div className="wc-shop-decision"><p><strong>Why consider it:</strong> {pick.advantage}</p><p><strong>Trade-off:</strong> {pick.tradeoff}</p></div>
          <AffiliateLink href={product.amazon} target="_blank" rel="sponsored noopener noreferrer" product={product.name} brand={product.brand} destination="amazon" page="home-shop" className="wc-shop-buy" aria-label={`Check price on Amazon for ${product.name}`}>Check price on Amazon →</AffiliateLink>
          <details><summary>Evidence and ongoing costs</summary><p>{pick.limits}</p><p>{pick.upkeep}</p><a href={pick.evidenceUrl} target="_blank" rel="noopener noreferrer">Manufacturer specifications →</a><p><Link href={category.guide}>Compare evidence and maintenance →</Link></p></details>
        </article>;
      })}
    </div>
    <p className="wc-shop-help">Private well or uncertain water quality? <Link href="/well">Start with well-water testing guidance.</Link> Looking for hardness removal? <Link href="/blog/best-water-filter-hard-water">Compare softeners and drinking-water filters.</Link></p>
  </section>;
}

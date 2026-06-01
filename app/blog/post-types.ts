import type { ReactNode } from 'react';

export type TopPickRow = {
  product: string;
  brand: string;
  price: string;
  reason: string;
  link: string;
  amazon: string;
  badge?: string;
  /** Set true when this product is out of stock — it will be skipped and the next pick promoted automatically */
  outOfStock?: boolean;
};

export type PostSeo = {
  /** When set, used as the document `<title>` (absolute — root `title.template` is not applied). */
  title: string;
  description: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
  };
};

export type Post = {
  title: string;
  excerpt: string;
  /** Optional SERP / social overrides; on-page `title` + `excerpt` stay as-is. */
  seo?: PostSeo;
  date: string;
  dateDisplay: string;
  readTime: string;
  badge: string;
  badgeColor: string;
  topPicks: TopPickRow[];
  /** FAQ items — rendered on-page and as FAQPage JSON-LD */
  faq?: { q: string; a: string }[];
  content: ReactNode;
};

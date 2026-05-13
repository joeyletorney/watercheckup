import type { ReactNode } from 'react';

export type TopPickRow = {
  product: string;
  brand: string;
  price: string;
  reason: string;
  link: string;
  amazon: string;
  badge?: string;
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
  content: ReactNode;
};

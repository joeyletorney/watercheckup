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

export type Post = {
  title: string;
  excerpt: string;
  date: string;
  dateDisplay: string;
  readTime: string;
  badge: string;
  badgeColor: string;
  topPicks: TopPickRow[];
  content: ReactNode;
};

import type { ReactNode } from 'react';

export type Post = {
  title: string;
  excerpt: string;
  date: string;
  dateDisplay: string;
  readTime: string;
  badge: string;
  badgeColor: string;
  topPick: { label: string; product: string; reason: string; link: string; amazon: string };
  content: ReactNode;
};

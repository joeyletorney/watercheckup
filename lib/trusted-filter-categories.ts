/** Homepage “Most trusted filters” — category accordions (product IDs match HomeClient PRODUCTS). */

export type TrustedFilterCategory = {
  id: string;
  emoji: string;
  label: string;
  accent: string;
  summary: string;
  productIds: number[];
};

export const TRUSTED_FILTER_CATEGORIES: TrustedFilterCategory[] = [
  {
    id: 'overall-ro',
    emoji: '🏆',
    label: 'Best overall RO',
    accent: '#22d3ee',
    summary: 'Under-sink reverse osmosis — top NSF 58 picks',
    productIds: [3, 5, 47, 28, 27, 26],
  },
  {
    id: 'value-ro',
    emoji: '💎',
    label: 'Best value RO',
    accent: '#22d3ee',
    summary: 'Strong certification without overspending',
    productIds: [47, 26, 28, 3, 5, 27],
  },
  {
    id: 'renters',
    emoji: '🪣',
    label: 'Best for renters',
    accent: '#06b6d4',
    summary: 'No drilling — countertop, pitcher, plug-in',
    productIds: [6, 31, 29, 9, 10, 12],
  },
  {
    id: 'whole-house',
    emoji: '🏠',
    label: 'Best whole-house',
    accent: '#34d399',
    summary: 'Every tap and shower — carbon & sediment',
    productIds: [32, 19, 33],
  },
  {
    id: 'shower',
    emoji: '🚿',
    label: 'Best shower filters',
    accent: '#a78bfa',
    summary: 'Chlorine and hardness at the shower head',
    productIds: [20, 36],
  },
];

import { amazonDpUrl } from '@/lib/amazon-affiliate';
import type { AffiliateDestination } from '@/lib/affiliate-tracking';
import { clearlyFilteredAmazonUrl, WATERDROP_DIRECT_BY_ID, WATERDROP_G3P600_URL } from '@/lib/waterdrop-buy';

export type ConversionPick = {
  product: string;
  brand: string;
  reason: string;
  href: string;
  destination: AffiliateDestination;
};

const DEFAULT_PICKS: ConversionPick[] = [
  {
    product: 'Clearly Filtered 10-Cup Pitcher',
    brand: 'Clearly Filtered',
    reason: 'No-install pitcher. NSF 42/372 certified, with published lead and PFAS lab tests.',
    href: clearlyFilteredAmazonUrl(),
    destination: 'amazon',
  },
  {
    product: 'Waterdrop G3P600',
    brand: 'Waterdrop',
    reason: 'Tankless under-sink RO with NSF 42/53/58/372 listings.',
    href: WATERDROP_G3P600_URL,
    destination: 'direct',
  },
  {
    product: 'AquaTru Classic Countertop RO',
    brand: 'AquaTru',
    reason: 'Countertop reverse osmosis — no plumbing changes.',
    href: amazonDpUrl('B0CQS3HQ8F'),
    destination: 'amazon',
  },
];

const WHOLE_HOUSE_PICKS: ConversionPick[] = [
  {
    product: 'Aquasana Whole House WH-1000-B',
    brand: 'Aquasana',
    reason: 'Whole-house carbon for chlorine at every tap. Confirm the current WH-1000-B package.',
    href: amazonDpUrl('B00XAJJVHQ'),
    destination: 'amazon',
  },
  {
    product: 'iSpring WGB32B 3-Stage',
    brand: 'iSpring',
    reason: 'DIY whole-house sediment + dual carbon — NSF 42.',
    href: amazonDpUrl('B008GNRMYK'),
    destination: 'amazon',
  },
  {
    product: 'Waterdrop WHF3T-PG',
    brand: 'Waterdrop',
    reason: 'NSF 372 whole-house carbon with transparent housings and a pressure gauge.',
    href: WATERDROP_DIRECT_BY_ID[34] ?? WATERDROP_G3P600_URL,
    destination: 'direct',
  },
];

export function conversionPicksFor(kind: 'default' | 'wholeHouse' = 'default'): ConversionPick[] {
  return kind === 'wholeHouse' ? WHOLE_HOUSE_PICKS : DEFAULT_PICKS;
}

import Image from 'next/image';
import { CITY_HERO_IMAGE, cityHeroAlt } from '@/lib/unsplash-images';

type Props = {
  cityLabel: string;
};

export function CityPageHeroImage({ cityLabel }: Props) {
  return (
    <div className="city-page-hero-visual">
      <Image
        src={CITY_HERO_IMAGE}
        alt={cityHeroAlt(cityLabel)}
        width={72}
        height={72}
        sizes="72px"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}

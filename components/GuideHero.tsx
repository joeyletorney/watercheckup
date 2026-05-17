import { PageHeroBanner } from '@/components/PageHeroBanner';

type Props = {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  badge?: string;
  badgeColor?: string;
};

/** Standard inner-page hero with Unsplash photo and dark overlay. */
export function GuideHero({ src, alt, eyebrow, title, badge, badgeColor }: Props) {
  return (
    <PageHeroBanner src={src} alt={alt} priority maxHeight={320}>
      <p className="wc-page-hero-banner__eyebrow">{eyebrow}</p>
      <h1 className="wc-page-hero-banner__title">{title}</h1>
      {badge ? (
        <span
          className="wc-page-hero-banner__badge"
          style={
            badgeColor
              ? { borderColor: `${badgeColor}88`, color: badgeColor }
              : undefined
          }
        >
          {badge}
        </span>
      ) : null}
    </PageHeroBanner>
  );
}

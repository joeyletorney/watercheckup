import Image from 'next/image';
import { BLOG_DEFAULT_FEATURED, BLOG_DEFAULT_FEATURED_ALT, getBlogFeaturedImageUrl } from '@/lib/unsplash-images';

type Props = {
  slug: string;
  title: string;
  badge?: string;
  showTitle?: boolean;
};

export function BlogFeaturedImage({ slug, title, badge, showTitle = true }: Props) {
  const src = getBlogFeaturedImageUrl(slug, badge) || BLOG_DEFAULT_FEATURED;
  const alt = badge ? `${title} — ${badge} water quality article` : BLOG_DEFAULT_FEATURED_ALT;

  return (
    <figure className="wc-blog-featured">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={600}
        sizes="(max-width: 720px) 100vw, 720px"
        priority
        className="wc-blog-featured__img"
      />
      <div className="wc-blog-featured__overlay" aria-hidden />
      <div className="wc-blog-featured__gradient" aria-hidden />
      {showTitle ? (
        <figcaption className="wc-blog-featured__caption">
          <h1 className="wc-blog-featured__title">{title}</h1>
        </figcaption>
      ) : null}
    </figure>
  );
}

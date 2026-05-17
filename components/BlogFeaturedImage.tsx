import Image from 'next/image';
import { getBlogFeaturedImageUrl } from '@/lib/unsplash-images';

type Props = {
  slug: string;
  title: string;
  badge?: string;
};

export function BlogFeaturedImage({ slug, title, badge }: Props) {
  const src = getBlogFeaturedImageUrl(slug, badge);

  return (
    <figure className="wc-blog-featured" style={{ margin: '0 0 32px' }}>
      <Image
        src={src}
        alt={title}
        width={800}
        height={400}
        sizes="(max-width: 720px) 100vw, 720px"
        priority
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </figure>
  );
}

import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
};

/** Rounded content-section photo (no text overlay). */
export function ContentImage({ src, alt, width, height, priority = false, className }: Props) {
  return (
    <figure className={className ? `wc-content-photo ${className}` : 'wc-content-photo'}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 720px) 100vw, 720px"
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        className="wc-content-photo__img"
      />
    </figure>
  );
}

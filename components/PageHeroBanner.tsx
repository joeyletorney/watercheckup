import type { ReactNode } from 'react';
import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  maxHeight?: number;
  children?: ReactNode;
  bottomGradient?: boolean;
};

export function PageHeroBanner({
  src,
  alt,
  priority = false,
  className,
  maxHeight = 400,
  children,
  bottomGradient = true,
}: Props) {
  return (
    <div
      className={className ? `wc-page-hero-banner ${className}` : 'wc-page-hero-banner'}
      style={{ maxHeight }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 720px) 100vw, 880px"
        priority={priority}
        className="wc-page-hero-banner__img"
      />
      <div className="wc-page-hero-banner__overlay" aria-hidden />
      {bottomGradient ? <div className="wc-page-hero-banner__gradient" aria-hidden /> : null}
      {children ? <div className="wc-page-hero-banner__content">{children}</div> : null}
    </div>
  );
}

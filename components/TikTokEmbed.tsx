'use client';

import { useId, useState } from 'react';

type TikTokEmbedProps = {
  videoId: string;
  url: string;
  heading?: string;
};

export function TikTokEmbed({ videoId, url, heading }: TikTokEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const autoId = useId();
  const headingId = heading ? `tiktok-heading-${videoId}` : undefined;
  const title = heading ?? 'TikTok video';
  const embedSrc = `https://www.tiktok.com/embed/v2/${videoId}`;

  return (
    <section className="wc-tiktok-embed" aria-labelledby={headingId} data-tiktok-id={videoId}>
      {heading ? <h2 id={headingId} className="wc-tiktok-embed__heading">{heading}</h2> : null}
      <div className="wc-tiktok-embed__frame">
        {playing ? (
          <iframe
            src={embedSrc}
            title={title}
            allow="encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className="wc-tiktok-embed__facade"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            aria-describedby={`${autoId}-fallback`}
          >
            <span className="wc-tiktok-embed__play" aria-hidden>
              <svg viewBox="0 0 24 24" width="28" height="28" focusable="false">
                <path fill="currentColor" d="M8 5.14v13.72L19.5 12 8 5.14z" />
              </svg>
            </span>
            <span className="wc-tiktok-embed__hint">Play video</span>
          </button>
        )}
      </div>
      <p id={`${autoId}-fallback`} className="wc-tiktok-embed__fallback">
        <a href={url} target="_blank" rel="noopener">Watch on TikTok</a>
      </p>
    </section>
  );
}

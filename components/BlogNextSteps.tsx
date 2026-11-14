import type { ArticleNextSteps } from '@/lib/blog-next-steps';
import { JourneyLink } from './JourneyLink';

export function BlogNextSteps({ slug, guidance }: { slug: string; guidance: ArticleNextSteps }) {
  return <section className="wc-article-next" aria-labelledby="article-next-heading">
    <p className="wc-article-next-eyebrow">YOUR NEXT STEP</p>
    <h2 id="article-next-heading">{guidance.title}</h2>
    <p>{guidance.description}</p>
    <div className="wc-article-next-grid">{guidance.links.map(link => <JourneyLink
      key={link.step} href={link.href} prefetch={false} eventName="guide_next_step" step={link.step} page={`/blog/${slug}`}
    ><strong>{link.label} →</strong><span>{link.detail}</span></JourneyLink>)}</div>
  </section>;
}

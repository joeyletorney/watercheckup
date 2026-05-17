import Image from 'next/image';
import {
  HOW_IT_DATA,
  HOW_IT_FILTER,
  HOW_IT_ZIP,
} from '@/lib/unsplash-images';

const STEPS = [
  {
    title: 'Search by ZIP',
    body: 'Enter your ZIP or city — we match EPA monitoring data to your utility.',
    src: HOW_IT_ZIP,
    alt: 'Person searching location on a map for water quality data',
  },
  {
    title: 'See your data',
    body: 'Violations, PFAS detections, lead risk, and hardness in plain English.',
    src: HOW_IT_DATA,
    alt: 'Water quality report and analytics on a screen',
  },
  {
    title: 'Get filter guidance',
    body: 'Certified filter types matched to what is actually in your water.',
    src: HOW_IT_FILTER,
    alt: 'Under-sink water filtration system installation',
  },
] as const;

export function HowItWorksSteps() {
  return (
    <section className="wc-how-it-works" aria-labelledby="wc-how-it-works-heading">
      <p className="wc-how-it-works__eyebrow">HOW IT WORKS</p>
      <h2 id="wc-how-it-works-heading" className="wc-how-it-works__title">
        Your water report in three steps
      </h2>
      <div className="wc-how-it-works__grid">
        {STEPS.map((step, i) => (
          <div key={step.title} className="wc-how-it-works__card">
            <div className="wc-how-it-works__thumb">
              <Image
                src={step.src}
                alt={step.alt}
                width={400}
                height={280}
                sizes="(max-width: 640px) 80vw, 200px"
                loading="lazy"
                style={{ objectFit: 'cover' }}
              />
              <span className="wc-how-it-works__step-num" aria-hidden>
                {i + 1}
              </span>
            </div>
            <h3 className="wc-how-it-works__card-title">{step.title}</h3>
            <p className="wc-how-it-works__card-body">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

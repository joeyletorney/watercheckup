'use client';

import { useEffect, useState } from 'react';

import { getCcr2027CountdownParts, type Ccr2027CountdownParts } from '@/lib/ccr-2027-deadline';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function CountdownBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="wc-ccr-countdown__box">
      <div className="wc-ccr-countdown__value">{value}</div>
      <div className="wc-ccr-countdown__label">{label}</div>
    </div>
  );
}

export function Ccr2027CountdownBanner() {
  const [parts, setParts] = useState<Ccr2027CountdownParts>(() => getCcr2027CountdownParts());

  useEffect(() => {
    const tick = () => setParts(getCcr2027CountdownParts());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="wc-ccr-countdown" aria-label="2027 CCR Rule deadline countdown">
      <div className="wc-ccr-countdown__inner">
        <h2 className="wc-ccr-countdown__headline">2027 CCR Rule Deadline</h2>
        <p className="wc-ccr-countdown__sub">
          January 1, 2027 — New EPA requirements take effect. First compliant reports due July 1, 2027.
        </p>

        <div className="wc-ccr-countdown__grid" role="timer" aria-live="polite">
          <CountdownBox value={String(parts.days)} label="Days" />
          <CountdownBox value={pad(parts.hours)} label="Hours" />
          <CountdownBox value={pad(parts.minutes)} label="Minutes" />
          <CountdownBox value={pad(parts.seconds)} label="Seconds" />
        </div>

        <p className="wc-ccr-countdown__footer">
          The revised CCR Rule requires direct URL electronic delivery — WaterCheckup satisfies this requirement
          for free. Claim your listing before the deadline.
        </p>
      </div>
    </section>
  );
}

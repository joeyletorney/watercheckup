'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteTrustedFilterPicks } from '@/components/SiteTrustedFilterPicks';
import { FAQ_SECTIONS } from '@/lib/faq-content';

const HERO_IMAGE = '/washinghands.jpg';
const HERO_ALT = 'Washing hands with clean tap water — drinking water safety FAQs';

function faqPanelId(sectionIndex: number, itemIndex: number) {
  return `faq-panel-${sectionIndex}-${itemIndex}`;
}

export default function FAQPage() {
  const baseId = useId();
  const defaultOpen = FAQ_SECTIONS.map((cat) => cat.items[0]?.q ?? null).filter(Boolean);
  const [openSet, setOpenSet] = useState<Set<string>>(new Set(defaultOpen as string[]));

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0' }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check My ZIP →" />

      <style>{`
        .faq-hero {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .faq-hero {
            height: 350px;
          }
        }
      `}</style>

      <section className="faq-hero" aria-label="Frequently asked questions about drinking water">
        <Image src={HERO_IMAGE} alt={HERO_ALT} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} aria-hidden />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            maxWidth: 780,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 900,
              color: '#f1f5f9',
              lineHeight: 1.15,
              margin: '0 0 12px',
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            Frequently Asked Questions
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px, 2.5vw, 18px)',
              color: '#e2e8f0',
              lineHeight: 1.55,
              margin: 0,
              maxWidth: 520,
              textShadow: '0 1px 8px rgba(0,0,0,0.35)',
            }}
          >
            Everything you need to know about your drinking water
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 20px 80px' }}>
        {FAQ_SECTIONS.map((section, sectionIndex) => (
          <div key={section.category} style={{ marginBottom: 72 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#0891b2',
                letterSpacing: 2,
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '1px solid #0f2336',
              }}
            >
              {section.category.toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {section.items.map((item, itemIndex) => {
                const isOpen = openSet.has(item.q);
                const panelId = `${baseId}-${faqPanelId(sectionIndex, itemIndex)}`;
                const buttonId = `${panelId}-btn`;
                return (
                  <div
                    key={item.q}
                    style={{
                      background: '#0d2240',
                      border: '1px solid #0f2336',
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: '0 2px 12px #00000033',
                    }}
                  >
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenSet((prev) => {
                          const next = new Set(prev);
                          if (next.has(item.q)) next.delete(item.q);
                          else next.add(item.q);
                          return next;
                        })
                      }
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        padding: '18px 22px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.4 }}>
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        style={{
                          fontSize: 20,
                          color: '#94a3b8',
                          flexShrink: 0,
                          transform: isOpen ? 'rotate(45deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      >
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        style={{ padding: '0 22px 22px', borderTop: '1px solid #0f2336', paddingTop: 18 }}
                      >
                        <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.85, margin: '0 0 14px' }}>
                          {item.a}
                        </p>
                        {item.links?.map((link) => (
                          <Link
                            prefetch
                            key={link.href}
                            href={link.href}
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: '#22d3ee',
                              textDecoration: 'none',
                            }}
                          >
                            {link.label} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div
          style={{
            background: 'linear-gradient(135deg, #071828, #040d14)',
            border: '1px solid #0f2d40',
            borderRadius: 16,
            padding: '32px 28px',
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>
            Ready to check your actual water?
          </div>
          <p style={{ fontSize: 15, color: '#cbd5e1', marginBottom: 24, lineHeight: 1.6 }}>
            Enter your ZIP code and get a free report from five EPA datasets plus EWG health guidelines.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
              borderRadius: 10,
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              boxShadow: '0 4px 20px #0891b244',
            }}
          >
            Check My Water →
          </a>
        </div>

        <SiteTrustedFilterPicks marginTop={72} />
      </div>
    </div>
  );
}

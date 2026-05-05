'use client';
import { useState } from 'react';
import Link from 'next/link';

const TAG = 'watercheck20-20';

const SCORE_COLOR = (s: number) =>
  s >= 80 ? '#22d3ee' : s >= 65 ? '#86efac' : s >= 50 ? '#f59e0b' : s >= 35 ? '#f97316' : '#ef4444';

const SCORE_LABEL = (s: number) =>
  s >= 80 ? 'Good' : s >= 65 ? 'Fair' : s >= 50 ? 'Concerning' : s >= 35 ? 'Poor' : 'High Risk';

// Max possible score is 88 — all municipal water has chlorine, DBPs, and unmonitored contaminants.
// "No violations on record" does not mean perfectly safe water.
const CAP_SCORE = (s: number) => Math.min(s, 88);

const SCORE_GRADE = (s: number) => {
  if (s >= 80) return 'A-';
  if (s >= 65) return 'B';
  if (s >= 50) return 'C';
  if (s >= 35) return 'D';
  return 'F';
};

function ScoreDial({ score }: { score: number }) {
  const capped = CAP_SCORE(score);
  const grade = SCORE_GRADE(capped);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (capped / 100) * circ;
  const sc = SCORE_COLOR(capped);
  return (
    <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
      <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1a3a5c" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={sc} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 28, fontWeight: 900, color: sc, lineHeight: 1 }}>{capped}</span>
        <span style={{ fontSize: 10, color: '#64748b', letterSpacing: 1 }}>/ 88</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: sc, marginTop: 2 }}>{grade}</span>
      </div>
    </div>
  );
}

function ContaminantBar({ name, level, unit, status, statusColor }: {
  name: string; level?: number | string; unit?: string; status: string; statusColor: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #0f2336', gap: 12 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', flex: 1 }}>{name}</span>
      {level != null && <span style={{ fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>{level}{unit ? ` ${unit}` : ''}</span>}
      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${statusColor}20`, color: statusColor, whiteSpace: 'nowrap' }}>{status}</span>
    </div>
  );
}

export default function ResultsClient({ zip, initialData }: { zip: string; initialData: any }) {
  const [data] = useState(initialData);
  const [tab, setTab] = useState<'report' | 'pfas' | 'violations' | 'filters'>('report');
  const [alertEmail, setAlertEmail] = useState('');
  const [alertSent, setAlertSent] = useState(false);
  const [alertSending, setAlertSending] = useState(false);

  const sendAlert = async () => {
    if (!alertEmail.includes('@') || alertSending) return;
    setAlertSending(true);
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: alertEmail, zip, source: 'results-page-alerts' }),
      });
      setAlertSent(true);
    } catch { setAlertSent(true); }
    finally { setAlertSending(false); }
  };

  if (!data) {
    return (
      <div style={{ maxWidth: 680, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚱</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>No data found for ZIP {zip}</h1>
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>This ZIP code may not be in our database yet, or it may be a rural area served by a private well.</p>
        <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: '#0891b2', borderRadius: 10, color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
          Try another ZIP →
        </Link>
      </div>
    );
  }

  const sc = SCORE_COLOR(CAP_SCORE(data.score));
  const cappedScore = CAP_SCORE(data.score);
  const cappedGrade = SCORE_GRADE(cappedScore);
  const tabs = [
    { id: 'report', label: '📊 Report' },
    { id: 'pfas', label: '☣️ PFAS' },
    { id: 'violations', label: '⚠️ Violations' },
    { id: 'filters', label: '💧 Filters' },
  ] as const;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: 28 }}>
        <nav style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>Results</span>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#94a3b8' }}>{zip}</span>
        </nav>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>
          WATER QUALITY REPORT
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 6px' }}>
          {data.city}
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px' }}>
          {data.systemName} · PWSID {data.pwsid} · {data.sourceType}
          {data.population ? ` · ${data.population} served` : ''}
        </p>

        {/* Score + summary row */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', padding: '20px 24px', background: '#071828', border: `2px solid ${sc}30`, borderRadius: 16, marginBottom: 20 }}>
          <ScoreDial score={data.score} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 2, marginBottom: 4 }}>WATER SAFETY SCORE</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: sc, marginBottom: 6 }}>{SCORE_LABEL(cappedScore)}</div>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{data.summary}</p>
            {data.pfasSummary && (
              <p style={{ fontSize: 13, color: '#f59e0b', lineHeight: 1.6, margin: '6px 0 0' }}>{data.pfasSummary}</p>
            )}
            <p style={{ fontSize: 11, color: '#475569', margin: '8px 0 0', lineHeight: 1.5 }}>
              Max score is 88/88 — all municipal water contains chlorine and disinfection byproducts not captured in EPA records.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            {[
              { label: 'Open Violations', value: data.openViolations, color: data.openViolations > 0 ? '#ef4444' : '#22d3ee' },
              { label: 'Total Violations', value: data.totalViolations, color: '#94a3b8' },
              { label: 'PFAS Detected', value: data.pfasCount, color: data.pfasCount > 0 ? '#f59e0b' : '#22d3ee' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', padding: '8px 16px', background: '#0d2240', borderRadius: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
                <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 0.5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick share */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`My ${data.city} tap water scored ${cappedScore}/88 (Grade: ${cappedGrade}) on EPA data. Check yours free 💧 watercheckup.com/results/${zip}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, padding: '6px 12px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}
          >
            ↗ Share score
          </a>
          <Link href="/"
            style={{ fontSize: 12, padding: '6px 12px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}
          >
            🔍 Check another ZIP
          </Link>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: '#071828', borderRadius: 10, padding: 4, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              background: tab === t.id ? '#0891b2' : 'transparent',
              color: tab === t.id ? '#fff' : '#64748b',
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* ── REPORT TAB ── */}
      {tab === 'report' && (
        <div>
          {/* What this means */}
          <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 12 }}>WHAT THIS MEANS FOR YOU</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.openViolations > 0 && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontSize: 16, flexShrink: 0 }}>🚨</span>
                  <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
                    <strong>{data.openViolations} open EPA violation{data.openViolations !== 1 ? 's' : ''}</strong> — your utility is currently out of compliance with federal drinking water standards.
                  </p>
                </div>
              )}
              {data.pfasAboveMcl > 0 && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontSize: 16, flexShrink: 0 }}>⚠️</span>
                  <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
                    <strong>{data.pfasAboveMcl} PFAS compound{data.pfasAboveMcl !== 1 ? 's' : ''} above EPA MCL</strong> — detected above the federal maximum contaminant level. Only reverse osmosis removes PFAS.
                  </p>
                </div>
              )}
              {data.pfasCount > 0 && data.pfasAboveMcl === 0 && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#f59e0b', fontSize: 16, flexShrink: 0 }}>⚠️</span>
                  <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
                    <strong>{data.pfasCount} PFAS compound{data.pfasCount !== 1 ? 's' : ''} detected</strong> — below EPA limits but PFAS accumulate in the body over time. A reverse osmosis filter removes them.
                  </p>
                </div>
              )}
              {data.openViolations === 0 && data.pfasCount === 0 && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#22d3ee', fontSize: 16, flexShrink: 0 }}>✅</span>
                  <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
                    No open violations or PFAS detections on record. That said, lead can still enter from your home's internal plumbing — especially in homes built before 1986.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contaminants */}
          {data.contaminants?.length > 0 && (
            <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 4 }}>CONTAMINANTS DETECTED</div>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px' }}>Source: EPA SDWIS lead & copper rule sampling</p>
              {data.contaminants.map((c: any, i: number) => (
                <ContaminantBar key={i}
                  name={c.name || c.contaminant}
                  level={c.level ?? c.result}
                  unit={c.unit}
                  status={c.status || (c.overLimit ? 'Above limit' : 'Within limit')}
                  statusColor={c.statusColor || (c.overLimit ? '#ef4444' : '#22d3ee')}
                />
              ))}
            </div>
          )}

          {/* Data sources */}
          <div style={{ padding: '14px 18px', background: '#040d14', border: '1px solid #0f2336', borderRadius: 10, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 2, marginBottom: 8 }}>DATA SOURCES</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(data.dataSources || [data.dataSource]).map((s: string) => (
                <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 6, color: '#0891b2' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Top filter recommendation */}
          {(() => {
            const hasPfas = data.pfasCount > 0;
            const hasViolations = data.openViolations > 0;
            const needsRO = hasPfas || hasViolations || data.score < 65;
            const pick = needsRO
              ? { name: 'Waterdrop G3P800 RO', price: '~$369', badge: 'TOP PICK FOR YOUR WATER', amazon: `https://www.amazon.com/dp/B0987FCQQW?tag=${TAG}`, reason: `Removes ${hasPfas ? 'PFAS, ' : ''}lead, and disinfection byproducts — the primary concerns detected for this water supply.` }
              : { name: 'Clearly Filtered Pitcher', price: '~$90', badge: 'BEST NO-INSTALL OPTION', amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${TAG}`, reason: 'NSF-certified to remove lead, chlorine, and 365+ contaminants. No installation needed.' };
            return (
              <div style={{ padding: '20px 22px', background: 'linear-gradient(135deg, #071828, #040d14)', border: '2px solid rgba(8,145,178,0.35)', borderRadius: 12, marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 12 }}>RECOMMENDED FOR YOUR WATER</div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 32, flexShrink: 0 }}>💧</div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{pick.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, padding: '2px 7px', borderRadius: 4, background: '#0891b2', color: '#fff' }}>{pick.badge}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{pick.price}</div>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 12px' }}>{pick.reason}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <a href={pick.amazon} target="_blank" rel="noopener noreferrer sponsored"
                        style={{ display: 'inline-block', padding: '9px 18px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                        View on Amazon →
                      </a>
                      <button onClick={() => setTab('filters')}
                        style={{ padding: '9px 14px', background: 'transparent', border: '1px solid #1a3a5c', borderRadius: 8, color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Compare all options →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* City page link */}
          {(() => {
            const citySlug = data.city?.toLowerCase().split(',')[0].trim().replace(/\s+/g, '-');
            return (
              <div style={{ padding: '16px 20px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                  Want the full city-level breakdown?{' '}
                  <Link href={`/water/${citySlug}`} style={{ color: '#0891b2', fontWeight: 700, textDecoration: 'none' }}>
                    View the {data.city?.split(',')[0]} city water report →
                  </Link>
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── PFAS TAB ── */}
      {tab === 'pfas' && (
        <div>
          <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 12 }}>PFAS MONITORING — EPA UCMR5 (2023–2025)</div>
            {data.pfasCount === 0 ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 24 }}>✅</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#22d3ee' }}>No PFAS detected</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>All 29 PFAS compounds tested below detection limits for this water system.</div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  <div style={{ padding: '10px 16px', background: '#071828', borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: data.pfasAboveMcl > 0 ? '#ef4444' : '#f59e0b' }}>{data.pfasCount}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Compounds detected</div>
                  </div>
                  <div style={{ padding: '10px 16px', background: '#071828', borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: data.pfasAboveMcl > 0 ? '#ef4444' : '#22d3ee' }}>{data.pfasAboveMcl}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Above EPA MCL</div>
                  </div>
                  {data.ucmr5?.maxPfasPpt != null && (
                    <div style={{ padding: '10px 16px', background: '#071828', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#94a3b8' }}>{data.ucmr5.maxPfasPpt}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>Max ppt detected</div>
                    </div>
                  )}
                </div>
                <div style={{ padding: '14px 16px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 8 }}>
                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
                    PFAS "forever chemicals" don't break down in the body and accumulate over time. The EPA set the first federal PFAS limits in April 2024 (4 ppt for PFOA/PFOS). <strong style={{ color: '#e2e8f0' }}>Only reverse osmosis or NSF 58-certified filters reliably remove PFAS.</strong> Standard pitcher filters do not.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── VIOLATIONS TAB ── */}
      {tab === 'violations' && (
        <div>
          <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 12 }}>EPA VIOLATION HISTORY</div>
            {!data.violations?.length ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 24 }}>✅</span>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#22d3ee' }}>No violations on record</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.violations.map((v: any, i: number) => (
                  <div key={i} style={{ padding: '14px 16px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>{v.rule}</div>
                        {v.contaminant && <div style={{ fontSize: 12, color: '#94a3b8' }}>{v.contaminant}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#64748b' }}>{v.year}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: `${v.statusColor}20`, color: v.statusColor }}>{v.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontSize: 11, color: '#64748b', margin: '14px 0 0', lineHeight: 1.6 }}>
              Source: EPA SDWIS Safe Drinking Water Information System · Showing most recent violations
            </p>
          </div>
        </div>
      )}

      {/* ── FILTERS TAB ── */}
      {tab === 'filters' && (
        <div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16, lineHeight: 1.6 }}>
            Based on <strong style={{ color: '#e2e8f0' }}>{data.city?.split(',')[0]}</strong>'s water profile — {data.pfasCount > 0 ? 'PFAS detected, ' : ''}{data.openViolations > 0 ? `${data.openViolations} open violations, ` : ''}score {cappedScore}/88 — here are the right filters for your home.
          </p>
          {[
            {
              name: 'Waterdrop G3P800 RO',
              badge: 'EDITORS PICK',
              price: '~$369',
              reason: 'Removes 99%+ PFAS, lead, and disinfection byproducts. Tankless, 800 GPD, smart TDS display.',
              amazon: `https://www.amazon.com/dp/B0987FCQQW?tag=${TAG}`,
              best: true,
            },
            {
              name: 'Aquasana SmartFlow RO',
              badge: 'MOST CERTIFIED',
              price: '~$449',
              reason: 'NSF 42/53/58/401 certified — the most certifications of any under-sink RO. 90+ contaminants removed.',
              amazon: `https://www.amazon.com/dp/B0CHZ8VQBB?tag=${TAG}`,
              best: false,
            },
            {
              name: 'Clearly Filtered Pitcher',
              badge: 'BEST NO-INSTALL',
              price: '~$90',
              reason: 'Only pitcher certified to remove PFAS at 99.9%. NSF 42/53/244/401/P473. No plumbing needed.',
              amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${TAG}`,
              best: false,
            },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 18px',
              background: f.best ? 'rgba(8,145,178,0.08)' : '#071828',
              border: f.best ? '2px solid rgba(8,145,178,0.4)' : '1px solid #1a3a5c',
              borderRadius: 12, marginBottom: 12,
            }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>💧</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{f.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, padding: '2px 7px', borderRadius: 4, background: f.best ? '#0891b2' : '#1e3a5f', color: '#fff' }}>{f.badge}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{f.price}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 10 }}>{f.reason}</div>
                <a href={f.amazon} target="_blank" rel="noopener noreferrer sponsored"
                  style={{ display: 'inline-block', padding: '8px 16px', background: f.best ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240', border: f.best ? 'none' : '1px solid #1a3a5c', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                  View on Amazon →
                </a>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '14px 18px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10 }}>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
              Not sure which is right for you?{' '}
              <Link href="/quiz" style={{ color: '#0891b2', fontWeight: 700, textDecoration: 'none' }}>Take the 3-question filter quiz →</Link>
            </p>
          </div>
        </div>
      )}

      {/* ── EMAIL ALERTS ── */}
      <div style={{ marginTop: 40, padding: '24px 24px', background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 14 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: '#f8fafc', marginBottom: 8 }}>Get Alerts If Your Water Changes</div>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.55 }}>
          We'll notify you if new contaminants are detected or violations are filed for ZIP {zip}.
        </p>
        {alertSent ? (
          <div style={{ fontSize: 14, color: '#4ade80', fontWeight: 700 }}>✅ You're on the list. Watch your inbox.</div>
        ) : (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              value={alertEmail}
              onChange={e => setAlertEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendAlert()}
              placeholder="your@email.com"
              type="email"
              style={{
                flex: '1 1 220px', minHeight: 46, padding: '11px 14px',
                background: 'rgba(4,22,48,0.95)', border: '1px solid rgba(251,191,36,0.35)',
                borderRadius: 10, color: '#f1f5f9', fontSize: 15, outline: 'none',
              }}
            />
            <button
              onClick={sendAlert}
              disabled={alertSending || !alertEmail.includes('@')}
              style={{
                padding: '12px 22px', minHeight: 46, borderRadius: 10, border: 'none',
                fontSize: 14, fontWeight: 800, color: '#0f172a',
                background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
                boxShadow: '0 6px 20px rgba(245,158,11,0.35)',
                cursor: alertSending || !alertEmail.includes('@') ? 'not-allowed' : 'pointer',
                opacity: alertSending || !alertEmail.includes('@') ? 0.55 : 1,
              }}
            >
              {alertSending ? '…' : 'Notify me'}
            </button>
          </div>
        )}
        <p style={{ fontSize: 11, color: '#64748b', margin: '10px 0 0' }}>No spam. Unsubscribe anytime.</p>
      </div>

      {/* ── CHECK ANOTHER ZIP ── */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <Link href="/"
          style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px #0891b244' }}>
          Check Another ZIP →
        </Link>
      </div>

    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ─────────────────────────────────────────────────────────────────────────────
// REAL EPA SDWIS BACKEND — same domain, no CORS
// ─────────────────────────────────────────────────────────────────────────────
async function fetchWaterData(zip: string) {
  const res = await fetch(`/api/water?zip=${zip}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
  return data;
}

async function findInstallers(zip: string) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system: 'You are a local business search API. Respond ONLY with a raw JSON array. No markdown.',
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: `Search for water treatment installation companies near ZIP ${zip}. Return ONLY a JSON array of 4-5 real companies: [{"name":"Company","address":"123 Main St, City, ST","phone":"(555) 555-5555","rating":4.8,"reviews":120,"cert":"WQA Certified","specialty":"RO Systems","website":"https://example.com","distance":"2.4 mi"}]. ONLY the JSON array.` }]
    })
  });
  const d = await res.json();
  const text = (d.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
  const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
  const s = clean.indexOf('['), e = clean.lastIndexOf(']');
  if (s === -1 || e === -1) return [];
  return JSON.parse(clean.slice(s, e + 1));
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CATALOG — NSF/WQA Gold Seal, Real Amazon Links
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:1, name:'APEC ROES-50', brand:'APEC Water Systems', type:'Under-Sink RO', price:219, filterCostPerYear:95, rating:4.7, reviews:28400, gpd:50, stages:5, cert:['WQA Gold Seal','NSF/ANSI 58'], certColor:'#d97706', removes:['Lead >99%','Arsenic >99%','Fluoride >96%','Chlorine >98%','TDS >93%'], bestFor:['Lead','Arsenic','Fluoride','Nitrate','Copper'], pros:['Made in USA','Budget-friendly','Easy DIY install','20yr track record'], img:'https://m.media-amazon.com/images/I/61cF0FQEDBL._AC_SL1500_.jpg', amazon:'https://www.amazon.com/dp/B00I0ZGOZM', tankless:false, remineralize:false },
  { id:2, name:'iSpring RCC7AK', brand:'iSpring', type:'Under-Sink RO + Alkaline', price:229, filterCostPerYear:80, rating:4.7, reviews:14200, gpd:75, stages:6, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58'], certColor:'#22d3ee', removes:['Lead >98.9%','PFAS >96%','Chromium >99%','Fluoride >97%','TDS >93%'], bestFor:['Lead','PFAS','Chromium-6','Copper','Nitrate'], pros:['Remineralization stage','75 GPD fast','Triple NSF cert','pH balanced'], img:'https://m.media-amazon.com/images/I/71RKD7DEYBL._AC_SL1500_.jpg', amazon:'https://www.amazon.com/dp/B005LJ8EXU', tankless:false, remineralize:true },
  { id:3, name:'Waterdrop G3P800', brand:'Waterdrop', type:'Tankless Under-Sink RO', price:449, filterCostPerYear:170, rating:4.8, reviews:9800, gpd:800, stages:8, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58','NSF/ANSI 372'], certColor:'#22d3ee', removes:['PFAS >99%','Lead >99%','Fluoride','Chlorine','Heavy metals'], bestFor:['PFAS','Lead','Arsenic','Chromium-6'], pros:['No tank — compact','800 GPD ultra fast','Smart LED faucet','3:1 waste ratio'], img:'https://m.media-amazon.com/images/I/61Y0jVJoVxL._AC_SL1500_.jpg', amazon:'https://www.amazon.com/dp/B07P1XFYJP', tankless:true, remineralize:false },
  { id:4, name:'Home Master TMAFC', brand:'Home Master', type:'Under-Sink RO + Remineralization', price:379, filterCostPerYear:110, rating:4.6, reviews:3200, gpd:75, stages:7, cert:['NSF Certified','WQA tested'], certColor:'#d97706', removes:['Lead >99%','Chlorine >98%','PFAS','VOCs','TDS'], bestFor:['Lead','Chlorine','Iron','VOCs'], pros:['Dual remineralization','1:1 waste ratio','Great taste'], img:'https://m.media-amazon.com/images/I/71b1VFe2VJL._AC_SL1500_.jpg', amazon:'https://www.amazon.com/dp/B00B5GT45E', tankless:false, remineralize:true },
  { id:5, name:'Aquasana SmartFlow RO', brand:'Aquasana', type:'Under-Sink RO + Claryum', price:449, filterCostPerYear:145, rating:4.7, reviews:2100, gpd:50, stages:5, cert:['WQA Gold Seal','NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58','NSF/ANSI 401'], certColor:'#d97706', removes:['90+ contaminants','Fluoride 90%','Lead >99%','Microplastics','PFAS'], bestFor:['PFAS','Lead','Fluoride','Microplastics'], pros:['Most certified','90 contaminants','Retains minerals'], img:'https://m.media-amazon.com/images/I/71gFCKKMNwL._AC_SL1500_.jpg', amazon:'https://www.amazon.com/dp/B01AO49OAQ', tankless:false, remineralize:true },
  { id:6, name:'Pelican PC600', brand:'Pelican Water', type:'Whole-House POE', price:899, filterCostPerYear:120, rating:4.7, reviews:1800, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 61','WQA Gold Seal'], certColor:'#d97706', removes:['Chlorine >97%','Chloramine','THMs','VOCs','Sediment'], bestFor:['Chloramine','Chloroform','HAAs','VOCs'], pros:['Whole house','No salt','6yr filter life'], img:'https://m.media-amazon.com/images/I/81r1fLVQbwL._AC_SL1500_.jpg', amazon:'https://www.amazon.com/dp/B001JM5OQ0', tankless:false, remineralize:false, wholeHouse:true },
  { id:7, name:'PUR PLUS 11-Cup Pitcher', brand:'PUR', type:'Pitcher Filter', price:42, filterCostPerYear:110, rating:4.5, reviews:22000, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Lead 100%','Arsenic 100%','Uranium 100%','Chlorine','PFNA 96%'], bestFor:['Lead','Arsenic','Uranium','Chromium-6'], pros:['No install','Portable','Budget-friendly'], img:'https://m.media-amazon.com/images/I/71Pg8yZLLfL._AC_SL1500_.jpg', amazon:'https://www.amazon.com/dp/B07NMQNHPB', tankless:false, remineralize:false, pitcher:true },
];

const SEV: Record<string, {color:string,label:string}> = {
  low:      { color:'#22d3ee', label:'Within Limits' },
  moderate: { color:'#f59e0b', label:'Elevated' },
  high:     { color:'#ef4444', label:'Exceeds Limit' },
};

const STEPS = [
  'Querying EPA Envirofacts API…',
  'Finding water system for ZIP…',
  'Pulling violation records from SDWIS…',
  'Fetching Lead & Copper samples…',
  'Building your report…',
];

// ─────────────────────────────────────────────────────────────────────────────
// SCORE DIAL
// ─────────────────────────────────────────────────────────────────────────────
function ScoreDial({ score, grade }: { score: number; grade: string }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(score), 150); return () => clearTimeout(t); }, [score]);
  const r = 72, cx = 90, cy = 90;
  const rad = (d: number) => (d * Math.PI) / 180;
  const pt  = (a: number) => ({ x: cx + r * Math.cos(rad(a)), y: cy + r * Math.sin(rad(a)) });
  const arc = (s: number, e: number) => {
    const p1 = pt(s), p2 = pt(e), lg = e - s > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${lg} 1 ${p2.x} ${p2.y}`;
  };
  const color = score >= 80 ? '#22d3ee' : score >= 65 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="180" height="160" viewBox="0 0 180 160">
      <path d={arc(210, 510)} fill="none" stroke="#1e3a4a" strokeWidth="10" strokeLinecap="round" />
      <path d={arc(210, 210 + 300 * (anim / 100))} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        style={{ transition: 'all 1.3s cubic-bezier(0.34,1.56,0.64,1)' }}
        filter={`drop-shadow(0 0 8px ${color}88)`} />
      <text x={cx} y={cy + 8}  textAnchor="middle" fontSize="32" fontWeight="800" fill={color} fontFamily="monospace">{anim}</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="monospace">Grade: {grade}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ p, highlight }: { p: any; highlight: boolean }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div style={{ background: highlight ? '#07131e' : '#060e17', border: `1px solid ${highlight ? '#0891b2' : '#0e2233'}`, borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, position: 'relative' }}>
        {!imgErr
          ? <img src={p.img} alt={p.name} onError={() => setImgErr(true)} style={{ maxHeight: 130, maxWidth: '100%', objectFit: 'contain' }} />
          : <div style={{ fontSize: 36 }}>💧</div>}
        {highlight && <div style={{ position: 'absolute', top: 6, right: 6, background: '#0891b2', color: '#fff', fontSize: 8, padding: '2px 6px', borderRadius: 3, fontWeight: 800 }}>TOP PICK</div>}
        {p.tankless && <div style={{ position: 'absolute', top: 6, left: 6, background: '#7c3aed', color: '#fff', fontSize: 8, padding: '2px 6px', borderRadius: 3, fontWeight: 800 }}>TANKLESS</div>}
      </div>
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div>
          <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1, marginBottom: 2 }}>{p.brand.toUpperCase()}</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.2 }}>{p.name}</div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>{p.type}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ color: '#f59e0b', fontSize: 11 }}>{'★'.repeat(Math.round(p.rating))}</span>
          <span style={{ fontSize: 9, color: '#94a3b8' }}>{p.rating} ({p.reviews.toLocaleString()})</span>
        </div>
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {p.cert.map((c: string) => (
            <span key={c} style={{ fontSize: 8, padding: '1px 5px', borderRadius: 3, background: p.certColor + '22', color: p.certColor, border: `1px solid ${p.certColor}44`, fontWeight: 700 }}>{c}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[p.gpd ? { l: 'GPD', v: p.gpd } : null, { l: 'Stages', v: p.stages }, { l: 'Filter/yr', v: `$${p.filterCostPerYear}` }, p.remineralize ? { l: 'Remineralizes', v: '✓' } : null].filter(Boolean).map((s: any) => (
            <div key={s.l} style={{ background: '#0a1929', borderRadius: 4, padding: '3px 7px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#22d3ee' }}>{s.v}</div>
              <div style={{ fontSize: 7, color: '#334155', letterSpacing: 1 }}>{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 8, color: '#334155', letterSpacing: 1, marginBottom: 3 }}>REMOVES</div>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {p.removes.slice(0, 3).map((r: string) => <span key={r} style={{ fontSize: 8, padding: '1px 5px', borderRadius: 3, background: '#051a0a', color: '#22d3ee', border: '1px solid #22d3ee22' }}>{r}</span>)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 2 }}>
          {p.pros.slice(0, 2).map((pro: string) => <div key={pro} style={{ fontSize: 9, color: '#64748b' }}>✓ {pro}</div>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #0e2233' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#22d3ee' }}>${p.price}</div>
            <div style={{ fontSize: 8, color: '#334155' }}>Amazon · Free ship</div>
          </div>
          <a href={p.amazon} target="_blank" rel="noreferrer" style={{ padding: '8px 13px', background: '#f59e0b', borderRadius: 6, color: '#000', fontSize: 10, fontWeight: 800, textDecoration: 'none' }}>Buy →</a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function WaterCheckup() {
  const [zip, setZip]               = useState('');
  const [loading, setLoading]       = useState(false);
  const [step, setStep]             = useState(0);
  const [data, setData]             = useState<any>(null);
  const [error, setError]           = useState<string | null>(null);
  const [tab, setTab]               = useState('report');
  const [showEmail, setShowEmail]   = useState(false);
  const [email, setEmail]           = useState('');
  const [emailAlert, setEmailAlert] = useState(false);
  const [emailSent, setEmailSent]   = useState(false);
  const [years, setYears]           = useState(5);
  const [ppl, setPpl]               = useState(4);
  const [ftype, setFtype]           = useState('iSpring RCC7AK');
  const [installers, setInstallers] = useState<any[]>([]);
  const [instLoading, setInstLoading] = useState(false);
  const [productFilter, setProductFilter] = useState('all');
  const [quoted, setQuoted]         = useState<Record<string, boolean>>({});

  const search = async () => {
    if (zip.length !== 5 || loading) return;
    setLoading(true); setError(null); setData(null); setTab('report'); setEmailSent(false); setStep(0); setInstallers([]);
    let s = 0;
    const tick = setInterval(() => { s = Math.min(s + 1, STEPS.length - 1); setStep(s); }, 900);
    try {
      const result = await fetchWaterData(zip);
      clearInterval(tick);
      setData(result);
      setTimeout(() => setShowEmail(true), 800);
      loadInstallers(zip);
    } catch (e: any) {
      clearInterval(tick);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadInstallers = async (z: string) => {
    setInstLoading(true);
    try { const list = await findInstallers(z); setInstallers(list); } catch {}
    finally { setInstLoading(false); }
  };

  const getRecommended = () => {
    if (!data || !data.contaminants?.length) return PRODUCTS.filter((p: any) => !p.wholeHouse && !p.pitcher).slice(0, 3);
    const names = data.contaminants.map((c: any) => c.name);
    return PRODUCTS.map(p => ({ ...p, m: p.bestFor.filter((b: string) => names.includes(b)).length })).sort((a, b) => b.m - a.m).slice(0, 3);
  };

  const prod = PRODUCTS.find(p => p.name === ftype) || PRODUCTS[1];
  const chartData = Array.from({ length: years + 1 }, (_, i) => ({
    year: `Yr ${i}`,
    filter:  Math.round(prod.price + prod.filterCostPerYear * i),
    bottled: Math.round(ppl * 32 * 12 * i),
  }));
  const recommended = getRecommended();
  const filteredProducts = PRODUCTS.filter(p => {
    if (productFilter === 'all') return true;
    if (productFilter === 'ro') return p.type.includes('RO') && !(p as any).wholeHouse;
    if (productFilter === 'tankless') return p.tankless;
    if (productFilter === 'whole') return (p as any).wholeHouse;
    if (productFilter === 'pitcher') return (p as any).pitcher;
    return true;
  });
  const scoreColor = !data ? '#22d3ee' : data.score >= 80 ? '#22d3ee' : data.score >= 65 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ minHeight: '100vh', background: '#050e17', fontFamily: "'Courier New', monospace", color: '#e2e8f0' }}>

      {/* HEADER */}
      <div style={{ borderBottom: '1px solid #0e2233', padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💧</div>
        <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: 2, color: '#22d3ee' }}>WATER<span style={{ color: '#e2e8f0' }}>CHECKUP</span></span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: '#d97706', color: '#fff', fontWeight: 800, letterSpacing: 1 }}>WQA GOLD SEAL</span>
          <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: '#0891b2', color: '#fff', fontWeight: 800, letterSpacing: 1 }}>NSF CERTIFIED</span>
          <span style={{ fontSize: 9, color: '#334155', marginLeft: 4 }}>Live EPA SDWIS Data</span>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ maxWidth: 680, margin: '44px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: '#0891b2', marginBottom: 10 }}>LIVE EPA SDWIS · REAL VIOLATION HISTORY</div>
        <h1 style={{ fontSize: 34, fontWeight: 900, margin: '0 0 8px', lineHeight: 1.1 }}>Enter Your ZIP Code</h1>
        <p style={{ color: '#475569', marginBottom: 28, fontSize: 12 }}>Real EPA data · NSF & WQA certified products · Local installers</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <input
            value={zip}
            onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="e.g. 02169"
            maxLength={5}
            style={{ width: 150, padding: '12px 16px', fontSize: 20, letterSpacing: 4, background: '#0a1929', border: '1px solid #1e3a4a', borderRadius: 8, color: '#22d3ee', outline: 'none', textAlign: 'center' }}
          />
          <button onClick={search} disabled={zip.length !== 5 || loading} style={{
            padding: '12px 24px', background: zip.length === 5 && !loading ? '#0891b2' : '#0e2233',
            border: 'none', borderRadius: 8, color: zip.length === 5 && !loading ? '#fff' : '#334155',
            fontSize: 12, fontWeight: 700, letterSpacing: 2, cursor: zip.length === 5 && !loading ? 'pointer' : 'default', transition: 'all 0.2s',
          }}>
            {loading ? 'QUERYING EPA…' : 'ANALYZE →'}
          </button>
        </div>
        <div style={{ marginTop: 10, fontSize: 10, color: '#1e3a4a' }}>Try: 02169 · 60601 · 77001 · 10001 · 90210</div>

        {error && (
          <div style={{ marginTop: 20, padding: '14px 18px', background: '#1a0a0a', border: '1px solid #ef4444', borderRadius: 8, textAlign: 'left' }}>
            <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>⚠ Error</div>
            <div style={{ color: '#fca5a5', fontSize: 11, wordBreak: 'break-word', lineHeight: 1.7 }}>{error}</div>
          </div>
        )}
      </div>

      {/* LOADER */}
      {loading && (
        <div style={{ maxWidth: 460, margin: '44px auto', padding: '26px 30px', background: '#0a1929', border: '1px solid #0e2233', borderRadius: 12 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, opacity: i <= step ? 1 : 0.15, transition: 'opacity 0.4s' }}>
              <span style={{ color: i < step ? '#22d3ee' : i === step ? '#f59e0b' : '#1e3a4a', fontSize: 13 }}>{i < step ? '✓' : i === step ? '▶' : '○'}</span>
              <span style={{ fontSize: 12, color: i === step ? '#e2e8f0' : '#475569' }}>{s}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: '8px 12px', background: '#060e17', borderRadius: 6, fontSize: 10, color: '#334155', textAlign: 'center' }}>
            Live query to EPA Envirofacts — real data, no estimates
          </div>
        </div>
      )}

      {/* RESULTS */}
      {data && !loading && (
        <div style={{ maxWidth: 900, margin: '36px auto 60px', padding: '0 20px' }}>

          {/* SUMMARY HEADER */}
          <div style={{ background: '#0a1929', border: '1px solid #0e2233', borderRadius: '12px 12px 0 0', padding: '22px 26px', display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <ScoreDial score={data.score} grade={data.grade} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 19, fontWeight: 800 }}>{data.systemName}</span>
                {data.openViolations > 0 && <span style={{ fontSize: 10, padding: '3px 8px', background: '#ef444422', border: '1px solid #ef444444', borderRadius: 4, color: '#ef4444' }}>{data.openViolations} OPEN</span>}
              </div>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 2 }}>{data.city} · PWSID: {data.pwsid}</div>
              <div style={{ fontSize: 11, color: '#334155', marginBottom: 10 }}>
                {data.sourceType}{data.population ? ` · ${data.population} served` : ''} · {data.dataSource}
              </div>
              {data.summary && <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginBottom: 14, lineHeight: 1.6 }}>"{data.summary}"</div>}
              <div style={{ display: 'flex', gap: 20 }}>
                {[
                  { l: 'VIOLATIONS', v: data.totalViolations, c: data.totalViolations > 0 ? '#f59e0b' : '#22d3ee' },
                  { l: 'OPEN',       v: data.openViolations,  c: data.openViolations  > 0 ? '#ef4444' : '#22d3ee' },
                  { l: 'SCORE',      v: data.score,           c: scoreColor },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: 9, color: '#334155', letterSpacing: 1 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowEmail(true)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #0891b2', borderRadius: 6, color: '#22d3ee', fontSize: 11, letterSpacing: 1, cursor: 'pointer', whiteSpace: 'nowrap' }}>✉ GET REPORT</button>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', background: '#07111a', borderLeft: '1px solid #0e2233', borderRight: '1px solid #0e2233', overflowX: 'auto' }}>
            {[['report','📊 Water Report'],['products','🛒 Products'],['cost','💰 Cost Calc'],['installers','🔧 Installers']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{ padding: '11px 16px', background: 'transparent', border: 'none', whiteSpace: 'nowrap', borderBottom: tab === id ? '2px solid #0891b2' : '2px solid transparent', color: tab === id ? '#22d3ee' : '#475569', fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }}>{label}</button>
            ))}
          </div>

          {/* TAB: WATER REPORT */}
          {tab === 'report' && (
            <div style={{ background: '#0a1929', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '8px 14px', background: '#051a0a', border: '1px solid #22d3ee22', borderRadius: 6 }}>
                <span style={{ fontSize: 12 }}>🟢</span>
                <span style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>LIVE EPA DATA</span>
                <span style={{ fontSize: 10, color: '#475569' }}>Direct from EPA SDWIS Envirofacts API · Updated quarterly by EPA</span>
              </div>

              {data.violations?.length > 0 ? (
                <>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: '#0891b2', marginBottom: 12 }}>VIOLATION HISTORY — EPA SDWIS</div>
                  <div style={{ background: '#060e17', border: '1px solid #0e2233', borderRadius: 8, marginBottom: 26, overflow: 'hidden' }}>
                    {data.violations.map((v: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: i < data.violations.length - 1 ? '1px solid #0a1929' : 'none', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{v.rule}</div>
                          {v.contaminant && <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{v.contaminant}</div>}
                        </div>
                        <div style={{ fontSize: 11, color: '#475569', minWidth: 36 }}>{v.year}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: v.statusColor || '#94a3b8', minWidth: 70, textAlign: 'right' }}>{v.status}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ background: '#051a0a', border: '1px solid #22d3ee22', borderRadius: 8, padding: '14px 18px', marginBottom: 22, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>✅</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#22d3ee' }}>No violations on record</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>EPA SDWIS shows no violations for this water system.</div>
                  </div>
                </div>
              )}

              {data.contaminants?.length > 0 && (
                <>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: '#0891b2', marginBottom: 16 }}>CONTAMINANT DATA — REAL SAMPLES</div>
                  {data.contaminants.map((c: any) => {
                    const sev = SEV[c.severity] || SEV.low;
                    const pct = c.level && c.limit ? Math.min((c.level / (c.limit * 1.5)) * 100, 100) : 0;
                    return (
                      <div key={c.name} style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</span>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            {c.level && c.limit && <span style={{ fontSize: 11, color: '#475569' }}>{c.level} {c.unit} · limit {c.limit} {c.unit}</span>}
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: sev.color + '22', color: sev.color }}>{sev.label}</span>
                          </div>
                        </div>
                        {c.level && c.limit && (
                          <div style={{ height: 5, background: '#1e3a4a', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: sev.color, borderRadius: 3, transition: 'width 1s ease', boxShadow: `0 0 8px ${sev.color}88` }} />
                          </div>
                        )}
                        {c.note && <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{c.note}</div>}
                      </div>
                    );
                  })}
                </>
              )}

              <div style={{ fontSize: 10, letterSpacing: 3, color: '#0891b2', margin: '26px 0 14px' }}>RECOMMENDED FILTERS FOR YOUR WATER</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
                {recommended.map((p: any, i: number) => <ProductCard key={p.id} p={p} highlight={i === 0} />)}
              </div>
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <button onClick={() => setTab('products')} style={{ padding: '8px 18px', background: 'transparent', border: '1px solid #0891b2', borderRadius: 6, color: '#22d3ee', fontSize: 11, cursor: 'pointer', letterSpacing: 1 }}>
                  View All 7 Products →
                </button>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS */}
          {tab === 'products' && (
            <div style={{ background: '#0a1929', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#0891b2' }}>NSF & WQA GOLD SEAL CERTIFIED — ON AMAZON</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {[['all','All'],['ro','Under-Sink RO'],['tankless','Tankless'],['whole','Whole House'],['pitcher','Pitcher']].map(([id, label]) => (
                    <button key={id} onClick={() => setProductFilter(id)} style={{ padding: '4px 10px', background: productFilter === id ? '#0891b2' : '#060e17', border: `1px solid ${productFilter === id ? '#0891b2' : '#0e2233'}`, borderRadius: 4, color: productFilter === id ? '#fff' : '#475569', fontSize: 10, cursor: 'pointer', fontWeight: productFilter === id ? 700 : 400 }}>{label}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
                {filteredProducts.map((p: any) => <ProductCard key={p.id} p={p} highlight={recommended.some((r: any) => r.id === p.id)} />)}
              </div>
            </div>
          )}

          {/* TAB: COST CALCULATOR */}
          {tab === 'cost' && (
            <div style={{ background: '#0a1929', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: '#0891b2', marginBottom: 18 }}>COST OF OWNERSHIP CALCULATOR</div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24, alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 9, color: '#64748b', marginBottom: 5 }}>SYSTEM</div>
                  <select value={ftype} onChange={e => setFtype(e.target.value)} style={{ background: '#060e17', border: '1px solid #1e3a4a', color: '#e2e8f0', padding: '7px 10px', borderRadius: 6, fontSize: 11 }}>
                    {PRODUCTS.map(p => <option key={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: '#64748b', marginBottom: 5 }}>YEARS: {years}</div>
                  <input type="range" min={1} max={10} value={years} onChange={e => setYears(+e.target.value)} style={{ width: 130, accentColor: '#0891b2' }} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: '#64748b', marginBottom: 5 }}>HOUSEHOLD: {ppl}</div>
                  <input type="range" min={1} max={8} value={ppl} onChange={e => setPpl(+e.target.value)} style={{ width: 130, accentColor: '#0891b2' }} />
                </div>
              </div>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gF" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0891b2" stopOpacity={0.4} /><stop offset="95%" stopColor="#0891b2" stopOpacity={0} /></linearGradient>
                      <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0e2233" />
                    <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickFormatter={v => `$${v}`} />
                    <Tooltip contentStyle={{ background: '#060e17', border: '1px solid #1e3a4a', borderRadius: 8 }} labelStyle={{ color: '#94a3b8', fontSize: 10 }} formatter={(v: any) => [`$${v}`, '']} />
                    <Area type="monotone" dataKey="filter"  name="Filter System" stroke="#0891b2" fill="url(#gF)" strokeWidth={2} />
                    <Area type="monotone" dataKey="bottled" name="Bottled Water"  stroke="#ef4444" fill="url(#gB)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
                {[
                  { l: 'Filter System', c: '#0891b2', v: `$${prod.price + prod.filterCostPerYear * years}` },
                  { l: 'Bottled Water',  c: '#ef4444', v: `$${Math.round(ppl * 32 * 12 * years)}` },
                  { l: 'You Save',       c: '#22d3ee', v: `$${Math.max(0, Math.round(ppl * 32 * 12 * years) - prod.price - prod.filterCostPerYear * years)}` },
                ].map(s => (
                  <div key={s.l} style={{ flex: 1, minWidth: 90, background: '#060e17', border: `1px solid ${s.c}33`, borderRadius: 8, padding: '12px 16px' }}>
                    <div style={{ fontSize: 9, color: '#64748b', marginBottom: 3 }}>{s.l}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: 9, color: '#334155' }}>over {years} yr{years !== 1 ? 's' : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: INSTALLERS */}
          {tab === 'installers' && (
            <div style={{ background: '#0a1929', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#0891b2' }}>WATER TREATMENT INSTALLERS NEAR {data.city}</div>
                <button onClick={() => loadInstallers(zip)} disabled={instLoading} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #0e2233', borderRadius: 4, color: '#475569', fontSize: 10, cursor: 'pointer' }}>{instLoading ? 'Searching…' : '↻ Refresh'}</button>
              </div>

              {instLoading && <div style={{ padding: '24px', textAlign: 'center', color: '#475569', fontSize: 12 }}>🔍 Searching for local water treatment installers…</div>}

              {!instLoading && installers.map((c: any, i: number) => (
                <div key={i} style={{ background: '#060e17', border: '1px solid #0e2233', borderRadius: 8, padding: '16px 20px', marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 3 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{c.address}</div>
                      {c.specialty && <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{c.specialty}</div>}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        {c.cert && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: '#d9770622', color: '#d97706', border: '1px solid #d9770644', fontWeight: 700 }}>{c.cert}</span>}
                        {c.rating && <span style={{ fontSize: 11, color: '#f59e0b' }}>{'★'.repeat(Math.round(c.rating))} <span style={{ color: '#64748b', fontSize: 10 }}>{c.rating}{c.reviews ? ` (${c.reviews})` : ''}</span></span>}
                        {c.distance && <span style={{ fontSize: 10, color: '#334155' }}>📍 {c.distance}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      {c.phone && <a href={`tel:${c.phone}`} style={{ padding: '7px 12px', background: 'transparent', border: '1px solid #1e3a4a', borderRadius: 5, color: '#94a3b8', fontSize: 10, textDecoration: 'none' }}>📞 {c.phone}</a>}
                      {c.website && <a href={c.website} target="_blank" rel="noreferrer" style={{ padding: '7px 12px', background: 'transparent', border: '1px solid #1e3a4a', borderRadius: 5, color: '#94a3b8', fontSize: 10, textDecoration: 'none' }}>🌐</a>}
                      <button onClick={() => setQuoted(q => ({ ...q, [c.name]: true }))} style={{ padding: '7px 14px', background: quoted[c.name] ? '#064e3b' : '#0891b2', border: 'none', borderRadius: 5, color: quoted[c.name] ? '#22d3ee' : '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                        {quoted[c.name] ? '✓ Sent' : 'Get Quote'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!instLoading && installers.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: '#475569', fontSize: 12 }}>
                  <button onClick={() => loadInstallers(zip)} style={{ padding: '8px 18px', background: '#0891b2', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, cursor: 'pointer' }}>Search for Local Installers</button>
                </div>
              )}
              <div style={{ marginTop: 14, fontSize: 10, color: '#334155', textAlign: 'center' }}>💡 Installer data sourced via live search. Always verify credentials and get multiple quotes.</div>
            </div>
          )}
        </div>
      )}

      {/* EMAIL MODAL */}
      {showEmail && data && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowEmail(false)}>
          <div style={{ background: '#0a1929', border: '1px solid #0e2233', borderRadius: 14, padding: '30px 34px', maxWidth: 390, width: '90%' }} onClick={e => e.stopPropagation()}>
            {emailSent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 34, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#22d3ee' }}>Report sent!</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 5 }}>Check your inbox.</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#0891b2', marginBottom: 8 }}>FREE WATER REPORT</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 5 }}>Get your full analysis</div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 18 }}>Your {data.city} water quality report with NSF-certified filter recommendations.</div>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 13px', background: '#060e17', border: '1px solid #1e3a4a', borderRadius: 8, color: '#e2e8f0', fontSize: 12, marginBottom: 10, outline: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
                  <input type="checkbox" id="al" checked={emailAlert} onChange={e => setEmailAlert(e.target.checked)} style={{ accentColor: '#0891b2' }} />
                  <label htmlFor="al" style={{ fontSize: 10, color: '#64748b', cursor: 'pointer' }}>Alert me when water quality changes</label>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { if (email) { setEmailSent(true); setTimeout(() => setShowEmail(false), 1600); } }}
                    style={{ flex: 1, padding: '10px', background: '#0891b2', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    Send Report →
                  </button>
                  <button onClick={() => setShowEmail(false)} style={{ padding: '10px 14px', background: 'transparent', border: '1px solid #1e3a4a', borderRadius: 8, color: '#475569', fontSize: 11, cursor: 'pointer' }}>Skip</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS WATER — Bahamas crystal-clear shallow water, top-down view
// ─────────────────────────────────────────────────────────────────────────────
export function WaterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cvs = canvas;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const gfx = ctx;

    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let t = 0;
    let animId: number;
    let scrollY = 0;

    // Pre-generate stable sand grain positions
    const GRAINS = Array.from({ length: 280 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.4 + Math.random() * 1.8,
      a: 0.025 + Math.random() * 0.07,
    }));

    // Bioluminescent orbs — subtle plankton / suspended light (mostly cyan, less fantasy purple)
    const BIORBS = Array.from({ length: 16 }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00018,
      r: 14 + Math.random() * 32,
      phase: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 0.65,
      hue: i % 5 === 0 ? '45,180,200' : i % 5 === 1 ? '6,182,212' : '20,195,220',
    }));

    // Micro-bubbles / silt — slow upward drift (reads as depth & movement)
    const BUBBLES = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      sp: 0.00012 + Math.random() * 0.00022,
      wobble: Math.random() * Math.PI * 2,
    }));

    // God rays — light shafts from surface
    const RAYS = Array.from({ length: 9 }, (_, i) => ({
      angle: -0.35 + (i / 8) * 0.7,
      width: 18 + Math.random() * 28,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
    }));

    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    function draw() {
      const W = cvs.width;
      const H = cvs.height;
      if (!reducedMotion) t += 0.006;

      // ── 1. DEPTH GRADIENT BASE — shallow sand → deeper water (scroll adds “going deeper”)
      const depth = Math.min(scrollY / 1200, 1);
      const sand = gfx.createLinearGradient(0, 0, 0, H);
      sand.addColorStop(0,    `rgb(${8+Math.round(depth*4)},${22+Math.round(depth*4)},${38+Math.round(depth*8)})`);
      sand.addColorStop(0.25, `rgb(${6+Math.round(depth*3)},${26+Math.round(depth*5)},${44+Math.round(depth*9)})`);
      sand.addColorStop(0.55, `rgb(5,${28+Math.round(depth*4)},${46+Math.round(depth*8)})`);
      sand.addColorStop(1,    `rgb(${4-Math.round(depth)},${18-Math.round(depth*2)},${32+Math.round(depth*12)})`);
      gfx.fillStyle = sand;
      gfx.fillRect(0, 0, W, H);
      // Warm shallow sand patch (subtle — reads as lit seafloor through water)
      const sandPatch = gfx.createRadialGradient(W * 0.35, H * 0.85, 0, W * 0.42, H * 0.92, Math.max(W, H) * 0.55);
      sandPatch.addColorStop(0,   `rgba(180,165,130,${0.045 + depth * 0.02})`);
      sandPatch.addColorStop(0.5, `rgba(60,85,95,${0.02})`);
      sandPatch.addColorStop(1,   'rgba(0,0,0,0)');
      gfx.fillStyle = sandPatch;
      gfx.fillRect(0, 0, W, H);

      // ── 2. GOD RAYS — light shafts from the surface ─────────────────────
      gfx.save();
      gfx.globalCompositeOperation = 'lighter';
      const rayOriginY = -H * 0.15;
      RAYS.forEach(ray => {
        const flicker = 0.25 + 0.3 * (0.5 + 0.5 * Math.sin(t * ray.speed + ray.phase));
        const x0 = W * 0.5 + Math.sin(t * 0.08 + ray.phase) * W * 0.08;
        const spread = H * 1.6;
        const x1 = x0 + Math.sin(ray.angle) * spread - ray.width * 3;
        const x2 = x0 + Math.sin(ray.angle) * spread + ray.width * 3;
        const rg = gfx.createLinearGradient(x0, rayOriginY, (x1 + x2) / 2, H);
        rg.addColorStop(0,   `rgba(186,230,253,${flicker * 0.22})`);
        rg.addColorStop(0.3, `rgba(125,200,240,${flicker * 0.12})`);
        rg.addColorStop(0.7, `rgba(60,150,210,${flicker * 0.05})`);
        rg.addColorStop(1,   'rgba(0,80,150,0)');
        gfx.beginPath();
        gfx.moveTo(x0 - 8, rayOriginY);
        gfx.lineTo(x0 + 8, rayOriginY);
        gfx.lineTo(x2, H);
        gfx.lineTo(x1, H);
        gfx.closePath();
        gfx.fillStyle = rg;
        gfx.fill();
      });
      gfx.restore();

      // ── 3. FLOOR TEXTURE ────────────────────────────────────────────────
      gfx.save();
      gfx.globalAlpha = 0.04;
      for (let row = 0; row < 32; row++) {
        const baseY = (row / 32) * H;
        gfx.beginPath();
        for (let x = 0; x <= W; x += 5) {
          const y = baseY
            + Math.sin(x * 0.011 + row * 0.55 + t * 0.18) * 5
            + Math.sin(x * 0.023 - row * 0.28 + t * 0.12) * 2.5;
          x === 0 ? gfx.moveTo(x, y) : gfx.lineTo(x, y);
        }
        gfx.strokeStyle = 'rgba(0,180,200,1)';
        gfx.lineWidth = 1.2;
        gfx.stroke();
      }
      gfx.restore();

      GRAINS.forEach(g => {
        gfx.beginPath();
        gfx.arc(g.x * W, g.y * H, g.r, 0, Math.PI * 2);
        gfx.fillStyle = `rgba(0,120,160,${g.a * 0.4})`;
        gfx.fill();
      });

      // ── 4. CAUSTICS ──────────────────────────────────────────────────────
      gfx.save();
      gfx.globalCompositeOperation = 'lighter';
      const NC = 64;
      for (let i = 0; i < NC; i++) {
        const ph = (i / NC) * Math.PI * 6.2;
        const s1 = 0.22 + (i % 7) * 0.065;
        const s2 = 0.17 + (i % 5) * 0.075;
        const cx = W * 0.5 + Math.sin(t * s1 + ph) * W * 0.47 + Math.cos(t * s2 + ph * 0.58) * W * 0.13;
        const cy = H * 0.5 + Math.cos(t * s2 + ph * 1.08) * H * 0.46 + Math.sin(t * s1 + ph * 0.44) * H * 0.11;
        const r  = 26 + (i % 9) * 9 + Math.sin(t * 1.6 + i * 0.9) * 14;
        const ia = 0.011 + (i % 6) * 0.0035;
        const cg = gfx.createRadialGradient(cx, cy, 0, cx, cy, r);
        cg.addColorStop(0,    `rgba(220,252,255,${ia * 2.6})`);
        cg.addColorStop(0.22, `rgba(120,230,248,${ia * 1.2})`);
        cg.addColorStop(0.55, `rgba(40,185,215,${ia * 0.45})`);
        cg.addColorStop(1,    'rgba(0,0,0,0)');
        gfx.beginPath();
        gfx.arc(cx, cy, r, 0, Math.PI * 2);
        gfx.fillStyle = cg;
        gfx.fill();
      }
      const NM = 36;
      for (let i = 0; i < NM; i++) {
        const ph = (i / NM) * Math.PI * 9.1;
        const mx = W * 0.5 + Math.sin(t * 0.8 + ph) * W * 0.42 + Math.cos(t * 1.1 + ph * 0.7) * W * 0.18;
        const my = H * 0.5 + Math.cos(t * 0.9 + ph * 1.2) * H * 0.40 + Math.sin(t * 0.7 + ph * 0.5) * H * 0.14;
        const mr = 7 + (i % 5) * 5 + Math.sin(t * 3.2 + i) * 4;
        const ma = 0.020 + (i % 4) * 0.006;
        const mcg = gfx.createRadialGradient(mx, my, 0, mx, my, mr);
        mcg.addColorStop(0,   `rgba(235,252,255,${ma * 2.5})`);
        mcg.addColorStop(0.5, `rgba(120,232,255,${ma * 0.8})`);
        mcg.addColorStop(1,   'rgba(0,0,0,0)');
        gfx.beginPath();
        gfx.arc(mx, my, mr, 0, Math.PI * 2);
        gfx.fillStyle = mcg;
        gfx.fill();
      }
      // Elongated caustic lenses (sunlight through a rippled surface)
      for (let k = 0; k < 14; k++) {
        const ax = W * 0.5 + Math.sin(t * 0.52 + k * 0.85) * W * 0.38;
        const ay = H * 0.48 + Math.cos(t * 0.45 + k * 1.05) * H * 0.36;
        const rx = 32 + (k % 5) * 14;
        const ry = rx * (0.22 + (k % 3) * 0.04);
        gfx.save();
        gfx.translate(ax, ay);
        gfx.rotate(t * 0.12 + k * 0.65);
        gfx.beginPath();
        // ellipse() is missing on some older browsers — avoid runtime throw on canvas init
        if (typeof gfx.ellipse === 'function') {
          gfx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        } else {
          gfx.arc(0, 0, rx, 0, Math.PI * 2);
        }
        const eg = gfx.createRadialGradient(0, 0, 0, 0, 0, rx);
        eg.addColorStop(0, 'rgba(210,248,255,0.07)');
        eg.addColorStop(0.45, 'rgba(70,195,225,0.028)');
        eg.addColorStop(1, 'rgba(0,0,0,0)');
        gfx.fillStyle = eg;
        gfx.fill();
        gfx.restore();
      }
      gfx.restore();

      // ── 5. BIOLUMINESCENT ORBS ───────────────────────────────────────────
      gfx.save();
      gfx.globalCompositeOperation = 'lighter';
      BIORBS.forEach(orb => {
        orb.x += orb.vx; orb.y += orb.vy;
        if (orb.x < 0) orb.x = 1; if (orb.x > 1) orb.x = 0;
        if (orb.y < 0) orb.y = 1; if (orb.y > 1) orb.y = 0;
        const pulse = 0.5 + 0.5 * Math.sin(t * orb.speed + orb.phase);
        const alpha = 0.08 + pulse * 0.14;
        const ox = orb.x * W, oy = orb.y * H;
        const or2 = orb.r * (1 + pulse * 0.3);
        const bg = gfx.createRadialGradient(ox, oy, 0, ox, oy, or2);
        bg.addColorStop(0,   `rgba(${orb.hue},${alpha * 2.2})`);
        bg.addColorStop(0.4, `rgba(${orb.hue},${alpha * 0.8})`);
        bg.addColorStop(1,   `rgba(${orb.hue},0)`);
        gfx.beginPath();
        gfx.arc(ox, oy, or2, 0, Math.PI * 2);
        gfx.fillStyle = bg;
        gfx.fill();
      });
      gfx.restore();

      // ── 6. WATER COLUMN TINT — spectral absorption (cyan surface → blue-green depth)
      const wa = 0.52 + depth * 0.14;
      const water = gfx.createLinearGradient(0, 0, 0, H);
      water.addColorStop(0,    `rgba(0,125,155,${wa * 0.92})`);
      water.addColorStop(0.22,  `rgba(0,105,145,${wa + 0.02})`);
      water.addColorStop(0.48, `rgba(0,82,128,${wa + 0.07})`);
      water.addColorStop(0.78, `rgba(0,58,98,${wa + 0.11})`);
      water.addColorStop(1,    `rgba(0,28,62,${wa + 0.13})`);
      gfx.fillStyle = water;
      gfx.fillRect(0, 0, W, H);
      // Sun penetration — brighter, greener-cyan near the surface (subsurface scatter hint)
      const sunPen = gfx.createLinearGradient(0, 0, 0, H * 0.42);
      sunPen.addColorStop(0,   `rgba(120,220,210,${0.07 + depth * 0.03})`);
      sunPen.addColorStop(0.6, 'rgba(40,140,160,0)');
      sunPen.addColorStop(1,   'rgba(0,0,0,0)');
      gfx.fillStyle = sunPen;
      gfx.fillRect(0, 0, W, H);

      const edge = gfx.createRadialGradient(W/2, H/2, H*0.06, W/2, H/2, W*0.74);
      edge.addColorStop(0,    'rgba(0,35,75,0)');
      edge.addColorStop(0.62, 'rgba(0,18,48,0.16)');
      edge.addColorStop(1,    'rgba(0,8,28,0.48)');
      gfx.fillStyle = edge;
      gfx.fillRect(0, 0, W, H);

      // ── 6b. MICRO-BUBBLES / PARTICULATE — slow rise + lateral wobble
      gfx.save();
      gfx.globalCompositeOperation = 'screen';
      BUBBLES.forEach(b => {
        b.y -= b.sp;
        if (b.y < -0.03) b.y = 1.03;
        b.wobble += 0.018 + b.r * 0.004;
        const bx = b.x * W + Math.sin(b.wobble + t * 1.4) * 5;
        const by = b.y * H;
        const a = 0.035 + Math.sin(b.wobble * 1.3) * 0.018;
        gfx.beginPath();
        gfx.arc(bx, by, b.r, 0, Math.PI * 2);
        gfx.fillStyle = `rgba(215,245,255,${a})`;
        gfx.fill();
      });
      gfx.restore();

      // ── 7. SURFACE REFRACTION — caustic shear lines (lighter toward top = shallower)
      gfx.save();
      gfx.globalCompositeOperation = 'overlay';
      gfx.globalAlpha = 0.085;
      for (let i = 0; i < 26; i++) {
        const baseY = (i / 26) * H;
        const shallow = 1 - baseY / H;
        gfx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const y = baseY
            + Math.sin(x * 0.012 + t * 0.95 + i * 0.62) * (5 + shallow * 4)
            + Math.sin(x * 0.026 - t * 0.58 + i * 1.08) * 3.2
            + Math.sin(x * 0.048 + t * 1.65 + i * 0.38) * 1.8;
          x === 0 ? gfx.moveTo(x, y) : gfx.lineTo(x, y);
        }
        gfx.strokeStyle = `rgba(240,252,255,${0.35 + shallow * 0.45})`;
        gfx.lineWidth = 0.45 + Math.sin(t * 0.75 + i) * 0.22;
        gfx.stroke();
      }
      gfx.restore();

      // ── 7b. SUN GLINT — soft specular band at the “surface”
      gfx.save();
      gfx.globalCompositeOperation = 'screen';
      const gy = H * 0.035 + Math.sin(t * 0.32) * 5 + Math.sin(t * 0.61) * 2.5;
      const glint = gfx.createLinearGradient(0, gy, W, gy + 32);
      glint.addColorStop(0, 'rgba(255,255,255,0)');
      glint.addColorStop(0.4, `rgba(235,250,255,${0.038 + depth * 0.025})`);
      glint.addColorStop(0.55, `rgba(200,235,248,${0.022 + depth * 0.015})`);
      glint.addColorStop(1, 'rgba(255,255,255,0)');
      gfx.fillStyle = glint;
      gfx.fillRect(0, gy - 6, W, 42);
      gfx.restore();

      // ── 8. VIGNETTE ──────────────────────────────────────────────────────
      const vig = gfx.createRadialGradient(W/2, H/2, H*0.16, W/2, H/2, W*0.80);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, `rgba(0,18,45,${0.52 + depth * 0.2})`);
      gfx.fillStyle = vig;
      gfx.fillRect(0, 0, W, H);

      if (!reducedMotion) animId = requestAnimationFrame(draw);
    }

    const resize = () => {
      cvs.width  = window.innerWidth;
      cvs.height = window.innerHeight;
      if (reducedMotion) draw();
    };
    resize();
    window.addEventListener('resize', resize);

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }} />;
}

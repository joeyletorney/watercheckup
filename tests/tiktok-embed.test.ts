import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { test } from 'node:test';
import { TikTokEmbed } from '../components/TikTokEmbed';

const VIDEO_ID = '7710434939006668046';
const VIDEO_URL = `https://www.tiktok.com/@joethewaterpro/video/${VIDEO_ID}`;
const PROFILE_URL = 'https://www.tiktok.com/@joethewaterpro';

test('TikTok facade does not load an iframe or embed.js until clicked', () => {
  const html = renderToStaticMarkup(
    createElement(TikTokEmbed, {
      videoId: VIDEO_ID,
      url: VIDEO_URL,
      heading: 'Watch: my top 3 pitchers in 37 seconds',
    }),
  );
  assert.match(html, /Watch: my top 3 pitchers in 37 seconds/);
  assert.match(html, /Watch on TikTok/);
  assert.match(html, new RegExp(VIDEO_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(html, /<iframe/);
  assert.doesNotMatch(html, /embed\.js/);
  assert.doesNotMatch(html, /tiktok\.com\/embed/);

  const source = readFileSync(join(process.cwd(), 'components/TikTokEmbed.tsx'), 'utf8');
  assert.match(source, /tiktok\.com\/embed\/v2\/\$\{videoId\}/);
  assert.doesNotMatch(source, /embed\.js/);
});

test('pitcher guide embeds the TikTok video after the intro and before the product list', () => {
  const page = readFileSync(join(process.cwd(), 'app/blog/[slug]/page.tsx'), 'utf8');
  assert.match(page, /best-water-filter-pitcher-2025/);
  assert.match(page, /TikTokEmbed/);
  assert.match(page, /7710434939006668046/);
  assert.match(page, /Watch: my top 3 pitchers in 37 seconds/);

  const tiktokIndex = page.indexOf('<TikTokEmbed');
  const videoIndex = page.indexOf('<PitcherCartridgeVideo');
  const productsIndex = page.indexOf('<BlogCommercialComparison');
  assert.ok(tiktokIndex > 0);
  assert.ok(videoIndex > tiktokIndex, 'TikTok embed should sit above the cartridge video');
  assert.ok(productsIndex > tiktokIndex, 'TikTok embed should sit before the product comparison');
});

test('footer includes a Follow on TikTok link that opens in a new tab', () => {
  const footer = readFileSync(join(process.cwd(), 'app/components/SiteFooter.tsx'), 'utf8');
  assert.match(footer, /Follow on TikTok/);
  assert.match(footer, new RegExp(PROFILE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(footer, /target="_blank"/);
  assert.match(footer, /rel="noopener"/);
});

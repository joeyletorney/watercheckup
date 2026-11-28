import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import sharp from 'sharp';

const root = process.cwd();
const jpg = join(root, 'public/media/dont-buy-filter-poster.jpg');
const webp = join(root, 'public/media/dont-buy-filter-poster.webp');

test('homepage filter-guide video uses the baked poster and does not preload the file', () => {
  const source = readFileSync(join(root, 'components/HomeFilterShop.tsx'), 'utf8');
  assert.match(source, /poster="\/media\/dont-buy-filter-poster\.jpg"/);
  assert.match(source, /preload="none"/);
  assert.match(source, /src="\/media\/filter-guide\.mp4"/);
  assert.doesNotMatch(source, /poster="\/media\/filter-guide\.jpg"/);
  assert.equal(existsSync(jpg), true);
  assert.equal(existsSync(webp), true);
});

test('filter-guide poster is 1280x720 JPEG and WebP', async () => {
  const jpegMeta = await sharp(jpg).metadata();
  assert.equal(jpegMeta.format, 'jpeg');
  assert.equal(jpegMeta.width, 1280);
  assert.equal(jpegMeta.height, 720);
  const webpMeta = await sharp(webp).metadata();
  assert.equal(webpMeta.format, 'webp');
  assert.equal(webpMeta.width, 1280);
  assert.equal(webpMeta.height, 720);
});

test('VideoObject JSON-LD for the filter guide, if present, points thumbnailUrl at the new poster', () => {
  const files = [
    'app/page.tsx',
    'app/layout.tsx',
    'app/HomeLanding.tsx',
    'components/HomeFilterShop.tsx',
    'lib/site-faq-schema.ts',
  ];
  for (const rel of files) {
    const source = readFileSync(join(root, rel), 'utf8');
    if (!/VideoObject/.test(source)) continue;
    assert.match(source, /dont-buy-filter-poster/);
  }
});

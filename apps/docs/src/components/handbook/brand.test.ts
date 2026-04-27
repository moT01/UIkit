import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const brandComponentPath = resolve(here, 'Brand.astro');

test('secondary brand mark declares a light preview surface', () => {
  const src = readFileSync(brandComponentPath, 'utf8');
  const secondary = src.match(
    /\{[\s\S]*?file:\s*'fcc-secondary\.svg'[\s\S]*?\}/
  );
  assert.ok(secondary, 'secondary brand mark entry must exist');
  assert.match(
    secondary?.[0] ?? '',
    /previewTone:\s*'light'/,
    'dark-fill secondary mark must render on a light tokenized preview surface'
  );
});

test('brand mark frames use palette classes instead of ad hoc recolouring', () => {
  const src = readFileSync(brandComponentPath, 'utf8');
  assert.match(
    src,
    /brand-marks__frame[^\n]*\$\{m\.previewTone === 'light' \? ' light-palette' : ''\}/,
    'brand preview frames must use the existing light-palette class for dark assets'
  );
  assert.doesNotMatch(
    src,
    /filter:\s*invert|mix-blend-mode|fill:\s*var\(/,
    'brand previews must not recolor SVGs with one-off CSS'
  );
});

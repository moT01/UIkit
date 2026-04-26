import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { FoundationsBand } from './FoundationsBand.js';

const here = dirname(fileURLToPath(import.meta.url));
const bandPath = resolve(here, 'FoundationsBand.tsx');

test('FoundationsBand declares exactly one MutationObserver', () => {
  const src = readFileSync(bandPath, 'utf8');
  const matches = src.match(/new\s+MutationObserver/g) ?? [];
  assert.equal(
    matches.length,
    1,
    `FoundationsBand must declare exactly one MutationObserver, found ${matches.length}`
  );
});

test('FoundationsBand observer filters on the class attribute', () => {
  const src = readFileSync(bandPath, 'utf8');
  assert.match(
    src,
    /attributeFilter:\s*\[[^\]]*['"]class['"]/,
    'observer must filter on `class` so palette swap triggers a re-read'
  );
});

test('FoundationsBand SSR markup contains one outer <section>', () => {
  const html = renderToStaticMarkup(<FoundationsBand />);
  const sections = html.match(/<section[\s>]/g) ?? [];
  assert.equal(
    sections.length,
    1,
    `expected exactly one <section>, found ${sections.length}`
  );
});

test('FoundationsBand SSR markup contains three subgroup headings', () => {
  const html = renderToStaticMarkup(<FoundationsBand />);
  for (const label of ['Gray ramp', 'Accents', 'Semantic']) {
    assert.ok(
      html.includes(label),
      `expected subgroup heading "${label}" in markup`
    );
  }
});

test('FoundationsBand SSR markup includes ≥ 8 swatches', () => {
  const html = renderToStaticMarkup(<FoundationsBand />);
  const cells = html.match(/class="swatch"/g) ?? [];
  assert.ok(cells.length >= 8, `expected ≥ 8 swatches, found ${cells.length}`);
});

test('FoundationsBand uses no hardcoded hex literals', () => {
  const src = readFileSync(bandPath, 'utf8');
  const hex = src.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
  assert.deepEqual(
    hex,
    [],
    `FoundationsBand must contain zero hex literals; found ${hex.join(', ')}`
  );
});

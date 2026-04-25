// Wave 6 P4 — `/guides/*` IA. The collection is the single source
// of truth for the per-package surface; the renderer at
// `src/pages/guides/[...slug].astro` and the index at
// `src/pages/guides/index.astro` consume it. These checks lock the
// six guides as a contract.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, '..', '..');
const guidesDir = resolve(appRoot, 'src', 'content', 'guides');

const guideFiles = existsSync(guidesDir)
  ? readdirSync(guidesDir).filter(name => name.endsWith('.mdx'))
  : [];

const REQUIRED_FRONTMATTER = ['title', 'eyebrow', 'summary', 'order'] as const;

test('Wave 6 ships at least six guides', () => {
  assert.ok(
    guideFiles.length >= 6,
    `expected 6+ guides under content/guides/, got ${guideFiles.length}`
  );
});

test('every guide declares the required frontmatter keys', () => {
  for (const file of guideFiles) {
    const src = readFileSync(resolve(guidesDir, file), 'utf8');
    for (const key of REQUIRED_FRONTMATTER) {
      assert.match(
        src,
        new RegExp(`^${key}:\\s+\\S`, 'm'),
        `${file} missing frontmatter key "${key}"`
      );
    }
  }
});

test('the guide renderer + index pages exist', () => {
  for (const path of [
    'src/pages/guides/index.astro',
    'src/pages/guides/[...slug].astro'
  ]) {
    assert.ok(existsSync(resolve(appRoot, path)), `expected ${path} to exist`);
  }
});

test('ProseLayout exists and is consumed by the guide renderer', () => {
  const layoutPath = resolve(appRoot, 'src', 'layouts', 'ProseLayout.astro');
  assert.ok(existsSync(layoutPath), 'ProseLayout.astro must exist');
  const renderer = readFileSync(
    resolve(appRoot, 'src', 'pages', 'guides', '[...slug].astro'),
    'utf8'
  );
  assert.match(
    renderer,
    /ProseLayout/,
    'guides/[...slug].astro must wrap content in ProseLayout'
  );
});

test('every guide carries enough `## ` headings to populate a TOC', () => {
  // Wave 7 P8 — ProseLayout's TOC harvests `<h2 id=...>`. With
  // `rehype-slug` wired (`apps/docs/astro.config.mjs`), every `## `
  // heading in MDX renders as `<h2 id=...>` in dist. So the source-
  // level invariant is: each guide must have ≥2 `## ` headings.
  for (const file of guideFiles) {
    const src = readFileSync(resolve(guidesDir, file), 'utf8');
    const matches = src.match(/^## /gm);
    assert.ok(
      matches && matches.length >= 2,
      `${file} must have >= 2 '## ' headings (TOC needs anchors); got ${matches?.length ?? 0}`
    );
  }
});

test('astro.config.mjs wires rehype-slug + rehype-autolink-headings', () => {
  // Spec L324 — without these, ProseLayout TOC silently empties.
  const cfg = readFileSync(resolve(appRoot, 'astro.config.mjs'), 'utf8');
  assert.match(
    cfg,
    /rehype-?[Ss]lug/,
    'astro.config.mjs must import rehype-slug'
  );
  assert.match(
    cfg,
    /rehype-?[Aa]utolink-?[Hh]eadings/,
    'astro.config.mjs must import rehype-autolink-headings'
  );
});

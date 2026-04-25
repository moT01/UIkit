// Wave 7 P7 — brand-handbook expansion contract. The /handbook page
// loads the `foundations` collection. Wave 6 shipped 6 entries
// (colors, typography, spacing, iconography, motion, voice). The
// user expected a freeCodeCamp Brand Guidelines handbook, not a
// token reference. P7 raises the floor to 8+ entries and adds the
// brand-specific topics (logo usage, do/don'ts, overview).
//
// Resume cue (WAVE-7-SPEC.md L316):
//   ls apps/docs/src/content/foundations/*.mdx | wc -l >= 8
//   grep -l "Voice|Logo|Iconography" apps/docs/src/content/foundations/*.mdx | wc -l >= 3
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const foundationsDir = resolve(here, '..', 'content', 'foundations');

const files = readdirSync(foundationsDir).filter(name => name.endsWith('.mdx'));

test('Wave 7 P7 — at least 8 foundations entries', () => {
  assert.ok(
    files.length >= 8,
    `expected >= 8 foundations MDX entries, got ${files.length} (${files.join(', ')})`
  );
});

test('every foundations entry declares title, eyebrow, summary, order', () => {
  for (const file of files) {
    const src = readFileSync(resolve(foundationsDir, file), 'utf8');
    const fmMatch = src.match(/^---\s*\n([\s\S]*?)\n---/);
    assert.ok(fmMatch, `${file} must start with --- frontmatter ---`);
    const fm = fmMatch[1];
    for (const key of ['title', 'eyebrow', 'summary', 'order']) {
      assert.match(
        fm,
        new RegExp(`^${key}:`, 'm'),
        `${file} frontmatter missing required key: ${key}`
      );
    }
  }
});

test('every foundations entry contains at least one ## heading', () => {
  for (const file of files) {
    const src = readFileSync(resolve(foundationsDir, file), 'utf8');
    assert.match(
      src,
      /^## /m,
      `${file} must contain at least one '## ' heading so the page TOC has anchors`
    );
  }
});

test('foundations orders are unique positive integers', () => {
  const orders = new Map<number, string>();
  for (const file of files) {
    const src = readFileSync(resolve(foundationsDir, file), 'utf8');
    const match = src.match(/^order:\s*(\d+)/m);
    assert.ok(match, `${file} must declare a numeric order`);
    const n = Number(match[1]);
    assert.ok(
      Number.isInteger(n) && n > 0,
      `${file} order must be a positive integer, got ${match[1]}`
    );
    assert.ok(
      !orders.has(n),
      `${file} reuses order ${n} (also: ${orders.get(n)})`
    );
    orders.set(n, file);
  }
});

test('at least 3 entries cover Voice / Logo / Iconography', () => {
  // Spec resume cue L316. The handbook is the brand guideline; these
  // three topics are the minimum coverage for the brand layer (voice
  // + logo + icon system). At least one file each must surface the
  // term in title, body, or both.
  const TARGETS = ['Voice', 'Logo', 'Iconography'];
  const matched = new Set<string>();
  for (const file of files) {
    const src = readFileSync(resolve(foundationsDir, file), 'utf8');
    for (const t of TARGETS) {
      const re = new RegExp(`\\b${t}\\b`);
      if (re.test(src)) matched.add(t);
    }
  }
  assert.ok(
    matched.size >= 3,
    `expected files covering Voice + Logo + Iconography; matched only [${[...matched].join(', ')}]`
  );
});

test('a brand-guidelines entry exists (logo usage / wordmark)', () => {
  // P7 acceptance row "brand": logo usage (clearspace, sizing,
  // do/don'ts), wordmark vs symbol, partner co-branding.
  const found = files.some(file => {
    const src = readFileSync(resolve(foundationsDir, file), 'utf8');
    return /\b(Logo|Wordmark|Brand)\b/i.test(src);
  });
  assert.ok(
    found,
    'expected a foundations entry covering Brand / Logo / Wordmark'
  );
});

test('a do/donts entry exists (cross-cutting examples)', () => {
  const found = files.some(file => {
    const src = readFileSync(resolve(foundationsDir, file), 'utf8');
    return /(Do(?:n[''’]?t)?\s*\/\s*Don[''’]?t|Do\b.+?Don[''’]?t|## Do\b)/i.test(
      src
    );
  });
  assert.ok(
    found,
    'expected a foundations entry with a Do / Don’t section (cross-cutting visual rules)'
  );
});

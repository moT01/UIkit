import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cardPath = resolve(here, '../components/site/PlaygroundCard.astro');

test('every <button class="showcase__tab"> declares type="button"', () => {
  const src = readFileSync(cardPath, 'utf8');
  // Find every <button …class='showcase__tab…'> opening tag.
  const buttonRe =
    /<button\b[^>]*class=['"][^'"]*\bshowcase__tab\b[^'"]*['"][^>]*>/g;
  const matches = src.match(buttonRe) ?? [];
  assert.ok(
    matches.length >= 2,
    `expected at least 2 .showcase__tab buttons, got ${matches.length}`
  );
  for (const tag of matches) {
    assert.match(
      tag,
      /\btype=['"]button['"]/,
      `tab button missing type='button': ${tag.replace(/\s+/g, ' ')}`
    );
  }
});

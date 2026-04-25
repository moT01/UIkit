import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const showcaseFiles = readdirSync(here)
  .filter(name => name.endsWith('.astro'))
  .map(name => resolve(here, name));

test('no showcase passes `previewPlain` (canonical chrome only)', () => {
  const offenders: string[] = [];
  for (const file of showcaseFiles) {
    const src = readFileSync(file, 'utf8');
    if (/\bpreviewPlain\b(?!\s*=\s*\{false\})/.test(src)) {
      offenders.push(file.replace(`${here}/`, ''));
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `Showcases passing previewPlain (must drop per W9-B12): ${offenders.join(', ')}`
  );
});

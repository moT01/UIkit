import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cfgPath = resolve(here, '../../vitest.config.ts');

const FLOOR = {
  statements: 85,
  branches: 80,
  functions: 85,
  lines: 85
};

test('vitest.config thresholds are at or above the floor', () => {
  const src = readFileSync(cfgPath, 'utf8');
  for (const [key, min] of Object.entries(FLOOR)) {
    const re = new RegExp(`${key}\\s*:\\s*(\\d+)`);
    const match = src.match(re);
    assert.ok(
      match,
      `vitest.config.ts must declare a numeric \`${key}\` threshold`
    );
    const value = Number(match[1]);
    assert.ok(
      value >= min,
      `${key} threshold ${value} must be >= ${min} (floor)`
    );
  }
});

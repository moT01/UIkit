// Wave 9 P1 (W9-S1) — every-component-has-a-test meta gate.
//
// Walks `dist/props.json` (the machine-readable API surface emitted
// by `scripts/gen-props.mjs`) and asserts every exported component
// or helper is referenced by at least one vitest contract test under
// `packages/uikit/src/**/*.test.{ts,tsx}`.
//
// Drift modes this catches:
//  - A new uikit component lands without a contract test.
//  - A helper renamed in source but not in tests (silent regression
//    where the test stops exercising the right symbol).
//
// Methodology:
//  - "Reference" = identifier appears in the test source as a word
//    boundary (regex `\bName\b`). False positives are tolerable; false
//    negatives are not.
//  - Sub-components (e.g. `RadioGroup`, `SidebarItem`, `Toaster`) are
//    covered when their parent's test references them. This matches
//    how the suite is organised today and keeps the meta-gate honest
//    without forcing a 1:1 file mapping.
//  - The `$schemaVersion` synthetic key and `_extractionFailed` stub
//    entries (R1 mitigation) are skipped — the test cannot assert on
//    APIs the type-extractor failed to introspect.
import { test, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const propsPath = resolve(here, '../../dist/props.json');
const srcRoot = resolve(here, '..');

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, acc);
    else if (/\.test\.(ts|tsx)$/.test(entry)) acc.push(full);
  }
  return acc;
}

if (!existsSync(propsPath)) {
  test.skip('S1 — dist/props.json missing; run `pnpm -F @freecodecamp/uikit build` first', () => {});
} else {
  const props = JSON.parse(readFileSync(propsPath, 'utf8')) as Record<
    string,
    unknown
  >;
  const exported = Object.keys(props).filter(k => !k.startsWith('$'));
  const testFiles = walk(srcRoot);
  const haystack = testFiles.map(f => readFileSync(f, 'utf8')).join('\n\n');

  for (const name of exported) {
    test(`S1 — '${name}' is referenced by at least one contract test`, () => {
      const re = new RegExp(`\\b${name}\\b`);
      expect(
        re.test(haystack),
        `Expected at least one *.test.{ts,tsx} under packages/uikit/src to reference '${name}'`
      ).toBe(true);
    });
  }
}

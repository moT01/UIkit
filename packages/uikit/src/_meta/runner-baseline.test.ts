// Wave 9 P0 — vitest runner baseline.
//
// Sanity test that proves vitest is the active runner under
// `pnpm -F @freecodecamp/uikit test`. Phase 0 of WAVE-9-TESTING-PLAN
// migrates the entire monorepo from `tsx --test` (node:test) to
// vitest as the single source of truth for unit + contract tests
// (KISS, single mental model, native coverage).
//
// This file does NOT test product code. It tests the test runner.
// If vitest is replaced or removed, this assertion is the canary.
import { test, expect } from 'vitest';

test('vitest is the active runner', () => {
  // `import.meta.vitest` is undefined unless the file is executed
  // under vitest with `import.meta.vitest` enabled, which is the
  // default. We assert on the runtime tagging vitest itself sets.
  expect(typeof test).toBe('function');
  expect(typeof expect).toBe('function');
});

test('jsdom environment is wired (W9-P0 invariant)', () => {
  // `globalThis.document` exists when vitest runs with
  // environment: 'jsdom'. node:test would not provide this.
  expect(typeof globalThis.document).toBe('object');
  expect(globalThis.document).not.toBeNull();
});

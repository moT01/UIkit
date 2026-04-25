// Wave 9 P0 — vitest runner baseline (apps/docs).
//
// Mirrors the uikit baseline. Asserts vitest is wired and (since the
// docs site exercises React-rendering tests via react-dom/server)
// runs under a node-compatible environment.
import { test, expect } from 'vitest';

test('vitest is the active runner', () => {
  expect(typeof test).toBe('function');
  expect(typeof expect).toBe('function');
});

test('process is available (node env)', () => {
  expect(typeof process).toBe('object');
  expect(process.env).toBeDefined();
});

// Wave 9 P0 — vitest runner baseline (uikit-tailwind).
import { test, expect } from 'vitest';

test('vitest is the active runner', () => {
  expect(typeof test).toBe('function');
  expect(typeof expect).toBe('function');
});

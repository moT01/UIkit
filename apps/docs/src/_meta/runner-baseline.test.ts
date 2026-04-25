import { test, expect } from 'vitest';

test('vitest is the active runner', () => {
  expect(typeof test).toBe('function');
  expect(typeof expect).toBe('function');
});

test('process is available (node env)', () => {
  expect(typeof process).toBe('object');
  expect(process.env).toBeDefined();
});

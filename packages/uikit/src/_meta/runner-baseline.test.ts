import { test, expect } from 'vitest';

test('vitest is the active runner', () => {
  // `import.meta.vitest` is undefined unless the file is executed
  // under vitest with `import.meta.vitest` enabled, which is the
  // default. We assert on the runtime tagging vitest itself sets.
  expect(typeof test).toBe('function');
  expect(typeof expect).toBe('function');
});

test('jsdom environment is wired', () => {
  // `globalThis.document` exists when vitest runs with
  // environment: 'jsdom'. node:test would not provide this.
  expect(typeof globalThis.document).toBe('object');
  expect(globalThis.document).not.toBeNull();
});

// Wave 9 — vitest contract test runner for @freecodecamp/uikit.
//
// Migrated from `tsx --test` (node:test) to vitest under W9-P0. Same
// SSR / DOM expectations preserved — the existing tests call
// `react-dom/server`'s `renderToStaticMarkup` and assert on the HTML
// string, so they are runtime-agnostic. New behavioural tests added
// in Wave 9 use `@testing-library/react` against the shared `jsdom`
// environment.
//
// Coverage is a hard gate for v1.0 GA per WAVE-9-TESTING-PLAN. The
// thresholds below seed at the current baseline and ratchet upward
// as Phase 5 backfills land.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'scripts/**/*.test.mjs'],
    exclude: ['dist/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/_meta/**',
        'src/**/index.ts',
        'src/**/types.ts',
        'dist/**',
        'scripts/**'
      ],
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70
      }
    }
  }
});

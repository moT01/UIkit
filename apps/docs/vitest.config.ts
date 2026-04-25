// Wave 9 — vitest unit + integration runner for @freecodecamp/uikit-docs.
//
// Migrated from `tsx --test` to vitest under W9-P0. Existing tests are
// SSR-only (`renderToStaticMarkup`) plus source-introspection — both
// runtime-agnostic. The test runner does NOT touch Playwright specs:
// `tests/visual/` and `tests/behavioural/` are owned by playwright.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'integrations/**/*.test.ts'
    ],
    exclude: ['dist/**', 'node_modules/**', 'tests/**', '.astro/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts', 'src/**/*.tsx', 'integrations/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/_meta/**',
        'src/env.d.ts',
        'src/showcase/**',
        'tests/**',
        'dist/**',
        '.astro/**'
      ],
      thresholds: {
        statements: 60,
        branches: 55,
        functions: 60,
        lines: 60
      }
    }
  }
});

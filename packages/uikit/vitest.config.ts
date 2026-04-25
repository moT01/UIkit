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
        // Wave 9 P5 — ratcheted from the 70/65/70/70 seed after the
        // L1 unit backfill landed (Textarea, DataTable, CommandPalette,
        // Dropdown, Listbox, Pagination, ToggleButton, Toast, Modal,
        // Combobox). Live coverage at 91.67 / 90.4 / 93.16 / 93.1, so
        // 85 / 80 / 85 / 85 protects the floor without flagging
        // jitter from new code that arrives mid-PR. Locked further by
        // src/_meta/coverage-thresholds.test.ts.
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85
      }
    }
  }
});

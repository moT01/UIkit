// Wave 9 — vitest runner for @freecodecamp/uikit-cdn build scripts.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['scripts/**/*.test.ts'],
    exclude: ['dist/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['scripts/**/*.ts', 'scripts/**/*.mjs'],
      exclude: ['scripts/**/*.test.ts', 'scripts/_meta/**', 'dist/**'],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60
      }
    }
  }
});

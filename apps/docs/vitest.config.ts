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
      include: [
        'src/components/**/*.ts',
        'src/components/**/*.tsx',
        'src/lib/**/*.ts',
        'integrations/**/*.ts'
      ],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/_meta/**',
        'src/env.d.ts',
        'src/**/*.client.ts',
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

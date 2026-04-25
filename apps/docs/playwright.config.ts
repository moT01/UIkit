import { defineConfig, devices } from '@playwright/test';

/**
 * Visual + behavioural Playwright harness for the docs site.
 *
 * Strategy: serve the **built** Astro output via `astro preview` so the
 * test target matches production output (no HMR script injection, no dev
 * overlays). CI builds once, then runs this suite against the preview
 * server; local runs expect a pre-built `dist/` — if you're iterating,
 * run `pnpm build` before `pnpm test:visual`.
 *
 * Tier layout:
 *  - `./tests/visual/`        — pixel-baseline goldens, four projects
 *                                (mobile, tablet, desktop, desktop-light).
 *  - `./tests/behavioural/`   — Wave 9 P0 — interaction contracts for
 *                                stateful primitives. Desktop-only;
 *                                independent project so a flaky behaviour
 *                                spec cannot cause visual goldens to
 *                                re-snapshot.
 *
 * Goldens live under `tests/visual/__snapshots__/` grouped by spec +
 * viewport. Update via `pnpm test:visual:update` after a deliberate
 * visual change, then diff the PNGs in code review.
 */
export default defineConfig({
  // Wave 9 P0 — broadened from `./tests/visual` so Playwright can also
  // pick up `./tests/behavioural`. Each project pins its own `testDir`
  // or `testMatch` so the two tiers do not cross-pollinate.
  testDir: './tests',
  snapshotPathTemplate:
    '{testDir}/__snapshots__/{testFilePath}/{arg}-{projectName}{ext}',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
    // Deterministic rendering: no animations, no reduced-motion surprises
    // when the platform toggles it mid-run.
    reducedMotion: 'reduce'
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled',
      caret: 'hide'
    }
  },
  projects: [
    {
      name: 'mobile',
      testDir: './tests/visual',
      use: { viewport: { width: 375, height: 667 }, deviceScaleFactor: 2 }
    },
    {
      name: 'tablet',
      testDir: './tests/visual',
      use: { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2 }
    },
    {
      name: 'desktop',
      testDir: './tests/visual',
      use: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }
    },
    // Wave 8 P6 (W8-9) — dark + light parity. Re-runs the
    // `routes`, `playground-card`, and `handbook` specs at desktop
    // viewport with a `light-palette` class set on `<html>` before
    // any user code runs. Goldens auto-suffix via the existing
    // `{projectName}` token in `snapshotPathTemplate`. Path filters
    // were rejected (D7) because non-CSS regressions (component
    // conditionals, JS theme toggles, asset paths) can break light
    // mode without touching `*.css` — every-PR gate is the contract.
    {
      name: 'desktop-light',
      testDir: './tests/visual',
      testMatch: [
        '**/routes.spec.ts',
        '**/playground-card.spec.ts',
        '**/handbook.spec.ts'
      ],
      use: {
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1
      }
    },
    // Wave 9 P0 — behavioural tier. Desktop viewport only; the
    // primitives whose interaction contracts we lock here behave
    // identically across viewports for the contracts we assert
    // (click-to-toggle, type-to-filter, focus-to-show). Mobile/tablet
    // touch-specific behaviour is out of scope for v1.0 GA.
    {
      name: 'behavioural-desktop',
      testDir: './tests/behavioural',
      use: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }
    }
  ],
  webServer: {
    command: 'pnpm preview --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});

// `devices` re-export keeps IDE auto-import happy if a spec wants a real
// device profile for a one-off regression.
export { devices };

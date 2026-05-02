import { test, expect } from '@playwright/test';

// Silence any in-page IntersectionObserver scroll-spy wiring — those
// observers fire repeatedly as Playwright scrolls the page to stitch a
// full-page screenshot, drifting sidebar active-state between retries.
// Pages that run a scroll-spy (showcase) bail early when this flag is
// set.
test.beforeEach(async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    (window as unknown as { __NO_SPY__: boolean }).__NO_SPY__ = true;
  });
  if (testInfo.project.name === 'desktop-light') {
    await page.addInitScript(() => {
      document.documentElement.classList.remove('dark-palette');
      document.documentElement.classList.add('light-palette');
    });
  }
});

/**
 * Baseline visual regression — one golden per (route × viewport).
 *
 * Route set: every page whose layout is **shipped** (full MDX pages +
 * Astro-authored surfaces). Stubs and storybook-only components stay
 * out of this suite until they graduate to full pages — flip-flopping
 * goldens against half-finished copy is noise.
 *
 * If you add a full page, add its path here. If you intentionally change
 * the look of a page, run `pnpm test:visual:update` and review the
 * diffed PNGs as part of the same commit.
 */

// `/playground` is the dogfood index — its `client:visible` islands
// hydrate non-deterministically (toast pop, command-palette overlay,
// async syntax-highlight ticks). Per-card snapshots in
// `playground-card.spec.ts` cover the same surface deterministically;
// keeping a fullPage shot here only buys flake.
const surfaces: readonly string[] = ['/', '/handbook'];

const routes = [...surfaces];

for (const path of routes) {
  const label =
    path === '/' ? 'landing' : path.replace(/^\//, '').replace(/\//g, '-');

  test(`${label} renders stably`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });

    // Fonts can race the first paint and shift the snapshot hash.
    await page.evaluate(async () => {
      if ('fonts' in document) {
        await document.fonts.ready;
      }
    });

    // Kill the typewriter animation on the landing page so the terminal
    // body renders in its final "painted whole script" state regardless
    // of timing.
    await page.addStyleTag({
      content:
        '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });

    // Force every `client:visible` island to hydrate before screenshot:
    // walk the page top → bottom → top so each section enters the
    // viewport once. Without this, Playwright's fullPage stitching
    // hydrates islands mid-capture, producing DOM mutation between
    // consecutive stability frames and timing out the screenshot.
    await page.evaluate(async () => {
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const viewportHeight = window.innerHeight;
      for (let y = 0; y <= docHeight; y += viewportHeight) {
        window.scrollTo(0, y);
        await new Promise(r => requestAnimationFrame(() => r(null)));
      }
      window.scrollTo(0, 0);
      await new Promise(r => requestAnimationFrame(() => r(null)));
    });
    // Wait for every <img> to finish decoding so lazy images do not
    // shift layout between consecutive stability frames.
    await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map(img =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : new Promise<void>(resolve => {
                img.addEventListener('load', () => resolve(), { once: true });
                img.addEventListener('error', () => resolve(), { once: true });
              })
        )
      );
    });
    // Final networkidle — any island that fired an XHR on hydrate
    // (e.g. the search-index island) must finish before capture.
    await page.waitForLoadState('networkidle');

    // Poll the document height until it holds steady for ≥ 4 frames.
    // `/playground` is ~41k px tall and a few of its `client:visible`
    // islands re-layout on hydrate; without this gate the screenshot
    // helper's stability check intermittently catches the page
    // mid-reflow.
    await expect
      .poll(
        async () =>
          page.evaluate(() => {
            return new Promise<number>(resolve => {
              let last = -1;
              let stable = 0;
              const tick = () => {
                const h = Math.max(
                  document.documentElement.scrollHeight,
                  document.body.scrollHeight
                );
                if (h === last) {
                  stable += 1;
                  if (stable >= 4) {
                    resolve(h);
                    return;
                  }
                } else {
                  stable = 0;
                  last = h;
                }
                requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            });
          }),
        { timeout: 10_000, intervals: [50] }
      )
      .toBeGreaterThan(0);

    await expect(page).toHaveScreenshot(`${label}.png`, {
      fullPage: true,
      // `/playground` is huge (≈ 41k px tall) — the default 5 s
      // stability window can lapse on the slowest viewport before
      // every lazy island settles. 20 s leaves headroom without
      // masking real flakiness.
      timeout: 20_000
    });
  });
}

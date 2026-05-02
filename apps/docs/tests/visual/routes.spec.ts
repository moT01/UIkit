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

const surfaces: readonly string[] = ['/', '/playground', '/handbook'];

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
    // consecutive stability frames and timing out at 5 s.
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
    // One more networkidle — any island that fired an XHR on hydrate
    // (e.g. the search-index island) must finish before capture.
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot(`${label}.png`, {
      fullPage: true
    });
  });
}

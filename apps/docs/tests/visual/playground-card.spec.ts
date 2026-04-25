// Wave 7 P9 — visual regression on PlaygroundCard. Pins the per-component
// visual contract that Wave 6 ('45 cards' / 'all live React previews')
// promised but never validated. Wave 7 P5 + P6 made every preview a real
// React render; this suite locks the rendered DOM shape against per-slug
// goldens for the cards that exercise distinct primitive layers:
//
//   - button   — primitive layer, default-open anatomy block
//   - combobox — stateful island (client:visible)
//   - modal    — stateful island (client:load, button trigger)
//   - navbar   — composite layout (3-zone)
//   - table    — data-display layout (multi-row)
//
// `/` itself stays out of full-page snapshot — too tall, too volatile.
// Per-card screenshots target the `<section id=...>` anchor for the
// chosen slug.
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __NO_SPY__: boolean }).__NO_SPY__ = true;
  });
});

const SLUGS: readonly string[] = [
  'button',
  'combobox',
  'modal',
  'navbar',
  'table'
];

for (const slug of SLUGS) {
  test(`PlaygroundCard ${slug} renders stably`, async ({ page }) => {
    await page.goto(`/#${slug}`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      if ('fonts' in document) await document.fonts.ready;
    });
    await page.addStyleTag({
      content:
        '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });
    const card = page.locator(`section#${slug}`);
    await card.scrollIntoViewIfNeeded();
    // Stateful islands (combobox, modal) need a hydration tick before
    // the snapshot is stable. networkidle covers most; a short
    // request-animation-frame settles the last few.
    await page.evaluate(
      () => new Promise(resolve => requestAnimationFrame(() => resolve(null)))
    );
    await expect(card).toHaveScreenshot(`playground-card-${slug}.png`);
  });
}

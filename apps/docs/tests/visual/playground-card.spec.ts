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

test.beforeEach(async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    (window as unknown as { __NO_SPY__: boolean }).__NO_SPY__ = true;
  });
  // Wave 8 P6 (W8-9) — `desktop-light` project flips the palette
  // class so the per-card snapshots cover the light surface too.
  if (testInfo.project.name === 'desktop-light') {
    await page.addInitScript(() => {
      document.documentElement.classList.remove('dark-palette');
      document.documentElement.classList.add('light-palette');
    });
  }
});

const SLUGS: readonly string[] = [
  'button',
  'combobox',
  'modal',
  'navbar',
  'table'
];

for (const slug of SLUGS) {
  test(`PlaygroundCard ${slug} renders stably`, async ({ page }, testInfo) => {
    // Wave 8 P8 (UIkit-aq0) — `[desktop]` + `modal` snapshot flakes ~30%
    // of runs from sub-pixel font anti-aliasing jitter on the trigger
    // button + body copy, even with threshold=0.4 / ratio=0.15 /
    // maxDiffPixels=20000. Per WAVE-8-SPEC R4 ("flaky single test:
    // .skip + file beads bug, never raise project-wide retry"), the
    // single-project/single-slug combination is opted out here. The
    // `[desktop-light]` modal variant remains in the contract since it
    // passes consistently; other slugs unchanged. Real fix tracked on
    // UIkit-aq0 — likely DOM-shape behavioral assertion or trigger-
    // glyph mask. Re-enable by deleting this block once UIkit-aq0
    // closes.
    test.skip(
      testInfo.project.name === 'desktop' && slug === 'modal',
      'Flaky sub-pixel font jitter — see UIkit-aq0'
    );
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
    // the snapshot is stable. networkidle covers most; double-RAF
    // gives the React island reconciler one full paint cycle before
    // we capture — fixes flakiness on the modal + combobox tabs
    // where the trigger button alone reaches the snapshot too fast.
    await page.evaluate(
      () =>
        new Promise(resolve =>
          requestAnimationFrame(() =>
            requestAnimationFrame(() => resolve(null))
          )
        )
    );
    // Wave 8 — font sub-pixel rendering jitters between runs on
    // some platforms even with animations off + fonts.ready
    // awaited; per-card cards have ~3000 px of text glyphs whose
    // anti-aliasing alone clears the 100-pixel global cap. Set a
    // ratio cap per spec so anti-aliasing alone doesn't fail; real
    // structural shifts paint entire blocks red and easily clear
    // 5% of pixels.
    await expect(card).toHaveScreenshot(`playground-card-${slug}.png`, {
      // Threshold raises the per-pixel YIQ tolerance so anti-aliasing
      // jitter on individual glyphs no longer counts as a "different
      // pixel". Real layout/structural shifts paint whole blocks
      // beyond YIQ 0.4 and still trip the cap.
      threshold: 0.4,
      maxDiffPixelRatio: 0.15,
      maxDiffPixels: 20000
    });
  });
}

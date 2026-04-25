// Wave 7 P9 — sidebar active-state regression. Wave 7 P2 fixed the
// hash-aware `isActiveHrefWithHash` helper + scroll-spy wiring on
// AppSidebar. This spec locks the runtime contract: scroll the home
// page to a given component anchor, assert the sidebar entry for that
// slug carries `data-active="true"`. If P2's spy regresses, this fails.
import { test, expect } from '@playwright/test';

const SLUGS: readonly string[] = ['button', 'modal', 'table'];

for (const slug of SLUGS) {
  test(`scrolling to #${slug} marks the sidebar entry active`, async ({
    page
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      if ('fonts' in document) await document.fonts.ready;
    });
    // Land at the section. The spy enhancer reads scroll position +
    // hash on hashchange + scroll, so navigating via `location.hash`
    // is enough to trigger the active-state flip.
    await page.evaluate(s => {
      const el = document.getElementById(s);
      el?.scrollIntoView({ behavior: 'auto', block: 'start' });
      location.hash = `#${s}`;
    }, slug);
    // Give the spy one frame to react.
    await page.evaluate(
      () => new Promise(resolve => requestAnimationFrame(() => resolve(null)))
    );
    const link = page.locator(
      `[data-sidebar-link][data-target="${slug}"], [data-sidebar-link][href$="#${slug}"]`
    );
    await expect(link.first()).toHaveAttribute('data-active', 'true');
  });
}

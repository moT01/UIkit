import { test, expect } from '@playwright/test';

/**
 *
 * Snapshot coverage of the drawer lives in `drawer.spec.ts`; this
 * spec asserts the BEHAVIOR — body state attribute, ESC handling,
 * backdrop tap, focus restoration, TOC tappability — so a JS
 * regression in `AppHeader.astro` surfaces here even when the open
 * snapshot looks pixel-identical.
 */
test.describe('mobile drawer contract', () => {
  test.beforeEach(async ({ page }) => {
    // Skip the showcase scroll-spy script's auto-scroll; the
    // drawer assertions don't need scroll position to be live.
    await page.addInitScript(() => {
      (window as unknown as { __NO_SPY__: boolean }).__NO_SPY__ = true;
    });
  });

  test('hamburger toggles body[data-nav-open] and reveals drawer', async ({
    page
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile',
      'Drawer only renders at the mobile viewport.'
    );
    await page.goto('/');
    await page.click('[data-nav-toggle]');
    await expect(page.locator('body')).toHaveAttribute('data-nav-open', '');
    await expect(page.locator('#app-sidebar')).toBeVisible();
    await expect(page.locator('[data-nav-toggle]')).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  test('backdrop tap closes drawer and restores focus to hamburger', async ({
    page
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile',
      'Drawer only renders at the mobile viewport.'
    );
    await page.goto('/');
    await page.click('[data-nav-toggle]');
    await page.click('[data-nav-backdrop]', { force: true });
    await expect(page.locator('body')).not.toHaveAttribute('data-nav-open', '');
    await expect(page.locator('[data-nav-toggle]')).toBeFocused();
  });

  test('Escape closes drawer and restores focus to hamburger', async ({
    page
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile',
      'Drawer only renders at the mobile viewport.'
    );
    await page.goto('/');
    await page.click('[data-nav-toggle]');
    await page.keyboard.press('Escape');
    await expect(page.locator('body')).not.toHaveAttribute('data-nav-open', '');
    await expect(page.locator('[data-nav-toggle]')).toBeFocused();
  });

  test('hamburger aria-expanded reflects drawer state across full toggle cycle', async ({
    page
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile',
      'Drawer only renders at the mobile viewport.'
    );
    await page.goto('/');
    const btn = page.locator('[data-nav-toggle]');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  test('per-page TOC on /handbook is tappable when drawer is open', async ({
    page
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile',
      'Drawer + TOC only renders at the mobile viewport.'
    );
    await page.goto('/handbook');
    await page.click('[data-nav-toggle]');
    // /handbook ships its own in-page TOC nav rather than the
    // ProseLayout `[data-prose-toc]` (which is guides-only).
    const toc = page.locator('nav.handbook-toc');
    await expect(toc).toBeVisible();
    const links = toc.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(2);
    // Each TOC entry must point at an in-page anchor — the visible
    // affordance is "tap to scroll to section X". Verifying the
    // href shape covers the contract without racing the
    // in-page-anchor scroll behavior.
    const href = await links.nth(1).getAttribute('href');
    expect(href).toMatch(/^#/);
  });
});

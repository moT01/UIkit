// Wave 9 P0 — behavioural Playwright tier baseline.
//
// Sentinel spec that proves the behavioural test directory is wired
// into `playwright.config.ts` and the docs preview server starts.
// Phase 6 of WAVE-9-TESTING-PLAN backfills one behavioural spec per
// stateful primitive (tabs, pagination, listbox, command-palette,
// modal, dropdown, tooltip, toast, form-stepper, ...).
//
// This file is intentionally minimal — it asserts the page loads
// and the canonical chrome is present. Spec authors copy-and-extend
// it for each primitive in Phase 6.
import { test, expect } from '@playwright/test';

test.describe('@behavioural baseline', () => {
  test('docs landing page serves the canonical playground chrome', async ({
    page
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    // First card on the playground is `button` — used as the chrome
    // golden everywhere else in the audit. If this assertion fails,
    // the whole behavioural tier is suspect.
    const buttonCard = page.locator('section#button');
    await expect(buttonCard).toBeVisible();
    await expect(buttonCard.locator('.showcase__head-title')).toContainText(
      /button/i
    );
    await expect(
      buttonCard.locator('.showcase__tab[data-tab="react"]')
    ).toBeVisible();
    await expect(
      buttonCard.locator('.showcase__tab[data-tab="html"]')
    ).toBeVisible();
  });
});

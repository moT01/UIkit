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

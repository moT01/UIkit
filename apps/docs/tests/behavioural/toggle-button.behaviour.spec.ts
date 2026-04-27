import { test, expect } from '@playwright/test';

test.describe('@behavioural toggle-button', () => {
  test('seed states paint correctly', async ({ page }) => {
    await page.goto('/playground#toggle-button', { waitUntil: 'networkidle' });
    const card = page.locator('section#toggle-button .showcase__preview');
    const buttons = card.locator('button.toggle-btn');
    await expect(buttons).toHaveCount(2);
    await expect(buttons.nth(0)).toHaveAttribute('aria-pressed', 'false');
    await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'true');
  });

  test('click flips aria-pressed on each independent toggle', async ({
    page
  }) => {
    await page.goto('/playground#toggle-button', { waitUntil: 'networkidle' });
    const card = page.locator('section#toggle-button .showcase__preview');
    const buttons = card.locator('button.toggle-btn');
    await buttons.nth(0).click();
    await expect(buttons.nth(0)).toHaveAttribute('aria-pressed', 'true');
    // The second toggle is unaffected by clicks on the first.
    await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await buttons.nth(1).click();
    await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'false');
  });
});

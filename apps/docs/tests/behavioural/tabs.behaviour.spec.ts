import { test, expect } from '@playwright/test';

test.describe('@behavioural tabs', () => {
  test('first tab is active by default; click second flips aria-selected', async ({
    page
  }) => {
    await page.goto('/playground#tabs', { waitUntil: 'networkidle' });
    const card = page.locator('section#tabs');
    await expect(card).toBeVisible();
    const tabs = card.locator('.showcase__preview .tabs__tab');
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'false');
    await tabs.nth(1).click();
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking the third tab activates it and deactivates the others', async ({
    page
  }) => {
    await page.goto('/playground#tabs', { waitUntil: 'networkidle' });
    const tabs = page.locator('section#tabs .showcase__preview .tabs__tab');
    await tabs.nth(2).click();
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'false');
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
  });
});

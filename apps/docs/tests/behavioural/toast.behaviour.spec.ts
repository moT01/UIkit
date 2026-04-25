import { test, expect } from '@playwright/test';

const TRIGGER = 'button:has-text("Trigger toast")';

test.describe('@behavioural toast', () => {
  test('trigger mounts a dismissible "Saved" toast', async ({ page }) => {
    await page.goto('/#toast', { waitUntil: 'networkidle' });
    const card = page.locator('section#toast .showcase__preview');
    await expect(card).toBeVisible();
    // Reference gallery has 3 non-dismissible toasts.
    await expect(card.locator('.toast')).toHaveCount(3);
    await expect(
      card.locator('.toast__title', { hasText: 'Saved' })
    ).toHaveCount(0);
    await card.locator(TRIGGER).click();
    await expect(card.locator('.toast')).toHaveCount(4);
    await expect(
      card.locator('.toast__title', { hasText: 'Saved' })
    ).toBeVisible();
  });

  test('Dismiss button removes the toast from the DOM', async ({ page }) => {
    await page.goto('/#toast', { waitUntil: 'networkidle' });
    const card = page.locator('section#toast .showcase__preview');
    await card.locator(TRIGGER).click();
    const saved = card
      .locator('.toast')
      .filter({ has: page.locator('.toast__title', { hasText: 'Saved' }) });
    await expect(saved).toHaveCount(1);
    await saved.getByRole('button', { name: 'Dismiss' }).click();
    await expect(card.locator('.toast')).toHaveCount(3);
    await expect(
      card.locator('.toast__title', { hasText: 'Saved' })
    ).toHaveCount(0);
  });
});

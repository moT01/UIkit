import { test, expect } from '@playwright/test';

test.describe('@behavioural select', () => {
  test('seed value matches defaultValue', async ({ page }) => {
    await page.goto('/playground#select', { waitUntil: 'networkidle' });
    const card = page.locator('section#select .showcase__preview');
    const select = card.locator('select#difficulty-demo');
    await expect(select).toBeVisible();
    await expect(select).toHaveValue('intermediate');
  });

  test('selectOption updates the value', async ({ page }) => {
    await page.goto('/playground#select', { waitUntil: 'networkidle' });
    const card = page.locator('section#select .showcase__preview');
    const select = card.locator('select#difficulty-demo');
    await select.selectOption('advanced');
    await expect(select).toHaveValue('advanced');
  });
});

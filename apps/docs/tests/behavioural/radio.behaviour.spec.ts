import { test, expect } from '@playwright/test';

test.describe('@behavioural radio', () => {
  test('RadioGroup pre-selects the matching Radio from defaultValue', async ({
    page
  }) => {
    await page.goto('/#radio', { waitUntil: 'networkidle' });
    const card = page.locator('section#radio');
    await expect(card).toBeVisible();
    const darkRadio = card.locator('input[type="radio"][value="dark"]');
    const lightRadio = card.locator('input[type="radio"][value="light"]');
    const systemRadio = card.locator('input[type="radio"][value="system"]');
    await expect(darkRadio).toBeChecked();
    await expect(lightRadio).not.toBeChecked();
    await expect(systemRadio).not.toBeChecked();
  });

  test('Clicking another Radio updates the group selection', async ({
    page
  }) => {
    await page.goto('/#radio', { waitUntil: 'networkidle' });
    const card = page.locator('section#radio');
    const lightLabel = card.locator('label.radio:has-text("Light")');
    await lightLabel.click();
    await expect(card.locator('input[value="light"]')).toBeChecked();
    await expect(card.locator('input[value="dark"]')).not.toBeChecked();
  });
});

import { test, expect } from '@playwright/test';

test.describe('@behavioural input', () => {
  test('renders type=email input with the seeded placeholder', async ({
    page
  }) => {
    await page.goto('/#input', { waitUntil: 'networkidle' });
    const card = page.locator('section#input .showcase__preview');
    const input = card.locator('input#email-demo');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('type', 'email');
    await expect(input).toHaveAttribute('placeholder', 'camper@example.com');
  });

  test('typing updates the input value', async ({ page }) => {
    await page.goto('/#input', { waitUntil: 'networkidle' });
    const card = page.locator('section#input .showcase__preview');
    const input = card.locator('input#email-demo');
    await input.fill('hi@freecodecamp.org');
    await expect(input).toHaveValue('hi@freecodecamp.org');
  });
});

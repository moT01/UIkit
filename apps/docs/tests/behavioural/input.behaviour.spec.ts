// Wave 9 P6.2 (W9-Phase 6) — Input behavioural contract.
//
// `<Input>` is a thin wrapper over a native `<input>`, so the
// browser owns the typing/value flow. The showcase ships:
//
//   <Input id='email-demo' type='email' placeholder='camper@example.com' />
//
// We lock the surface every consumer relies on: type forwards,
// placeholder paints, typing updates the input value.
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

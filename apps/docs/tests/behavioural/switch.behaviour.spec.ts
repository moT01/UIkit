// Wave 9 P6.1 (W9-Phase 6) — Switch behavioural contract.
//
// Switch is a styled `<input type='checkbox'>` wrapped in a label
// with a track + thumb skin. Browser owns the toggle. The showcase
// hydrates each `<Switch>` with `client:idle`, mostly to keep the
// `defaultChecked` SSR/hydration boundary clean. Two switches:
//
//   1. defaultChecked — "Keyboard shortcuts".
//   2. unchecked      — "Sound effects".
import { test, expect } from '@playwright/test';

test.describe('@behavioural switch', () => {
  test('seed states honour defaultChecked', async ({ page }) => {
    await page.goto('/#switch', { waitUntil: 'networkidle' });
    const card = page.locator('section#switch .showcase__preview');
    const inputs = card.locator('input[type="checkbox"]');
    await expect(inputs).toHaveCount(2);
    await expect(inputs.nth(0)).toBeChecked();
    await expect(inputs.nth(1)).not.toBeChecked();
  });

  test('click flips the underlying checkbox state', async ({ page }) => {
    await page.goto('/#switch', { waitUntil: 'networkidle' });
    const card = page.locator('section#switch .showcase__preview');
    // The native <input> is visually hidden — switches paint the
    // track + thumb skin via the wrapping <label>, so clicks are
    // dispatched on the label and propagate to the input.
    const labels = card.locator('label.switch');
    const inputs = card.locator('input[type="checkbox"]');
    await labels.nth(1).click();
    await expect(inputs.nth(1)).toBeChecked();
    await labels.nth(0).click();
    await expect(inputs.nth(0)).not.toBeChecked();
  });
});

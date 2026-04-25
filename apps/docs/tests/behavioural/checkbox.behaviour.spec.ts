// Wave 9 P6.1 (W9-Phase 6) — Checkbox behavioural contract.
//
// Checkbox is a thin wrapper over a native `<input type='checkbox'>`,
// so the browser owns the click → toggle wiring (no React state).
// The showcase ships two:
//
//   1. defaultChecked={true} — pre-checked, label "I accept the honor code".
//   2. unchecked            — label "Email me certificate alerts".
//
// This spec locks the seed states + click toggles them.
import { test, expect } from '@playwright/test';

test.describe('@behavioural checkbox', () => {
  test('seed states honour defaultChecked', async ({ page }) => {
    await page.goto('/#checkbox', { waitUntil: 'networkidle' });
    const card = page.locator('section#checkbox .showcase__preview');
    const inputs = card.locator('input[type="checkbox"]');
    await expect(inputs).toHaveCount(2);
    await expect(inputs.nth(0)).toBeChecked();
    await expect(inputs.nth(1)).not.toBeChecked();
  });

  test('click toggles the native checked state', async ({ page }) => {
    await page.goto('/#checkbox', { waitUntil: 'networkidle' });
    const card = page.locator('section#checkbox .showcase__preview');
    const inputs = card.locator('input[type="checkbox"]');
    await inputs.nth(1).click();
    await expect(inputs.nth(1)).toBeChecked();
    // Toggle the pre-checked one off.
    await inputs.nth(0).click();
    await expect(inputs.nth(0)).not.toBeChecked();
  });
});

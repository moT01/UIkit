// Wave 9 P6.2 (W9-Phase 6) — Select behavioural contract.
//
// `<Select>` is a thin wrapper over a native `<select>`. The
// showcase seeds:
//
//   <Select id='difficulty-demo' defaultValue='intermediate'>
//     <option value='beginner'>Beginner</option>
//     <option value='intermediate'>Intermediate</option>
//     <option value='advanced'>Advanced</option>
//   </Select>
//
// We lock the seed value + change-via-selectOption flow. Browser
// owns state.
import { test, expect } from '@playwright/test';

test.describe('@behavioural select', () => {
  test('seed value matches defaultValue', async ({ page }) => {
    await page.goto('/#select', { waitUntil: 'networkidle' });
    const card = page.locator('section#select .showcase__preview');
    const select = card.locator('select#difficulty-demo');
    await expect(select).toBeVisible();
    await expect(select).toHaveValue('intermediate');
  });

  test('selectOption updates the value', async ({ page }) => {
    await page.goto('/#select', { waitUntil: 'networkidle' });
    const card = page.locator('section#select .showcase__preview');
    const select = card.locator('select#difficulty-demo');
    await select.selectOption('advanced');
    await expect(select).toHaveValue('advanced');
  });
});

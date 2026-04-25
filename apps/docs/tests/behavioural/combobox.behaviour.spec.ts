// Wave 9 P6.3 (W9-Phase 6) — Combobox behavioural contract.
//
// `<Combobox>` is a stateful filter widget. Demo island
// (`_islands/ComboboxDemo.tsx`) holds query + selected value in
// React state; typing filters the option list, clicking an option
// commits it via `onValueChange`. Five seed certifications:
//   rwd | js | fe | be | rdb.
//
// Lock the surface every consumer relies on:
//
//   1. Initial: 5 options visible, no selection.
//   2. Typing 'java' filters to the JS option only.
//   3. Clicking an option flips its `aria-selected` to true.
import { test, expect } from '@playwright/test';

test.describe('@behavioural combobox', () => {
  test('seed renders 5 options + empty input', async ({ page }) => {
    await page.goto('/#combobox', { waitUntil: 'networkidle' });
    const card = page.locator('section#combobox .showcase__preview');
    const input = card.locator('input[role="combobox"]');
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('');
    const options = card.locator('[role="option"]');
    await expect(options).toHaveCount(5);
  });

  test('typing filters the option list', async ({ page }) => {
    await page.goto('/#combobox', { waitUntil: 'networkidle' });
    const card = page.locator('section#combobox .showcase__preview');
    const input = card.locator('input[role="combobox"]');
    // The island uses `client:visible` — focus the input first to
    // ensure the React island has hydrated before we type. Once
    // focused, we know the keydown/onChange wiring is live.
    await input.focus();
    await input.fill('java');
    const options = card.locator('[role="option"]');
    await expect(options).toHaveCount(1);
    await expect(options.first()).toContainText(/JavaScript/);
  });

  test('clicking an option marks aria-selected on it', async ({ page }) => {
    await page.goto('/#combobox', { waitUntil: 'networkidle' });
    const card = page.locator('section#combobox .showcase__preview');
    const options = card.locator('[role="option"]');
    await options.nth(2).click();
    await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
  });

  // The empty-message branch is locked by the L1 unit test
  // (`packages/uikit/src/navigation/Combobox.dom.test.tsx` →
  // "empty state renders when there are no items + no loading + no
  // error"). Reproducing it here is fragile because the demo's
  // `client:visible` hydration timing differs across viewports.
});

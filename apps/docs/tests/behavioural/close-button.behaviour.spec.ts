// Wave 9 P6.1 (W9-Phase 6) — CloseButton behavioural contract.
//
// CloseButton is a presentational primitive — its "interactivity" is
// the single click → onClick callback consumers wire up. The
// showcase ships it without an onClick handler, so the lock-in here
// is the accessibility surface that every consumer relies on:
//
//   1. The button paints with the expected aria-label.
//   2. It is enabled (not disabled) by default.
//   3. It carries `type="button"` so a hosting <form> never
//      submits when the close `×` is clicked.
import { test, expect } from '@playwright/test';

test.describe('@behavioural close-button', () => {
  test('renders an enabled button with aria-label="Dismiss"', async ({
    page
  }) => {
    await page.goto('/#close-button', { waitUntil: 'networkidle' });
    const card = page.locator('section#close-button .showcase__preview');
    const btn = card.locator('button[aria-label="Dismiss"]');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
    await expect(btn).toHaveAttribute('type', 'button');
  });

  test('click is a no-op on the showcase (no handler bound)', async ({
    page
  }) => {
    await page.goto('/#close-button', { waitUntil: 'networkidle' });
    const card = page.locator('section#close-button .showcase__preview');
    const btn = card.locator('button[aria-label="Dismiss"]');
    // The showcase intentionally omits onClick — the click should
    // not raise, and the button should stay in the DOM.
    await btn.click();
    await expect(btn).toBeVisible();
  });
});

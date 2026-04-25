// Wave 9 P2.2 (W9-B18) — radio behavioural contract.
//
// `<RadioGroup defaultValue="dark">` on `/#radio` MUST render the
// matching `<Radio>` pre-selected on first paint. The audit
// (LANDING-AUDIT.md B6/B18) caught the showcase shipping unchecked
// in every browser run because the React island never hydrated AND
// the uikit RadioGroup did not honour `defaultValue`.
//
// Phase 2.1 fixed the uikit primitive (defaultValue → context value).
// Phase 2.2 wires the showcase to hydrate (`client:idle`). This spec
// asserts the post-hydration state directly via the live preview.
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

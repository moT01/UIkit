import { test, expect } from '@playwright/test';

const TRIGGER = 'button:has-text("Open modal")';
const PANEL_OPEN = '.modal__panel[data-state="open"]';

test.describe('@behavioural modal', () => {
  test('trigger reveals the modal with the seeded title', async ({ page }) => {
    await page.goto('/#modal', { waitUntil: 'networkidle' });
    const card = page.locator('section#modal .showcase__preview');
    await expect(card).toBeVisible();
    await expect(page.locator(PANEL_OPEN)).toHaveCount(0);
    await card.locator(TRIGGER).click();
    const panel = page.locator(PANEL_OPEN);
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Reset progress?');
  });

  test('Escape closes the modal', async ({ page }) => {
    await page.goto('/#modal', { waitUntil: 'networkidle' });
    await page.locator(`section#modal ${TRIGGER}`).click();
    await expect(page.locator(PANEL_OPEN)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator(PANEL_OPEN)).toHaveCount(0);
  });

  test('Cancel button in the footer closes the modal', async ({ page }) => {
    await page.goto('/#modal', { waitUntil: 'networkidle' });
    await page.locator(`section#modal ${TRIGGER}`).click();
    const panel = page.locator(PANEL_OPEN);
    await expect(panel).toBeVisible();
    await panel.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.locator(PANEL_OPEN)).toHaveCount(0);
  });
});

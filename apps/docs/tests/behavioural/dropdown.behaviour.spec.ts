import { test, expect } from '@playwright/test';

const TOGGLE = 'button:has-text("Sort")';
const MENU = '[role="menu"]';
const ITEM = '[role="menuitem"]';

test.describe('@behavioural dropdown', () => {
  test('toggle opens the menu and flips aria-expanded', async ({ page }) => {
    await page.goto('/playground#dropdown', { waitUntil: 'networkidle' });
    const card = page.locator('section#dropdown .showcase__preview');
    await expect(card).toBeVisible();
    const toggle = card.locator(TOGGLE);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(card.locator(MENU)).toHaveCount(0);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(card.locator(MENU)).toBeVisible();
    await expect(card.locator(ITEM)).toHaveCount(3);
  });

  test('clicking a menu item closes the menu', async ({ page }) => {
    await page.goto('/playground#dropdown', { waitUntil: 'networkidle' });
    const card = page.locator('section#dropdown .showcase__preview');
    await card.locator(TOGGLE).click();
    await expect(card.locator(MENU)).toBeVisible();
    await card.locator(ITEM).first().click();
    await expect(card.locator(MENU)).toHaveCount(0);
    await expect(card.locator(TOGGLE)).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  test('Escape closes the menu', async ({ page }) => {
    await page.goto('/playground#dropdown', { waitUntil: 'networkidle' });
    const card = page.locator('section#dropdown .showcase__preview');
    await card.locator(TOGGLE).click();
    await expect(card.locator(MENU)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(card.locator(MENU)).toHaveCount(0);
  });
});

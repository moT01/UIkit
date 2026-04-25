import { test, expect } from '@playwright/test';

test.describe('@behavioural breadcrumb-rail', () => {
  test('home renders no breadcrumb sub-bar', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('.site-breadcrumb')).toHaveCount(0);
  });

  test('/handbook renders Home + Handbook with the leaf as current', async ({
    page
  }) => {
    await page.goto('/handbook', { waitUntil: 'networkidle' });
    const rail = page.locator('.site-breadcrumb');
    await expect(rail).toBeVisible();
    const items = rail.locator('.breadcrumb__item');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0).locator('a')).toHaveAttribute('href', '/');
    await expect(items.nth(0)).toContainText('Home');
    // Leaf has aria-current="page" via Breadcrumb's compound API.
    await expect(items.nth(1).locator('[aria-current="page"]')).toContainText(
      'Handbook'
    );
  });

  test('/guides/install renders 3 segments ending in Install (current)', async ({
    page
  }) => {
    await page.goto('/guides/install', { waitUntil: 'networkidle' });
    const items = page.locator('.site-breadcrumb .breadcrumb__item');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toContainText('Home');
    await expect(items.nth(1)).toContainText('Guides');
    await expect(items.nth(2).locator('[aria-current="page"]')).toContainText(
      'Install'
    );
  });
});

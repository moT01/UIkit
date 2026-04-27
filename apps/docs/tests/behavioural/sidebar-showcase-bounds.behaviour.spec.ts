import { test, expect } from '@playwright/test';

test.describe('@behavioural sidebar-showcase-bounds', () => {
  test('rendered Sidebar fits inside the showcase preview', async ({
    page
  }) => {
    await page.goto('/playground#sidebar', { waitUntil: 'networkidle' });
    const card = page.locator('section#sidebar .showcase__preview');
    await expect(card).toBeVisible();
    const sidebar = card.locator('.sidebar').first();
    await expect(sidebar).toBeVisible();
    const cardBox = await card.boundingBox();
    const sidebarBox = await sidebar.boundingBox();
    expect(cardBox).not.toBeNull();
    expect(sidebarBox).not.toBeNull();
    if (!cardBox || !sidebarBox) return;
    expect(
      sidebarBox.height,
      `sidebar height (${sidebarBox.height}) must fit inside the preview (${cardBox.height})`
    ).toBeLessThanOrEqual(cardBox.height);
    expect(
      sidebarBox.height,
      `sidebar showcase height capped at 480px (was ${sidebarBox.height})`
    ).toBeLessThanOrEqual(480);
  });
});

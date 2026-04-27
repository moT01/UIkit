import { test, expect } from '@playwright/test';

const SLUGS = ['sidebar-layout', 'stacked-layout', 'auth-layout'] as const;

test.describe('@behavioural layout-landscape', () => {
  for (const slug of SLUGS) {
    test(`${slug} preview renders in landscape (width > height)`, async ({
      page
    }) => {
      await page.goto(`/playground#${slug}`, { waitUntil: 'networkidle' });
      const preview = page
        .locator(`section#${slug} .showcase__preview > *`)
        .first();
      await expect(preview).toBeVisible();
      const box = await preview.boundingBox();
      expect(box, `${slug}: preview must have a bounding box`).not.toBeNull();
      if (!box) return;
      expect(
        box.width,
        `${slug}: preview must be at least 480px wide (was ${box.width})`
      ).toBeGreaterThanOrEqual(480);
      expect(
        box.width,
        `${slug}: landscape contract requires width > height (got ${box.width} × ${box.height})`
      ).toBeGreaterThan(box.height);
    });
  }
});

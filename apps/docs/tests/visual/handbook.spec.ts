import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    (window as unknown as { __NO_SPY__: boolean }).__NO_SPY__ = true;
  });
  if (testInfo.project.name === 'desktop-light') {
    await page.addInitScript(() => {
      document.documentElement.classList.remove('dark-palette');
      document.documentElement.classList.add('light-palette');
    });
  }
});

test('/handbook renders the full page stably', async ({ page }) => {
  await page.goto('/handbook', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.addStyleTag({
    content:
      '*, *::before, *::after { animation: none !important; transition: none !important; }'
  });
  await expect(page).toHaveScreenshot('handbook-full.png', { fullPage: true });
});

const NEW_SECTIONS: readonly string[] = ['overview', 'brand', 'do-donts'];

for (const slug of NEW_SECTIONS) {
  test(`/handbook#${slug} section renders stably`, async ({ page }) => {
    await page.goto(`/handbook#${slug}`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      if ('fonts' in document) await document.fonts.ready;
    });
    await page.addStyleTag({
      content:
        '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });
    const section = page.locator(`section#${slug}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveScreenshot(`handbook-${slug}.png`);
  });
}

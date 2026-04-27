import { test, expect } from '@playwright/test';

test.describe('@behavioural tooltip', () => {
  test('bubble carries role=tooltip + the seeded content text', async ({
    page
  }) => {
    await page.goto('/playground#tooltip', { waitUntil: 'networkidle' });
    const card = page.locator('section#tooltip .showcase__preview');
    const bubble = card.locator('[role="tooltip"]');
    await expect(bubble).toHaveCount(1);
    await expect(bubble).toHaveText(
      'Runs the public test suite against your code.'
    );
  });

  test('wrapper is keyboard-focusable (tabindex=0)', async ({ page }) => {
    await page.goto('/playground#tooltip', { waitUntil: 'networkidle' });
    const wrap = page.locator('section#tooltip .showcase__preview .tip');
    await expect(wrap).toHaveAttribute('tabindex', '0');
  });

  test('hovering the wrapper reveals the bubble (opacity goes positive)', async ({
    page
  }) => {
    await page.goto('/playground#tooltip', { waitUntil: 'networkidle' });
    const card = page.locator('section#tooltip .showcase__preview');
    const wrap = card.locator('.tip');
    const bubble = card.locator('[role="tooltip"]');
    const before = await bubble.evaluate(n =>
      parseFloat(getComputedStyle(n).opacity)
    );
    expect(before).toBe(0);
    await wrap.hover();
    // Allow the CSS transition (≤ var(--dur-fast) = 120ms) to apply.
    await expect
      .poll(
        async () =>
          await bubble.evaluate(n => parseFloat(getComputedStyle(n).opacity)),
        { timeout: 2000 }
      )
      .toBeGreaterThan(0);
  });
});

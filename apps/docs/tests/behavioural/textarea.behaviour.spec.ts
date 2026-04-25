// Wave 9 P6.2 (W9-Phase 6) — Textarea behavioural contract.
//
// `<Textarea>` wraps a native `<textarea>` (browser owns the typing
// flow). The showcase seeds:
//
//   <Textarea id='bio-demo' rows={3} placeholder='What are you learning right now?' />
//
// Lock: rows attribute is forwarded, placeholder paints, typed
// value updates the element.
import { test, expect } from '@playwright/test';

test.describe('@behavioural textarea', () => {
  test('renders <textarea> with the seeded rows + placeholder', async ({
    page
  }) => {
    await page.goto('/#textarea', { waitUntil: 'networkidle' });
    const card = page.locator('section#textarea .showcase__preview');
    const ta = card.locator('textarea#bio-demo');
    await expect(ta).toBeVisible();
    await expect(ta).toHaveAttribute('rows', '3');
    await expect(ta).toHaveAttribute(
      'placeholder',
      'What are you learning right now?'
    );
  });

  test('typing updates the textarea value', async ({ page }) => {
    await page.goto('/#textarea', { waitUntil: 'networkidle' });
    const card = page.locator('section#textarea .showcase__preview');
    const ta = card.locator('textarea#bio-demo');
    const text = 'TypeScript + Astro';
    await ta.fill(text);
    await expect(ta).toHaveValue(text);
  });
});

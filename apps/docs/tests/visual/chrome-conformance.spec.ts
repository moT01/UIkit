import { test, expect } from '@playwright/test';

const SLUGS: readonly string[] = [
  'text',
  'heading',
  'badge',
  'avatar',
  'divider',
  'spacer',
  'link',
  'image',
  'button',
  'toggle-button',
  'close-button',
  'input',
  'textarea',
  'select',
  'checkbox',
  'radio',
  'switch',
  'fieldset',
  'form-control',
  'form-group',
  'help-block',
  'form-stepper',
  'navbar',
  'sidebar',
  'tabs',
  'pagination',
  'listbox',
  'combobox',
  'command-palette',
  'breadcrumb',
  'modal',
  'dropdown',
  'tooltip',
  'toast',
  'alert',
  'callout',
  'skeleton',
  'empty-state',
  'card',
  'panel',
  'table',
  'data-table',
  'description-list',
  'sidebar-layout',
  'stacked-layout',
  'auth-layout'
];

// The canonical chrome contract — every showcase card must surface
// exactly this prefix of direct-child class signatures inside its
// `.showcase` shell. Sourced from `PlaygroundCard.astro` (the only
// chrome producer): head → preview → tabs → code. The preview
// modifier classes (`--stacked`, `--plain`) are part of the same
// `showcase__preview` token list — `class.item(0)` returns
// `showcase__preview` regardless. The copy-menu lives nested INSIDE
// `showcase__tabs`, not as its own direct child. Anatomy
// (`showcase__anatomy`) is conditionally rendered after the prefix
// and is checked by a dedicated B15 spec, not here.
const CANONICAL_DIRECT_CHILDREN: readonly string[] = [
  'showcase__head',
  'showcase__preview',
  'showcase__tabs',
  'showcase__code'
];

test.describe('@chrome S3 — every PlaygroundCard surfaces canonical chrome', () => {
  test.beforeEach(async ({ page }) => {
    // Showcases live at `/playground/` after the IA split (commit f1038b2).
    await page.goto('/playground/', { waitUntil: 'networkidle' });
  });

  for (const slug of SLUGS) {
    test(`${slug} has the canonical chrome direct-children`, async ({
      page
    }) => {
      const card = page.locator(`section#${slug} > .showcase`);
      await expect(card).toBeVisible();
      const childClasses = await card.evaluate((el: Element) => {
        const out: string[] = [];
        for (const child of Array.from(el.children)) {
          // Take the first class token — every chrome region uses a
          // single semantic class as its primary identifier; modifier
          // classes (e.g. `is-open`) come second and are ignored here.
          const token = child.classList.item(0);
          if (token) out.push(token);
        }
        return out;
      });
      // The canonical shell may render extra children at the tail
      // (e.g. an optional caption); we assert the FIRST N match the
      // canonical sequence in order. Anything missing or out of order
      // fails — anything extra is allowed at the tail only.
      const head = childClasses.slice(0, CANONICAL_DIRECT_CHILDREN.length);
      expect(head).toEqual(CANONICAL_DIRECT_CHILDREN);
    });
  }
});

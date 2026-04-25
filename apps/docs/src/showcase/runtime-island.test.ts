// Wave 7 P5 — runtime-island contract. Stateful components MUST mount
// real React via a `client:` directive; their preview MUST NOT be a
// static HTML mock. Wave 6 shipped 0 islands; Wave 7 P5 ships 11.
import { test } from 'vitest';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const showcaseDir = here;
const islandsDir = resolve(here, '_islands');

const STATEFUL: ReadonlyArray<{
  slug: string;
  hydration: 'load' | 'visible' | 'idle';
}> = [
  // Wave 9 P6.3 — promoted to `client:load` so the input hydrates
  // before the user can race past the visibility threshold.
  { slug: 'combobox', hydration: 'load' },
  { slug: 'command-palette', hydration: 'visible' },
  { slug: 'dropdown', hydration: 'visible' },
  { slug: 'form-stepper', hydration: 'visible' },
  { slug: 'listbox', hydration: 'visible' },
  { slug: 'modal', hydration: 'load' },
  { slug: 'pagination', hydration: 'visible' },
  // Wave 9 P2.2 (W9-B18) — Radio's parent-child context demands a
  // single React boundary; promoted from static SSR to a hydrated
  // island so `defaultValue` survives + clicks update selection.
  { slug: 'radio', hydration: 'idle' },
  { slug: 'switch', hydration: 'idle' },
  { slug: 'tabs', hydration: 'visible' },
  { slug: 'toast', hydration: 'load' },
  // Wave 9 P6.1 — promote toggle-button to a hydrated island so its
  // behavioural contract (click flips aria-pressed) is provable. Was
  // SSR-only in Wave 7.
  { slug: 'toggle-button', hydration: 'visible' },
  { slug: 'tooltip', hydration: 'idle' }
];

for (const { slug, hydration } of STATEFUL) {
  test(`${slug}.astro hydrates a real React component (client:${hydration})`, () => {
    const path = resolve(showcaseDir, `${slug}.astro`);
    const src = readFileSync(path, 'utf8');
    assert.match(
      src,
      new RegExp(`client:${hydration}`),
      `${slug}.astro must mount with client:${hydration}`
    );
  });
}

test('every stateful showcase imports either uikit or its island wrapper', () => {
  for (const { slug } of STATEFUL) {
    const path = resolve(showcaseDir, `${slug}.astro`);
    const src = readFileSync(path, 'utf8');
    const importsUikit = /from\s+['"]@freecodecamp\/uikit['"]/.test(src);
    const importsIsland = /from\s+['"]\.\/_islands\//.test(src);
    assert.ok(
      importsUikit || importsIsland,
      `${slug}.astro must import a uikit React component (direct or via _islands/)`
    );
  }
});

test('island wrappers exist for the demos that need internal state', () => {
  const required = [
    'ModalDemo.tsx',
    'ComboboxDemo.tsx',
    'CommandPaletteDemo.tsx',
    'DropdownDemo.tsx',
    'FormStepperDemo.tsx',
    'ListboxDemo.tsx',
    'PaginationDemo.tsx',
    'RadioDemo.tsx',
    'ToastDemo.tsx'
  ];
  for (const file of required) {
    assert.ok(
      existsSync(resolve(islandsDir, file)),
      `apps/docs/src/showcase/_islands/${file} must exist`
    );
  }
});

test('every stateful slug carries a client: directive', () => {
  let count = 0;
  for (const { slug } of STATEFUL) {
    const path = resolve(showcaseDir, `${slug}.astro`);
    if (/client:(load|visible|idle)/.test(readFileSync(path, 'utf8'))) {
      count++;
    }
  }
  assert.equal(
    count,
    STATEFUL.length,
    `all ${STATEFUL.length} stateful slugs must hydrate`
  );
});

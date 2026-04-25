// Wave 7 P5 — runtime-island contract. Stateful components MUST mount
// real React via a `client:` directive; their preview MUST NOT be a
// static HTML mock. Wave 6 shipped 0 islands; Wave 7 P5 ships 11.
import { test } from 'node:test';
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
  { slug: 'combobox', hydration: 'visible' },
  { slug: 'command-palette', hydration: 'visible' },
  { slug: 'dropdown', hydration: 'visible' },
  { slug: 'form-stepper', hydration: 'visible' },
  { slug: 'listbox', hydration: 'visible' },
  { slug: 'modal', hydration: 'load' },
  { slug: 'pagination', hydration: 'visible' },
  { slug: 'switch', hydration: 'idle' },
  { slug: 'tabs', hydration: 'visible' },
  { slug: 'toast', hydration: 'load' },
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
    'ToastDemo.tsx'
  ];
  for (const file of required) {
    assert.ok(
      existsSync(resolve(islandsDir, file)),
      `apps/docs/src/showcase/_islands/${file} must exist`
    );
  }
});

test('Wave 7 P5 — at least 11 showcases carry a client: directive', () => {
  let count = 0;
  for (const { slug } of STATEFUL) {
    const path = resolve(showcaseDir, `${slug}.astro`);
    if (/client:(load|visible|idle)/.test(readFileSync(path, 'utf8'))) {
      count++;
    }
  }
  assert.equal(count, STATEFUL.length, 'all 11 stateful slugs must hydrate');
});

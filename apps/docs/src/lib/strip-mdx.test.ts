// Wave 7 P8 — strip-mdx hardening. The Wave 6 implementation
// hardcoded a 6-name component blacklist. Runtime audit shows the
// docs MDX uses 20+ JSX component names; every one not in the list
// leaks into the `.md` agent endpoint as raw `<Component>` markup.
//
// Contract: stripMdx must remove ANY `<UpperCase>` tag (self-close
// or paired), single-line and multi-line `import`/`export`, and
// frontmatter, while preserving prose, links, code fences, and
// inline code.
import { test } from 'vitest';
import assert from 'node:assert/strict';
import { stripMdx } from './strip-mdx.ts';

test('strips YAML frontmatter from the head', () => {
  const input = `---
title: Button
eyebrow: Primitive · 01
summary: A button.
---

Body prose.`;
  const out = stripMdx(input);
  assert.equal(out, 'Body prose.');
});

test('strips single-line imports', () => {
  const input = `import { Foo } from '../foo';

Body.`;
  const out = stripMdx(input);
  assert.equal(out, 'Body.');
});

test('strips multi-line imports across lines', () => {
  const input = `import {
  Foo,
  Bar,
  Baz
} from '@freecodecamp/uikit';

Body prose.`;
  const out = stripMdx(input);
  assert.equal(out, 'Body prose.');
});

test('strips MDX named exports', () => {
  const input = `export const meta = { foo: 'bar' };

Body.`;
  const out = stripMdx(input);
  assert.equal(out, 'Body.');
});

test('strips self-closing JSX of unknown component names', () => {
  const input = `Some prose.

<AnatomySvg name="button" />

<NotInTheBlacklist foo="bar" />

More prose.`;
  const out = stripMdx(input);
  assert.equal(out, 'Some prose.\n\nMore prose.');
});

test('strips paired JSX of unknown component names', () => {
  const input = `Intro.

<DetailsForm
  ariaLabel="Demo"
  onSubmit={() => {}}
>
  <Field label="Name" />
</DetailsForm>

Outro.`;
  const out = stripMdx(input);
  assert.equal(out, 'Intro.\n\nOutro.');
});

test('preserves Markdown headings', () => {
  const input = `# Title

## Heading

### Sub`;
  const out = stripMdx(input);
  assert.equal(out, '# Title\n\n## Heading\n\n### Sub');
});

test('preserves prose, links, and inline code', () => {
  const input = `Read the [docs](/handbook). Use \`<Button />\` carefully.`;
  const out = stripMdx(input);
  assert.match(out, /Read the \[docs\]\(\/handbook\)/);
  assert.match(out, /`<Button \/>`/);
});

test('preserves fenced code blocks (including JSX inside fences)', () => {
  const input = `Setup:

\`\`\`tsx
import { Button } from '@freecodecamp/uikit';

<Button variant="cta">Run</Button>
\`\`\`

Done.`;
  const out = stripMdx(input);
  assert.match(out, /```tsx/);
  assert.match(out, /import \{ Button \}/);
  assert.match(out, /<Button variant="cta">Run<\/Button>/);
  assert.match(out, /^Done\.$/m);
});

test('preserves indented code blocks', () => {
  const input = `Plain text.

    indented code line
    another indented line

After.`;
  const out = stripMdx(input);
  assert.match(out, /    indented code line/);
});

test('handles a realistic showcase MDX file', () => {
  const input = `---
title: Button
eyebrow: Primitive · 01
status: stable
---

import PropTable from '../../components/site/PropTable.astro';
import { Button } from '@freecodecamp/uikit';

# Button

The workhorse.

<PropTable name="Button" />

## Variants

Use \`variant="cta"\` for the primary action:

\`\`\`tsx
<Button variant="cta">Start</Button>
\`\`\`

<DoDont
  do="Use one CTA per fold"
  dont="Stack two CTAs"
/>

Closing prose.`;
  const out = stripMdx(input);
  // Frontmatter gone
  assert.doesNotMatch(out, /title: Button/);
  // Imports gone
  assert.doesNotMatch(out, /^import /m);
  // JSX gone
  assert.doesNotMatch(out, /<PropTable/);
  assert.doesNotMatch(out, /<DoDont/);
  // Prose + headings + fence preserved
  assert.match(out, /^# Button$/m);
  assert.match(out, /The workhorse\./);
  assert.match(out, /^## Variants$/m);
  assert.match(out, /```tsx/);
  assert.match(out, /<Button variant="cta">Start<\/Button>/);
  assert.match(out, /Closing prose\./);
});

test('collapses 3+ blank lines to 2 (no run-on whitespace)', () => {
  const input = `A.



B.`;
  const out = stripMdx(input);
  assert.equal(out, 'A.\n\nB.');
});

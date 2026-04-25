// Wave 9 P2.12 (W9-B15) — anatomy panel must be collapsed by default
// across every showcase.
//
// Wave 7 P3 introduced `defaultOpen` on PlaygroundCard so the FIRST
// card on `/` (Button) could ship with its anatomy block expanded.
// The audit (B15) flagged this as visual noise: the user lands on
// the page and the very first card already has a tall <details>
// block crowding the next card. Closing it by default keeps the
// initial fold tidy and lets the user opt into the anatomy when
// they want it.
//
// The `defaultOpen` *prop* stays on PlaygroundCard for forwards
// compatibility (other consumers may want it) — this gate just
// asserts no showcase passes it. If a future need re-introduces it,
// the assertion fails loudly.
import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const showcaseFiles = readdirSync(here)
  .filter(name => name.endsWith('.astro'))
  .map(name => resolve(here, name));

test('no showcase passes `defaultOpen` (anatomy stays collapsed)', () => {
  const offenders: string[] = [];
  for (const file of showcaseFiles) {
    const src = readFileSync(file, 'utf8');
    // Match `defaultOpen` either bare (`defaultOpen` as a flag) or
    // explicitly `defaultOpen={true}`. Negative-match the safe
    // `defaultOpen={false}` form just in case.
    if (/\bdefaultOpen\b(?!\s*=\s*\{false\})/.test(src)) {
      offenders.push(file.replace(`${here}/`, ''));
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `Showcases passing defaultOpen (must drop per W9-B15): ${offenders.join(', ')}`
  );
});

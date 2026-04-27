import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tokensPath = resolve(
  here,
  '../../../../packages/uikit-css/src/tokens.css'
);

const extractRule = (src: string, selector: string): string => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return src.match(new RegExp(`${escaped}\\s*\\{[^}]*\\}`))?.[0] ?? '';
};

test('uikit code blocks keep long lines inside the pre scrollport', () => {
  const src = readFileSync(tokensPath, 'utf8');
  const preRule = extractRule(src, 'pre');
  const codeRule = extractRule(src, 'pre code');

  assert.match(
    preRule,
    /max-width:\s*100%\s*;/,
    '`pre` must not exceed its container when nested in docs layouts'
  );
  assert.match(
    preRule,
    /overflow-x:\s*auto\s*;/,
    '`pre` owns horizontal scrolling for long code lines'
  );
  assert.match(
    codeRule,
    /display:\s*block\s*;/,
    '`pre code` must establish a clipped block box inside the pre scrollport'
  );
  assert.match(
    codeRule,
    /width:\s*max-content\s*;/,
    '`pre code` must let long lines scroll without forcing the page wider'
  );
  assert.match(
    codeRule,
    /min-width:\s*100%\s*;/,
    '`pre code` should still fill short code blocks'
  );
});

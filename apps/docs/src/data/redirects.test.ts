import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, '..', '..');
const cfgPath = resolve(appRoot, 'astro.config.mjs');

test('astro.config.mjs declares the /api retirement redirect', () => {
  const cfg = readFileSync(cfgPath, 'utf8');
  assert.match(
    cfg,
    /['"]\/api['"]\s*:\s*['"][^'"]+['"]/,
    "astro.config.mjs must redirect '/api'"
  );
});

test('public/_redirects covers /api/<slug> with a fragment-preserving wildcard', () => {
  // Astro's redirect map can't add a URL fragment to its destination
  // (it requires a real route), so the per-slug rule lives in the
  // Netlify `_redirects` file. `:splat` interpolates the wildcard
  // segment into the new anchor.
  const redirectsPath = resolve(appRoot, 'public', '_redirects');
  assert.ok(
    existsSync(redirectsPath),
    'apps/docs/public/_redirects must exist'
  );
  const body = readFileSync(redirectsPath, 'utf8');
  assert.match(
    body,
    /^\s*\/api\/\*\s+\/#:splat\s+30\d!?/m,
    "public/_redirects must declare '/api/* /#:splat 301'"
  );
});

test('apps/docs/src/pages/api/ has been deleted', () => {
  const apiDir = resolve(appRoot, 'src', 'pages', 'api');
  assert.ok(
    !existsSync(apiDir),
    `apps/docs/src/pages/api/ must be deleted in (still exists at ${apiDir})`
  );
});

/**
 * Cloudflare Pages config meta-gates.
 *
 * Locks the contract between `apps/docs/wrangler.jsonc` and the deploy
 * workflow (`--project-name`, `working-directory`, build output). Each
 * Phase 2 P1 task adds new assertions to this file as artefacts land.
 *
 * Source-of-truth: files under `apps/docs/public/` and
 * `apps/docs/wrangler.jsonc`. The build step copies `public/*` to
 * `dist/*` verbatim, so the public-folder assertions are sufficient.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DOCS_ROOT = join(__dirname, '..');

/**
 * Strip `//` line comments from JSONC, ignoring matches inside double-quoted strings.
 * Sufficient for our wrangler.jsonc — we never use block comments there.
 */
function stripJsoncLineComments(input: string): string {
  let out = '';
  let inString = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1];
    if (inString) {
      out += ch;
      if (ch === '\\' && next !== undefined) {
        out += next;
        i++;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
      continue;
    }
    if (ch === '/' && next === '/') {
      while (i < input.length && input[i] !== '\n') i++;
      if (i < input.length) out += '\n';
      continue;
    }
    out += ch;
  }
  return out;
}

describe('wrangler.jsonc — Cloudflare Pages config', () => {
  const raw = readFileSync(join(DOCS_ROOT, 'wrangler.jsonc'), 'utf8');
  const config = JSON.parse(stripJsoncLineComments(raw)) as Record<
    string,
    unknown
  >;

  it('declares the canonical Pages project name', () => {
    // Must match `--project-name=fcc-design` in deploy-docs.yml.
    expect(config.name).toBe('fcc-design');
  });

  it('points at Astro `dist/` as the build output', () => {
    expect(config.pages_build_output_dir).toBe('./dist');
  });

  it('pins a `compatibility_date` in yyyy-mm-dd form', () => {
    expect(config.compatibility_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('declares no Functions bindings (SSG only)', () => {
    // Reject bindings that imply Pages Functions / Workers runtime.
    // Re-evaluate when SSR / edge work is in scope.
    const forbidden = [
      'kv_namespaces',
      'd1_databases',
      'r2_buckets',
      'queues',
      'durable_objects',
      'analytics_engine_datasets',
      'hyperdrive',
      'vectorize',
      'ai',
      'browser',
      'services',
      'mtls_certificates',
      'send_email',
      'dispatch_namespaces',
      'unsafe',
      'vars'
    ];
    for (const key of forbidden) {
      expect(
        config[key],
        `${key} present — SSG site should not need it`
      ).toBeUndefined();
    }
  });
});

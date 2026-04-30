import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const components = readFileSync(resolve(here, '../components.css'), 'utf8');

describe('components.css', () => {
  it('declares the canonical button selector', () => {
    expect(components).toMatch(/^\.btn\s*\{/m);
  });

  it('uses tokens (var(--*)) rather than raw colors', () => {
    // Allow at most a small number of raw hex colors as carve-outs.
    const rawHex = components.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
    expect(rawHex.length).toBeLessThan(20);
    // Token usage should dominate.
    const varUses = components.match(/var\(--[a-z0-9-]+\)/g) ?? [];
    expect(varUses.length).toBeGreaterThan(rawHex.length);
  });

  it('contains >= 100 BEM-style class declarations', () => {
    const matches = components.match(/^\s*\.[a-z][a-z0-9-_]*[^\n]*\{/gm) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(100);
  });
});

const indexCss = readFileSync(resolve(here, '../index.css'), 'utf8');

describe('index.css barrel', () => {
  it('imports tokens.css then components.css', () => {
    const tokensIdx = indexCss.indexOf("@import './tokens.css'");
    const componentsIdx = indexCss.indexOf("@import './components.css'");
    expect(tokensIdx).toBeGreaterThanOrEqual(0);
    expect(componentsIdx).toBeGreaterThan(tokensIdx);
  });
});

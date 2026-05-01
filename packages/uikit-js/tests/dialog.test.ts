import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, it, expect, beforeEach } from 'vitest';
import { dialog } from '../src/adapters/dialog';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureHtml = readFileSync(resolve(here, 'fixtures/dialog.html'), 'utf8');

function loadFixture(): HTMLElement {
  document.body.innerHTML = '';
  document.documentElement.innerHTML = fixtureHtml.replace(
    /^[\s\S]*?<body[^>]*>/,
    ''
  );
  return document.querySelector<HTMLElement>('[data-uikit-dialog]')!;
}

describe('dialog adapter', () => {
  beforeEach(() => {
    loadFixture();
  });

  it('mounts the dialog element from the fixture', () => {
    const el = document.querySelector<HTMLElement>('[data-uikit-dialog]');
    expect(el).not.toBeNull();
    expect(el!.getAttribute('role')).toBe('dialog');
    expect(el!.getAttribute('aria-modal')).toBe('true');
    expect(el!.dataset.state).toBe('closed');
  });

  it('returns an instance with a destroy method', () => {
    const el = document.querySelector<HTMLElement>('[data-uikit-dialog]')!;
    const inst = dialog(el);
    expect(inst).toBeTruthy();
    expect(typeof inst.destroy).toBe('function');
    inst.destroy();
  });

  it('exposes the trigger via data-uikit-dialog-trigger', () => {
    const trigger = document.querySelector<HTMLElement>(
      '[data-uikit-dialog-trigger="demo"]'
    );
    expect(trigger).not.toBeNull();
    expect(trigger!.tagName).toBe('BUTTON');
  });
});

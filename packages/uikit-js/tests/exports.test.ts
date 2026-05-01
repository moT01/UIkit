import { describe, it, expect } from 'vitest';
import * as uikit from '../src/index';

describe('@freecodecamp/uikit-js public exports', () => {
  it('exports the full adapter set', () => {
    for (const name of [
      'combobox',
      'dialog',
      'listbox',
      'pagination',
      'toaster',
      'toastTrigger'
    ]) {
      expect(uikit, `missing export: ${name}`).toHaveProperty(name);
      expect(typeof (uikit as Record<string, unknown>)[name]).toBe('function');
    }
  });

  it('does not leak internal helpers', () => {
    const exported = Object.keys(uikit);
    for (const name of exported) {
      expect(name.startsWith('_'), `internal export leaked: ${name}`).toBe(
        false
      );
    }
  });
});

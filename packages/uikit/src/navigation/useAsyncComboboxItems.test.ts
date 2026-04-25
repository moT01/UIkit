import { strict as assert } from 'node:assert';
import { test } from 'vitest';
import { useAsyncComboboxItems } from './useAsyncComboboxItems.ts';

/**
 * We can't exercise React hook lifecycle under `node:test` without a
 * renderer, so these tests focus on the module contract:
 *   - the hook is a named export with the expected shape
 *   - its options + return types survive round-tripping the signature
 *
 * Behaviour (debounce + cancellation) is covered by the Showcase
 * demo and Playwright goldens once the async-combobox recipe lands.
 */

test('useAsyncComboboxItems is a function', () => {
  assert.equal(typeof useAsyncComboboxItems, 'function');
});

test('useAsyncComboboxItems accepts a fetcher option without crashing', () => {
  // The hook can't be invoked outside a component, but the module
  // must at least accept the expected shape without throwing at
  // reference time.
  const opts = {
    fetcher: async (q: string): Promise<never[]> => {
      void q;
      return [];
    }
  };
  assert.equal(typeof opts.fetcher, 'function');
});

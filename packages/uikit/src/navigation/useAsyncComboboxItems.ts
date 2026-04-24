import { useEffect, useRef, useState } from 'react';
import type { ComboboxItem } from './Combobox';

export interface UseAsyncComboboxItemsOptions<T extends ComboboxItem> {
  /**
   * Fetches items for the current query. Receives an AbortSignal —
   * honour it to avoid race conditions where a stale response
   * overwrites a newer one.
   */
  fetcher: (query: string, signal: AbortSignal) => Promise<T[]>;
  /** Debounce window in ms before the fetcher runs. Default: 180. */
  debounceMs?: number;
  /**
   * Whether to fetch immediately when the query is empty. Default
   * `true` — surfaces a "starter set" on focus. Set `false` to keep
   * the list empty until the user types.
   */
  fetchEmpty?: boolean;
  /** Initial query value. Default: "". */
  initialQuery?: string;
}

export interface UseAsyncComboboxItemsReturn<T extends ComboboxItem> {
  items: T[];
  loading: boolean;
  error: string | null;
  query: string;
  setQuery: (next: string) => void;
}

/**
 * Debounced async source for <Combobox>. Cancels in-flight requests
 * when the query changes so the latest-submitted request always wins.
 *
 * Usage:
 *   const src = useAsyncComboboxItems({ fetcher: searchPackages });
 *   <Combobox
 *     items={src.items}
 *     loading={src.loading}
 *     error={src.error}
 *     inputValue={src.query}
 *     onInputValueChange={src.setQuery}
 *   />
 */
export function useAsyncComboboxItems<T extends ComboboxItem>(
  options: UseAsyncComboboxItemsOptions<T>
): UseAsyncComboboxItemsReturn<T> {
  const {
    fetcher,
    debounceMs = 180,
    fetchEmpty = true,
    initialQuery = ''
  } = options;

  const [query, setQuery] = useState<string>(initialQuery);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Track the most recent fetcher and the current controller so
  // unmount + query-change paths can cancel cleanly.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const activeControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!fetchEmpty && query.trim().length === 0) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    activeControllerRef.current?.abort();
    activeControllerRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const next = await fetcherRef.current(query, controller.signal);
        if (controller.signal.aborted) return;
        setItems(next);
        setLoading(false);
      } catch (err) {
        if (controller.signal.aborted) return;
        setLoading(false);
        setError(err instanceof Error ? err.message : String(err));
      }
    }, debounceMs);

    return (): void => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, debounceMs, fetchEmpty]);

  return { items, loading, error, query, setQuery };
}

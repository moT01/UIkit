---
'@freecodecamp/uikit': minor
---

`<Combobox>` gains `loading`, `error`, `emptyMessage`, and
`loadingMessage` props that render dedicated status rows inside the
listbox (`data-part="loading" | "error" | "empty"`). The listbox
exposes `aria-busy` while loading so assistive tech pauses result
announcements.

New `useAsyncComboboxItems` hook ships alongside — a debounced async
source that cancels in-flight requests when the query changes so the
latest-submitted request always wins. Signature:

```ts
const src = useAsyncComboboxItems({
  fetcher: (q, signal) => fetchPackages(q, { signal }),
  debounceMs: 180,
  fetchEmpty: true
});
<Combobox
  items={src.items}
  loading={src.loading}
  error={src.error}
  inputValue={src.query}
  onInputValueChange={src.setQuery}
/>;
```

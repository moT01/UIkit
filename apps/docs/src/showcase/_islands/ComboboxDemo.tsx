// Wave 7 P5 — Combobox showcase island. Uses the real
// `<Combobox items=... onValueChange=...>` API from
// @freecodecamp/uikit/navigation. The fake "options" + "label" props
// shipped in the Wave 6 snippet were not part of the shipping API;
// Wave 7 P4 audit caught it; Wave 7 P5 ships the real demo.
import { useMemo, useState } from 'react';
import { Combobox, filterItemsByLabel } from '@freecodecamp/uikit';

const ALL = [
  { value: 'rwd', label: 'Responsive Web Design' },
  { value: 'js', label: 'JavaScript Algorithms' },
  { value: 'fe', label: 'Front-End Libraries' },
  { value: 'be', label: 'Back End Development' },
  { value: 'rdb', label: 'Relational Databases' }
];

export function ComboboxDemo(): JSX.Element {
  const [query, setQuery] = useState('Resp');
  const [value, setValue] = useState<string>('rwd');
  const items = useMemo(() => filterItemsByLabel(ALL, query), [query]);
  return (
    <div style={{ maxWidth: 360, margin: '0 auto' }}>
      <Combobox
        inputValue={query}
        onInputValueChange={setQuery}
        value={value}
        onValueChange={setValue}
        items={items}
        placeholder='Pick a certification'
        emptyMessage='No matches'
      />
    </div>
  );
}

export default ComboboxDemo;

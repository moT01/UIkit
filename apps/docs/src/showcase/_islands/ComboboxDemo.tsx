// Wave 7 P5 / Wave 8 P7 — Combobox showcase island. Uses the real
// `<Combobox items=... onValueChange=...>` API from
// @freecodecamp/uikit/navigation. The fake "options" + "label" props
// shipped in the Wave 6 snippet were not part of the shipping API;
// Wave 7 P4 audit caught it; Wave 7 P5 ships the real demo.
//
// Wave 8 P7 (W8-6) cleared the seed `query='Resp'` + `value='rwd'`
// so the input renders empty and the popover stays closed at first
// paint. The previous seed forced the popover open before any user
// interaction — visual noise that read as broken on `/`.
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
  const [query, setQuery] = useState('');
  const [value, setValue] = useState<string>('');
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

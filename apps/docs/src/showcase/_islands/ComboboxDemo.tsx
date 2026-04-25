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

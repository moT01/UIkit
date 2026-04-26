import type { JSX } from 'react';
import { useState } from 'react';
import { Listbox } from '@freecodecamp/uikit';

const ITEMS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'devops', label: 'DevOps' },
  { value: 'design', label: 'Design' }
];

export function ListboxDemo(): JSX.Element {
  const [value, setValue] = useState<string | string[]>('frontend');
  return (
    <div style={{ maxWidth: 320, margin: '0 auto' }}>
      <Listbox items={ITEMS} value={value} onValueChange={setValue} />
    </div>
  );
}

export default ListboxDemo;

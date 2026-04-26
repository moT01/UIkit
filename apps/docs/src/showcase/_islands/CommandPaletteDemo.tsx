import type { JSX } from 'react';
import { useState } from 'react';
import { CommandPalette, Button } from '@freecodecamp/uikit';

const GROUPS = [
  {
    label: 'Navigation',
    items: [
      { id: 'curriculum', label: 'Go to curriculum', shortcut: 'G C' },
      { id: 'forum', label: 'Go to forum', shortcut: 'G F' }
    ]
  },
  {
    label: 'Actions',
    items: [
      { id: 'run', label: 'Run tests', shortcut: '⌘ ⏎' },
      { id: 'reset', label: 'Reset progress', shortcut: '⌘ R' }
    ]
  }
];

export function CommandPaletteDemo(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [, setLast] = useState<string | null>(null);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open command palette</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        onSelect={id => {
          setLast(id);
          setOpen(false);
        }}
        groups={GROUPS}
        placeholder='Type a command or search…'
      />
    </>
  );
}

export default CommandPaletteDemo;

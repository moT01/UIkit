import type { JSX } from 'react';
import { Dropdown } from '@freecodecamp/uikit';

export function DropdownDemo(): JSX.Element {
  return (
    <Dropdown>
      <Dropdown.Toggle>Sort ▾</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href='#'>Most recent</Dropdown.Item>
        <Dropdown.Item href='#' active>
          Alphabetical
        </Dropdown.Item>
        <Dropdown.Item href='#'>Hardest first</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownDemo;

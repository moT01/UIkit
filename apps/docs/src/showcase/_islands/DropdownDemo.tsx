// Wave 7 P5 — Dropdown showcase island. Member-access subcomponents
// (Toggle/Menu/Item) require a fully-React subtree, so the entire
// composition lives in this island.
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

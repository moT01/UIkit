export interface NavItem {
  readonly id: string;
  readonly label: string;
}

export interface NavSection {
  readonly id: string;
  readonly label: string;
  readonly items: readonly NavItem[];
}

export interface FlatNavItem extends NavItem {
  readonly section: string;
}

export const nav: readonly NavSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'installation', label: 'Installation' },
      { id: 'tokens', label: 'Design tokens' },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'toggle-button', label: 'Toggle button' },
      { id: 'close-button', label: 'Close button' },
      { id: 'link', label: 'Link' },
    ],
  },
  {
    id: 'forms',
    label: 'Forms',
    items: [
      { id: 'input', label: 'Input' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'switch', label: 'Switch' },
      { id: 'form-group', label: 'Form group' },
      { id: 'form-control', label: 'Form control' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    items: [
      { id: 'alert', label: 'Alert' },
      { id: 'callout', label: 'Callout' },
      { id: 'badge', label: 'Badge' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'modal', label: 'Modal' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    items: [
      { id: 'card', label: 'Card' },
      { id: 'panel', label: 'Panel' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'dropdown', label: 'Dropdown' },
      { id: 'spacer', label: 'Spacer' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    items: [
      { id: 'table', label: 'Table' },
      { id: 'image', label: 'Image' },
    ],
  },
];

export const flatNav: readonly FlatNavItem[] = nav.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.id }))
);

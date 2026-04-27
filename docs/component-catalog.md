# Component catalog

This catalog covers every component slug surfaced by
`apps/docs/src/data/nav.ts` and `apps/docs/src/data/knownComponents.ts`.
Each row points to the React source, the component MDX page, and the Astro
showcase used by the docs app.

The package barrel for React exports lives in `packages/uikit/src/index.ts`.
Layer barrels live in each source folder.

## Primitives

| Component | Slug      | Source                                      | Docs                                           | Showcase                               | Notes                                                                                                      |
| --------- | --------- | ------------------------------------------- | ---------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Text      | `text`    | `packages/uikit/src/primitives/Text.tsx`    | `apps/docs/src/content/components/text.mdx`    | `apps/docs/src/showcase/text.astro`    | Polymorphic body text. Types: `TextAs`, `TextSize`, `TextWeight`, `TextTone`, `TextProps`.                 |
| Heading   | `heading` | `packages/uikit/src/primitives/Heading.tsx` | `apps/docs/src/content/components/heading.mdx` | `apps/docs/src/showcase/heading.astro` | Semantic heading level is separate from visual size. Types: `HeadingLevel`, `HeadingSize`, `HeadingProps`. |
| Badge     | `badge`   | `packages/uikit/src/primitives/Badge.tsx`   | `apps/docs/src/content/components/badge.mdx`   | `apps/docs/src/showcase/badge.astro`   | Status/count tag. Types: `BadgeVariant`, `BadgeProps`.                                                     |
| Avatar    | `avatar`  | `packages/uikit/src/primitives/Avatar.tsx`  | `apps/docs/src/content/components/avatar.mdx`  | `apps/docs/src/showcase/avatar.astro`  | Square image or initials badge with optional status. Types: `AvatarSize`, `AvatarStatus`, `AvatarProps`.   |
| Divider   | `divider` | `packages/uikit/src/primitives/Divider.tsx` | `apps/docs/src/content/components/divider.mdx` | `apps/docs/src/showcase/divider.astro` | Horizontal or vertical separator. Types: `DividerOrientation`, `DividerVariant`, `DividerProps`.           |
| Spacer    | `spacer`  | `packages/uikit/src/primitives/Spacer.tsx`  | `apps/docs/src/content/components/spacer.mdx`  | `apps/docs/src/showcase/spacer.astro`  | Explicit whitespace mapped to the token spacing scale. Types: `SpacerStep`, `SpacerProps`.                 |
| Link      | `link`    | `packages/uikit/src/primitives/Link.tsx`    | `apps/docs/src/content/components/link.mdx`    | `apps/docs/src/showcase/link.astro`    | Styled anchor with block-row option. Type: `LinkProps`.                                                    |
| Image     | `image`   | `packages/uikit/src/primitives/Image.tsx`   | `apps/docs/src/content/components/image.mdx`   | `apps/docs/src/showcase/image.astro`   | Responsive image primitive. Type: `ImageProps`.                                                            |

## Actions

Actions are split across primitive and form source folders because some actions
are semantic buttons and some represent persistent form state.

| Component     | Slug            | Source                                          | Docs                                                 | Showcase                                     | Notes                                                                                                  |
| ------------- | --------------- | ----------------------------------------------- | ---------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Button        | `button`        | `packages/uikit/src/primitives/Button.tsx`      | `apps/docs/src/content/components/button.mdx`        | `apps/docs/src/showcase/button.astro`        | Primary action primitive with variants and sizes. Types: `ButtonVariant`, `ButtonSize`, `ButtonProps`. |
| Toggle button | `toggle-button` | `packages/uikit/src/forms/ToggleButton.tsx`     | `apps/docs/src/content/components/toggle-button.mdx` | `apps/docs/src/showcase/toggle-button.astro` | Pressed/unpressed state button. Types: `ToggleButtonSize`, `ToggleButtonProps`.                        |
| Close button  | `close-button`  | `packages/uikit/src/primitives/CloseButton.tsx` | `apps/docs/src/content/components/close-button.mdx`  | `apps/docs/src/showcase/close-button.astro`  | Dismiss affordance with default accessible label. Type: `CloseButtonProps`.                            |

## Forms

| Component    | Slug           | Source                                     | Docs                                                | Showcase                                    | Notes                                                                                           |
| ------------ | -------------- | ------------------------------------------ | --------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Input        | `input`        | `packages/uikit/src/forms/Input.tsx`       | `apps/docs/src/content/components/input.mdx`        | `apps/docs/src/showcase/input.astro`        | Native single-line text input with invalid state. Type: `InputProps`.                           |
| Textarea     | `textarea`     | `packages/uikit/src/forms/Textarea.tsx`    | `apps/docs/src/content/components/textarea.mdx`     | `apps/docs/src/showcase/textarea.astro`     | Native textarea, mono variant, optional auto-resize. Types: `TextareaVariant`, `TextareaProps`. |
| Select       | `select`       | `packages/uikit/src/forms/Select.tsx`      | `apps/docs/src/content/components/select.mdx`       | `apps/docs/src/showcase/select.astro`       | Native select, not a portal or combobox. Type: `SelectProps`.                                   |
| Checkbox     | `checkbox`     | `packages/uikit/src/forms/Checkbox.tsx`    | `apps/docs/src/content/components/checkbox.mdx`     | `apps/docs/src/showcase/checkbox.astro`     | Native checkbox with optional label. Type: `CheckboxProps`.                                     |
| Radio        | `radio`        | `packages/uikit/src/forms/Radio.tsx`       | `apps/docs/src/content/components/radio.mdx`        | `apps/docs/src/showcase/radio.astro`        | Radio plus `RadioGroup`. Types: `RadioProps`, `RadioGroupProps`.                                |
| Switch       | `switch`       | `packages/uikit/src/forms/Switch.tsx`      | `apps/docs/src/content/components/switch.mdx`       | `apps/docs/src/showcase/switch.astro`       | Checkbox-backed binary setting control. Type: `SwitchProps`.                                    |
| Fieldset     | `fieldset`     | `packages/uikit/src/forms/Fieldset.tsx`    | `apps/docs/src/content/components/fieldset.mdx`     | `apps/docs/src/showcase/fieldset.astro`     | Native fieldset and legend grouping. Types: `FieldsetTone`, `FieldsetProps`.                    |
| Form control | `form-control` | `packages/uikit/src/forms/FormControl.tsx` | `apps/docs/src/content/components/form-control.mdx` | `apps/docs/src/showcase/form-control.astro` | Threads label, control id, and described-by wiring. Type: `FormControlProps`.                   |
| Form group   | `form-group`   | `packages/uikit/src/forms/FormGroup.tsx`   | `apps/docs/src/content/components/form-group.mdx`   | `apps/docs/src/showcase/form-group.astro`   | Vertical cluster for label, control, help, and error. Type: `FormGroupProps`.                   |
| Help block   | `help-block`   | `packages/uikit/src/forms/HelpBlock.tsx`   | `apps/docs/src/content/components/help-block.mdx`   | `apps/docs/src/showcase/help-block.astro`   | Help, success, or error microcopy. Types: `HelpBlockVariant`, `HelpBlockProps`.                 |
| Form stepper | `form-stepper` | `packages/uikit/src/forms/FormStepper.tsx` | `apps/docs/src/content/components/form-stepper.mdx` | `apps/docs/src/showcase/form-stepper.astro` | Controlled multi-step form progress. Types: `FormStepperStep`, `FormStepperProps`.              |

## Navigation

| Component       | Slug              | Source                                           | Docs                                                   | Showcase                                       | Notes                                                                                                                                                      |
| --------------- | ----------------- | ------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navbar          | `navbar`          | `packages/uikit/src/navigation/Navbar.tsx`       | `apps/docs/src/content/components/navbar.mdx`          | `apps/docs/src/showcase/navbar.astro`          | Top-page chrome with start, center, and end slots. Type: `NavbarProps`.                                                                                    |
| Sidebar         | `sidebar`         | `packages/uikit/src/navigation/Sidebar.tsx`      | `apps/docs/src/content/components/sidebar.mdx`         | `apps/docs/src/showcase/sidebar.astro`         | Compound vertical nav with active matching helpers. Types include `SidebarProps`, `SidebarSectionProps`, `SidebarItemProps`, `IsActiveHrefOptions`.        |
| Tabs            | `tabs`            | `packages/uikit/src/navigation/Tabs.tsx`         | `apps/docs/src/content/components/tabs.mdx`            | `apps/docs/src/showcase/tabs.astro`            | Keyboard tab panel. Types: `TabProps`, `TabsProps`.                                                                                                        |
| Pagination      | `pagination`      | `packages/uikit/src/navigation/Pagination.tsx`   | `apps/docs/src/content/components/pagination.mdx`      | `apps/docs/src/showcase/pagination.astro`      | React component plus `data-uikit-pagination` vanilla adapter. Types: `PaginationEntry`, `PaginationProps`.                                                 |
| Listbox         | `listbox`         | `packages/uikit/src/navigation/Listbox.tsx`      | `apps/docs/src/content/components/listbox.mdx`         | `apps/docs/src/showcase/listbox.astro`         | Controlled single/multi select plus `data-uikit-listbox` vanilla adapter. Types: `ListboxItem`, `ListboxSelectionMode`, `ListboxValue`, `ListboxProps`.    |
| Combobox        | `combobox`        | `packages/uikit/src/navigation/Combobox.tsx`     | `apps/docs/src/content/components/combobox.mdx`        | `apps/docs/src/showcase/combobox.astro`        | Filterable input/list pair plus `data-uikit-combobox` vanilla adapter. Types: `ComboboxItem`, `ComboboxProps`.                                             |
| Command palette | `command-palette` | `packages/uikit/src/overlays/CommandPalette.tsx` | `apps/docs/src/content/components/command-palette.mdx` | `apps/docs/src/showcase/command-palette.astro` | Keyboard launcher grouped under navigation in site IA, implemented in overlays. Types: `CommandPaletteItem`, `CommandPaletteGroup`, `CommandPaletteProps`. |
| Breadcrumb      | `breadcrumb`      | `packages/uikit/src/navigation/Breadcrumb.tsx`   | `apps/docs/src/content/components/breadcrumb.mdx`      | `apps/docs/src/showcase/breadcrumb.astro`      | Compound breadcrumb trail with `aria-current`. Types: `BreadcrumbProps`, `BreadcrumbItemProps`.                                                            |

## Overlays

| Component | Slug       | Source                                     | Docs                                            | Showcase                                | Notes                                                                                                                                                                                          |
| --------- | ---------- | ------------------------------------------ | ----------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modal     | `modal`    | `packages/uikit/src/overlays/Modal.tsx`    | `apps/docs/src/content/components/modal.mdx`    | `apps/docs/src/showcase/modal.astro`    | Controlled dialog. Type: `ModalProps`. Vanilla dialog support exists in `@freecodecamp/uikit-js`.                                                                                              |
| Dropdown  | `dropdown` | `packages/uikit/src/overlays/Dropdown.tsx` | `apps/docs/src/content/components/dropdown.mdx` | `apps/docs/src/showcase/dropdown.astro` | Compound menu button pattern. Types: `DropdownProps`, `DropdownItemProps`.                                                                                                                     |
| Tooltip   | `tooltip`  | `packages/uikit/src/overlays/Tooltip.tsx`  | `apps/docs/src/content/components/tooltip.mdx`  | `apps/docs/src/showcase/tooltip.astro`  | CSS-only hover/focus hint. Type: `TooltipProps`.                                                                                                                                               |
| Toast     | `toast`    | `packages/uikit/src/overlays/Toast.tsx`    | `apps/docs/src/content/components/toast.mdx`    | `apps/docs/src/showcase/toast.astro`    | Toast, Toaster, and creator API. Types: `ToastVariant`, `ToastProps`, `ToasterProps`, `CreateToasterProps`, `CreateToasterReturn`. Vanilla toaster support exists in `@freecodecamp/uikit-js`. |

## Feedback

| Component   | Slug          | Source                                           | Docs                                               | Showcase                                   | Notes                                                                            |
| ----------- | ------------- | ------------------------------------------------ | -------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------- |
| Alert       | `alert`       | `packages/uikit/src/data-display/Alert.tsx`      | `apps/docs/src/content/components/alert.mdx`       | `apps/docs/src/showcase/alert.astro`       | In-page live region. Types: `AlertVariant`, `AlertProps`.                        |
| Callout     | `callout`     | `packages/uikit/src/data-display/Callout.tsx`    | `apps/docs/src/content/components/callout.mdx`     | `apps/docs/src/showcase/callout.astro`     | Prose note/warning/caution block. Types: `CalloutVariant`, `CalloutProps`.       |
| Skeleton    | `skeleton`    | `packages/uikit/src/data-display/Skeleton.tsx`   | `apps/docs/src/content/components/skeleton.mdx`    | `apps/docs/src/showcase/skeleton.astro`    | Loading placeholder with busy status. Types: `SkeletonVariant`, `SkeletonProps`. |
| Empty state | `empty-state` | `packages/uikit/src/data-display/EmptyState.tsx` | `apps/docs/src/content/components/empty-state.mdx` | `apps/docs/src/showcase/empty-state.astro` | Empty result or zero-state block. Type: `EmptyStateProps`.                       |

## Data display

| Component        | Slug               | Source                                                | Docs                                                    | Showcase                                        | Notes                                                                                                                |
| ---------------- | ------------------ | ----------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Card             | `card`             | `packages/uikit/src/data-display/Card.tsx`            | `apps/docs/src/content/components/card.mdx`             | `apps/docs/src/showcase/card.astro`             | Compound framed surface. Type: `CardProps`.                                                                          |
| Panel            | `panel`            | `packages/uikit/src/data-display/Panel.tsx`           | `apps/docs/src/content/components/panel.mdx`            | `apps/docs/src/showcase/panel.astro`            | Lightweight grouped surface. Types: `PanelVariant`, `PanelProps`.                                                    |
| Table            | `table`            | `packages/uikit/src/data-display/Table.tsx`           | `apps/docs/src/content/components/table.mdx`            | `apps/docs/src/showcase/table.astro`            | Semantic table wrapper. Type: `TableProps`.                                                                          |
| Data table       | `data-table`       | `packages/uikit/src/data-display/DataTable.tsx`       | `apps/docs/src/content/components/data-table.mdx`       | `apps/docs/src/showcase/data-table.astro`       | Controlled sortable/selectable table. Types: `DataTableAlign`, `DataTableColumn`, `DataTableSort`, `DataTableProps`. |
| Description list | `description-list` | `packages/uikit/src/data-display/DescriptionList.tsx` | `apps/docs/src/content/components/description-list.mdx` | `apps/docs/src/showcase/description-list.astro` | Semantic `dl` key/value display. Types: `DescriptionListLayout`, `DescriptionListItem`, `DescriptionListProps`.      |

## Layouts

| Component      | Slug             | Source                                         | Docs                                                  | Showcase                                      | Notes                                                       |
| -------------- | ---------------- | ---------------------------------------------- | ----------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| Sidebar layout | `sidebar-layout` | `packages/uikit/src/layouts/SidebarLayout.tsx` | `apps/docs/src/content/components/sidebar-layout.mdx` | `apps/docs/src/showcase/sidebar-layout.astro` | Sidebar plus main layout shell. Type: `SidebarLayoutProps`. |
| Stacked layout | `stacked-layout` | `packages/uikit/src/layouts/StackedLayout.tsx` | `apps/docs/src/content/components/stacked-layout.mdx` | `apps/docs/src/showcase/stacked-layout.astro` | Top-nav page shell. Type: `StackedLayoutProps`.             |
| Auth layout    | `auth-layout`    | `packages/uikit/src/layouts/AuthLayout.tsx`    | `apps/docs/src/content/components/auth-layout.mdx`    | `apps/docs/src/showcase/auth-layout.astro`    | Centered auth flow shell. Type: `AuthLayoutProps`.          |

## Related tests

The component package keeps most unit and DOM tests beside source files. The
docs app adds broader checks:

- showcase SSR and runtime tests in `apps/docs/src/showcase/*.test.ts`
- docs data and content tests in `apps/docs/src/data/*.test.ts`
- docs meta tests in `apps/docs/src/_meta/*.test.ts`
- Playwright behavioral tests in `apps/docs/tests/behavioural`
- Playwright visual tests in `apps/docs/tests/visual`

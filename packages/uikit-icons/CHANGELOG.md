# @freecodecamp/uikit-icons

## 1.0.0

### Major Changes

- 8a666e5: # v1.0.0 — freeCodeCamp UIKit GA

  First stable release of the freeCodeCamp design system. Squashed from
  63 per-wave changesets (Waves 1–9).

  ## Architecture

  3-layer system: CSS primitives (`uikit-css`) → vanilla-JS adapters
  (`uikit-js`) → React components (`uikit`). Distributed via npm + fCC
  CDN with SRI. Semver locked from this release forward.
  - **`@freecodecamp/uikit`** — 47 React components across 4 tiers.
    Full SSR contract (`renderToStaticMarkup`); no JSDOM dependency.
  - **`@freecodecamp/uikit-css`** — design tokens + BEM component
    stylesheet. Command-line Chic language: navy-dark base, gold CTA,
    3 px square borders, Hack mono + Lato sans. All components reach
    CSS custom properties; no raw hex in component CSS.
  - **`@freecodecamp/uikit-js`** — vanilla IIFE adapters mounted via
    `data-uikit-*` attributes. Zero framework dependency.
  - **`@freecodecamp/uikit-icons`** — 60-glyph SVG sprite. React +
    vanilla both reference via `<use href="#slug">`.
  - **`@freecodecamp/uikit-tailwind`** — Tailwind preset exposing the
    token palette as utility classes.

  ## Component surface (47 components)

  Atoms: Text, Heading, Divider, Avatar, Fieldset, DescriptionList,
  Badge, Skeleton, EmptyState, Breadcrumb.

  Forms: Radio, RadioGroup, Select, Textarea, Input, Checkbox, Switch,
  ToggleButton.

  Tier 3 composites: Tabs, Pagination, Listbox, Dropdown, Sidebar,
  Navbar, DataTable, FormStepper, PaletteGallery, AuthLayout,
  StackedLayout, SidebarLayout.

  Tier 4 overlays: Modal, Toast, Combobox, CommandPalette, Tooltip.

  ## Test coverage at GA
  - vitest unit (jsdom): 91.67 / 90.4 / 93.16 / 93.1
    (statements / branches / functions / lines). Threshold floor 85/80/85/85.
  - 19 behavioural Playwright specs (one per stateful primitive).
  - S1 meta gate: every component has a `*.test.tsx`.
  - S2 meta gate: showcase wiring matches `knownComponents`.
  - S3 meta gate: chrome conformance across 45-card grid.
  - Visual regression: mobile / tablet / desktop / desktop-light goldens.

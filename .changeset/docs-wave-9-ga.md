---
'@freecodecamp/uikit': patch
'@freecodecamp/uikit-css': patch
---

# GA hardening — Wave 9

Wave 9 closes the final v1.0 audit findings. The bulk of the work
lands in the docs harness as test coverage + chrome polish; two small
fixes ship to consumers.

## What changed for consumers

- **`<RadioGroup defaultValue>` now pre-selects the matching `<Radio>`
  in uncontrolled mode.** Previously the prop was silently ignored —
  the group rendered every radio empty until a click. Controlled-mode
  precedence (`value` wins over `defaultValue`) is preserved. Locked
  by `Radio.test.ts` + the radio behavioural Playwright spec.
- **`uikit-css` now declares `--breadcrumbs-height: 32px`.** The docs
  chrome consumes it for the breadcrumb sub-bar; downstream consumers
  can opt into the same token instead of hard-coding the value.

## Test infrastructure

The Wave 9 audit exposed a 4-layer testing matrix gap. The migration
from `tsx --test` to vitest landed in P0; the rest of the wave used
that runner to fill the matrix.

- **Layer 1 (vitest unit, jsdom).** L1 backfill on the components
  with thin existing coverage: Textarea, DataTable, CommandPalette,
  Dropdown, Listbox, Pagination, ToggleButton, Toast, Modal,
  Combobox. Coverage moved from 72.21 / 77.72 / 63.97 / 75.04 to
  **91.67 / 90.4 / 93.16 / 93.1** (statements / branches / functions
  / lines). Threshold floor pinned at 85 / 80 / 85 / 85 via
  `packages/uikit/vitest.config.ts` and a meta gate
  (`coverage-thresholds.test.ts`).
- **Layer 4 (Playwright behavioural).** 19 stateful primitives now
  carry an interactive contract spec — every slug in the GA matrix.
  S2 meta gate (`apps/docs/src/_meta/behavioural-coverage.test.ts`)
  is fully hard: `READY === REQUIRED_AT_GA`.

## Docs chrome polish

The audit ledger (`.scratchpad/LANDING-AUDIT.md`) tracked 18 findings.
Net resolved this wave:

- **B6 / B18 — `<RadioGroup defaultValue>` ignored.** See "What
  changed for consumers" above.
- **B17 — 8 stateful primitives painted but inert.** Fixed at the
  hydration boundary (radio promoted to a `_islands/RadioDemo`
  wrapper so the parent + children share a React Context;
  combobox promoted to `client:load` so the input owns its filter
  state before the user races past the visibility threshold).
- **C3 — header active link advertised no `aria-current`.** AppHeader
  now takes a `pathname` prop; the matcher logic + visual contract
  (yellow-gold underline, 700 weight) are locked at L1 + L4.
- **B15 — anatomy `<details>` shipped open by default.** Dropped
  `defaultOpen` from the only consumer (button.astro) and added a
  meta gate that fails any future use.
- **B12 — preview chrome inconsistent.** Dropped `previewPlain` from
  10 showcases; every card now renders the canonical gridded
  backdrop. Components that don't read well on grid set their own
  opaque background instead of overriding chrome.
- **B11 — layout previews painted in cramped portrait.** Added
  `width: 100%; min-height: 0; height: 320` (or 360) to the auth /
  sidebar / stacked layout demos so they fill 680 × 320 landscape.
  The component-internal `min-height: 100vh` is overridden inline.
- **B16 — `/#sidebar` overflowed.** Locked the contract — at desktop,
  the rendered Sidebar fits within the preview frame and stays under
  480 px tall. (No code change required; current chrome already
  satisfies the contract.)
- **B8.1 / B8.2 / B8.3 / B8.4 — site header drift.** Active link
  yellow-gold underline, brand block single-line (drop the version
  em), breadcrumb sub-bar wired below the header on every non-home
  route, `--breadcrumbs-height` token pinned.
- **B13 — hex literals in `showcase.css`.** Four
  `#b0b0bd` / `#d0d0d5` / `#24292e` literals replaced with semantic
  tokens; meta gate fails any future hex.
- **B14 — `.showcase__tab` buttons missing `type='button'`.** Defensive
  fix; meta gate added.
- **B2 — preview width.** Not-repro after Wave 8/9 chrome cleanup;
  locked the contract that preview === card width.
- **B3 — "Pick the flavour" surface labels.** Not-stale; the
  React/HTML/Tailwind trio reflects the three real packages.

Open at GA cut (P3/P4 visual polish, deferred): B4 (foundations grid
rhythm), B5 (hero CTA + install snippet padding).

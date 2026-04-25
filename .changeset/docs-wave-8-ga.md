---
---

# Docs first-delivery polish — Wave 8

The first-delivery audit closed eight gaps that blocked v1.0 by surfacing
issues a real user would hit before they read the README:

- search lied in dev (Pagefind only indexed the production build),
- prop tables were hand-typed (and drifted from shipping types),
- foundations lived only on `/handbook`, never on `/`,
- breadcrumbs were missing from the navigation layer entirely,
- the Modal trigger button rendered as `danger` (read as destructive),
- the Combobox demo started with the popover open by default,
- the mobile drawer + per-page TOC had only screenshot coverage and no
  behavioral test for ESC / focus / backdrop / TOC tappability,
- light-palette regressions could ship green because every visual
  baseline ran in dark mode only.

## What landed

**P0 — Cut per-card Tailwind tabs (W8-11).** `PlaygroundCard.astro` is
now `REACT | HTML` only; the per-card Tailwind tab + panel + copy-as
menu item is gone. `@freecodecamp/uikit-tailwind` and the
`/guides/tailwind` page remain — Tailwind story shifts to the package

- guide instead of a placeholder tab on every card. New
  `tab-strip.test.ts` locks the contract; the four showcase orphans
  (`badge`, `button`, `callout`, `card`) had their `slot='tailwind'`
  Code blocks deleted. `tailwind.mdx` prose updated to drop the
  "Tailwind tab in each `<PlaygroundCard>`" claim.

**P1 — PropTable generator + render (W8-3).** `react-docgen-typescript`
extracts every `Props` interface from `packages/uikit/src/**/*.tsx` at
build time; `packages/uikit/scripts/gen-props.mjs` runs after `tsup`
and emits `dist/props.json` (55 component entries, `$schemaVersion:
"1.0.0"` envelope). Generic-heavy components (`DataTable<TRow>`)
trigger a stub envelope with `_extractionFailed: true` and a stderr
WARN line. New `./props.json` exports map. `apps/docs/src/components/
site/PropTable.tsx` is a server-rendered React component that the
`PlaygroundCard` anatomy `<details>` block renders inline; 141
`prop-table__row` rows ship in the built `/`. New `apps/docs/scripts/
ensure-uikit-built.mjs` auto-runs the uikit build on first clone so a
fresh contributor's `pnpm dev` doesn't crash on a missing
`props.json`.

**P2 — Static search index + Pagefind removal (W8-2).** New
`apps/docs/integrations/search-index.ts` Astro integration registers
a Vite middleware on `/search-index.json` in dev (every request
rebuilds against current MDX; the dev server's watcher invalidates
on content change) and writes `dist/search-index.json` from
`astro:build:done` in prod. The builder (`integrations/lib/build-
index.ts`) is a pure function over `src/content/{foundations,
components,guides}/**/*.mdx` — 60 entries with title, summary,
tags, href. `pagefind` dep removed; `Search.astro` rewritten with a
`<input data-search-input>` + `<ul data-search-results>` pair plus
the `fuse.js` client at `src/scripts/search.client.ts`. Locked Fuse
config: `keys: title (0.6), summary (0.3), tags (0.1)`,
`threshold: 0.3`, `minMatchCharLength: 2`, `ignoreLocation: true`.
XSS guard: every text render goes through `textContent`, every
`href` clears a scheme allowlist
(`http:`, `https:`, `/`, `#`, `mailto:`, `tel:`).

**P3 — `<FoundationsBand>` island on `/` (W8-1).** New
`apps/docs/src/components/site/FoundationsBand.tsx` renders the gray
ramp + accent pairs + semantic colors above the components grid
with ONE `MutationObserver` for the whole band. Replaces 12 per-cell
`<TokenSwatch client:load>` islands (12 observers → 1). `TokenSwatch`
gained a controlled `value` prop so the cell can skip its self-mount
observer when a parent owns the palette read; `/handbook` keeps the
self-mount path unchanged. New `FoundationsBandSection.astro` thin
wrapper mounts on `/` between the foundations quicklinks and the
type-scale + spacing demos.

**P4 — `<Breadcrumb>` component (W8-5).** New navigation primitive in
`packages/uikit`. Compound API: `<Breadcrumb>` + `<Breadcrumb.Item>`.
Renders `<nav aria-label="Breadcrumb"><ol><li>…</li></ol></nav>`;
the active item drops the link and emits `<span aria-current="page">`.
The visible separator is a CSS `::after` pseudo-element on every
non-last item — invisible to assistive tech, themable via
`--breadcrumb-separator-content`. Scheme allowlist on `href` (same
allowlist as the search client) blocks XSS surfaces. New showcase,
content MDX, nav entry, `knownComponentSlugs` entry, and
`uikit-css/components.css` blocks. The component lands as a
`@freecodecamp/uikit` minor bump via the sibling
`uikit-add-breadcrumb.md` changeset.

**P5 — Mobile drawer behavioral contract (W8-7).** New
`tests/visual/mobile-drawer.spec.ts` covers five behavioral
invariants under the `mobile` Playwright project:

- hamburger toggles `body[data-nav-open]` and reveals
  `#app-sidebar`;
- backdrop tap closes the drawer and restores focus to the
  hamburger;
- Escape closes the drawer and restores focus to the hamburger;
- aria-expanded reflects the drawer state across a full toggle
  cycle;
- per-page TOC on `/handbook` is tappable when the drawer is open.

`AppHeader.astro`'s drawer script gained focus restoration on the
backdrop close path (ESC already had it). All 91 + 16 visual
goldens refreshed for the cumulative P0–P3 visible changes;
`playground-card.spec.ts` per-test tolerance bumped to absorb
font sub-pixel jitter that cleared the previous 100-pixel global
cap.

**P6 — `desktop-light` Playwright project (W8-9).** New project entry
re-runs the `routes`, `playground-card`, and `handbook` specs at
1440×900 with the `light-palette` class set on `<html>` before any
user code runs. 16 baselines emitted (one per active spec test);
parity holds against the existing `desktop` project. Path filters
were rejected — non-CSS regressions (component conditionals, JS
theme toggles, asset paths) can break light mode without touching
`*.css`, so every PR runs the project. Cleaned up 42 dead `api-*`
baselines left behind by Wave 7 P0's `/api/*` retirement.

**P7 — Modal CTA + Combobox closed by default (W8-6).** Modal
trigger button on `/#modal` flipped from `variant='danger'` to
`variant='cta'` — the click opens a confirm dialog, not a
destructive op. The footer "Reset progress" button keeps the
destructive variant because that one IS destructive. Combobox
demo cleared its seed `query='Resp'` + `value='rwd'` so the
input renders empty and the popover stays closed at first paint.
Snapshots refreshed.

## Acceptance gate

`pnpm -r test`, `pnpm -r build`, and `pnpm -F docs test:visual` all
green at HEAD. Single-page audit on `/`: foundations band renders
the gray ramp + accents + semantic colors, search dialog pulls
results in dev (≥ 60 entries), every component shows a prop table
inside its anatomy block, breadcrumb showcase renders the trail,
no Tailwind tab visible. Light-palette toggle via DevTools paints
the page consistently with the `desktop-light` snapshots.

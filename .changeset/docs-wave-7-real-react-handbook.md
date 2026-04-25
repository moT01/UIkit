---
---

# Docs overhaul — Wave 7 (real-react-handbook)

Close the three contracts Wave 6 (mellow-owl) shipped soft: real React on every showcase, full Brand Guidelines handbook, and `/api` purged from every user-facing surface. Plus the three smaller regressions Wave 6 introduced — token-swatch hex lies, broken sidebar active state on hash anchors, and `<Code>` snippets pointing at non-existent props.

## What landed

**P0 — `/api` purge (full).** `apiLinkMode` deleted from `PlaygroundCard.astro`; the `View API → /api/<slug>` link block removed entirely. Every `apiLinkMode` reference cleared from the 45 showcases. `Showcase.astro` forwarder retired (zero remaining consumers). `nav.test.ts` tightened from `>= 40` to `=== knownComponentSlugs.size`. New `apps/docs/src/data/api-purge.test.ts` enforces no `/api/*` references in user-facing src.

**P1 — Token swatch truth.** `apps/docs/src/components/site/TokenSwatch.tsx` ships as a `client:load` React island that reads `getComputedStyle(:root).getPropertyValue(name)` on mount and re-reads on `MutationObserver` palette swaps. Hardcoded hex (`#dfdfe2`, `#d0d0d5`, `#d36eff`) deleted from `pages/index.astro`. Public swatches now match the resolved CSS for both `dark-palette` and `light-palette`.

**P2 — Sidebar hash-anchor active state.** New `isActiveHrefWithHash(currentPath, currentHash, href)` in `packages/uikit/src/navigation/Sidebar.tsx` that splits `href` at `#` and matches both segments. `AppSidebar.astro` threads `Astro.url.hash`. `data-sidebar-link` + `data-target` attrs land on every nav item; `scripts/showcase-spy.client.ts` flips `data-active` on scroll-spy. 6 unit tests + 4 AppSidebar regression-guard tests + a Playwright spec at `tests/visual/sidebar-active.spec.ts`.

**P3 — PlaygroundCard markup audit + Shiki theme.** `astro.config.mjs` pins `markdown.shikiConfig.theme: 'github-dark'` so every `<Code>` block emits `<pre class="astro-code github-dark">`. New `defaultOpen?: boolean` prop on PlaygroundCard; the first card on `/` (Button) ships with the anatomy `<details>` open by default. `components.css` heading variants bound to declared tokens (`--fs-display`, `--fs-2xl`, `--fs-xl`, etc.) — no more raw-pixel drift.

**P4 — Showcase API-snippet audit.** New `apps/docs/src/data/showcase-snippet-audit.test.ts` walks the JSX inside every `<Code slot='react' code={...}>` block in all 45 showcases via the TypeScript compiler API, validates each tag against `@freecodecamp/uikit` exports, and checks each prop against the shipping `Props` interface. Heading + DataTable drift fixed.

**P5 — Real React islands (stateful, 11).** Combobox, CommandPalette, Dropdown, FormStepper, Listbox, Modal, Pagination, Switch, Tabs, Toast, Tooltip — each showcase now mounts the real React component via `client:visible` / `client:idle` / `client:load`. 8 demo wrappers landed under `apps/docs/src/showcase/_islands/` for the demos that need internal state. New `runtime-island.test.ts` locks the contract.

**P6 — Real React render (SSR-only, 34).** Every remaining showcase imports its uikit component and renders it as JSX — Astro SSRs through `@astrojs/react` without hydration. Hand-rolled BEM HTML mocks deleted; the rendered DOM IS the uikit output. New `ssr-react-render.test.ts` enforces the import-and-render contract per slug. Spec resume cue `grep -rEc "from '@freecodecamp/uikit'" apps/docs/src/showcase/` returns 54 (≥ 45 target).

**P7 — Brand-guidelines handbook.** `/handbook` expanded from a token reference to a full freeCodeCamp Brand Guidelines reader: 9 foundations entries (was 6) — `overview`, `colors`, `typography`, `spacing`, `iconography`, `motion`, `voice`, `brand` (logo usage, wordmark vs. symbol, clearspace, partner co-branding), and `do-donts` (cross-cutting composition / contrast / density / voice / iconography / motion / brand rules). New `apps/docs/src/data/handbook.test.ts` locks the entry count, frontmatter shape, ≥1 `## ` heading per file, and brand/do-donts coverage. `handbook.astro` rewired to load + render the new MDX.

**P8 — Strip-mdx hardening + ProseLayout TOC.** `apps/docs/src/lib/strip-mdx.ts` rewritten as a fence-aware splitter that strips ANY `<UpperCase>` JSX (no hardcoded blacklist), all `import`/`export` forms (single + multi-line), and frontmatter — while preserving prose, links, inline code, and fenced code blocks. New `strip-mdx.test.ts` (12 cases). `astro.config.mjs` adds `rehype-slug` + `rehype-autolink-headings` to MDX, so every `## ` becomes `<h2 id="…">` and `ProseLayout`'s TOC harvest works. `guides.test.ts` extended to assert `## ` heading floor + the rehype wiring.

**P9 — Visual + a11y regression.** `apps/docs/tests/visual/` now ships:

- `playground-card.spec.ts` — per-card snapshots for Button, Combobox, Modal, Navbar, Table.
- `sidebar-active.spec.ts` — scroll-spy active-state contract.
- `handbook.spec.ts` — full-page + per-section snapshots (Overview, Brand, Do/Don't) at desktop / tablet / mobile.
- `a11y.spec.ts` — h1 floor, `<img>` alt, accessible names on focusable buttons + every link, across `/`, `/handbook`, and three guides.
- `routes.spec.ts` — retargeted from retired `/api/<slug>` paths to the surviving chrome surfaces (`/handbook` + `/guides/*`).

**P10 — Wave 7 changeset + GA gate.** This file. `pnpm -r test` green (docs 220, uikit 232). `pnpm -F docs build` green. Visual snapshots regenerated against the post-P0 IA.

## Migration

Docs-only — no library version bump.

External deep-links to `/api/<slug>` continue to land at `/#<slug>` via `public/_redirects`; the legacy URL shape is dead in source but honored at the edge.

## Why

Wave 6 set the IA but landed three contracts soft: zero showcases mounted real React, `apiLinkMode` defaulted to a 404-ing `View API` link on every card, and the public token table contradicted the actual CSS values. Wave 7 closes them. The docs site is now what Wave 6 promised — every component on `/` is the real React component, the brand handbook is a brand handbook, and there is no `/api` reference anywhere a learner can click.

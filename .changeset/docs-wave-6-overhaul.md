---
---

# Docs overhaul — Wave 6 (mellow-owl)

Refactor `apps/docs/` to the three-surface IA the team actually uses:
`/` (full playground, single source of truth), `/guides/*` (per-package
install + recipes), `/handbook` (philosophy, tokens, brand). Drop
`/api/*` — its content folds back into the playground.

## What landed

**P0 — sibling-source dogfood.** `apps/docs/tsconfig.json` and
`apps/docs/astro.config.mjs` resolve `@freecodecamp/uikit*` to
`packages/<name>/src/` via a `vite.resolve.alias` map. Edits to raw
source HMR into the running docs dev server with zero publish/link
dance. `vite.server.fs.allow` widens the FS sandbox to the monorepo
root. `optimizeDeps.exclude` keeps Vite from caching `dist/` artifacts.

**P1 — `<PlaygroundCard>`.** New
`apps/docs/src/components/site/PlaygroundCard.astro` replaces the old
`Showcase.astro`; the legacy import lives on as a 17-line forwarder so
no call site breaks. The card adds an optional ANATOMY `<details>`
block that surfaces status, since, tokens, and the WAI-ARIA APG link.

**P2 — every component on `/`.** All 45 components from
`packages/uikit/src` now live as one file each under
`apps/docs/src/showcase/<slug>.astro`. The 21 pre-existing inline
showcases were extracted verbatim; the 24 missing components were
authored fresh against the BEM CSS in `uikit-css`. `pages/index.astro`
shrunk from 1427 lines to 458 — it glob-imports the showcase
directory and renders in `data/nav.ts` order, so reordering the nav
reorders the page.

**P3 — `/api/*` retirement.** `apps/docs/src/pages/api/` deleted.
Astro `redirects` map sends `/api → /` and `/components → /`. A new
`apps/docs/public/_redirects` (Netlify) carries the
fragment-preserving rules `/api/* /#:splat 301!` and
`/components/* /#:splat 301!` that Astro can't express
(destination must be a real route). Component nav `href`s flipped
from `/api/<slug>` to `/#<slug>`.

**P4 — `/guides/*` IA.** Six MDX guides under
`apps/docs/src/content/guides/`: install, tailwind, cdn, copy-paste,
recipes, migrate-v1. New `guides` collection in `content.config.ts`,
new `ProseLayout.astro` with a TOC sidebar collected from `<h2>`
headings.

**P5 — llms.txt root + dump.** `/llms.txt` and `/llms-full.txt` are
auto-generated Astro endpoints reading the `components` and `guides`
collections. The root file lists every visible URL with a
one-line summary; the full file concatenates every page.

**P6 — paired `.md` siblings.** `/components/<slug>.md`,
`/guides/<slug>.md`, and `/handbook.md` are agent-friendly markdown
twins of the human pages. A shared `src/lib/strip-mdx.ts` helper
strips frontmatter, MDX `import` lines, and known Astro component
invocations (`<PropTable />`, etc.) before emit.

**P7 — tests.** Five new test files lock the contracts:
`dogfood-resolve.test.ts` (P0), `playground-card.test.ts` (P1),
`showcase-coverage.test.ts` (P2 — 45 files, no orphans),
`redirects.test.ts` (P3), `guides.test.ts` (P4),
`llms-txt.test.ts` (P5/P6). `nav.test.ts` and `AppSidebar.test.ts`
updated for the `/api → /#` href flip.

## Why no package bump

This is `@freecodecamp/uikit-docs`-only. The `.changeset/config.json`
ignore list already excludes the docs app from versioned releases.
External `/api/<slug>` deep links keep working through Netlify's
`_redirects` (301 to the matching anchor on `/`).

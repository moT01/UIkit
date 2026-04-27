# Docs app internals

`apps/docs` is the private Astro app that publishes the UIKit documentation
site. It is also a dogfood app for the React package, CSS package, vanilla
runtime, icon sprite, and generated API metadata.

## App shape

Key routes and source files:

- `/`: `apps/docs/src/pages/index.astro`
  - landing page
  - foundations preview
  - full component playground
  - imports all `apps/docs/src/showcase/*.astro` modules eagerly
- `/handbook`: `apps/docs/src/pages/handbook.astro`
  - one-page foundations, implementation, brand, and contribution reference
- `/guides`: `apps/docs/src/pages/guides/index.astro`
- `/guides/[slug]`: `apps/docs/src/pages/guides/[...slug].astro`
- `/llms.txt`: `apps/docs/src/pages/llms.txt.ts`
- `/llms-full.txt`: `apps/docs/src/pages/llms-full.txt.ts`
- `/api`: redirected to `/`
- `/components`, `/showcase`, and foundations subroutes redirect to current
  anchor-based pages

The app uses `BaseLayout.astro` for site shell structure and shared scripts.
`ProseLayout.astro` supports prose pages.

## Workspace package resolution

`apps/docs/astro.config.mjs` aliases workspace package imports to source:

- `@freecodecamp/uikit` -> `packages/uikit/src/index.ts`
- `@freecodecamp/uikit/*` -> `packages/uikit/src/*`
- `@freecodecamp/uikit-icons` -> `packages/uikit-icons/src/index.ts`
- `@freecodecamp/uikit-icons/*` -> `packages/uikit-icons/src/*`
- `@freecodecamp/uikit-js` -> `packages/uikit-js/src/index.ts`
- `@freecodecamp/uikit-tailwind` -> `packages/uikit-tailwind/src/index.ts`

The Vite SSR config marks these packages as `noExternal`, and `optimizeDeps`
excludes them so HMR uses source rather than package dists.

## Content collections

Collections are defined in `apps/docs/src/content.config.ts`.

| Collection    | Source folder             | Required fields                                     | Purpose                                                           |
| ------------- | ------------------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| `foundations` | `src/content/foundations` | `title`, `eyebrow`, `summary`, `order`              | Handbook foundations sections.                                    |
| `components`  | `src/content/components`  | `title`, `eyebrow`, `status`, `category`, `summary` | Component docs and API reference content.                         |
| `guides`      | `src/content/guides`      | `title`, `eyebrow`, `summary`, `order`              | Install, CDN, Tailwind, recipe, copy-paste, and migration guides. |

Component categories are restricted to:

- `primitive`
- `form`
- `overlay`
- `navigation`
- `data-display`
- `layout`

## Component playground convention

Each component surfaced on `/` has:

- a nav item in `apps/docs/src/data/nav.ts`
- a known slug entry in `apps/docs/src/data/knownComponents.ts`
- a content page in `apps/docs/src/content/components/<slug>.mdx`
- a showcase module in `apps/docs/src/showcase/<slug>.astro`

Interactive demos live in `apps/docs/src/showcase/_islands/*.tsx` and are
imported by the relevant `.astro` showcase. Examples include combobox, command
palette, dropdown, form stepper, listbox, modal, pagination, radio, tabs, and
toast demos.

The root page imports showcase modules with `import.meta.glob` and throws if a
nav slug has no matching showcase module. Tests under `src/data` and
`src/showcase` enforce nav/content/showcase coverage.

## Site components

`apps/docs/src/components/site` contains the app shell and documentation UI:

- `AppHeader`
- `AppSidebar`
- `AppBreadcrumb`
- `Search`
- `PlaygroundCard`
- `PlaygroundLink`
- `PropTable`
- `TokenChips`
- `TokenSwatch`
- `FoundationsBand`
- `FoundationsBandSection`
- `ComponentCard`
- `AnatomySvg`
- `DoDont`
- `RelatedComponents`

`apps/docs/src/components/foundations` contains visual foundation demos for
palette, spacing, type, and motion. `apps/docs/src/components/handbook` contains
handbook-specific brand and sidebar components.

## Search index

The search index integration lives in `apps/docs/integrations/search-index.ts`.
The pure builder is `apps/docs/integrations/lib/build-index.ts`.

Behavior:

- dev server mounts `/search-index.json` through `astro:server:setup`
- production build writes `dist/search-index.json` through
  `astro:build:done`
- the builder walks `src/content/{foundations,components,guides}/*.mdx`
- frontmatter parsing is intentionally flat and local to the builder
- entries contain `title`, `summary`, `tags`, and `href`

Client search code lives in `apps/docs/src/scripts/search.client.ts` and uses
Fuse.js.

## Predev and prebuild scripts

The docs package runs this chain before dev and build:

```bash
node scripts/copy-sprite.mjs && node scripts/build-asset-kit.mjs && node scripts/ensure-uikit-built.mjs
```

`copy-sprite.mjs` copies:

- `packages/uikit-icons/dist/sprite.svg` to
  `apps/docs/public/uikit/sprite.svg`
- `packages/uikit-js/dist/uikit.global.js` to
  `apps/docs/public/uikit/uikit.global.js`

It is tolerant in dev if the upstream dists are missing.

`build-asset-kit.mjs` zips the brand marks into
`apps/docs/public/brand/asset-kit.zip`. The zip is generated because zip
metadata can churn.

`ensure-uikit-built.mjs` checks for `packages/uikit/dist/props.json` and runs
`pnpm -F @freecodecamp/uikit build` if it is missing.

## Dogfood assets

The docs app serves workspace-built runtime assets from:

- `/uikit/sprite.svg`
- `/uikit/uikit.global.js`

These files are copied from package dists. Do not hand-edit them in
`apps/docs/public/uikit`.

The CDN-style brand asset kit is served from `/brand/asset-kit.zip`.

## Tests

Vitest config: `apps/docs/vitest.config.ts`

- environment: Node
- includes `src/**/*.test.ts`, `src/**/*.test.tsx`, and
  `integrations/**/*.test.ts`
- excludes `dist`, `node_modules`, `tests`, and `.astro`
- coverage includes site components, lib files, and integrations
- coverage thresholds are 60 statements, 55 branches, 60 functions, 60 lines

Playwright config: `apps/docs/playwright.config.ts`

- `testDir`: `apps/docs/tests`
- server: `pnpm preview --host 127.0.0.1 --port 4321`
- base URL: `http://127.0.0.1:4321`
- retries in CI: 2
- visual screenshot settings disable animations and hide caret

Playwright projects:

- `mobile`: visual tests at 375x667
- `tablet`: visual tests at 768x1024
- `desktop`: visual tests at 1440x900
- `desktop-light`: selected visual tests with light palette at 1440x900
- `behavioural-desktop`: behavioral tests at 1440x900

Failure artifacts are uploaded in CI from:

- `apps/docs/playwright-report`
- `apps/docs/test-results`

## Docs build output

Astro build writes `apps/docs/dist`. Notable generated files include:

- route HTML
- generated component and guide Markdown endpoints
- `search-index.json`
- `llms.txt`
- `llms-full.txt`
- sitemap files
- copied fonts
- copied `uikit` runtime assets
- brand asset kit

The docs app is a consumer of the package graph, so a docs build may require
package dist artifacts even when Vite aliases source for most imports.

# Repo overview

freeCodeCamp UIKit is a pnpm/Turbo monorepo for the freeCodeCamp design system.
It ships a React component package, source CSS tokens and BEM classes, a
vanilla JavaScript runtime, an icon package, a Tailwind integration, an internal
CDN bundle builder, and the Astro documentation site.

## What ships

| Surface                  | Package or app                 | Main source                   | Output                                                            |
| ------------------------ | ------------------------------ | ----------------------------- | ----------------------------------------------------------------- |
| React components         | `@freecodecamp/uikit`          | `packages/uikit/src`          | ESM, CJS, declarations, and `props.json` in `packages/uikit/dist` |
| Tokens and component CSS | `@freecodecamp/uikit-css`      | `packages/uikit-css/src`      | Source CSS, fonts, and brand assets shipped directly              |
| Vanilla runtime          | `@freecodecamp/uikit-js`       | `packages/uikit-js/src`       | ESM module and IIFE bundle in `packages/uikit-js/dist`            |
| Icons                    | `@freecodecamp/uikit-icons`    | `packages/uikit-icons/src`    | Icon map, React wrapper, declarations, and `sprite.svg` in `dist` |
| Tailwind integration     | `@freecodecamp/uikit-tailwind` | `packages/uikit-tailwind/src` | Preset and plugin ESM/CJS entries in `dist`                       |
| CDN bundle               | `@freecodecamp/uikit-cdn`      | `packages/uikit-cdn/scripts`  | `dist-cdn/uikit` bundle with version aliases and manifest         |
| Public docs site         | `@freecodecamp/uikit-docs`     | `apps/docs/src`               | Static Astro site in `apps/docs/dist`                             |

## Workspace layout

`pnpm-workspace.yaml` includes two workspace roots:

- `apps/*` for private applications. Today this is `apps/docs`.
- `packages/*` for publishable packages and internal package tooling.

Important root files:

- `package.json` owns root scripts, dev tools, pnpm version, lint-staged, and
  the private monorepo metadata.
- `turbo.json` defines the task graph for build, dev, tests, linting,
  typechecking, preview, visual tests, and CDN verification.
- `tsconfig.base.json` sets strict TypeScript defaults used by packages and the
  docs app.
- `eslint.config.js` is the flat ESLint config for TypeScript and Astro-aware
  linting.
- `prettier.config.js` and `.prettierignore` define formatting.
- `.github/workflows/*` defines CI, reusable lint/test/build/visual jobs, and
  the manual CDN release flow.

Generated output is intentionally separate from source:

- `packages/*/dist` from `tsup` builds.
- `packages/uikit/dist/props.json` from `scripts/gen-props.mjs`.
- `dist-cdn/uikit` from the CDN build.
- `apps/docs/.astro` and `apps/docs/dist` from Astro.
- `apps/docs/public/uikit/*` from docs predev/prebuild asset copying.
- coverage and Playwright artifacts under package/app coverage and
  `apps/docs/test-results`.

## Build flow

1. `@freecodecamp/uikit-css` provides the token and component CSS source. It
   does not compile during its package build.
2. `@freecodecamp/uikit` compiles React source with `tsup` and generates
   `dist/props.json` for docs API tables.
3. `@freecodecamp/uikit-js` compiles the vanilla runtime to ESM and
   `uikit.global.js`.
4. `@freecodecamp/uikit-icons` compiles package entries and builds
   `dist/sprite.svg`.
5. `@freecodecamp/uikit-tailwind` compiles the Tailwind preset and plugin.
6. `@freecodecamp/uikit-cdn` bundles CSS with Lightning CSS, copies fonts,
   brand assets, the vanilla IIFE, and the icon sprite, then mirrors them under
   `latest`, major, minor, and exact-version aliases.
7. `apps/docs` imports workspace package source during dev/build through Vite
   aliases, copies dogfood assets into `public/uikit`, and builds the Astro
   site.

`turbo run build` drives this graph. The `build` task depends on upstream
workspace builds, except `@freecodecamp/uikit-css#build`, which is explicitly
source-only and has no upstream dependency.

## Runtime model

UIKit has three usage modes:

- React consumers import components from `@freecodecamp/uikit` plus CSS from
  `@freecodecamp/uikit-css`.
- Static HTML consumers use BEM classes from the CSS package or the CDN
  stylesheet.
- Vanilla interactive consumers add `data-uikit-*` attributes and load
  `uikit.global.js`; the runtime scans the DOM at boot and after mutations.

The docs app dogfoods all three: React previews, HTML examples, CSS tokens, the
vanilla runtime, icons, and CDN-style assets.

## Current checkout note

This document describes the current working tree, not only the last commit.
At the time of writing, script and flow changes are present in the checkout
around pnpm 10, Playwright script aliases, CDN scripts, Turbo tasks, and
Tailwind package metadata. Check `git status` before treating this as committed
history.

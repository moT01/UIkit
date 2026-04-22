# fCC UIKit

A component library for freeCodeCamp's Command-line Chic design language.

## Quick start

Add one line to your app's entry CSS:

```css
@import url("https://cdn.freecodecamp.org/uikit/styles.min.css");
```

Fonts, tokens, and every component class come with it. Use the BEM class names in any framework:

```tsx
<button className="btn btn--cta">Start curriculum</button>
<span className="badge badge--success">Passed</span>
```

Full walkthrough with a Windmill raw-app example lives in the [**CDN guide**](./src/pages/guides/cdn.astro) (visible at `/guides/cdn` once you run the storybook).

Contributor docs live in [CONTRIBUTING.md](./CONTRIBUTING.md) and the release runbook at [docs/releasing.md](./docs/releasing.md).

## Versioning

The CDN ships one rolling bundle plus semver-style aliases:

- Root: `/uikit/styles.min.css` and `/uikit/fonts/*` track the current release.
- `latest/`: explicit alias for the current release.
- `<major>/`: tracks the latest release in that major line.
- `<major>.<minor>/`: tracks the latest release in that minor line.
- `<major>.<minor>.<patch>/`: fully pinned release.

Examples:

```css
@import url("https://cdn.freecodecamp.org/uikit/styles.min.css");         /* rolling latest */
@import url("https://cdn.freecodecamp.org/uikit/latest/styles.min.css");  /* explicit latest */
@import url("https://cdn.freecodecamp.org/uikit/0/styles.min.css");       /* latest 0.x */
@import url("https://cdn.freecodecamp.org/uikit/0.1/styles.min.css");     /* latest 0.1.x */
@import url("https://cdn.freecodecamp.org/uikit/0.1.0/styles.min.css");   /* pinned */
```

## Publishing

Cut releases from GitHub Actions with the manual `Release` workflow. It builds from the chosen ref, verifies the CDN bundle, tags the repo as `v<version>`, and uploads release assets for that version.

Why this is manual: the default `GITHUB_TOKEN` is scoped to the repository that runs the workflow, so this repo's workflow can create releases here but cannot push into `freeCodeCamp/cdn` without a separate cross-repo credential.

Typical flow:

- Bump `package.json` to the exact `x.y.z` version you want to ship.
- Run the `Release` workflow from the default branch with the target ref.
- Download `fcc-uikit-<version>.tar.gz` or `fcc-uikit-<version>.zip` from the GitHub release.
- Extract `uikit/` and copy its contents into `freeCodeCamp/cdn/build/uikit/`.

Assets that need to ship:

- `styles.min.css` for the full kit.
- `tokens.min.css` for tokens and fonts only.
- `components.min.css` for component rules only.
- `fonts/` for all bundled font files.
- `brand/` for shared freeCodeCamp brand assets when present.
- `manifest.json` for file hashes and sizes.
- `latest/`, `<major>/`, `<major>.<minor>/`, and `<version>/` as byte-for-byte mirrors of the top-level bundle.

Examples:

```text
build/uikit/styles.min.css
build/uikit/fonts/Lato-Regular.woff
build/uikit/latest/styles.min.css
build/uikit/0/styles.min.css
build/uikit/0.1/styles.min.css
build/uikit/0.1.0/styles.min.css
```

## Fallbacks — pick how deep you want to fork

When the CDN isn't an option, the kit still works. Each tier ships the same visual result with a different level of ownership. Full details in the [**Copy & vendor guide**](./src/pages/guides/copy-paste.astro) (at `/guides/copy-paste`).

- **Vendor the compiled bundle.** Run `pnpm build:cdn` and commit the resulting `dist-cdn/uikit/` into your app. No network dependency.
- **Paste the source CSS.** Copy `src/styles/tokens.css` and `src/styles/components.css` into your own stylesheet folder.
- **Paste individual snippets.** Grep `components.css` for the rule block you need. Each component's rules are independent.
- **Copy the React component file.** Each `.tsx` under `src/components/react/` is a thin `className` wrapper — drop one in and pair it with matching CSS.

## Run locally

```bash
pnpm install
pnpm dev          # storybook + guides at http://localhost:4321
pnpm build        # Astro static build → dist/
pnpm build:cdn    # produce CDN bundle → dist-cdn/uikit/
pnpm verify:cdn   # sanity-check the CDN bundle
pnpm test         # unit tests (node:test + tsx)
```

## Architecture

- `src/styles/tokens.css` — palette, type scale, spacing, `@font-face`
- `src/styles/components.css` — vanilla CSS for every component
- `src/styles/showcase.css` — site chrome for the storybook
- `src/components/react/*.tsx` — typed React wrappers around the CSS classes
- `src/data/nav.ts` — single source of truth for the sidebar
- `src/pages/index.astro` — component storybook (the SPA)
- `src/pages/guides/*.astro` — usage guides (separate pages)
- `scripts/build-cdn.mjs` — lightningcss-driven CDN pipeline
- `scripts/verify-cdn.mjs` — integrity + URL-rewrite checker

## License

BSD-3-Clause. See [LICENSE](LICENSE).

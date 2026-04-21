# fCC UIKit

A copy-paste component library for teams shipping learning tools.
Built in freeCodeCamp's Command-line Chic language — dark-first, flat
surfaces, square corners, no shadow. Two flavors in one kit: typed React
components and plain-CSS snippets that drop into any stack.

## What it is

- Twenty-one production components covering actions, forms, feedback,
  layout, and data.
- A design-token layer that recolors the entire kit by swapping a single
  class on `<html>`.
- A single-page storybook — preview, copy, ship.

No npm package. No runtime you don't own. Take the files, rename them,
change the tokens, remove what you don't need.

## Run locally

```bash
pnpm install
pnpm dev       # start the storybook at http://localhost:4321
pnpm build     # produce dist/ for deployment
```

## Architecture

- `src/styles/tokens.css` — palette, type scale, spacing, font-face
- `src/styles/components.css` — vanilla CSS for every component
- `src/styles/showcase.css` — site chrome for the storybook
- `src/components/react/*.tsx` — typed React implementations
- `src/data/nav.ts` — the single source of truth for the sidebar

## License

BSD-3-Clause. See [LICENSE](LICENSE).

# Contributing

Thanks for helping improve the freeCodeCamp UIKit. This repo follows the freeCodeCamp.org contribution standards. Start with the freeCodeCamp contributor guide:

> <https://contribute.freecodecamp.org/>

When you're ready to work on UIKit specifically, the sections below cover the project-local workflow.

## Code of Conduct

All contributors are expected to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Reporting bugs

Open an issue at <https://github.com/freeCodeCamp/UIkit/issues> with steps to reproduce, expected behaviour, and observed behaviour. Include a screenshot when the bug is visual. For Playwright golden mismatches, attach the diff PNG from `apps/docs/test-results/`.

## Reporting security issues

Do **not** open a public issue. Follow the disclosure process in [SECURITY.md](./SECURITY.md).

## Setup

```bash
pnpm install
pnpm build
pnpm test
```

`pnpm install` also installs Husky's git hooks. The `pre-commit` hook runs `lint-staged`, which formats staged files with Prettier + ESLint before the commit lands.

Requires Node `>=20` (CI runs on Node 22) and pnpm 10. The `.nvmrc`,
`engines`, and root `packageManager` fields pin the versions.

## Day-to-day workflow

- Branch from `main`.
- Make your change.
- Add a changeset for any change that affects a published package: `pnpm changeset` (interactive).
- Run `pnpm lint`, `pnpm test`, and `pnpm build` before opening a PR.
- Refresh Playwright goldens in the same commit when a visual change lands: `pnpm test:visual:update`.

## Linting and formatting

```bash
pnpm format        # prettier --write + eslint --fix
pnpm format:check  # prettier --check + eslint
pnpm lint          # turbo run lint
pnpm typecheck     # turbo run typecheck
```

Configs:

- `prettier.config.js` — Prettier rules (single quotes, no trailing commas, `prettier-plugin-astro` for `.astro`).
- `eslint.config.js` — ESLint flat config (`eslint-plugin-astro` + `typescript-eslint`).

## Tests

```bash
pnpm test                # vitest unit + node:test where present (turbo)
pnpm test:coverage       # vitest with v8 coverage; thresholds 85/80/85/85
pnpm test:visual         # Playwright goldens (mobile / tablet / desktop / desktop-light)
pnpm test:visual:update  # refresh goldens after intentional UI change
```

## CI and release flow

- `CI` runs on pushes to `main` and pull requests targeting `main`: `pnpm format:check`, `pnpm test`, `pnpm build`, `pnpm --filter @freecodecamp/uikit-cdn run verify`.
- `Release` is manual. Trigger from GitHub Actions with `workflow_dispatch` and pick the ref to release.
- The release workflow builds the CDN bundle, then opens a PR on `freeCodeCamp/cdn` that updates `build/uikit/`.
- Cross-repo push uses the `CDN_PUSH_TOKEN` secret (fine-grained PAT scoped to `freeCodeCamp/cdn`). The default `GITHUB_TOKEN` is never used outside this repo.
- npm publish is not currently automated. Run `pnpm release:check`, then
  `pnpm release` locally with an org-scoped npm token.

## Release checklist

1. Run `pnpm changeset` for each PR that ships user-visible change.
2. When ready to release, run `pnpm changeset version` on `main` to consume queued changesets, bump versions, and update per-package `CHANGELOG.md`.
3. Commit the version bump as a single commit.
4. Run `pnpm release:check` from a clean checkout.
5. Run `pnpm release` to publish npm packages.
6. Run the `Release` workflow with `ref: main` to publish the CDN bundle.
7. Review and merge the PR it opens on `freeCodeCamp/cdn`.

## More docs

- Release runbook: [docs/releasing.md](./docs/releasing.md)
- CDN usage guide: [apps/docs/src/pages/guides/cdn.astro](./apps/docs/src/pages/guides/cdn.astro)
- Components matrix: [docs/components-matrix.md](./docs/components-matrix.md)

# Contributing

## Setup

```bash
pnpm install
pnpm test
pnpm build
pnpm build:cdn
pnpm verify:cdn
```

## Day-to-day workflow

- Branch from `main`.
- Make your change.
- Keep `package.json` on the intended release version.
- Run `pnpm test` and the relevant build steps before opening a PR.

## CI and release flow

- `CI` runs on pushes to `main` and pull requests targeting `main`.
- `Release` is manual. Run it from GitHub Actions with `workflow_dispatch` when you want to cut a release.
- The release workflow builds from the selected ref, runs tests, verifies the CDN bundle, tags the repo as `v<version>`, and uploads release assets.
- The workflow does not publish directly to `freeCodeCamp/cdn`. The default `GITHUB_TOKEN` can create releases in this repo, but it does not have cross-repo write access.

## Manual release checklist

1. Set `package.json` to the exact `x.y.z` version you want to ship.
2. Merge that change to `main`.
3. Run the `Release` workflow from the default branch.
4. Download the generated release asset bundle.
5. Extract `uikit/` and copy it into `freeCodeCamp/cdn/build/uikit/`.
6. Commit and publish that CDN repo change separately.

## More docs

- Release runbook: [docs/releasing.md](./docs/releasing.md)
- CDN usage guide: [src/pages/guides/cdn.astro](./src/pages/guides/cdn.astro)

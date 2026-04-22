# Releasing UIKit

## What ships

The CDN bundle lives under `dist-cdn/uikit/` and must be copied into `freeCodeCamp/cdn/build/uikit/` without rearranging it.

Ship these assets:

- `styles.min.css`
- `tokens.min.css`
- `components.min.css`
- `fonts/`
- `brand/` when present
- `manifest.json`
- `latest/`
- `<major>/`
- `<major>.<minor>/`
- `<major>.<minor>.<patch>/`

## Version aliases

For package version `0.1.0`, the build emits:

```text
uikit/styles.min.css
uikit/latest/styles.min.css
uikit/0/styles.min.css
uikit/0.1/styles.min.css
uikit/0.1.0/styles.min.css
```

Alias rules:

- Root tracks the current release.
- `latest/` is an explicit current-release alias.
- `<major>/` tracks the latest release in that major line.
- `<major>.<minor>/` tracks the latest release in that minor line.
- `<major>.<minor>.<patch>/` is fully pinned.

## GitHub Actions

### CI

The `CI` workflow runs on:

- pushes to `main`
- pull requests targeting `main`

It runs:

- `pnpm test`
- `pnpm build:cdn`
- `pnpm verify:cdn`
- `pnpm build`

### Release

The `Release` workflow is manual and uses `workflow_dispatch`.

Inputs:

- `ref`: the git ref to release
- `draft`: whether to create a draft release
- `prerelease`: whether to mark the release as a prerelease

It performs these steps:

1. Checks out the selected ref.
2. Installs dependencies.
3. Runs tests and builds.
4. Reads `package.json` version and requires full `x.y.z` semver.
5. Packages `dist-cdn/uikit/` as `.tar.gz` and `.zip`.
6. Creates a GitHub release tagged as `v<version>`.

Release assets:

- `fcc-uikit-<version>.tar.gz`
- `fcc-uikit-<version>.zip`
- `fcc-uikit-<version>-sha256.txt`

## Why CDN publishing is manual

This repo's workflow uses the default `GITHUB_TOKEN`. That token can create tags and releases in this repo when `contents: write` is allowed, but it does not have permission to push to `freeCodeCamp/cdn` unless a separate cross-repo credential is added.

That means the last mile stays manual:

1. Run the `Release` workflow.
2. Download a release asset.
3. Extract `uikit/`.
4. Copy the extracted files into `freeCodeCamp/cdn/build/uikit/`.
5. Commit that change in the `freeCodeCamp/cdn` repo.

## Quick release checklist

1. Bump `package.json` to the target `x.y.z`.
2. Merge to `main`.
3. Run `Release` with `ref=main`.
4. Confirm the tag is `v<version>`.
5. Confirm the release assets were uploaded.
6. Sync `uikit/` into the CDN repo.

# UIKit repo docs

This folder documents how this repository works. It is for maintainers and
contributors working in the monorepo. The public product documentation lives in
`apps/docs` and is published as the Astro docs site.

## Start here

| Doc                                                 | What it covers                                                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [Repo overview](./repo-overview.md)                 | What the monorepo ships, where source lives, and how the build outputs fit together.              |
| [Packages](./packages.md)                           | Every workspace package, its entrypoints, exports, scripts, tests, and generated artifacts.       |
| [Tooling](./tooling.md)                             | Workspace inventory, toolchain pins, oxc adoption, LTS policy, CI/CD overview.                    |
| [ADRs](./adr/)                                      | Architecture decision records — locked decisions cited from code and other docs.                  |
| [Component catalog](./component-catalog.md)         | Every component surfaced by the docs navigation, grouped by tier, with source and showcase paths. |
| [Development workflows](./development-workflows.md) | Current `pnpm run` scripts, Turbo tasks, local workflows, CI, and validation commands.            |
| [Docs app internals](./docs-app-internals.md)       | How the Astro docs app, content collections, showcases, search index, and tests are wired.        |
| [Components matrix](./components-matrix.md)         | UIKit component coverage compared with Catalyst, Ark UI, and Headless UI.                         |
| [Releasing](./releasing.md)                         | CDN bundle build, verification, GitHub Actions release flow, and cross-repo publish PR.           |
| [v1.1 backlog](./v1.1-backlog.md)                   | Deferred bugs, features, CI hardening, and repo-public follow-ups.                                |
| [Release notes](./releases/v1.0.0-rc.0.md)          | Historical v1.0.0 release candidate draft notes.                                                  |

## Source of truth

These docs describe the checked-out repo state. For exact behavior, read the
source files they point to:

- package scripts: root `package.json` and each workspace `package.json`
- task graph: `turbo.json`
- CI and release: `.github/workflows/*`
- component inventory: `apps/docs/src/data/nav.ts` and
  `apps/docs/src/data/knownComponents.ts`
- package exports: `packages/*/package.json` and package barrel files

If a command or workflow changes, update the relevant repo doc in the same PR.

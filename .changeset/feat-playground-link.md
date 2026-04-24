---
'@freecodecamp/uikit-docs': minor
---

Ship a `<PlaygroundLink>` component — a form-POST link that opens a
pre-seeded StackBlitz project with `@freecodecamp/uikit` and
`@freecodecamp/uikit-css` pre-installed. First wired into the Button
MDX page; copy-paste the import + usage to add it to any other page.

We deliberately chose a link-out rather than an inline Sandpack
iframe — Sandpack's bundle is ~600 kB and would slow every page
load. StackBlitz hosts the runtime + preview on their side, keeping
the docs light.

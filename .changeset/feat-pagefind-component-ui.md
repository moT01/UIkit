---
'@freecodecamp/uikit-docs': minor
---

Migrate the docs site search from Pagefind's classic `PagefindUI`
constructor to the **Component UI** web-components introduced in
Pagefind 1.5. `Search.astro` now composes `<pagefind-config>`,
`<pagefind-input>`, `<pagefind-summary>`, `<pagefind-results>` inside
the existing `<dialog>` chrome; configuration moves from JS options
to declarative HTML attributes; colour tokens forward to Pagefind's
`--pagefind-ui-*` CSS variables so search inherits our palette.

Drops the build-time "please migrate" banner from Pagefind. The
existing `"/"`-keyboard-shortcut + backdrop-click-to-close behaviour
is unchanged.

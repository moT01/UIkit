---
'@freecodecamp/uikit-docs': patch
---

Enable Astro's `<ClientRouter />` in `BaseLayout.astro`, giving every
docs page a native View-Transitions-API cross-fade on internal route
changes. Falls back to a classic swap where the browser doesn't
support VT. Scroll position, the sidebar active state, and the copied
`__NO_SPY__` init script continue to behave because we only layer the
router on top — no hash/search rewrites.

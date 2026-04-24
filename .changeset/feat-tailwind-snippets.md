---
'@freecodecamp/uikit-docs': patch
---

Tailwind snippets on the showcase page for the four most-copy-pasted
primitives: Button, Badge, Card, and Callout. The "Copy Tailwind"
menu item now returns a real snippet that reads token colours
(`var(--cta-background)` etc.) from `@freecodecamp/uikit-css`, so
Tailwind-first teams can drop the markup in without losing palette
parity. Remaining components inherit a clearer fallback note that
points at the HTML tab for raw structure.

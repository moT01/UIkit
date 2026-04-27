# @freecodecamp/uikit-js

Vanilla JavaScript runtime for freeCodeCamp UIKit. It wires
`data-uikit-*` attributes to the UIKit adapters and keeps later DOM additions
mounted with one `MutationObserver`.

## Install

```bash
pnpm add @freecodecamp/uikit-js
```

## Use

```ts
import '@freecodecamp/uikit-js';
```

For script-tag consumers, use the IIFE export:

```html
<script src="/path/to/uikit.global.js" defer></script>
```

The CDN package copies that IIFE into the published CDN bundle.

## Exports

- `@freecodecamp/uikit-js`
- `@freecodecamp/uikit-js/iife`
- `@freecodecamp/uikit-js/package.json`

Docs: <https://design.freecodecamp.org>

License: BSD-3-Clause

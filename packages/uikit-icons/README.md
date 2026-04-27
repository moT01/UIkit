# @freecodecamp/uikit-icons

Curated SVG icon set for freeCodeCamp UIKit. The package ships a non-React icon
body map, a React `<Icon>` wrapper, and a generated SVG sprite.

## Install

```bash
pnpm add @freecodecamp/uikit-icons
```

## Use React

```tsx
import { Icon } from '@freecodecamp/uikit-icons/react';

export function Example() {
  return <Icon name='check' label='Complete' />;
}
```

## Use the icon map

```ts
import { icons } from '@freecodecamp/uikit-icons';
```

## Exports

- `@freecodecamp/uikit-icons`
- `@freecodecamp/uikit-icons/react`
- `@freecodecamp/uikit-icons/sprite.svg`
- `@freecodecamp/uikit-icons/package.json`

Peer dependency: `react >=18 <20` for the React wrapper only.

Docs: <https://design.freecodecamp.org>

License: BSD-3-Clause

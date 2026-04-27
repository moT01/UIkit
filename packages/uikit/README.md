# @freecodecamp/uikit

React components for freeCodeCamp's Command-line Chic design system.

## Install

```bash
pnpm add @freecodecamp/uikit @freecodecamp/uikit-css
```

## Use

```tsx
import '@freecodecamp/uikit-css';
import { Button, Text } from '@freecodecamp/uikit';

export function Example() {
  return (
    <>
      <Text>Ready to learn?</Text>
      <Button variant='cta'>Start curriculum</Button>
    </>
  );
}
```

## Exports

- `@freecodecamp/uikit`
- `@freecodecamp/uikit/primitives`
- `@freecodecamp/uikit/forms`
- `@freecodecamp/uikit/overlays`
- `@freecodecamp/uikit/navigation`
- `@freecodecamp/uikit/data-display`
- `@freecodecamp/uikit/layouts`
- `@freecodecamp/uikit/props.json`
- `@freecodecamp/uikit/package.json`

## Peers

- `react >=18 <20`
- `react-dom >=18 <20`
- `@ark-ui/react ^5.0.0`

Docs: <https://fcc-uikit.netlify.app>

License: BSD-3-Clause

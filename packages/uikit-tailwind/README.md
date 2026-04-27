# @freecodecamp/uikit-tailwind

Tailwind preset and plugin that map utilities to freeCodeCamp UIKit CSS custom
properties.

## Install

```bash
pnpm add -D @freecodecamp/uikit-tailwind
pnpm add @freecodecamp/uikit-css
```

## Use

```ts
import uikitPreset, {
  plugin as uikitPlugin
} from '@freecodecamp/uikit-tailwind';

export default {
  presets: [uikitPreset],
  plugins: [uikitPlugin]
};
```

Load the CSS tokens in your app as well:

```ts
import '@freecodecamp/uikit-css';
```

## Exports

- `@freecodecamp/uikit-tailwind`
- `@freecodecamp/uikit-tailwind/preset`
- `@freecodecamp/uikit-tailwind/plugin`
- `@freecodecamp/uikit-tailwind/package.json`

Peer dependency: `tailwindcss >=3 <5`.

Docs: <https://fcc-uikit.netlify.app>

License: BSD-3-Clause

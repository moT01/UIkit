// Tailwind plugin adding fCC-specific utilities and palette variants.
// Consumers enable it via { plugins: [fccPlugin] } in tailwind.config.
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import type { PluginCreator } from 'tailwindcss/plugin';

type FccPlugin = {
  handler: PluginCreator;
  config?: Partial<Config>;
};

const fccPlugin: FccPlugin = plugin(({ addUtilities, addVariant }) => {
  addUtilities({
    '.focus-ring': {
      outline: '3px solid var(--blue-mid)',
      outlineOffset: '0'
    }
  });

  // Palette-scoped variants — mirror the .dark-palette / .light-palette
  // hooks on <html> (see packages/uikit-css/src/tokens.css).
  addVariant('fcc-dark', '&:is(.dark-palette *)');
  addVariant('fcc-light', '&:is(.light-palette *)');
});

export default fccPlugin;

// Wave 9 P2.2 (W9-B18) — Radio showcase island.
//
// Astro `client:*` islands hydrate by re-running the React component
// with the serialized `props` attribute on `<astro-island>` —
// children authored in the .astro template only render once at SSR
// and are gone after hydration. Radio's parent-child context wiring
// (RadioGroup → RadioGroupContext → Radio) requires the entire tree
// to render under one React boundary; the .astro slot pattern would
// render parent + children separately and break the context.
//
// Wrapping the composition here means SSR and hydration see the
// identical React tree, so:
//  1. SSR pre-selects the matching Radio via `defaultValue`.
//  2. Hydration restores the click handlers so the user can change
//     the selection.
import { Radio, RadioGroup } from '@freecodecamp/uikit';

export function RadioDemo(): JSX.Element {
  return (
    <RadioGroup name='theme-demo' defaultValue='dark' aria-label='Theme'>
      <Radio value='dark' label='Dark — default' />
      <Radio value='light' label='Light' />
      <Radio value='system' label='System' />
    </RadioGroup>
  );
}

export default RadioDemo;

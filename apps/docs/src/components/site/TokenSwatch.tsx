// Wave 7 P1 — token-swatch truth. Renders a CSS custom-property name
// alongside its RUNTIME-RESOLVED value, not a hand-typed hex. Wave 6
// shipped three lying swatches (display values had drifted from the
// declared token values by months of CSS edits). This island reads
// `getComputedStyle(:root)` on mount and re-reads when the palette
// class on `<html>` changes, so swatches always reflect what the kit
// actually paints.
//
// Hydration: `client:load` because the read must run as soon as the
// stylesheet parses to avoid the empty-string flash. SSR renders a
// loading dash (`—`); client takes over within 100ms typical.
import { useEffect, useState, useRef } from 'react';

export interface TokenSwatchProps {
  /** CSS custom-property name including the leading `--`. */
  name: string;
  /** Optional human label override; defaults to `name`. */
  label?: string;
  /** Defaults to `:root`. Override when reading from a scoped element. */
  scope?: string;
}

const PLACEHOLDER = '—';

function resolve(name: string, scope: string): string {
  if (typeof window === 'undefined') return '';
  const node =
    scope === ':root'
      ? document.documentElement
      : document.querySelector<HTMLElement>(scope);
  if (!node) return '';
  return getComputedStyle(node).getPropertyValue(name).trim();
}

export function TokenSwatch({
  name,
  label,
  scope = ':root'
}: TokenSwatchProps): JSX.Element {
  const [value, setValue] = useState<string>('');
  const observer = useRef<MutationObserver | null>(null);

  useEffect(() => {
    setValue(resolve(name, scope));

    // Re-read whenever the palette class on <html> flips. The light
    // and dark palettes redeclare the same custom-property names with
    // different values; the swatch must follow.
    if (typeof MutationObserver === 'undefined') return;
    observer.current = new MutationObserver(() => {
      setValue(resolve(name, scope));
    });
    observer.current.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-palette']
    });
    return () => observer.current?.disconnect();
  }, [name, scope]);

  const display = value || PLACEHOLDER;
  // Chip uses the custom-property directly so the hue stays in lock
  // step with the resolved value, even before the effect fires.
  return (
    <div className='swatch'>
      <div
        className='swatch__chip'
        style={{ background: `var(${name})` }}
        aria-hidden='true'
      />
      <div className='swatch__meta'>
        <span className='swatch__name'>{label ?? name}</span>
        <span className='swatch__value' data-token-value>
          {display}
        </span>
      </div>
    </div>
  );
}

export default TokenSwatch;

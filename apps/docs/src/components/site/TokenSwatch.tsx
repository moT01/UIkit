import type { JSX } from 'react';
// Renders a CSS custom-property name with its runtime-resolved value (not a hand-typed hex).
// Uncontrolled: self-mounts a MutationObserver on `<html>` and re-reads on palette swap.
// Controlled (`value` prop): skips the observer; parent drives the re-read for many cells at once.
import { useEffect, useState, useRef } from 'react';

export interface TokenSwatchProps {
  /** CSS custom-property name including the leading `--`. */
  name: string;
  /** Optional human label override; defaults to `name`. */
  label?: string;
  /** Defaults to `:root`. Override when reading from a scoped element. */
  scope?: string;
  /** Controlled mode — parent supplies resolved value and owns the palette observer. */
  value?: string;
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
  scope = ':root',
  value
}: TokenSwatchProps): JSX.Element {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>('');
  const observer = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (isControlled) return;
    setInternal(resolve(name, scope));

    if (typeof MutationObserver === 'undefined') return;
    observer.current = new MutationObserver(() => {
      setInternal(resolve(name, scope));
    });
    observer.current.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-palette']
    });
    return () => observer.current?.disconnect();
  }, [name, scope, isControlled]);

  const display = isControlled ? value || PLACEHOLDER : internal || PLACEHOLDER;
  // Chip uses var() directly so it paints correctly before the effect resolves the displayed text.
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

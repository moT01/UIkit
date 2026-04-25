import React, { forwardRef } from 'react';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ className = '', children, ...rest }, ref) => {
    const classes = ['sidebar', className].filter(Boolean).join(' ');
    return (
      <aside ref={ref} role='navigation' className={classes} {...rest}>
        {children}
      </aside>
    );
  }
);
Sidebar.displayName = 'Sidebar';

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLElement> {
  label?: React.ReactNode;
  /**
   * When true, renders the section as a `<details><summary>` pair so users can
   * fold/unfold. Default: false (emits the original `<section>`).
   */
  collapsible?: boolean;
  /**
   * Initial open state when `collapsible` is true. Ignored otherwise.
   * Default: true.
   */
  defaultOpen?: boolean;
}

export const SidebarSection = forwardRef<HTMLElement, SidebarSectionProps>(
  (
    {
      label,
      className = '',
      children,
      collapsible = false,
      defaultOpen = true,
      ...rest
    },
    ref
  ) => {
    if (collapsible) {
      const classes = [
        'sidebar__section',
        'sidebar__section--collapsible',
        className
      ]
        .filter(Boolean)
        .join(' ');
      return (
        <details
          ref={ref as unknown as React.Ref<HTMLDetailsElement>}
          className={classes}
          open={defaultOpen}
          {...(rest as React.HTMLAttributes<HTMLDetailsElement>)}
        >
          <summary className='sidebar__section__summary'>
            {label !== undefined && (
              <span className='sidebar__eyebrow'>{label}</span>
            )}
            <span className='sidebar__section__caret' aria-hidden='true'>
              ▸
            </span>
          </summary>
          {children}
        </details>
      );
    }
    const classes = ['sidebar__section', className].filter(Boolean).join(' ');
    return (
      <section ref={ref} className={classes} {...rest}>
        {label !== undefined && <div className='sidebar__eyebrow'>{label}</div>}
        {children}
      </section>
    );
  }
);
SidebarSection.displayName = 'SidebarSection';

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface SidebarItemCommonProps {
  active?: boolean;
  icon?: React.ReactNode;
}

export type SidebarItemProps = SidebarItemCommonProps &
  Omit<AnchorProps & ButtonProps, 'type'>;

export const SidebarItem = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  SidebarItemProps
>((props, ref) => {
  const { active, icon, className = '', children, ...rest } = props;
  const classes = ['sidebar__item', className].filter(Boolean).join(' ');
  const extras = {
    'aria-current': active ? 'page' : undefined,
    'data-active': active ? 'true' : undefined
  } as const;
  const inner = (
    <>
      {icon !== undefined && <span className='sidebar__icon'>{icon}</span>}
      <span className='sidebar__label'>{children}</span>
    </>
  );
  const href = (rest as AnchorProps).href;
  if (href !== undefined) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...extras}
        {...(rest as AnchorProps)}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type='button'
      className={classes}
      {...extras}
      {...(rest as ButtonProps)}
    >
      {inner}
    </button>
  );
});
SidebarItem.displayName = 'SidebarItem';

/**
 * Normalise a path by stripping trailing slashes. Root (`/`) is preserved.
 */
function normalisePath(value: string): string {
  if (value === '/') return '/';
  return value.replace(/\/+$/, '') || '/';
}

export interface IsActiveHrefOptions {
  /** When true (default), require exact match. When false, descendant hrefs match. */
  exact?: boolean;
}

/**
 * Compare a current path against a nav href, with trailing-slash normalisation.
 * - Default (`exact`): `true` only if paths match after normalisation.
 * - `{ exact: false }`: also `true` when `path` is a descendant of `href`.
 */
export function isActiveHref(
  path: string,
  href: string,
  options?: IsActiveHrefOptions
): boolean {
  const exact = options?.exact ?? true;
  const p = normalisePath(path);
  const h = normalisePath(href);
  if (p === h) return true;
  if (exact) return false;
  if (h === '/') return true;
  return p.startsWith(h + '/');
}

/**
 * Hash-aware variant for nav entries that target an in-page anchor
 * (`/#button`, `/handbook#palette`). Required when a single route hosts
 * multiple addressable sections — e.g. the docs `/` Playground listing
 * 45 components as `/#<slug>` anchors.
 *
 * Match rules:
 * - If `href` contains no `#`, defer to {@link isActiveHref}.
 * - If `href` contains a `#`, split into `[path, hash]` and require the
 *   current `path` to match `path` AND the current `hash` to match
 *   `'#' + hash` exactly. An empty `currentHash` never matches a hash
 *   target — so the page-load default of `/` never lights up `/#button`.
 *
 * @param currentPath - `window.location.pathname` (or `Astro.url.pathname`).
 * @param currentHash - `window.location.hash` including the leading `#`,
 *                      or `''` when no fragment.
 * @param href        - The nav item's href.
 */
export function isActiveHrefWithHash(
  currentPath: string,
  currentHash: string,
  href: string
): boolean {
  const hashIdx = href.indexOf('#');
  if (hashIdx === -1) return isActiveHref(currentPath, href);

  const targetPath = hashIdx === 0 ? currentPath : href.slice(0, hashIdx);
  const targetHash = '#' + href.slice(hashIdx + 1);

  // A bare `#frag` href is treated as same-route fragment.
  const path = normalisePath(targetPath);
  const cur = normalisePath(currentPath);
  if (path !== cur) return false;
  return currentHash === targetHash;
}

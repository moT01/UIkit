// Dogfood chrome: docs site sidebar built on @freecodecamp/uikit's
// <Sidebar> + <SidebarSection> + <SidebarItem>. Wave 7 P2 — switched
// from `isActiveHref` to `isActiveHrefWithHash` so the 45 component
// nav entries (`/#<slug>`) get correct active state on the Playground.
// `currentHash` is threaded in from `Astro.url.hash`; client-side
// scroll-spy keeps it in sync as the user scrolls.
//
// Wave 4 · 4.6 dropped the `shouldOpenSection` / `DEFAULT_OPEN` dance.
// After the IA flattened (/ as Playground + /handbook as reference),
// the sidebar renders on exactly two routes and serves as a shallow
// jump-list — every section ships expanded.
import type { JSX } from 'react';
import {
  Sidebar,
  SidebarItem,
  SidebarSection,
  isActiveHrefWithHash
} from '@freecodecamp/uikit/navigation';
import type { NavSection } from '../../data/nav';

export interface AppSidebarProps {
  readonly nav: readonly NavSection[];
  readonly currentPath: string;
  /** `Astro.url.hash`; empty string when no fragment. */
  readonly currentHash?: string;
}

export function AppSidebar({
  nav,
  currentPath,
  currentHash = ''
}: AppSidebarProps): JSX.Element {
  return (
    <Sidebar aria-label='Component navigation'>
      <div className='sidebar__intro'>
        <p className='sidebar__intro-kicker'>freeCodeCamp UIKit</p>
        <p className='sidebar__intro-title'>Docs</p>
      </div>
      {nav.map(section => (
        <SidebarSection key={section.id} label={section.label}>
          {section.items.map(item => {
            // Anchor hrefs (`/#<slug>`, `#frag`) are scroll-spied
            // client-side via `showcase-spy.client.ts`. Tag them with
            // `data-sidebar-link` + `data-target` so the spy can find
            // and re-mark them as the user scrolls. Route-based hrefs
            // (e.g. `/handbook`) get static `active` from SSR only.
            const hashIdx = item.href.indexOf('#');
            const target = hashIdx === -1 ? null : item.href.slice(hashIdx + 1);
            const spyProps = target
              ? { 'data-sidebar-link': '', 'data-target': target }
              : {};
            return (
              <SidebarItem
                key={item.id}
                href={item.href}
                active={isActiveHrefWithHash(
                  currentPath,
                  currentHash,
                  item.href
                )}
                {...spyProps}
              >
                {item.label}
              </SidebarItem>
            );
          })}
        </SidebarSection>
      ))}
      <p className='sidebar__hint'>
        Press <kbd className='kbd'>/</kbd> to search
      </p>
    </Sidebar>
  );
}

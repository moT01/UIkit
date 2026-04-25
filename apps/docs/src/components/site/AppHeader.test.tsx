// Wave 9 P2.11 (W9-C3) — AppHeader active-link contract.
//
// The site header dogfoods <Navbar> with 4 primary links: `/`,
// `/handbook`, `/guides/install`, GitHub. Wave 7+8 shipped them as
// plain anchors with no current-page indicator, so screen readers
// could not tell which page the user is on. Wave 9 wires
// `aria-current="page"` on the matching link via a `pathname` prop
// fed by `Astro.url.pathname` from `AppHeader.astro`.
//
// Match policy:
//
//   • `/`              → home only when pathname is exactly '/'.
//   • `/handbook`      → matches `/handbook` and any `/handbook/*` slug.
//   • `/guides/install` → matches any `/guides/*` slug.
//   • GitHub (external) → never marked current.
import { test, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppHeader } from './AppHeader';

const render = (pathname: string): string =>
  renderToStaticMarkup(<AppHeader pathname={pathname} />);

const ariaCurrentForHref = (html: string, href: string): string | null => {
  // Locate the anchor with the given href (escaped) and capture
  // its `aria-current` attribute if present.
  const escaped = href.replace(/\//g, '\\/');
  const re = new RegExp(
    `<a[^>]*href="${escaped}"[^>]*\\baria-current="([^"]+)"`,
    'i'
  );
  const match = html.match(re);
  return match ? match[1] : null;
};

test('home `/` carries aria-current="page" only on the index route', () => {
  const html = render('/');
  expect(ariaCurrentForHref(html, '/')).toBe('page');
  expect(ariaCurrentForHref(html, '/handbook')).toBeNull();
  expect(ariaCurrentForHref(html, '/guides/install')).toBeNull();
});

test('`/handbook` marks the Handbook link, not home', () => {
  const html = render('/handbook');
  expect(ariaCurrentForHref(html, '/handbook')).toBe('page');
  expect(ariaCurrentForHref(html, '/')).toBeNull();
});

test('nested handbook routes still resolve to the Handbook link', () => {
  const html = render('/handbook/contributing');
  expect(ariaCurrentForHref(html, '/handbook')).toBe('page');
  expect(ariaCurrentForHref(html, '/')).toBeNull();
});

test('`/guides/*` routes mark the Guides link', () => {
  const html = render('/guides/copy-paste');
  expect(ariaCurrentForHref(html, '/guides/install')).toBe('page');
  expect(ariaCurrentForHref(html, '/')).toBeNull();
});

test('GitHub link is never marked current (external)', () => {
  for (const path of ['/', '/handbook', '/guides/install']) {
    const html = render(path);
    expect(
      ariaCurrentForHref(html, 'https://github.com/freeCodeCamp/ui')
    ).toBeNull();
  }
});

test('exactly one link is current per render', () => {
  for (const path of ['/', '/handbook', '/handbook/foo', '/guides/install']) {
    const html = render(path);
    const matches = html.match(/aria-current="page"/g) ?? [];
    expect(matches.length, `expected 1 current link on ${path}`).toBe(1);
  }
});

test('unknown routes default to no current link', () => {
  const html = render('/some-unknown-route');
  const matches = html.match(/aria-current="page"/g) ?? [];
  expect(matches.length).toBe(0);
});

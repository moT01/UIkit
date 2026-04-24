---
'@freecodecamp/uikit-docs': minor
---

Wave 4 — docs-overhaul landed. The docs site now reads like one
scrollable reference backed by a compact API spine.

- `/` — Playground. The gallery that used to live at `/showcase` is
  the canonical home. Three CTAs: Get started, Browse components,
  GitHub.
- `/handbook` — single-page reference. Scroll-anchored sections
  absorb every foundation (palette / typography / spacing /
  iconography / motion / voice), the new brand subsection (marks,
  clear-space demo, misuse, wordmark, asset-kit zip), plus install
  / CDN / overview / contributing.
- `/api` — compact index of every shipped component slug with
  status + since + link.
- `/api/<slug>` — per-component API reference. Excluded from
  `sitemap.xml` and Pagefind so search engines + in-site search
  surface the Playground + Handbook instead.
- Header trimmed to four items: Playground · Handbook · API ref ·
  GitHub. Sidebar rail only renders on `/` and `/handbook`.

301 redirects for every retired route so external deep-links keep
landing on the right anchor:

- `/showcase` → `/`
- `/components` → `/api`
- `/components/<slug>` → `/api/<slug>`
- `/guides` → `/handbook#overview`
- `/guides/cdn` → `/handbook#cdn`
- `/guides/copy-paste` → `/handbook#install`
- `/foundations` → `/handbook`
- `/foundations/<pillar>` → `/handbook#<pillar>`

// Wave 6 P5 — root LLM-friendly index. Lists every visible URL on
// the site with a one-line summary and the matching `.md` companion
// for agent consumption. See `/llms-full.txt` for the concatenated
// content dump.
//
// Output is plain `text/plain` markdown — no HTML, no frontmatter,
// no Pagefind indexing (Pagefind ignores `.txt`).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://fcc-uikit.netlify.app';

export const GET: APIRoute = async () => {
  const [components, guides] = await Promise.all([
    getCollection('components'),
    getCollection('guides')
  ]);

  components.sort((a, b) => a.id.localeCompare(b.id));
  guides.sort((a, b) => a.data.order - b.data.order);

  const lines: string[] = [];
  lines.push('# freeCodeCamp UIKit');
  lines.push('');
  lines.push('Dark-first, token-driven, framework-agnostic component library.');
  lines.push(
    'Three surfaces: React, vanilla CSS+JS, Tailwind preset. BEM-first.'
  );
  lines.push('');

  lines.push('## Surfaces');
  lines.push('');
  lines.push(`- [Playground](${SITE}/) — every component, paired code.`);
  lines.push(
    `- [Handbook](${SITE}/handbook) — design philosophy, tokens, brand.`
  );
  lines.push(
    `- [Guides](${SITE}/guides) — install matrix, Tailwind, CDN, recipes.`
  );
  lines.push('');

  lines.push('## Components');
  lines.push('');
  for (const c of components) {
    lines.push(
      `- [${c.data.title}](${SITE}/components/${c.id}.md) — ${c.data.summary}`
    );
  }
  lines.push('');

  lines.push('## Guides');
  lines.push('');
  for (const g of guides) {
    lines.push(
      `- [${g.data.title}](${SITE}/guides/${g.id}.md) — ${g.data.summary}`
    );
  }
  lines.push('');

  lines.push('## Concatenated dump');
  lines.push('');
  lines.push(
    `- [llms-full.txt](${SITE}/llms-full.txt) — every page, single file.`
  );
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};

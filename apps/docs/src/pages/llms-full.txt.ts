import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { stripMdx } from '../lib/strip-mdx';

const SITE = 'https://fcc-uikit.netlify.app';

export const GET: APIRoute = async () => {
  const [components, guides] = await Promise.all([
    getCollection('components'),
    getCollection('guides')
  ]);

  components.sort((a, b) => a.id.localeCompare(b.id));
  guides.sort((a, b) => a.data.order - b.data.order);

  const lines: string[] = [];
  lines.push('# freeCodeCamp UIKit — full dump');
  lines.push('');
  lines.push(`Source: ${SITE}/llms.txt`);
  lines.push('');
  lines.push('This file concatenates every component and guide page into one.');
  lines.push('Each section is delimited by a level-1 heading.');
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('# Guides');
  lines.push('');
  for (const g of guides) {
    lines.push(`## ${g.data.title}`);
    lines.push(`URL: ${SITE}/guides/${g.id}`);
    lines.push(`Summary: ${g.data.summary}`);
    lines.push('');
    lines.push(stripMdx(g.body ?? ''));
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('# Components');
  lines.push('');
  for (const c of components) {
    lines.push(`## ${c.data.title}`);
    lines.push(`URL: ${SITE}/#${c.id}`);
    lines.push(`Status: ${c.data.status}`);
    if (c.data.since) lines.push(`Since: ${c.data.since}`);
    if (c.data.tokens?.length)
      lines.push(`Tokens: ${c.data.tokens.join(', ')}`);
    if (c.data.a11yPattern) lines.push(`A11y: ${c.data.a11yPattern}`);
    lines.push(`Summary: ${c.data.summary}`);
    lines.push('');
    lines.push(stripMdx(c.body ?? ''));
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};

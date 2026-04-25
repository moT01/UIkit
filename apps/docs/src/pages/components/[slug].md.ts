// Wave 6 P6 — per-component markdown sibling. `/#button` is the
// human surface; `/components/button.md` is the agent surface. The
// content is the raw MDX body of the matching `content/components/`
// entry, frontmatter stripped, plus a header block describing the
// component (status, tokens, a11y).
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { stripMdx } from '../../lib/strip-mdx';

const SITE = 'https://fcc-uikit.netlify.app';

export const getStaticPaths: GetStaticPaths = async () => {
  const components = await getCollection('components');
  return components.map(entry => ({
    params: { slug: entry.id },
    props: { entry }
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getCollection>>[number];
  };

  const lines: string[] = [];
  lines.push(`# ${entry.data.title}`);
  lines.push('');
  lines.push(`> ${entry.data.summary}`);
  lines.push('');
  lines.push(`- Playground: ${SITE}/#${entry.id}`);
  lines.push(`- Status: ${entry.data.status}`);
  if (entry.data.since) lines.push(`- Since: ${entry.data.since}`);
  if (entry.data.tokens?.length)
    lines.push(`- Tokens: ${entry.data.tokens.join(', ')}`);
  if (entry.data.a11yPattern)
    lines.push(`- A11y pattern: ${entry.data.a11yPattern}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(stripMdx(entry.body ?? ''));

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};

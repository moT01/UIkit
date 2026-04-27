import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { stripMdx } from '../../lib/strip-mdx';

const SITE = 'https://design.freecodecamp.org';

export const getStaticPaths: GetStaticPaths = async () => {
  const guides = await getCollection('guides');
  return guides.map(entry => ({
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
  lines.push(`- HTML: ${SITE}/guides/${entry.id}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(stripMdx(entry.body ?? ''));

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};

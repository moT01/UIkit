// Wave 7 P4 — showcase API-snippet audit. Wave 6 shipped 45 showcases
// with hand-typed React snippets. At least one (heading.astro) drifted
// from the shipping API (`<Heading as="h1">` instead of `level={1}`).
// This test parses every showcase's React `<Code>` block, extracts the
// JSX tag + prop names, and validates them against the exported uikit
// Props interfaces. Drift = test failure.
//
// Methodology:
//  1. Build a map: ComponentName → source `.tsx` path. Scan
//     `packages/uikit/src/**/[A-Z]*.tsx`.
//  2. For each `apps/docs/src/showcase/<slug>.astro`:
//     - Read the file source.
//     - Find every `<Code slot='react' ... code={\`...\`}>` block.
//     - Inside, find every JSX-like `<Component prop1=... prop2=...>`.
//     - Skip lowercase tags (raw HTML).
//     - For each PascalCase tag, verify it exists in the source map.
//     - Extract its declared props from the source `Props` interface.
//     - Confirm every prop in the snippet is declared OR is a known
//       framework attr (className, style, key, ref, on*, aria-*, data-*).
import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, '..', '..');
const repoRoot = resolve(appRoot, '..', '..');
const uikitSrc = resolve(repoRoot, 'packages', 'uikit', 'src');
const showcaseDir = resolve(appRoot, 'src', 'showcase');

interface ComponentInfo {
  /** Exported component name. */
  name: string;
  /** Absolute path to source `.tsx`. */
  sourceFile: string;
}

/** Walk packages/uikit/src/**\/[A-Z]*.tsx and collect components.
 *  Also scan each file for additional `export const X = ` /
 *  `export function X(` / `export { X }` declarations whose names
 *  start uppercase — co-located components like `Tab` shipping
 *  alongside `Tabs` would otherwise be missed. */
function discoverComponents(): Map<string, ComponentInfo> {
  const map = new Map<string, ComponentInfo>();
  const stack: string[] = [uikitSrc];
  while (stack.length) {
    const dir = stack.pop()!;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        stack.push(resolve(dir, entry.name));
        continue;
      }
      if (!entry.isFile()) continue;
      if (!entry.name.endsWith('.tsx')) continue;
      if (entry.name.endsWith('.test.tsx')) continue;
      const first = entry.name.charAt(0);
      if (first !== first.toUpperCase()) continue;
      const fileName = entry.name.replace(/\.tsx$/, '');
      const sourceFile = resolve(dir, entry.name);
      map.set(fileName, { name: fileName, sourceFile });
      // Scan for additional uppercase exports.
      const src = readFileSync(sourceFile, 'utf8');
      for (const re of [
        /export\s+const\s+([A-Z][A-Za-z0-9]*)\s*[=:]/g,
        /export\s+function\s+([A-Z][A-Za-z0-9]*)\s*\(/g,
        /export\s+\{\s*([^}]+)\s*\}/g
      ]) {
        let m: RegExpExecArray | null;
        while ((m = re.exec(src)) !== null) {
          const captured = m[1];
          for (const piece of captured.split(',')) {
            const name = piece
              .trim()
              .split(/\s+as\s+/)[0]
              .trim();
            if (/^[A-Z][A-Za-z0-9]*$/.test(name) && !map.has(name)) {
              map.set(name, { name, sourceFile });
            }
          }
        }
      }
    }
  }
  return map;
}

/**
 * Parse a `Props` interface from a TS source file. Returns the set of
 * declared property names (including those inherited via `extends`
 * `React.HTMLAttributes<*>` — those bring in `className`, `style`,
 * etc.). For HTMLAttributes-extending interfaces we mark them as
 * "DOM-flexible" so the audit accepts any HTML attribute.
 */
function readProps(
  sourceFile: string,
  componentName: string
): { explicit: Set<string>; htmlFlexible: boolean } {
  const src = readFileSync(sourceFile, 'utf8');
  const ast = ts.createSourceFile(
    sourceFile,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const targetNames = [`${componentName}Props`, `${componentName}OwnProps`];
  const explicit = new Set<string>();
  let htmlFlexible = false;

  function walk(node: ts.Node): void {
    if (
      ts.isInterfaceDeclaration(node) &&
      targetNames.includes(node.name.text)
    ) {
      // Members.
      for (const member of node.members) {
        if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
          explicit.add(member.name.text);
        }
      }
      // Heritage clauses — extends React.HTMLAttributes<*>?
      for (const heritage of node.heritageClauses ?? []) {
        for (const type of heritage.types) {
          // Read the FULL heritage entry text, not just the
          // expression. `extends Omit<React.InputHTMLAttributes<…>>`
          // has `expression='Omit'` and the HTMLAttributes type sits
          // inside the type arguments.
          const text = type.getText();
          if (
            text.includes('HTMLAttributes') ||
            text.includes('SVGAttributes') ||
            text.includes('DOMAttributes')
          ) {
            htmlFlexible = true;
          }
        }
      }
    }
    if (
      ts.isTypeAliasDeclaration(node) &&
      targetNames.includes(node.name.text)
    ) {
      // type FooProps = X & { … }; only handle the literal members.
      const visit = (t: ts.Node): void => {
        if (ts.isTypeLiteralNode(t)) {
          for (const m of t.members) {
            if (ts.isPropertySignature(m) && ts.isIdentifier(m.name)) {
              explicit.add(m.name.text);
            }
          }
        }
        ts.forEachChild(t, visit);
      };
      visit(node.type);
      // Treat type-alias unions as flexible — we can't always
      // statically resolve every contributing member.
      htmlFlexible = true;
    }
    ts.forEachChild(node, walk);
  }
  walk(ast);
  return { explicit, htmlFlexible };
}

/** Pull each `code={\`...\`}` payload from a React `<Code slot='react'>`. */
function extractReactSnippets(astroSrc: string): string[] {
  const out: string[] = [];
  const reactBlockRe =
    /<Code\s+slot=['"]react['"][\s\S]*?code=\{`([\s\S]*?)`\}/g;
  let m: RegExpExecArray | null;
  while ((m = reactBlockRe.exec(astroSrc)) !== null) {
    out.push(m[1]);
  }
  return out;
}

/** Walk a JSX-like string and yield `[tagName, [propName, ...]]`. */
function extractJsxTagsAndProps(jsx: string): Array<{
  tag: string;
  props: string[];
}> {
  // Strip string + brace literals so prop=`<Foo>` doesn't fool us.
  // Quick-and-dirty: scan for `<TagName prop1 prop2={...} prop3='...'>`.
  const hits: Array<{ tag: string; props: string[] }> = [];
  // Allow member-access tags (`Modal.Body`, `Tabs.List`) so we don't
  // mistake `Modal.Body` for `<Modal>` with a phantom `Body` prop.
  const tagRe = /<([A-Z][A-Za-z0-9]*(?:\.[A-Z][A-Za-z0-9]*)*)\b([\s\S]*?)\/?>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(jsx)) !== null) {
    const tag = m[1];
    const rest = m[2] ?? '';
    // Walk the props string: name=... or boolean prop, with brace
    // and quote balancing to ignore prop values that contain `=`.
    const props: string[] = [];
    let i = 0;
    while (i < rest.length) {
      // Skip whitespace.
      while (i < rest.length && /\s/.test(rest[i])) i++;
      if (i >= rest.length) break;
      // Read prop name.
      const nameStart = i;
      while (i < rest.length && /[A-Za-z0-9_-]/.test(rest[i])) i++;
      const name = rest.slice(nameStart, i);
      if (!name) {
        i++;
        continue;
      }
      props.push(name);
      // Skip optional `=value`.
      if (rest[i] === '=') {
        i++;
        if (rest[i] === '{') {
          // Brace-balanced.
          let depth = 1;
          i++;
          while (i < rest.length && depth > 0) {
            if (rest[i] === '{') depth++;
            else if (rest[i] === '}') depth--;
            i++;
          }
        } else if (rest[i] === '"' || rest[i] === "'") {
          const q = rest[i];
          i++;
          while (i < rest.length && rest[i] !== q) i++;
          i++;
        } else {
          // Unquoted value — read until whitespace.
          while (i < rest.length && !/\s/.test(rest[i])) i++;
        }
      }
    }
    hits.push({ tag, props });
  }
  return hits;
}

/** Framework attrs accepted on every component without declaration. */
const FRAMEWORK_ATTRS = new Set<string>([
  'key',
  'ref',
  'children',
  'className',
  'style',
  'id'
]);

function isFrameworkAttr(name: string): boolean {
  if (FRAMEWORK_ATTRS.has(name)) return true;
  if (name.startsWith('aria-')) return true;
  if (name.startsWith('data-')) return true;
  if (name.startsWith('on') && name[2] === name[2]?.toUpperCase()) return true;
  return false;
}

const components = discoverComponents();

/** Resolve a possibly dotted JSX tag (`Modal.Body`) to the root
 *  component (`Modal`). Member-access subcomponents inherit their
 *  parent's source for prop validation. */
function rootTag(tag: string): string {
  return tag.split('.')[0];
}

const showcaseFiles = readdirSync(showcaseDir).filter(f =>
  f.endsWith('.astro')
);

test('every showcase React snippet uses tags exported from uikit', () => {
  const violations: string[] = [];
  for (const file of showcaseFiles) {
    const src = readFileSync(resolve(showcaseDir, file), 'utf8');
    const snippets = extractReactSnippets(src);
    for (const snippet of snippets) {
      for (const { tag } of extractJsxTagsAndProps(snippet)) {
        // Fragment + lowercase tags aren't components.
        if (tag === 'Fragment') continue;
        const root = rootTag(tag);
        if (!components.has(root)) {
          violations.push(
            `${file}: <${tag}> not exported from @freecodecamp/uikit`
          );
        }
      }
    }
  }
  assert.deepEqual(
    violations,
    [],
    `unknown JSX tags in showcase React snippets:\n  ${violations.join('\n  ')}`
  );
});

test('every showcase React snippet uses ONLY declared props', () => {
  const violations: string[] = [];
  for (const file of showcaseFiles) {
    const src = readFileSync(resolve(showcaseDir, file), 'utf8');
    const snippets = extractReactSnippets(src);
    for (const snippet of snippets) {
      for (const { tag, props } of extractJsxTagsAndProps(snippet)) {
        if (tag === 'Fragment') continue;
        // Member-access subcomponents like Modal.Body validate against
        // the ROOT component's source. We don't have per-subcomponent
        // Props at this audit fidelity — accept any framework-style
        // prop on subcomponents.
        const isMember = tag.includes('.');
        const root = rootTag(tag);
        const info = components.get(root);
        if (!info) continue;
        if (isMember) continue;
        const { explicit, htmlFlexible } = readProps(info.sourceFile, tag);
        for (const prop of props) {
          if (isFrameworkAttr(prop)) continue;
          if (explicit.has(prop)) continue;
          if (htmlFlexible) continue;
          violations.push(
            `${file}: <${tag} ${prop}=...> — not declared on ${tag}Props`
          );
        }
      }
    }
  }
  assert.deepEqual(
    violations,
    [],
    `unknown props in showcase React snippets:\n  ${violations.join('\n  ')}`
  );
});

test('discoverComponents finds the obvious primitives + actions', () => {
  // Sanity check: the audit can only catch drift if the source map is
  // populated. Assert a handful of must-haves so a future filename
  // refactor doesn't silently turn the audit into a no-op.
  for (const required of ['Button', 'Heading', 'Text', 'Modal', 'Tabs']) {
    assert.ok(
      components.has(required),
      `discoverComponents missed ${required} — audit would silently no-op`
    );
  }
  // Sanity bound: we expect roughly the count of components mentioned
  // in the playground. Loose lower bound.
  assert.ok(
    components.size >= 30,
    `expected 30+ components, found ${components.size}`
  );
});

// Surface the showcase basenames so a CI failure points at the right
// file without re-running the audit.
for (const file of showcaseFiles) {
  test(`showcase audit — ${basename(file)}`, () => {
    const src = readFileSync(resolve(showcaseDir, file), 'utf8');
    const snippets = extractReactSnippets(src);
    if (!snippets.length) return; // Some showcases ship CSS-only previews.
    for (const snippet of snippets) {
      for (const { tag, props } of extractJsxTagsAndProps(snippet)) {
        if (tag === 'Fragment') continue;
        const isMember = tag.includes('.');
        const root = rootTag(tag);
        const info = components.get(root);
        assert.ok(
          info,
          `<${tag}> in ${file} is not an exported uikit component`
        );
        if (!info) continue;
        if (isMember) continue;
        const { explicit, htmlFlexible } = readProps(info.sourceFile, tag);
        for (const prop of props) {
          if (isFrameworkAttr(prop)) continue;
          if (htmlFlexible) continue;
          assert.ok(
            explicit.has(prop),
            `<${tag} ${prop}=...> in ${file} — not on ${tag}Props`
          );
        }
      }
    }
  });
}

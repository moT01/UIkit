#!/usr/bin/env node
/**
 * Build CDN-ready assets into dist-cdn/uikit/.
 *
 * Layout:
 *   dist-cdn/uikit/
 *     styles.min.css            tokens + components combined, minified
 *     tokens.min.css
 *     components.min.css
 *     fonts/                    copied verbatim from public/fonts/
 *     brand/                    copied verbatim from public/brand/ (if present)
 *     manifest.json             sha256 + byte size per file
 *     <pkg.version>/            full mirror pinned to package.json version
 *
 * All `url('/fonts/...')` refs are rewritten to `url('./fonts/...')` so the
 * browser resolves font requests relative to the stylesheet URL
 * (e.g. https://cdn.freecodecamp.org/uikit/styles.min.css → .../uikit/fonts/...).
 */

import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "lightningcss";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const stylesDir = path.join(repoRoot, "src", "styles");
const publicDir = path.join(repoRoot, "public");
const outRoot = path.join(repoRoot, "dist-cdn", "uikit");

const rewriteFontUrl = (url) =>
  url.startsWith("/fonts/") ? "." + url : url;

function bundleCss(entryFile) {
  const { code, warnings } = bundle({
    filename: entryFile,
    minify: true,
    sourceMap: false,
    visitor: {
      Url(node) {
        return { ...node, url: rewriteFontUrl(node.url) };
      },
    },
  });
  if (warnings && warnings.length) {
    for (const w of warnings) {
      console.warn(`[build-cdn] warn: ${w.type} ${w.value ?? ""}`);
    }
  }
  return code;
}

async function readVersion() {
  const pkg = JSON.parse(
    await fs.readFile(path.join(repoRoot, "package.json"), "utf8"),
  );
  if (!pkg.version) throw new Error('package.json is missing "version".');
  return pkg.version;
}

async function copyDirIfExists(src, dest) {
  try {
    const stat = await fs.stat(src);
    if (!stat.isDirectory()) return false;
  } catch {
    return false;
  }
  await fs.cp(src, dest, { recursive: true });
  return true;
}

async function hashFile(filePath) {
  const buf = await fs.readFile(filePath);
  return {
    sha256: createHash("sha256").update(buf).digest("hex"),
    bytes: buf.byteLength,
  };
}

async function walk(dir, basePath = dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full, basePath)));
    } else if (entry.isFile()) {
      out.push(path.relative(basePath, full));
    }
  }
  return out.sort();
}

async function writeBundle(destDir) {
  await fs.mkdir(destDir, { recursive: true });

  const styles = bundleCss(path.join(stylesDir, "_cdn-entry.css"));
  const tokensOnly = bundleCss(path.join(stylesDir, "tokens.css"));
  const componentsOnly = bundleCss(path.join(stylesDir, "components.css"));

  await Promise.all([
    fs.writeFile(path.join(destDir, "styles.min.css"), styles),
    fs.writeFile(path.join(destDir, "tokens.min.css"), tokensOnly),
    fs.writeFile(path.join(destDir, "components.min.css"), componentsOnly),
  ]);

  await copyDirIfExists(
    path.join(publicDir, "fonts"),
    path.join(destDir, "fonts"),
  );
  await copyDirIfExists(
    path.join(publicDir, "brand"),
    path.join(destDir, "brand"),
  );

  const files = await walk(destDir);
  const manifest = {};
  for (const rel of files) {
    if (rel === "manifest.json") continue;
    manifest[rel] = await hashFile(path.join(destDir, rel));
  }
  await fs.writeFile(
    path.join(destDir, "manifest.json"),
    JSON.stringify(
      { generatedAt: new Date().toISOString(), files: manifest },
      null,
      2,
    ) + "\n",
  );
}

async function writeEntryCss() {
  const entry = "@import 'tokens.css';\n@import 'components.css';\n";
  await fs.writeFile(path.join(stylesDir, "_cdn-entry.css"), entry);
}

async function removeEntryCss() {
  try {
    await fs.unlink(path.join(stylesDir, "_cdn-entry.css"));
  } catch {}
}

async function main() {
  const version = await readVersion();

  await fs.rm(outRoot, { recursive: true, force: true });
  await fs.mkdir(outRoot, { recursive: true });

  await writeEntryCss();
  try {
    await writeBundle(outRoot);
    await writeBundle(path.join(outRoot, version));
  } finally {
    await removeEntryCss();
  }

  const rel = path.relative(repoRoot, outRoot);
  console.log(`[build-cdn] wrote ${rel}/ (version ${version})`);
}

main().catch((err) => {
  console.error("[build-cdn] failed:", err);
  process.exit(1);
});

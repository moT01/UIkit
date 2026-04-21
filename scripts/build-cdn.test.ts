import { strict as assert } from "node:assert";
import { test } from "node:test";
import { promises as fs } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outRoot = path.join(repoRoot, "dist-cdn", "uikit");
const buildScript = path.join(__dirname, "build-cdn.mjs");
const verifyScript = path.join(__dirname, "verify-cdn.mjs");

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readPkgVersion(): Promise<string> {
  const raw = await fs.readFile(path.join(repoRoot, "package.json"), "utf8");
  return JSON.parse(raw).version as string;
}

test("build-cdn produces the expected layout", async () => {
  const result = spawnSync("node", [buildScript], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(
    result.status,
    0,
    `build-cdn exited ${result.status}: ${result.stderr}`,
  );

  const version = await readPkgVersion();
  const required = [
    "styles.min.css",
    "tokens.min.css",
    "components.min.css",
    "manifest.json",
    "fonts",
    path.join(version, "styles.min.css"),
    path.join(version, "tokens.min.css"),
    path.join(version, "components.min.css"),
    path.join(version, "manifest.json"),
    path.join(version, "fonts"),
  ];
  for (const rel of required) {
    assert.ok(
      await exists(path.join(outRoot, rel)),
      `dist-cdn/uikit/${rel} missing`,
    );
  }
});

test("styles.min.css rewrites /fonts/ urls to ./fonts/", async () => {
  const css = await fs.readFile(path.join(outRoot, "styles.min.css"), "utf8");
  assert.equal(
    (css.match(/url\(\s*["']?\/fonts\//g) || []).length,
    0,
    "absolute /fonts/ urls must not appear in styles.min.css",
  );
  const relative = css.match(/url\(\s*["']?\.\/fonts\//g) || [];
  assert.ok(
    relative.length >= 4,
    `expected >=4 ./fonts/ refs, found ${relative.length}`,
  );
});

test("manifest.json hashes match files on disk", async () => {
  const manifest = JSON.parse(
    await fs.readFile(path.join(outRoot, "manifest.json"), "utf8"),
  );
  for (const [rel, meta] of Object.entries(
    manifest.files as Record<string, { sha256: string; bytes: number }>,
  )) {
    const buf = await fs.readFile(path.join(outRoot, rel));
    const actual = createHash("sha256").update(buf).digest("hex");
    assert.equal(actual, meta.sha256, `hash mismatch for ${rel}`);
    assert.equal(actual.length, 64);
  }
});

test("verify-cdn exits 0 on a clean build", async () => {
  const result = spawnSync("node", [verifyScript], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(
    result.status,
    0,
    `verify-cdn exited ${result.status}: ${result.stderr}\n${result.stdout}`,
  );
});

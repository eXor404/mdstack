// Generates static theme preview pages by running the local mdstack CLI
// against a tiny fixture folder, once per built-in theme. Each preview ends
// up as a self-contained folder under public/theme-previews/<theme>/.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(websiteRoot, '..');
const cliPath = path.join(repoRoot, 'bin', 'cli.js');
const fixtureDir = path.join(websiteRoot, '.cache', 'preview-fixture');
const fixtureDistDir = path.join(fixtureDir, 'dist');
const previewOutRoot = path.join(websiteRoot, 'public', 'theme-previews');

const themes = ['angular', 'vue', 'nuxt', 'homebrew'];

const FIXTURE_INDEX = `---
title: Preview
---

# mdstack themes preview

A tiny showcase of how each theme renders the same markdown.

> [!NOTE]
> Drop a folder of markdown, get a site. This page is the same content rendered four ways.

## Code

\`\`\`ts
import { defineConfig } from 'mdstack';

export default defineConfig({
  theme: 'angular',
});
\`\`\`

## A small table

| Command | What it does                |
| ------- | --------------------------- |
| dev     | Dev server with HMR         |
| build   | Static build to dist/       |
| preview | Serve the built dist/       |

## Inline things

You can write \`inline code\`, **bold**, *italic*, ==highlight==, and a <kbd>⌘</kbd> + <kbd>K</kbd> chord.
`;

const FIXTURE_CONFIG = `export default {
  brand: { text: 'mdstack', logo: null },
  theme: 'angular',
  site: '',
  footer: { copyright: '' },
};
`;

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else if (entry.isFile()) fs.copyFileSync(s, d);
  }
}

// Inject a stylesheet that disables anchor navigation inside the preview —
// it's a visual showcase, not a working site.
const PREVIEW_DISABLE_LINKS = `<style>
a, a:hover, a:focus { pointer-events: none !important; cursor: default !important; }
</style>`;

function disableLinks(root) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, entry.name);
    if (entry.isDirectory()) { disableLinks(p); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const orig = fs.readFileSync(p, 'utf8');
    if (orig.includes('preview-disable-links')) continue;
    const tagged = PREVIEW_DISABLE_LINKS.replace('<style>', '<style data-preview-disable-links>');
    const out = orig.includes('</head>')
      ? orig.replace('</head>', `${tagged}</head>`)
      : tagged + orig;
    fs.writeFileSync(p, out, 'utf8');
  }
}

// Walk a directory and rewrite absolute asset paths in HTML/CSS so the
// preview works when served from /theme-previews/<theme>/ instead of /.
function rewriteAssetPaths(root, prefix) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, entry.name);
    if (entry.isDirectory()) { rewriteAssetPaths(p, prefix); continue; }
    if (!/\.(html|css|js)$/.test(entry.name)) continue;
    const orig = fs.readFileSync(p, 'utf8');
    let out = orig;
    // CSS url(/_astro/...) → url(<prefix>/_astro/...)
    out = out.replace(/url\((['"]?)\/(_astro\/[^)'"]+)\1\)/g, (_, q, rest) => `url(${q}${prefix}/${rest}${q})`);
    // attr="/_astro/..." → attr="<prefix>/_astro/..."
    out = out.replace(/(["'])\/(_astro\/[^"']+)\1/g, (_, q, rest) => `${q}${prefix}/${rest}${q}`);
    // common single-file public assets
    out = out.replace(/(["'])\/(favicon\.svg|robots\.txt|sitemap\.xml)\1/g, (_, q, rest) => `${q}${prefix}/${rest}${q}`);
    if (out !== orig) fs.writeFileSync(p, out, 'utf8');
  }
}

function setupFixture() {
  rmrf(fixtureDir);
  fs.mkdirSync(fixtureDir, { recursive: true });
  fs.writeFileSync(path.join(fixtureDir, 'index.md'), FIXTURE_INDEX, 'utf8');
  fs.writeFileSync(path.join(fixtureDir, 'mdstack.config.js'), FIXTURE_CONFIG, 'utf8');
}

async function buildTheme(theme) {
  rmrf(fixtureDistDir);
  console.log(`[theme-previews] building ${theme}…`);
  await execFileP(process.execPath, [cliPath, 'build', fixtureDir, '--theme', theme], {
    cwd: repoRoot,
    env: { ...process.env, NODE_ENV: 'production' },
  });
  const outDir = path.join(previewOutRoot, theme);
  rmrf(outDir);
  copyDirSync(fixtureDistDir, outDir);
  rewriteAssetPaths(outDir, `/theme-previews/${theme}`);
  disableLinks(outDir);
  console.log(`[theme-previews] wrote ${path.relative(websiteRoot, outDir)}/`);
}

async function main() {
  if (!fs.existsSync(cliPath)) {
    console.error(`[theme-previews] cannot find local CLI at ${cliPath}`);
    process.exit(1);
  }
  fs.mkdirSync(previewOutRoot, { recursive: true });
  setupFixture();
  for (const theme of themes) {
    try {
      await buildTheme(theme);
    } catch (err) {
      console.error(`[theme-previews] ${theme} failed:`, err.message);
      console.error(err.stdout?.toString() ?? '');
      console.error(err.stderr?.toString() ?? '');
      process.exit(1);
    }
  }
  rmrf(fixtureDir);
  console.log('[theme-previews] done.');
}

main();

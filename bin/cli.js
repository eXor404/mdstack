#!/usr/bin/env node
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, isAbsolute, relative } from 'node:path';
import { existsSync, statSync, writeFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const APP_ROOT = resolve(__dirname, '..', 'app');

const VALID_COMMANDS = new Set(['dev', 'build', 'preview']);
const VALID_THEMES = new Set(['angular', 'vue', 'nuxt', 'homebrew']);
const DEFAULT_THEME = 'angular';
const CONFIG_FILENAME = 'mdstack.config.js';

const DEFAULT_CONFIG = `// mdstack site config — edit to customize the look of your site.
// Re-run mdstack after saving to apply changes.

export default {
  brand: {
    // Wordmark shown in the header next to the logo. Set to '' to hide.
    text: 'mdstack',
    // Path to a custom logo, absolute from this folder's root
    // (e.g. '/images/logo.svg'). Leave null to use the built-in
    // gradient mark.
    logo: null,
  },

  // Theme. Built-in: 'angular' (default), 'vue', 'nuxt', 'homebrew'.
  theme: 'angular',

  // Public URL of your site (no trailing slash). Used to generate
  // sitemap.xml and the Sitemap line in robots.txt at build time.
  // Leave '' to skip sitemap generation.
  site: '',

  footer: {
    // Copyright / credit line shown at the bottom of every page.
    // Set to '' to hide it entirely.
    copyright: '',
  },
};
`;

function fail(msg) {
  console.error(`mdstack: ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let cmd = 'dev';
  let theme = null;
  let dir;

  if (args[0] && VALID_COMMANDS.has(args[0])) {
    cmd = args.shift();
  }

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--theme' || a === '-t') {
      theme = args[++i];
      if (!theme) fail('--theme requires a value');
    } else if (a.startsWith('--theme=')) {
      theme = a.slice('--theme='.length);
    } else if (!dir) {
      dir = a;
    } else {
      fail(`Unexpected argument: ${a}`);
    }
  }

  if (!dir) fail(`Missing folder argument.\nUsage: mdstack [dev|build|preview] [--theme <name>] <folder>`);

  return { cmd, theme, dir };
}

function ensureDefaultConfig(source) {
  const configPath = resolve(source, CONFIG_FILENAME);
  if (existsSync(configPath)) return;
  try {
    writeFileSync(configPath, DEFAULT_CONFIG, 'utf8');
    const rel = relative(process.cwd(), configPath) || configPath;
    console.log(`mdstack: created ${rel} with defaults — edit it to customize`);
  } catch (err) {
    console.warn(`mdstack: couldn't write default config: ${err.message}`);
  }
}

async function loadUserConfig(source) {
  const configPath = resolve(source, CONFIG_FILENAME);
  if (!existsSync(configPath)) return {};
  try {
    const mod = await import(pathToFileURL(configPath).href);
    return mod.default ?? {};
  } catch (err) {
    console.warn(`mdstack: couldn't load ${CONFIG_FILENAME}: ${err.message}`);
    return {};
  }
}

function resolveSource(dir) {
  const abs = isAbsolute(dir) ? dir : resolve(process.cwd(), dir);
  if (!existsSync(abs) || !statSync(abs).isDirectory()) {
    fail(`Folder not found: ${abs}`);
  }
  return abs;
}

const { cmd, theme: cliTheme, dir } = parseArgs(process.argv);
const source = resolveSource(dir);

ensureDefaultConfig(source);
const userConfig = await loadUserConfig(source);

const theme = cliTheme || userConfig.theme || DEFAULT_THEME;
if (!VALID_THEMES.has(theme)) fail(`Unknown theme: ${theme}. Available: ${[...VALID_THEMES].join(', ')}`);

process.env.MD_SOURCE = source;
process.env.MD_THEME = theme;

const astro = await import('astro');

try {
  if (cmd === 'dev') {
    await astro.dev({ root: APP_ROOT });
  } else if (cmd === 'build') {
    const outDir = resolve(source, 'dist');
    await astro.build({ root: APP_ROOT, outDir });
    console.log(`\nmdstack: built to ${outDir}`);
  } else if (cmd === 'preview') {
    const outDir = resolve(source, 'dist');
    await astro.preview({ root: APP_ROOT, outDir });
  }
} catch (err) {
  console.error(err);
  process.exit(1);
}

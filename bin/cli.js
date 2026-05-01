#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { dirname, resolve, isAbsolute } from 'node:path';
import { existsSync, statSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const APP_ROOT = resolve(__dirname, '..', 'app');

const VALID_COMMANDS = new Set(['dev', 'build', 'preview']);
const VALID_THEMES = new Set(['angular']);
const DEFAULT_THEME = 'angular';

function fail(msg) {
  console.error(`mdstack: ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let cmd = 'dev';
  let theme = DEFAULT_THEME;
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
  if (!VALID_THEMES.has(theme)) fail(`Unknown theme: ${theme}. Available: ${[...VALID_THEMES].join(', ')}`);

  return { cmd, theme, dir };
}

function resolveSource(dir) {
  const abs = isAbsolute(dir) ? dir : resolve(process.cwd(), dir);
  if (!existsSync(abs) || !statSync(abs).isDirectory()) {
    fail(`Folder not found: ${abs}`);
  }
  return abs;
}

const { cmd, theme, dir } = parseArgs(process.argv);
const source = resolveSource(dir);
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

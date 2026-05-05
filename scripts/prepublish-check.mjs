#!/usr/bin/env node
// Refuse to publish if the tarball is bloated or contains build artifacts.
// Runs automatically via `prepublishOnly` before `npm publish`.

import { execSync } from 'node:child_process';

const FORBIDDEN = [
  /^app\/node_modules\//,
  /^app\/\.astro\//,
  /^app\/dist\//,
  /^example\//,
  /^node_modules\//,
  /^\.git\//,
];

const MAX_SIZE_BYTES = 500 * 1024;

const raw = execSync('npm pack --dry-run --json', { encoding: 'utf8' });
const [info] = JSON.parse(raw);

const bad = info.files.filter((f) => FORBIDDEN.some((re) => re.test(f.path)));
if (bad.length) {
  console.error('mdstack: refusing to publish — forbidden files in tarball:');
  for (const f of bad) console.error('  ' + f.path);
  process.exit(1);
}

if (info.size > MAX_SIZE_BYTES) {
  console.error(`mdstack: refusing to publish — tarball is ${(info.size / 1024).toFixed(1)} kB (limit ${MAX_SIZE_BYTES / 1024} kB).`);
  console.error('Tighten the `files` allowlist in package.json.');
  process.exit(1);
}

console.log(`mdstack: prepublish ok — ${info.entryCount} files, ${(info.size / 1024).toFixed(1)} kB`);

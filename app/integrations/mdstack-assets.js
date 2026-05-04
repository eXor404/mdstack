import { promises as fs } from 'node:fs';
import { resolve, relative, extname, join, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.bmp': 'image/bmp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

const EXCLUDED_TOP = new Set(['dist', 'node_modules', '.git', '.astro', '.vscode', '.idea']);
const EXCLUDED_FILES = new Set(['mdstack.config.js']);

function isExcludedRel(rel) {
  if (!rel || rel === '.' || rel === '..') return true;
  if (EXCLUDED_FILES.has(rel)) return true;
  const parts = rel.split(/[\\/]/);
  if (parts[0].startsWith('.')) return true;
  if (EXCLUDED_TOP.has(parts[0])) return true;
  return false;
}

async function* walkAssets(root, current = root) {
  let entries;
  try {
    entries = await fs.readdir(current, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(current, entry.name);
    const rel = relative(root, full);
    if (isExcludedRel(rel)) continue;
    if (entry.isDirectory()) {
      yield* walkAssets(root, full);
    } else if (entry.isFile() && extname(entry.name).toLowerCase() !== '.md') {
      yield { full, rel };
    }
  }
}

export default function mdstackAssets() {
  const source = process.env.MD_SOURCE;
  if (!source) {
    throw new Error('mdstack: MD_SOURCE env var not set — run via the mdstack CLI.');
  }

  return {
    name: 'mdstack:assets',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url || (req.method && req.method !== 'GET' && req.method !== 'HEAD')) {
            return next();
          }
          let pathname;
          try {
            pathname = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
          } catch {
            return next();
          }
          if (!pathname || pathname === '/' || pathname.endsWith('/')) return next();
          const ext = extname(pathname).toLowerCase();
          if (!ext || ext === '.md') return next();
          if (pathname.startsWith('/@') || pathname.startsWith('/_astro/') || pathname.startsWith('/node_modules/')) {
            return next();
          }

          const rel = pathname.replace(/^\/+/, '');
          if (isExcludedRel(rel)) return next();

          const filePath = resolve(source, rel);
          const sourceWithSep = source.endsWith(sep) ? source : source + sep;
          if (filePath !== source && !filePath.startsWith(sourceWithSep)) return next();

          try {
            const stat = await fs.stat(filePath);
            if (!stat.isFile()) return next();
            res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
            res.setHeader('Content-Length', String(stat.size));
            res.setHeader('Cache-Control', 'no-cache');
            if (req.method === 'HEAD') {
              res.end();
              return;
            }
            const data = await fs.readFile(filePath);
            res.end(data);
          } catch {
            return next();
          }
        });
      },
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        let count = 0;
        for await (const { full, rel } of walkAssets(source)) {
          const dest = join(outDir, rel);
          await fs.mkdir(dirname(dest), { recursive: true });
          await fs.copyFile(full, dest);
          count++;
        }
        if (count > 0) {
          const log = logger?.info?.bind(logger) ?? console.log;
          log(`copied ${count} asset${count === 1 ? '' : 's'} from source folder`);
        }
      },
    },
  };
}

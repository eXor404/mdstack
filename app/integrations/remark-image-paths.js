import { resolve, relative, dirname, sep } from 'node:path';

function visit(node, types, visitor) {
  if (!node || typeof node !== 'object') return;
  if (types.includes(node.type)) visitor(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child, types, visitor);
  }
}

const ABSOLUTE_OR_PROTOCOL = /^(?:[a-z][a-z0-9+\-.]*:|\/\/|\/|#|data:)/i;

function rewriteUrl(url, mdAbsPath, source) {
  if (!url || ABSOLUTE_OR_PROTOCOL.test(url)) return url;
  const cleaned = url.replace(/[?#].*$/, '');
  const trailing = url.slice(cleaned.length);
  const absTarget = resolve(dirname(mdAbsPath), cleaned);
  const sourceWithSep = source.endsWith(sep) ? source : source + sep;
  if (absTarget !== source && !absTarget.startsWith(sourceWithSep)) return url;
  const fromSource = relative(source, absTarget).split(sep).join('/');
  return '/' + fromSource + trailing;
}

export default function remarkImagePaths() {
  const source = process.env.MD_SOURCE;
  if (!source) {
    throw new Error('mdstack: MD_SOURCE env var not set — run via the mdstack CLI.');
  }

  return (tree, file) => {
    const mdPath = file?.path || file?.history?.[file.history.length - 1];
    if (!mdPath) return;

    visit(tree, ['image'], (node) => {
      node.url = rewriteUrl(node.url, mdPath, source);
    });

    visit(tree, ['definition'], (node) => {
      node.url = rewriteUrl(node.url, mdPath, source);
    });

    visit(tree, ['html'], (node) => {
      if (typeof node.value !== 'string') return;
      node.value = node.value.replace(
        /(<img\b[^>]*\bsrc=)(["'])([^"']+)\2/gi,
        (_m, prefix, quote, url) => `${prefix}${quote}${rewriteUrl(url, mdPath, source)}${quote}`
      );
    });
  };
}

const TYPES = ['note', 'tip', 'important', 'warning', 'caution'];

const LABELS = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
};

const ICONS = {
  note:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  tip:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2v1.3h6V16.7c0-.7.4-1.5 1-2A7 7 0 0 0 12 2z"/></svg>',
  important:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v4"/><path d="M12 15h.01"/></svg>',
  warning:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>' +
    '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  caution:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>' +
    '<line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
};

const MARKER_RE = new RegExp('^\\[!(' + TYPES.join('|') + ')\\][ \\t]*\\r?\\n?', 'i');

function visit(node, type, fn) {
  if (!node || typeof node !== 'object') return;
  if (node.type === type) fn(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child, type, fn);
  }
}

export default function remarkCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const firstPara = node.children?.[0];
      if (!firstPara || firstPara.type !== 'paragraph' || !Array.isArray(firstPara.children)) return;
      const firstText = firstPara.children[0];
      if (!firstText || firstText.type !== 'text' || typeof firstText.value !== 'string') return;

      const m = firstText.value.match(MARKER_RE);
      if (!m) return;
      const type = m[1].toLowerCase();
      if (!TYPES.includes(type)) return;

      firstText.value = firstText.value.slice(m[0].length);

      if (firstText.value === '') {
        firstPara.children.shift();
      }
      if (firstPara.children.length === 0) {
        node.children.shift();
      }

      node.data = node.data || {};
      node.data.hProperties = { ...(node.data.hProperties || {}), 'data-callout': type };

      node.children.unshift({
        type: 'html',
        value:
          '<p class="callout-title">' +
          '<span class="callout-icon">' + ICONS[type] + '</span>' +
          '<span>' + LABELS[type] + '</span>' +
          '</p>',
      });
    });
  };
}

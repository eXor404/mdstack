const HIGHLIGHT_RE = /==([^=\n]+?)==/g;

function transformChildren(parent) {
  if (!Array.isArray(parent.children)) return;
  const out = [];
  for (const child of parent.children) {
    if (Array.isArray(child.children)) transformChildren(child);

    if (child.type !== 'text' || typeof child.value !== 'string' || !child.value.includes('==')) {
      out.push(child);
      continue;
    }

    const value = child.value;
    let lastIdx = 0;
    let matched = false;
    HIGHLIGHT_RE.lastIndex = 0;
    let m;
    while ((m = HIGHLIGHT_RE.exec(value)) !== null) {
      matched = true;
      if (m.index > lastIdx) {
        out.push({ type: 'text', value: value.slice(lastIdx, m.index) });
      }
      out.push({ type: 'html', value: '<mark>' });
      out.push({ type: 'text', value: m[1] });
      out.push({ type: 'html', value: '</mark>' });
      lastIdx = m.index + m[0].length;
    }
    if (!matched) {
      out.push(child);
    } else if (lastIdx < value.length) {
      out.push({ type: 'text', value: value.slice(lastIdx) });
    }
  }
  parent.children = out;
}

export default function remarkHighlight() {
  return (tree) => transformChildren(tree);
}

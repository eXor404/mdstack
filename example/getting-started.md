---
title: Getting started
order: 2
---

# Getting started

Install via npm and point it at any folder of markdown files.

```bash
npx mdstack ./my-docs
```

For a static build:

```bash
npx mdstack build ./my-docs
```

The build output lands in `./my-docs/dist`.

## Frontmatter

| Field | Purpose |
| ----- | ------- |
| `title` | Nav label and page title |
| `order` | Sort order in the sidebar |

Inline `code` works. So does **bold** and *italic*.

---

That's it for now.

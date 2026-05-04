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

## Site config

The first time you run mdstack against a folder, it drops a `mdstack.config.js` file in there with sensible defaults. Edit any of the fields and re-run mdstack to apply changes:

```js
export default {
  brand: {
    text: 'mdstack',          // wordmark next to the logo, '' to hide
    logo: null,               // absolute path from source root, e.g. '/images/logo.svg'
  },
  theme: 'angular',           // currently only 'angular' ships
  footer: {
    copyright: '',            // shown at the bottom of every page; '' to hide
  },
};
```

The file lives at the root of your source folder and is excluded from the dev server, the built `dist/`, and the search palette. Delete it to regenerate the defaults.

## Frontmatter

| Field | Purpose |
| ----- | ------- |
| `title` | Nav label and page title |
| `order` | Sort order in the sidebar |

Inline `code` works. So does **bold** and *italic*.

## Custom 404 page

mdstack ships a built-in 404 (a centred gradient `404` with a *Back home* button) that gets generated to `dist/404.html` automatically — most static hosts (nginx, Caddy, GitHub Pages, Cloudflare Pages, Netlify…) serve it for unmatched paths out of the box.

To replace it, drop a `404.md` into your folder:

```text
my-docs/
├── index.md
├── getting-started.md
└── 404.md          ← your custom not-found page
```

Same frontmatter as any other doc, plus full markdown:

```md
---
title: Lost in space
---

# This page slipped through

Try one of these instead:

- [Home](/)
- [Getting started](/getting-started/)

Or hit ⌘K to search.
```

`404.md` is treated as a special file — it renders to `dist/404.html` and is excluded from the top nav, the search palette, and any auto-generated routes. It's rendered through the normal layout, so it gets the header, footer, theme toggle, and a sidebar TOC if you include H2/H3 headings.

---

That's it for now.

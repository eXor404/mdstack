# mdstack

> Drop a folder of markdown files, get a rendered site.

Zero-config static-site CLI. Point it at a folder of `.md` files and `mdstack` either serves them in dev or builds a self-contained `dist/` you can deploy anywhere static (Docker, Vercel, Netlify, S3, GitHub Pages…).

[![npm](https://img.shields.io/npm/v/@exor404/mdstack.svg)](https://www.npmjs.com/package/@exor404/mdstack)
[![license](https://img.shields.io/npm/l/@exor404/mdstack.svg)](./LICENSE)

> **Status:** pre-1.0, provisional. APIs and CLI flags may change before `0.x → 1.0`.

## Install

```bash
# Zero-install — runs the published version directly
npx @exor404/mdstack ./docs

# Or install locally
npm i -D @exor404/mdstack
npx mdstack ./docs

# Or globally
npm i -g @exor404/mdstack
mdstack ./docs
```

The package id is `@exor404/mdstack`; the installed CLI binary is `mdstack`.

## Quick start

```bash
mdstack ./docs            # dev server with HMR
mdstack build ./docs      # static build → ./docs/dist/
mdstack preview ./docs    # serve the built dist/
```

## Folder layout

Markdown files become routes. Every other file (images, fonts, PDFs, downloads, …) is served in dev and copied into the build, so the output is self-contained:

```
docs/
├── index.md            →  /
├── getting-started.md  →  /getting-started/
├── elements.md         →  /elements/
├── footer.md           →  footer columns (special file)
└── images/
    └── hero.png        →  /images/hero.png
```

## Frontmatter

```yaml
---
title: Getting Started   # nav label & <title>; defaults to filename
order: 2                 # nav sort order; lower comes first
---
```

## Configuration

On first run, `mdstack` creates a `mdstack.config.js` in your folder, and — if the folder has no markdown yet — drops a starter `index.md` next to it so you get a working homepage immediately. Edit the config to customize the brand, theme, footer, and public site URL:

```js
export default {
  brand: { text: 'My docs', logo: null },
  theme: 'angular',                // 'angular' | 'vue' | 'nuxt' | 'homebrew'
  site: 'https://example.com',     // enables sitemap.xml + Sitemap: in robots.txt
  footer: { copyright: '© My Co' },
};
```

## Features

**Markdown**

- GFM: tables, task lists, strikethrough (`~~…~~`)
- `==highlight==` renders as `<mark>`
- Footnotes, inline HTML, `<kbd>`, `<details>`
- Math: `$inline$` and `$$block$$` rendered server-side via KaTeX (fonts auto-bundled)
- Mermaid diagrams in ` ```mermaid ` blocks (follows the active light/dark theme)
- GitHub-style callouts: `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`
- Syntax-highlighted code blocks (Shiki — theme-matched per built-in theme)
- Image paths: relative (`./img.png`) **or** absolute from the source root (`/img.png`)

**Site**

- Light / dark theme toggle
- Auto TOC + scroll-spy in the sidebar
- ⌘K command palette over titles, headings, and body text — prose matches show a highlighted snippet
- Heading anchor links — hover any heading, click to copy a deep link
- 404 page (default themed; override by adding a `404.md` to your folder)
- Four built-in themes (see below)

**Build & SEO**

- Self-contained `dist/`: every non-`.md` file in the source folder ships through
- `robots.txt` emitted on every build
- `sitemap.xml` emitted when `site` is set in `mdstack.config.js` (404 routes excluded)
- A user-supplied `robots.txt` or `sitemap.xml` in the source folder always wins

## CLI

```
mdstack [dev|build|preview] [--theme <name>] <folder>
```

| Command   | What it does                                  |
| --------- | --------------------------------------------- |
| `dev`     | Dev server with HMR (default if command omitted) |
| `build`   | Static build to `<folder>/dist/`              |
| `preview` | Serve the built `dist/`                       |

Flags:

- `--theme, -t <name>` — override the `theme` from `mdstack.config.js`

## Themes

| Name       | Vibe                                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| `angular`  | Default. Dark gradient editorial.                                                                     |
| `vue`      | Clean docs aesthetic à la vuejs.org. Always-dark Palenight code blocks.                               |
| `nuxt`     | Electric-green Nuxt UI Pro feel. Subtle dot-grid, file-tab code blocks, animated link underlines.     |
| `homebrew` | Aggressively minimal GitHub-Pages-Jekyll vibe — single column, light-only, no chrome.                 |

## Requirements

Node 18+.

## License

[MIT](./LICENSE)

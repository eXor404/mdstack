# mdstack

> Drop a folder of markdown files, get a rendered site.

Zero-config static-site CLI. Point it at a folder of `.md` files and `mdstack` either serves them in dev or builds a self-contained `dist/` you can deploy anywhere static (Docker, Vercel, Netlify, S3, GitHub Pages…).

> **Status:** pre-1.0, provisional. APIs and CLI flags may change before `0.x → 1.0`.

## Quick start

```bash
npx mdstack ./docs            # dev server with HMR
npx mdstack build ./docs      # static build → ./docs/dist/
npx mdstack preview ./docs    # serve the built dist/
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

## Markdown features

- GFM: tables, task lists, strikethrough (`~~…~~`)
- Highlight extension: `==text==` renders as `<mark>`
- Image paths: relative (`./img.png`) **or** absolute from the source root (`/img.png`) — both resolve correctly in dev and in the build
- Syntax-highlighted code blocks (Shiki, `github-dark`)
- Footnotes, inline HTML, `<kbd>`, `<details>`
- ⌘K command palette over page titles, headings, and body text — matches in prose show a snippet with the term highlighted
- Light / dark theme toggle
- Auto TOC + scroll-spy in the sidebar
- 404 page (default themed; override by adding a `404.md` to your folder)
- Heading anchor links — hover any heading to reveal a link icon; click to copy a deep link to that section
- Math: `$inline$` and `$$block$$` rendered server-side via KaTeX (fonts auto-bundled)
- Mermaid diagrams: ` ```mermaid ` blocks render client-side and follow the active light/dark theme
- GitHub-style callouts: `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` blockquotes get an icon, label, and accent border
- Site config: a `mdstack.config.js` is auto-created in your folder on first run; edit it to set the header logo, brand text, theme, footer copyright, and public site URL
- SEO: builds emit `robots.txt` automatically, plus a `sitemap.xml` whenever `site` is set in `mdstack.config.js`. Drop your own `robots.txt` or `sitemap.xml` in the source folder to override.

## CLI

```
mdstack [dev|build|preview] [--theme <name>] <folder>
```

Available themes: `angular` (default, dark gradient editorial), `vue` (clean docs aesthetic à la vuejs.org with always-dark Palenight code blocks), `nuxt` (electric-green Nuxt UI Pro feel with subtle dot-grid, file-tab code blocks, and animated link underlines), `homebrew` (aggressively minimal GitHub-Pages-Jekyll vibe — single column, light-only, no chrome).

## Roadmap

- [ ] `keywords`, `author`, `license`, `repository`, `homepage` in `package.json`
- [ ] Auto-generated `sitemap.xml` / `robots.txt`

## Requirements

Node 18+.

---
title: Welcome
order: 1
---

# Welcome to mdstack

You're reading `index.md` — it became this homepage automatically because of its name. Open the file in your editor; the dev server hot-reloads on save.

## How it works

Every `.md` file in this folder becomes a page:

- `index.md` → `/`
- `about.md` → `/about/`
- `guides/setup.md` → `/guides/setup/`

Drop in a file, get a route. No build config, no router.

## Frontmatter

The YAML block at the top of this file controls the page:

```yaml
---
title: Welcome   # nav label & <title> (defaults to filename)
order: 1         # sort order in the sidebar (lower = first)
---
```

Both fields are optional.

## Site config

A `mdstack.config.js` was created next to this file. Edit it to change:

- **brand** — the wordmark and logo in the header
- **theme** — `angular`, `vue`, `nuxt`, or `homebrew`
- **site** — your public URL; setting this enables `sitemap.xml`
- **footer** — the copyright line at the bottom of every page

Re-run mdstack after saving to apply changes.

## Custom 404

A themed 404 page ships out of the box. To override it, drop a `404.md` into this folder — same frontmatter and markdown features as any other page.

## Next steps

- Replace this file with your real content
- Add more `.md` files for more pages
- Run `mdstack build ./` to produce a deployable `./dist/`

Happy writing.

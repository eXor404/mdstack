# mdstack — product website

Single-page Astro site at `mdstack.dev`. Long-scroll layout with hero,
how-it-works, features, theme showcase, install, CLI, FAQ.

## Develop

```bash
npm install
npm run dev
```

The dev server does not regenerate the theme-preview iframes — generate them
once with `npm run build:previews` if you want the showcase wired during dev.

## Build

```bash
npm run build      # full build: theme previews + version fetch + astro build
npm run build:fast # skip theme-preview generation (faster, but showcase is empty)
```

The `build` script runs three steps:

1. `scripts/build-theme-previews.mjs` — invokes the local `mdstack` CLI four
   times against a fixture folder, once per built-in theme. Each output is
   copied to `public/theme-previews/<theme>/` and served as a self-contained
   static folder behind the iframe in the `#themes` section.
2. `scripts/fetch-version.mjs` — fetches the latest `@exor404/mdstack` version
   from the npm registry and caches it under `.cache/version.json`. The site
   reads it at build time; nothing is fetched on the client.
3. `astro build` — emits the static site to `dist/`.

## Deploy

Any static host. The `dist/` directory is self-contained.

- Vercel / Cloudflare Pages: build command `npm run build`, output `dist/`.
- The repo root contains the `mdstack` CLI used by step 1 — clone the whole
  repo on the deploy box, not just the `website/` folder.

## Customizing

Single edit points worth knowing:

- `src/lib/links.ts` — `DOCS_URL` and other external links. Swap when the
  docs site is live.
- `src/styles/tokens.css` — design tokens copied from
  `app/src/themes/angular.css`. If the angular theme ever drifts, update both.
- `src/lib/install-tabs.ts` — the install commands in the hero card.

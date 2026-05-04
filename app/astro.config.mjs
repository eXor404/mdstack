import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import mdstackAssets from './integrations/mdstack-assets.js';
import remarkImagePaths from './integrations/remark-image-paths.js';
import remarkHighlight from './integrations/remark-highlight.js';
import remarkCallouts from './integrations/remark-callouts.js';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const __dirname = dirname(fileURLToPath(import.meta.url));
const theme = process.env.MD_THEME || 'angular';
const themeFile = resolve(__dirname, 'src', 'themes', `${theme}.css`);

// Shiki highlighter paired with each mdstack theme.
const SHIKI_BY_THEME = {
  angular: 'github-dark',
  vue: 'material-theme-palenight',
  nuxt: 'vitesse-dark',
  homebrew: 'monokai',
};
const shikiTheme = SHIKI_BY_THEME[theme] ?? 'github-dark';

export default defineConfig({
  integrations: [mdstackAssets()],
  vite: {
    resolve: {
      alias: {
        '~theme': themeFile,
      },
    },
    server: {
      // mdstack is a local CLI; deps live above APP_ROOT (or hoisted further
      // up under npx). Disable strict fs serving so KaTeX fonts and other
      // node_modules assets resolve regardless of where they're installed.
      fs: { strict: false },
    },
  },
  markdown: {
    remarkPlugins: [remarkImagePaths, remarkCallouts, remarkHighlight, remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      // Match the theme's code-block aesthetic.
      theme: shikiTheme,
    },
  },
});

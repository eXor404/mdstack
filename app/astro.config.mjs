import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import mdstackAssets from './integrations/mdstack-assets.js';
import remarkImagePaths from './integrations/remark-image-paths.js';
import remarkHighlight from './integrations/remark-highlight.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const theme = process.env.MD_THEME || 'angular';
const themeFile = resolve(__dirname, 'src', 'themes', `${theme}.css`);

export default defineConfig({
  integrations: [mdstackAssets()],
  vite: {
    resolve: {
      alias: {
        '~theme': themeFile,
      },
    },
  },
  markdown: {
    remarkPlugins: [remarkImagePaths, remarkHighlight],
    shikiConfig: {
      // Match the theme's code-block aesthetic.
      theme: 'github-dark',
    },
  },
});

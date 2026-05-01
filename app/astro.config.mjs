import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const theme = process.env.MD_THEME || 'angular';
const themeFile = resolve(__dirname, 'src', 'themes', `${theme}.css`);

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '~theme': themeFile,
      },
    },
  },
  markdown: {
    shikiConfig: {
      // Match the theme's code-block aesthetic.
      theme: 'github-dark',
    },
  },
});

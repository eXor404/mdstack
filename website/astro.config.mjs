import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://mdstack.dev',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
});

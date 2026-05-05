// mdstack site config — edit to customize the look of your site.
// Re-run mdstack after saving to apply changes.

export default {
  brand: {
    // Wordmark shown in the header next to the logo. Set to '' to hide.
    text: 'mdstack',
    // Path to a custom logo, absolute from this folder's root
    // (e.g. '/images/logo.svg'). Leave null to use the built-in
    // gradient mark.
    logo: null,
  },

  // Theme. Built-in: 'angular' (default), 'vue', 'nuxt', 'homebrew'.
  theme: 'angular',

  // Public URL of your site (no trailing slash). Used to generate
  // sitemap.xml and the Sitemap line in robots.txt at build time.
  // Leave '' to skip sitemap generation.
  site: '',

  footer: {
    // Copyright / credit line shown at the bottom of every page.
    // Set to '' to hide it entirely.
    copyright: '© eXor404',
  },
};

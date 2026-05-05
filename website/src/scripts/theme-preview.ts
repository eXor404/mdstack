// Wires the theme-preview tabs/select, swaps the iframe with a fade,
// updates the address-bar host and the live mdstack.config.js snippet.

const THEME_META: Record<string, { domain: string; blurb: string }> = {
  angular:  { domain: 'angular-vibes.dev',  blurb: 'Code-forward, sharp edges. The default.' },
  vue:      { domain: 'vue-vibes.dev',      blurb: 'Calm, friendly, breathable.' },
  nuxt:     { domain: 'nuxt-vibes.dev',     blurb: 'Clean dark surfaces with a green pulse.' },
  homebrew: { domain: 'homebrew-vibes.dev', blurb: 'Terminal-tactile and a bit nostalgic.' },
};

function init() {
  const stage = document.querySelector<HTMLElement>('[data-theme-stage]');
  if (!stage) return;

  const tabs = Array.from(stage.querySelectorAll<HTMLButtonElement>('[data-theme-tab]'));
  const select = stage.querySelector<HTMLSelectElement>('[data-theme-select]');
  const frame = stage.querySelector<HTMLIFrameElement>('[data-theme-frame]');
  const frameWrap = frame?.parentElement;
  const host = stage.querySelector<HTMLElement>('[data-theme-host]');
  const name = stage.querySelector<HTMLElement>('[data-theme-name]');
  const blurb = stage.querySelector<HTMLElement>('[data-theme-blurb]');
  const config = stage.querySelector<HTMLElement>('[data-theme-config]');
  const pickers = Array.from(stage.querySelectorAll<HTMLElement>('[data-theme-picker]'));

  let pending: number | null = null;

  function setActive(theme: string, push = true) {
    if (!THEME_META[theme]) return;
    if (stage.dataset.active === theme && push) return;
    stage.dataset.active = theme;

    tabs.forEach((t) => {
      const active = t.dataset.themeTab === theme;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
    pickers.forEach((p) => {
      p.dataset.active = String(p.dataset.themePicker === theme);
    });
    if (select && select.value !== theme) select.value = theme;

    const meta = THEME_META[theme];
    if (host) host.textContent = meta.domain;
    if (name) name.textContent = theme;
    if (blurb) blurb.textContent = meta.blurb;
    if (config) config.textContent = theme;

    if (frame && frameWrap) {
      if (pending) window.clearTimeout(pending);
      frameWrap.classList.add('is-fading');
      pending = window.setTimeout(() => {
        frame.src = `/theme-previews/${theme}/index.html`;
        const onLoad = () => {
          frameWrap.classList.remove('is-fading');
          frame.removeEventListener('load', onLoad);
        };
        frame.addEventListener('load', onLoad);
        // Safety: clear fade even if the load never fires (cached, etc).
        window.setTimeout(() => frameWrap.classList.remove('is-fading'), 800);
      }, 120);
    }
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.themeTab;
      if (id) setActive(id);
    });
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(idx + dir + tabs.length) % tabs.length];
      const id = next.dataset.themeTab;
      if (id) {
        setActive(id);
        next.focus();
      }
    });
  });

  if (select) {
    select.addEventListener('change', () => {
      setActive(select.value);
    });
  }

  // Honor footer #themes?t=vue style links.
  document.querySelectorAll<HTMLAnchorElement>('[data-theme-link]').forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.dataset.themeLink;
      if (id) {
        // Defer to allow the anchor jump to land first.
        window.setTimeout(() => setActive(id), 50);
      }
    });
  });

  // Also accept ?t=<theme> on initial load when scrolling to #themes.
  const params = new URLSearchParams(window.location.search);
  const fromHash = window.location.hash.match(/[?&]t=([a-z]+)/);
  const initial = params.get('t') || fromHash?.[1];
  if (initial && THEME_META[initial]) setActive(initial);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

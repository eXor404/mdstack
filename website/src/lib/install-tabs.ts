export const HERO_INSTALL_TABS = [
  {
    id: 'npx',
    label: 'npx',
    lines: ['npx @exor404/mdstack ./docs'],
    copy: 'npx @exor404/mdstack ./docs',
  },
  {
    id: 'npm',
    label: 'npm',
    lines: ['npm i -D @exor404/mdstack', 'npx mdstack ./docs'],
    copy: 'npm i -D @exor404/mdstack\nnpx mdstack ./docs',
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    lines: ['pnpm add -D @exor404/mdstack', 'pnpm exec mdstack ./docs'],
    copy: 'pnpm add -D @exor404/mdstack\npnpm exec mdstack ./docs',
  },
  {
    id: 'yarn',
    label: 'yarn',
    lines: ['yarn add -D @exor404/mdstack', 'yarn mdstack ./docs'],
    copy: 'yarn add -D @exor404/mdstack\nyarn mdstack ./docs',
  },
  {
    id: 'global',
    label: 'global',
    lines: ['npm i -g @exor404/mdstack', 'mdstack ./docs'],
    copy: 'npm i -g @exor404/mdstack\nmdstack ./docs',
  },
];

import type { StorybookConfig } from '@storybook-astro/framework';

// Storybook for the .astro components (ADR 0002, ADR 0008). Stories sit next to their component
// under src/. The framework preset selects @storybook/builder-vite and renders each story through
// Astro's container API; static builds prerender every story (docs/research/phase-1-storybook-chromatic.md).
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', 'storybook-addon-pseudo-states'],
  framework: {
    name: '@storybook-astro/framework',
    options: {
      renderMode: 'static',
    },
  },
  // The static build rewrites the dev-only image paths in prerendered HTML to the emitted assets
  // by matching "<stem>-<hash>.<ext>", and its matcher accepts alphanumeric hashes only. Vite 8's
  // default base64url hashes can contain "-" and "_", so ask Rolldown for base36 hashes.
  viteFinal: (config) => {
    const output = config.build?.rolldownOptions?.output;
    const withHashes = (options: object | undefined) => ({
      ...options,
      hashCharacters: 'base36' as const,
    });
    return {
      ...config,
      build: {
        ...config.build,
        rolldownOptions: {
          ...config.build?.rolldownOptions,
          output: Array.isArray(output) ? output.map(withHashes) : withHashes(output),
        },
      },
    };
  },
};

export default config;

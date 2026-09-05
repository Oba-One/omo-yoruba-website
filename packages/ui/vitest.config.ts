import { fileURLToPath } from 'node:url';
import { defineConfig } from '@storybook-astro/framework/vitest';

// Portable stories: the framework wraps Astro's `getViteConfig` so `.astro` files compile, and
// renders each composed story through Astro's container API (docs/research/phase-1-storybook-chromatic.md).
// happy-dom gives `renderStory` a `document` to write into; the setup file loads the preview
// annotations (tokens, decorators, globals) so tests see what Storybook shows.
export default defineConfig({
  // Resolve astro from this package, not from wherever Vitest was started (the root runs every
  // workspace project and Bun links dependencies per package).
  root: fileURLToPath(new URL('.', import.meta.url)),
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    passWithNoTests: true,
  },
});

import { defineConfig } from 'vitest/config';

// Each package that has unit tests declares its own vitest.config.ts.
// The root config only discovers them, so `bun run test` runs everything at once (`bun test` is Bun's own runner).
export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.ts'],
  },
});

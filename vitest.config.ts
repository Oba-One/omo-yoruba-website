import { defineConfig } from 'vitest/config';

// Each package that has unit tests declares its own vitest.config.ts.
// The root config only discovers them, so `bun test` runs everything at once.
export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.ts'],
  },
});

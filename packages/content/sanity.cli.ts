import { defineCliConfig } from 'sanity/cli';

// TypeGen and schema extraction run here, where the schema lives (ADR 0017). `bun typegen`
// writes schema.json and src/sanity.types.ts, both committed; the CI job `TypeGen drift`
// regenerates them and fails on a difference. `sanity-typegen.json` is deprecated in this
// Studio major, so the typegen block lives here (docs/research/phase-2-sanity-studio-v6-and-astro.md).
export default defineCliConfig({
  api: {
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? 'local',
    dataset: process.env.PUBLIC_SANITY_DATASET ?? 'development',
  },
  schemaExtraction: {
    path: './schema.json',
    enforceRequiredFields: false,
  },
  typegen: {
    // A dynamic route returns a Response from its frontmatter (`/gallery/[album]`'s 404), which the TypeGen
    // parser rejects as a return outside a function; its queries live in src/queries like every other.
    path: [
      './src/**/*.ts',
      '../web/src/**/*.{ts,astro}',
      '!../web/src/pages/gallery/*album*.astro',
    ],
    schema: './schema.json',
    generates: './src/sanity.types.ts',
    overloadClientMethods: true,
    formatGeneratedCode: false,
  },
});

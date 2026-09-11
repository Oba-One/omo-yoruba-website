import { createStudioConfig } from './src/studio/config';

// Loaded by the Sanity CLI (schema extract, typegen, documents) under Node through
// scripts/sanity.sh, which exports packages/web/.env first. The Studio embedded at /admin does
// not use this file: packages/web/sanity.config.ts builds its config from astro:env through the
// same factory (ADR 0017). The fallbacks keep `bun typegen` working offline, with no project.
export default createStudioConfig({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? 'local',
  dataset: process.env.PUBLIC_SANITY_DATASET ?? 'development',
});

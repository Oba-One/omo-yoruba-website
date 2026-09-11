import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from 'astro:env/client';
import { createStudioConfig } from '@oy/content/studio';

// @sanity/astro resolves this file from the Astro project root and mounts the Studio it
// exports at studioBasePath (/admin). The configuration itself belongs to @oy/content
// (ADR 0017); this file only supplies the environment.
export default createStudioConfig({
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET,
});

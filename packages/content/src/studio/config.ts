import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from '../schema';
import { documentActions, newDocumentOptions } from './document-options';
import { presentationOptions } from './presentation';
import { defaultDocumentNode, structure } from './structure';

/** The API version every Studio query pins (docs/research/phase-2-sanity-client-and-image-url.md). */
export const STUDIO_API_VERSION = '2026-09-11';

export interface StudioEnv {
  projectId: string;
  dataset: string;
}

/**
 * The one Studio configuration, built for two hosts: the embedded Studio in packages/web (from
 * astro:env) and the Sanity CLI in this package (from process.env). Browser safe: nothing here
 * reads the environment.
 */
export function createStudioConfig({ projectId, dataset }: StudioEnv) {
  return defineConfig({
    name: 'omo-yoruba',
    title: 'Omo Yorùbá',
    projectId,
    dataset,
    plugins: [
      structureTool({ structure, defaultDocumentNode }),
      presentationTool(presentationOptions),
      visionTool({ defaultApiVersion: STUDIO_API_VERSION }),
    ],
    schema: { types: schemaTypes },
    document: { newDocumentOptions, actions: documentActions },
  });
}

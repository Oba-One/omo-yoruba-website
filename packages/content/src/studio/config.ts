import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import {
  type PresentationPluginOptions,
  type PreviewUrlResolverOptions,
  presentationTool,
} from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { STUDIO_API_VERSION } from '../api-version';
import { schemaTypes } from '../schema';
import { documentActions, newDocumentOptions } from './document-options';
import { presentationOptions } from './presentation';
import { defaultDocumentNode, structure } from './structure';

export { STUDIO_API_VERSION };

export interface StudioEnv {
  projectId: string;
  dataset: string;
  /** The uncached preview host for the Presentation tool; empty previews on the Studio's origin. */
  previewOrigin?: string;
}

/**
 * The one Studio configuration, built for two hosts: the embedded Studio in packages/web (from
 * astro:env) and the Sanity CLI in this package (from process.env). Browser safe: nothing here
 * reads the environment.
 */
export function createStudioConfig({ projectId, dataset, previewOrigin }: StudioEnv) {
  const origin = previewOrigin?.trim();
  const presentation: PresentationPluginOptions = origin
    ? {
        ...presentationOptions,
        previewUrl: { ...(presentationOptions.previewUrl as PreviewUrlResolverOptions), origin },
        allowOrigins: [origin],
      }
    : presentationOptions;
  return defineConfig({
    name: 'omo-yoruba',
    title: 'Omo Yorùbá',
    projectId,
    dataset,
    plugins: [
      structureTool({ structure, defaultDocumentNode }),
      presentationTool(presentation),
      visionTool({ defaultApiVersion: STUDIO_API_VERSION }),
    ],
    schema: { types: schemaTypes },
    document: { newDocumentOptions, actions: documentActions },
  });
}

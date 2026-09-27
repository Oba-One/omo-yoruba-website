import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import {
  type PresentationPluginOptions,
  type PreviewUrlResolverOptions,
  presentationTool,
} from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { STUDIO_API_VERSION } from '../api-version';
import { authoredSchemaTypes, schemaTypes } from '../schema';
import { documentActions, newDocumentOptions, studioTools } from './document-options';
import { presentationOptions } from './presentation';
import { defaultDocumentNode, structure } from './structure';
import { studioTemplates } from './templates';

export { STUDIO_API_VERSION };

export interface StudioEnv {
  projectId: string;
  dataset: string;
  /** The uncached preview host for the Presentation tool; empty previews on the Studio's origin. */
  previewOrigin?: string;
  /**
   * The Sanity CLI's config: the types as written. Sanity's schema manifest keeps only the rules it
   * can read ahead of time, and the Studio's rules, which skip hidden inputs, read the document
   * first; so a deployed schema carries every rule for agents, and `sanity documents validate`
   * checks hidden inputs too.
   */
  cli?: boolean;
}

/**
 * The one Studio configuration, built for two hosts: the embedded Studio in packages/web (from
 * astro:env) and the Sanity CLI in this package (from process.env). Browser safe: nothing here
 * reads the environment.
 */
export function createStudioConfig({ projectId, dataset, previewOrigin, cli = false }: StudioEnv) {
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
    // Members get the structure and Presentation; Vision is for administrators (ADR 0042).
    tools: studioTools,
    // Editions are prepared as drafts and published by hand on the announce day: nothing is
    // staged in a release or scheduled to publish itself (ADR 0042).
    releases: { enabled: false },
    scheduledDrafts: { enabled: false },
    scheduledPublishing: { enabled: false },
    schema: { types: cli ? authoredSchemaTypes : schemaTypes, templates: studioTemplates },
    document: { newDocumentOptions, actions: documentActions },
  });
}

/**
 * The real dependencies behind the actions: the Sanity client with the Editor token (undefined
 * while the token is missing, so the handlers answer with the fallback sentence instead of
 * throwing) and the origin bucket shared by every warm request. Kept apart from the handlers so
 * they never import Astro's virtual modules.
 */
import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from 'astro:env/client';
import { getSecret } from 'astro:env/server';
import { STUDIO_API_VERSION } from '@oy/content/api-version';
import { createClient } from '@sanity/client';
import type { FormDeps } from './handlers';
import { createBucket } from './limits';

let deps: FormDeps | undefined;

export function siteDeps(): FormDeps {
  if (deps) return deps;
  const token = getSecret('SANITY_API_WRITE_TOKEN');
  deps = {
    client: token
      ? createClient({
          projectId: PUBLIC_SANITY_PROJECT_ID,
          dataset: PUBLIC_SANITY_DATASET,
          apiVersion: STUDIO_API_VERSION,
          useCdn: false,
          token,
          maxRetries: 1,
        })
      : undefined,
    bucket: createBucket(),
  };
  return deps;
}

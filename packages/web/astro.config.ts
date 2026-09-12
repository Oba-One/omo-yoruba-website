import { existsSync, readFileSync } from 'node:fs';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import { cacheVercel } from '@astrojs/vercel/cache';
import sanity from '@sanity/astro';
import { defineConfig, envField } from 'astro/config';
import { STUDIO_BASE_PATH } from './src/lib/paths';

// The integration needs the project id before astro:env exists, so the config reads
// packages/web/.env itself (the file the wizard writes) under the process environment, which
// Vercel and CI set. Values are simple KEY=VALUE lines; quotes are stripped.
function readDotEnv(file: string): Record<string, string> {
  if (!existsSync(file)) return {};
  const values: Record<string, string> = {};
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    values[match[1] as string] = (match[2] as string).replace(/^(['"])(.*)\1$/, '$2');
  }
  return values;
}
const dotEnv = readDotEnv(new URL('./.env', import.meta.url).pathname);
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || dotEnv.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || dotEnv.PUBLIC_SANITY_DATASET;
if (!projectId || !dataset) {
  throw new Error(
    'PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET are required since Phase 2. Run `bash scripts/setup-wizard.sh` from the repo root, or copy packages/web/.env.example to packages/web/.env (docs/runbook.md).',
  );
}

// Stack decisions: docs/design/README.md section 4, docs/adr/0001. Env schema: README section 7.
export default defineConfig({
  // Canonical origin. Vercel injects PUBLIC_SITE_URL per environment at build time, so
  // previews get their own value; the production domain is the fallback.
  site: process.env.PUBLIC_SITE_URL ?? 'https://omoyorubasocal.org',
  output: 'server',
  adapter: vercel(),

  // Route caching on the Vercel CDN (ADR 0001, ADR 0021): pages call Astro.cache.set with one
  // tag per document type and /api/revalidate purges by tag through the provider
  // (docs/research/phase-4-astro-cache-and-vercel-provider.md). No routeRules: a route that
  // sets nothing is never cached, which is what keeps the preview, Studio, API and action
  // routes out of the CDN.
  cache: { provider: cacheVercel() },

  integrations: [
    // The Studio at /admin and the Visual Editing overlay are React islands; nothing else is
    // (docs/adr/0002, docs/adr/0017).
    react(),
    sanity({
      projectId,
      dataset,
      apiVersion: '2026-09-11',
      useCdn: false,
      studioBasePath: STUDIO_BASE_PATH,
      stega: { studioUrl: STUDIO_BASE_PATH },
    }),
  ],

  // Playwright starts the dev server with PLAYWRIGHT=1 (playwright.config.ts): the dev toolbar's
  // shadow DOM would otherwise add headings and controls the specs and axe can see.
  devToolbar: { enabled: process.env.PLAYWRIGHT !== '1' },

  // Astro's built-in CSP renders a <meta> tag, has no report-only mode, and is not
  // supported alongside <ClientRouter />. Until Phase 9 the policy is delivered as a
  // Content-Security-Policy-Report-Only header from src/middleware.ts, built from the
  // single allow-list in src/lib/csp.ts. See docs/adr/0011 and docs/runbook.md.
  security: {
    csp: false,
  },

  env: {
    // The two Sanity variables are required since Phase 2 (the data layer exists); the rest
    // stay optional until their service is set up. Public values are inlined at build time:
    // changing one on Vercel needs a redeploy (docs/runbook.md). CI supplies placeholder
    // values for the build (.github/workflows/ci.yml).
    schema: {
      PUBLIC_SANITY_PROJECT_ID: envField.string({
        context: 'client',
        access: 'public',
      }),
      PUBLIC_SANITY_DATASET: envField.string({
        context: 'client',
        access: 'public',
      }),
      PUBLIC_SITE_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'https://omoyorubasocal.org',
      }),
      PUBLIC_POSTHOG_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
      PUBLIC_POSTHOG_HOST: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'https://us.i.posthog.com',
      }),
      PUBLIC_ZEFFY_EMBED_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
      PUBLIC_EVENTBRITE_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
      // A second hostname of the same deployment for the Presentation tool, never cached, so an
      // editor's draft view never meets the public CDN copy (ADR 0021). Empty means the Studio
      // previews on its own origin, which is right locally and until the domain exists.
      PUBLIC_PREVIEW_ORIGIN: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),

      SANITY_API_READ_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      SANITY_API_WRITE_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      SANITY_PREVIEW_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      SANITY_WEBHOOK_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      // RESEND_API_KEY lives in the Sanity Function environment, not here (README section 7).
    },
    validateSecrets: false,
  },
});

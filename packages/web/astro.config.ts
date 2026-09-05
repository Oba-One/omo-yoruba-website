import vercel from '@astrojs/vercel';
import { defineConfig, envField } from 'astro/config';

// Stack decisions: docs/design/README.md section 4, docs/adr/0001. Env schema: README section 7.
export default defineConfig({
  // Canonical origin. Vercel injects PUBLIC_SITE_URL per environment at build time, so
  // previews get their own value; the production domain is the fallback.
  site: process.env.PUBLIC_SITE_URL ?? 'https://omoyorubaofsocal.org',
  output: 'server',
  adapter: vercel(),

  // Astro's built-in CSP renders a <meta> tag, has no report-only mode, and is not
  // supported alongside <ClientRouter />. Until Phase 9 the policy is delivered as a
  // Content-Security-Policy-Report-Only header from src/middleware.ts, built from the
  // single allow-list in src/lib/csp.ts. See docs/adr/0011 and docs/runbook.md.
  security: {
    csp: false,
  },

  env: {
    // Every variable is optional in Phase 0 so the site builds before the owner has
    // run scripts/setup-wizard.sh. Phase 2 makes the Sanity variables required when
    // the data layer lands. Public values are inlined at build time: changing one on
    // Vercel needs a redeploy (docs/runbook.md).
    schema: {
      PUBLIC_SANITY_PROJECT_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
      PUBLIC_SANITY_DATASET: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'production',
      }),
      PUBLIC_SITE_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'https://omoyorubaofsocal.org',
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

# PostHog in Astro

Date: 4 September 2026. Source: https://posthog.com/docs/libraries/astro.

- PostHog's documented Astro setup is a `<script is:inline>` snippet in a `posthog.astro`
  component placed in the layout head, calling `posthog.init(token, { api_host, defaults })`
  with `defaults: '2026-05-30'`. With `<ClientRouter />` it recommends guarding against
  double initialisation and `capture_pageview: 'history_change'`.
- The brief names the `posthog-js` package rather than the CDN snippet, so
  `apps/web/src/components/Analytics.astro` bundles the package and imports it lazily
  after the `load` event, only when `PUBLIC_POSTHOG_KEY` is set. It initialises with the
  documented `defaults` and `history_change` pageviews, and switches off autocapture and
  session recording so no form contents are captured (ROUTES section 2).
- Budget risk for Phase 9: `posthog-js` is a large bundle. If the 60 KB gzipped JS
  budget on content pages cannot be met with it, the candidates are the CDN snippet
  (script from `us-assets.i.posthog.com`, already in the CSP allow-list) or
  `posthog-js-lite` (4.11.0 on the registry). Wayfinder ticket 15.

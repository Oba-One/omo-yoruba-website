# Analytics bundle versus the JS budget

Type: research
Status: resolved
Owner: no
Labels: infra
Phase: 9
Blocked by: none

## Question

`posthog-js` is large; the budget is 60 KB gzipped of JS on content pages. Measure the built bundle on a content page and, if over budget, compare the CDN snippet and `posthog-js-lite`. See `docs/research/posthog-astro.md`.

## Answer

Measured 12 September 2026 on the Phase 4 production build (`bun run build`, gzipped bytes of
`packages/web/.vercel/output/static/_astro`, the chunks the homepage loads): the client router
5.7 KB, the form bridge 4.0 KB, the analytics bridge 0.3 KB, Astro's island runtime 1.2 KB, and
six inline scripts (the custom elements of the nav, the footer form, the two dialogs, the progress
bar and the router hooks) of 25.5 K characters before compression, about 7 KB gzipped: roughly
18 KB against the 60 KB budget, with no image or Studio code on the page. The Visual Editing
island (104 KB plus React, 145 KB together) loads in draft mode only. `posthog-js` 1.427.2 is the
one chunk that breaks the budget on its own: 89 KB gzipped, fetched after `load` and only when
`PUBLIC_POSTHOG_KEY` is set, so it never delays first paint but counts toward "total JavaScript".
Phase 9 decides between keeping it, `posthog-js-lite` and the CDN snippet against the
`resource-summary:script:size` assertion in `packages/web/lighthouserc.cjs`, which counts every
script Chrome loads, third parties included.

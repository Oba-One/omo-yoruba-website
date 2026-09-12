# Phase 3: play functions on Astro stories, verified in the canvas, the static build and Vitest

Date: 11 September 2026. Method: a throwaway component under `packages/ui/src/_spike/` (deleted
after the run) with a custom element that opens a panel on click, closes it on Escape and returns
focus, in two variants: a hoisted `<script>` (Astro's default, bundled, TypeScript allowed) and a
`<script is:inline>` in plain JavaScript. One story per variant carried a `play` function written
with `within`, `userEvent`, `waitFor` and `expect` from `storybook/test`. Each was checked in
`storybook dev` (the in-app browser, Interactions panel), in `storybook build` served as static
files, and in Vitest through the framework's portable stories. Framework sources read:
`@storybook-astro/renderer/src/render.tsx` (`renderAstroToCanvas`, `invokeScriptTags`),
`@storybook-astro/framework/src/vitePluginAstroBuildPrerender.ts` (`rewriteAssetPaths`),
`@storybook-astro/framework/src/testing/astro-runtime.ts` (`setRenderedHtml`), all at 1.11.0.
Phase 1 left this unverified (`docs/research/phase-1-storybook-chromatic.md`, "play").

## Results

| Where | Hoisted `<script>` in TypeScript | Hoisted `<script>` in plain JS | `<script is:inline>` in plain JS |
| --- | --- | --- | --- |
| `storybook dev` canvas | Script served untransformed with its type annotations, the browser rejects it, play fails at the readiness wait | Runs; play passes (PASS in the Interactions panel, seven steps) | Runs; play passes |
| `storybook build`, served statically | `<script type="module" src="/Users/.../X.astro?astro&type=script&index=0&lang.ts">` answers 404; the element never upgrades | Same 404 | Script is embedded in the prerendered HTML, re-runs on insertion, play passes |
| Vitest portable stories (happy-dom) | Script never executes ("JavaScript file loading is disabled"); play fails | Same | Same: happy-dom does not run inline scripts either |

## Why

- The canvas writes the server HTML into `canvasElement.innerHTML`, then `invokeScriptTags`
  re-inserts every `<script>`; module scripts get a `sbAstroReload` query so the browser
  re-imports them. Storybook runs `play` after that, so the play function must `waitFor` the
  script's readiness marker before interacting. Source: `render.tsx`, `renderAstroToCanvas` and
  `invokeScriptTags`.
- The container API renders a hoisted script as `<script type="module" src="<absolute file
  path>?astro&type=script&index=0&lang.ts">`. In dev that path is served by Vite as the raw
  extracted script without the TypeScript transform (the request answered 200 with the
  annotations intact). In the static build `rewriteAssetPaths` only rewrites `/@fs/` URLs, and
  the script is not part of the client bundle, so nothing is emitted for it. Source:
  `vitePluginAstroBuildPrerender.ts` lines 279 to 321, the network log of both runs.
- Portable stories set `document.body.innerHTML` and stop; the roadmap records that the container
  API does not execute script tags, so client behaviour needs a browser. Source:
  `testing/astro-runtime.ts` `setRenderedHtml`, https://storybook-astro.org/guides/roadmap/.

## What this means for the components

- A component whose behaviour must run in Storybook (SiteNav, EnquiryModal, GiveDialog,
  NewsletterForm) carries it in a `<script is:inline>` written in plain JavaScript that defines a
  custom element guarded by `customElements.get`. The play function waits for the element's
  `data-ready` marker, then drives the keyboard. Vitest tests assert the markup and the ARIA
  state of the initial render only; keyboard behaviour is proven in the canvas and by Playwright
  against the site.
- Cost: no TypeScript and no bundling in those scripts, and each instance repeats the script (the
  four components render once per page). Inline scripts are also what `<ClientRouter />` leaves
  alone on navigation, which the persisted nav and dialogs rely on; the `customElements` guard
  makes a re-run harmless. Recorded as a decision in `docs/adr/0018`.
- Not a blocker for ADR 0002: `.astro` stays the component format and Storybook renders every
  state. Worth an upstream issue on `storybook-astro`: transform hoisted scripts in dev and emit
  them in static builds.

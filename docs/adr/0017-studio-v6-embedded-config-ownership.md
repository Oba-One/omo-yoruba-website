# Studio v6 at /admin; @oy/content owns the Studio config; the Blueprint manifest sits at the root

Decided with the owner on 11 September 2026 after wayfinder ticket 14. The Studio is `sanity`
6.12.0 (the brief said v5; research in `docs/research/phase-2-sanity-studio-v6-and-astro.md`),
embedded at `/admin` through `@sanity/astro` 3.5.1 with `@astrojs/react`, since the Studio
and the Visual Editing overlay are React islands. `packages/content` owns `sanity.config.ts`
(schema, structure, Presentation) and `sanity.cli.ts` (TypeGen, schema extraction), so
`bun typegen` runs where the schema lives; `packages/web/sanity.config.ts` only re-exports it,
because the integration resolves the file from the Astro project root. `sanity.blueprint.ts`
sits at the repo root next to `bun.lock`, as Sanity's monorepo guidance asks, with each
function's source under `packages/content/functions/<name>`.

## Consequences

- React, react-dom and styled-components are dependencies of `packages/web` for the Studio
  route only; no React component renders on a site route (ADR 0002).
- Functions run on Node 24 in production and on the machine's Node 22 locally; the runtime gap
  is recorded, not resolved.
- Draft mode is the `sanity-preview-perspective` cookie set by `/api/preview/enable` after
  `validatePreviewUrl`; `loadQuery` is hand written in `packages/web` (the integration exports
  none).

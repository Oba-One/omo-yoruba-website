# Sanity Studio major: v5 in the brief, v6 current

Type: research
Status: resolved
Owner: no
Labels: infra
Phase: 2
Blocked by: none

## Question

The handoff says Studio v5; the registry has `sanity` 6.12.0 and `@sanity/astro` 3.5.1 accepts v5 or v6. Research the v6 changes that touch this repo (structure tool, Presentation, TypeGen, Functions, Node 22) and recommend; the owner confirms before Phase 2 installs.

## Answer

Researched 5 September 2026 (Phase 2 session), findings with sources in
`docs/research/phase-2-sanity-studio-v6-and-astro.md`,
`docs/research/phase-2-sanity-client-and-image-url.md` and
`docs/research/phase-2-sanity-functions-blueprints-resend.md`.

Recommendation: Studio v6, `sanity` 6.12.0, not the v5 line the brief named.

- v6 is the `latest` tag (6.0.0 shipped 11 June 2026); v5 is a maintenance line that ended at
  5.31.2 on 19 August 2026.
- The v5 to v6 guide lists four breaking changes and none touches this repo: Node 20 dropped
  (minimum 22.12; the repo pins 22.x), React strict mode on in `sanity dev`, `auth.mode` removed
  (the repo defines no auth providers), the `groq2024` search default and Vite 8 with Rolldown
  (the repo has no custom Vite block in `sanity.cli.ts`). "Schemas, plugins, configuration shape,
  and content APIs are unaffected."
- Every API the brief relies on exists in 6.12.0's shipped types: `structureTool`,
  `presentationTool` with `defineLocations` and `defineDocuments`, `document.newDocumentOptions`,
  `document.actions`, `schema.templates`, `S.component` for a custom pane, `sanity schema extract`
  and `sanity typegen generate` (configured in `sanity.cli.ts` now; `sanity-typegen.json` is
  deprecated).
- `@sanity/astro` 3.5.1 accepts `sanity ^6` (since 3.4.1) and Astro 7; `@sanity/vision` 6.12.0
  requires `sanity ^6`. Astro 7 already runs Vite 8, so the embedded Studio and the site share
  one bundler line. Staying on v5 would mean a Vite 7 built Studio inside a Vite 8 site and
  `@sanity/vision` 5.x.
- The React 19.2.2 floor and styled-components 6 came with v5, so v6 adds no new peer.

Facts that contradict the brief, carried into the build: `@sanity/astro` exports no `loadQuery`
(the helper is hand written in `packages/web`); the overlay component is `VisualEditing` from
`@sanity/astro/visual-editing`, not `<SanityVisualEditing />`; draft mode is the
`sanity-preview-perspective` cookie set by `/api/preview/enable` after `validatePreviewUrl` from
`@sanity/preview-url-secret`; `sanity.config.ts` must sit at the Astro project root
(`packages/web`, re-exporting the config that `@oy/content` owns); Functions run on Node 24 in
production (local tests run on the machine's Node 22); the `publish` function event is
deprecated in favour of `create` and `update`; and a function cannot raise a Studio validation
warning, so `content-lint` writes a report document the Pending view lists.

Exact pins the session installs once the owner says yes (`bunfig.toml` keeps them exact):
`sanity` 6.12.0, `@sanity/astro` 3.5.1, `@sanity/client` 8.5.0, `@sanity/image-url` 2.1.1,
`@sanity/functions` 1.7.1, `@sanity/blueprints` 0.24.0, `@sanity/vision` 6.12.0,
`@sanity/preview-url-secret` 4.1.5, `groq` 6.12.0, `@astrojs/react` 6.0.5, `react`, `react-dom`
and `react-is` 19.2.8, `styled-components` 6.5.3, `@types/react` 19.2.18, `@types/react-dom`
19.2.7, `@types/react-is` 19.2.0, `resend` 6.26.0, `zod` 4.5.4. The React packages exist only
for the Studio at `/admin` and the Studio's own panes; no React component ships on a site route
(ADR 0002 holds).

Status: resolved as a recommendation. The owner's confirmation gates the install (the brief:
"the owner confirms before Phase 2 installs").

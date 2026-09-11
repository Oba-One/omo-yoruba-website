# 01: Pin the Phase 2 packages and wire the workspaces

Labels: infra
Status: open
Blocked by: none

**What to build:** the approved Sanity stack installed at exact versions where each package is
used, so every later ticket imports from a working install: the Studio, client, image URL builder,
Functions, Blueprints, Vision, preview URL secret, groq, Zod and Resend in `packages/content`; the
Astro integration, the React integration and their peers in `packages/web`; the Blueprint packages
at the root for the manifest. `packages/content` gets its `sanity.config.ts` and `sanity.cli.ts`
skeleton and `packages/web/sanity.config.ts` re-exports it.

- [ ] Every new dependency matches the pins in wayfinder ticket 14 and `docs/research/phase-2-*.md`
- [ ] `bun install` reports no peer warnings for the Sanity set; `bun run typecheck` passes
- [ ] `packages/content/sanity.config.ts` exports the Studio config; `packages/web/sanity.config.ts`
      re-exports it; `packages/web/src/env.d.ts` references the integration's module types

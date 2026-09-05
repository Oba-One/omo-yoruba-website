# One Bun workspaces monorepo with @oy/ui, @oy/tokens, @oy/content and @oy/lint

The site, the Storybook and the shared packages live in one repo as Bun workspaces
(`apps/*`, `packages/*`) so a component, its story, its schema type and its lint rule
change in one commit. Bun installs and runs scripts; Node 22 runs Astro, Vitest and the
Vercel build, so Node 22 is pinned in `.node-version`, `mise.toml`, `engines` and CI.

## Consequences

- `apps/web` owns pages, layouts, data loading and actions, and no component styling.
- `packages/ui` imports nothing from `apps/web`; `packages/content` is the only place GROQ
  lives; `packages/tokens` is the only place a colour literal may appear.
- `turbo.json` is added only if builds get slow.

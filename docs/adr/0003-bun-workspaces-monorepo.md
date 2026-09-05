# One Bun workspaces monorepo, every workspace under packages/

The site, the Storybook and the shared libraries live in one repo as Bun workspaces so a
component, its story, its schema type and its lint rule change in one commit. All of them
sit in a single flat `packages/` directory with `@oy/` names (`@oy/web`, `@oy/ui`,
`@oy/tokens`, `@oy/content`, `@oy/lint`), the layout of the owner's green-goods
repo (https://github.com/greenpill-dev-guild/green-goods), rather than the `apps/` and
`packages/` split in `docs/design/README.md` section 5. Bun installs and runs scripts;
Node 22 runs Astro, Vitest and the Vercel build, so Node 22 and Bun 1.3 are pinned in
`.mise.toml`, `engines`, `packageManager` and CI.

## Consequences

- `packages/web` owns pages, layouts, data loading and actions, and no component styling.
- `packages/ui` imports nothing from `packages/web`; `packages/content` is the only place
  GROQ lives; `packages/tokens` is the only place a colour literal may appear.
- A deployable package carries its own `vercel.json` (Root Directory `packages/web`; the
  Storybook deploys from `packages/ui`, whose `.storybook/` holds the config, so there is no
  separate Storybook workspace).
- `turbo.json` is added only if builds get slow.

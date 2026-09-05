# Phase 0: package versions verified before pinning

Date: 4 September 2026. Method: `npm view <pkg> version|peerDependencies|time` against
the npm registry (the publisher's source of truth for versions), then the primary docs
named per row. Every pin below is exact (`bunfig.toml` sets `exact = true`).

| Package | Pinned | Latest on registry | Why this pin |
| --- | --- | --- | --- |
| `astro` | 7.3.1 | 7.3.1 (2026-09-03) | Latest 7.x, as the brief asks. `engines.node >=22.12.0`. |
| `@astrojs/vercel` | 11.0.10 | 11.0.10 | Peer `astro ^7.0.0`. Exports `./cache` (`cacheVercel`) for Phase 4 route caching. |
| `@astrojs/check` | 0.9.10 | 0.9.10 | Peer `typescript ^5.0.0 \|\| ^6.0.0`; drives `astro check`. |
| `typescript` | 5.9.3 | 7.0.2 | `@astrojs/check` does not accept TypeScript 7 (the native port). 5.9.3 is the latest 5.x; revisit in Phase 9. |
| `@types/node` | 22.20.1 | 26.4.1 | Match the Node 22 runtime major. |
| `@biomejs/biome` | 2.5.12 | 2.5.12 | Formatter and linter; Astro support is experimental (see `biome-astro-support.md`). |
| `lefthook` | 2.1.12 | 2.1.12 | Git hooks; v2 config verified with `lefthook validate` (see `lefthook-2-config.md`). |
| `vitest` | 4.1.11 | 5.0.0 (2026-09-03) | Vitest 5 shipped the day before pinning; `@storybook/addon-vitest` 10.6 accepts `^3 \|\| ^4` only, and Phase 1 needs it. |
| `posthog-js` | 1.427.2 | 1.427.2 | Loaded after first paint behind `PUBLIC_POSTHOG_KEY` (see `posthog-astro.md`). |

Not pinned yet, checked for the wayfinder map (each later phase re-verifies before adding):

| Package | Registry today | Note for the phase that adds it |
| --- | --- | --- |
| `@storybook-astro/framework` | 1.11.0 | Peers `astro ^7.0.0`, `storybook ^10.0.0`, `vite ^8`. Phase 1. |
| `storybook`, `@storybook/builder-vite`, `@storybook/addon-a11y` | 10.6.0 | Phase 1. |
| `sanity` | 6.12.0 | The handoff says Studio v5; v6 is current and `@sanity/astro` 3.5.1 accepts `^5 \|\| ^6`. Owner decision in the wayfinder map, Phase 2. `engines.node >=22.12`. |
| `@sanity/astro` | 3.5.1 | Peers `astro ^7`, `sanity ^6`, React 18 or 19, `styled-components ^6.1.19`. Phase 2. |
| `@sanity/client` | 8.5.0 | Phase 2. |
| `@sanity/image-url` | 2.1.1 | Phase 4. |
| `@sanity/functions`, `@sanity/blueprints` | 1.7.1, 0.24.0 | Phase 2 functions. |
| `zod` | 4.5.4 | Astro 7 depends on `zod ^4.5.4`; actions in Phase 3 use the same major. |
| `astro-portabletext` | 1.0.0 | Phase 4. |
| `@playwright/test`, `@axe-core/playwright` | 1.63.0, 4.13.0 | Phase 3. |
| `@lhci/cli` | 0.15.1 | Phase 4. |
| `chromatic` | 18.7.2 | Phase 1. |
| `resend` | 6.26.0 | Phase 2 function. |

## Runtime facts

- Node 22 on Vercel: `engines.node` in `package.json` overrides the project setting;
  `22.x` maps to the latest 22.x. Vercel's default for new projects is 24.x and Node 20
  is deprecated on 1 October 2026. Source:
  https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- Astro 7 requires Node 22.12 or later (`engines` on the package). Bun 1.3.10 installs and
  runs scripts; the `astro` and `vitest` binaries run under Node from `PATH`, so Node 22
  must be active (`.node-version`, `.mise.toml`, and `actions/setup-node` in CI).
- Bun workspaces: `"workspaces": ["packages/*"]` in the root `package.json`,
  `workspace:*` for internal dependencies, `bun run --filter <name> <script>` to run a
  workspace script. `--filter '*'` runs the script in every workspace that defines it
  and skips the rest (verified locally). Source: https://bun.com/docs/install/workspaces

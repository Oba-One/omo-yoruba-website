# @oy/web

The site itself: the Astro 7 app that Vercel deploys. It renders every page on the server, reads
content from Sanity, runs the forms and mounts the Sanity Studio at `/admin`. Pages arrange parts
from `@oy/ui` and read content through `@oy/content`, so this package holds no component styling
and no GROQ.

## What lives where

- `astro.config.ts`: server output on the Vercel adapter with route caching, the Sanity and React
  integrations (React serves only the Studio and the Visual Editing overlay), and the env schema.
  Only `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` are required; the config reads them
  from `packages/web/.env` itself and stops without them (runbook, Environments and variables).
- `sanity.config.ts`: hands the environment to the Studio configuration `@oy/content` owns, which
  `@sanity/astro` mounts at `/admin` (`src/lib/paths.ts`, ADR 0017).
- `src/pages/`: one `.astro` file per route, each inside `SiteLayout`, and the API routes:
  `api/revalidate.ts` (the webhook's cache purge), `api/preview/` (draft mode on and off) and
  `api/csp-report.ts`.
- `src/layouts/SiteLayout.astro`: the chrome around every page: the nav, the footer, the Enquiry
  Modal, the Give Dialog, the cross-fade and, in draft mode, the Visual Editing overlay.
- `src/actions/index.ts`: the nine Astro Actions, one per enquiry kind and one for the newsletter.
  The work happens in `src/lib/forms/`, which Vitest drives without Astro (ADR 0019).
- `src/lib/sanity/`: `load-query.ts`, which makes every read with the Viewer token and answers null
  when a read fails, so the page renders Pending; and one pure view builder per page (`homepage.ts`,
  `festival-page.ts` and the rest) that turns a query result into what the library parts take.
- `src/lib/cache.ts` and `cache-policy.ts`: the CDN headers and tags a page sets with `cachePage`,
  and what is never cached (ADR 0021). `src/lib/csp.ts`: the one CSP allow-list.
- `src/middleware.ts`: sends the CSP report-only (ADR 0011), switches the cache off where the policy
  says, and runs the forms' no-JavaScript path.
- `src/components/`: `FormBridge.astro` (hands a form to the actions), `ZeffyEmbed.astro` (the Give
  Dialog's server island) and `Analytics.astro` (PostHog, once a key is set).
- `e2e/` with `playwright.config.ts`: the end-to-end specs. `lighthouserc.cjs` holds the Lighthouse
  budgets, and `vercel.json` pins Vercel's install and build commands.

## Draft mode

The Studio's Presentation tool opens `/api/preview/enable`, which checks its secret and sets the
perspective cookie and a session signed with the Viewer token (ADR 0044). With both, `loadQuery`
reads drafts with stega, the layout mounts the overlay and nothing is cached; a perspective cookie
set by hand, without the session, reads as published. `/api/preview/disable` clears both. The preview host and the checks by
hand: [Studio, preview and Visual Editing](../../docs/runbook.md#studio-preview-and-visual-editing).

## Commands

From the repo root:

| Command | Does |
| --- | --- |
| `bun dev` | the dev server on port 4321, with the Studio at `/admin` |
| `bun run build` | the production build, written to `.vercel/output` |
| `bun run test` | the unit tests (`src/**/*.test.ts`) with every other package's |
| `bun run --filter @oy/web typecheck` | `astro check` |
| `bun e2e` | the Playwright and axe suite |
| `bun run --filter @oy/web lighthouse` | Lighthouse CI against `LIGHTHOUSE_BASE_URL` (runbook, Lighthouse) |

## End-to-end tests

`bun e2e` starts its own dev server on port 4322, leaving a `bun dev` on 4321 alone, and runs every
spec in two Chromium projects: desktop at 1440 and mobile at 375. Install the browser once per
machine with `bunx playwright install chromium`, run from `packages/web` (runbook, Playwright and
axe). Locally, `bun e2e --workers=1` avoids stalls.

The specs must pass in both data modes:

- **Seeded:** the server reads the project in `packages/web/.env`, normally the seeded
  `development` dataset, so the pages show real content.
- **Placeholder:** CI sets `PUBLIC_SANITY_PROJECT_ID=placeholder` and no tokens, so every read
  answers null and every page renders Pending. Locally:
  `PUBLIC_SANITY_PROJECT_ID=placeholder SANITY_API_READ_TOKEN= SANITY_API_WRITE_TOKEN= bun e2e`.

`PLACEHOLDER_PROJECT` in `e2e/helpers.ts` tells a spec which mode it runs in; assert something in
both branches. The specs intercept the form actions, so nothing is written, except the two
no-JavaScript success specs, which run only with `E2E_WRITE=1` against `development`.
`PLAYWRIGHT_TEST_BASE_URL` points the suite at a deployed URL instead. More:
[Playwright and axe](../../docs/runbook.md#playwright-and-axe).

## Rules that matter most here

- A page arranges `@oy/ui` parts and owns only its layout and copy. A new visual treatment goes
  into `@oy/ui` first, and a new query into `@oy/content`.
- Every fact comes from the Studio or renders its Pending chip; nothing is invented.
- Every public page calls `cachePage` with its route, so a publish can purge it.

Building or changing a route: the `oy-page` skill in `.claude/skills/`. Everything else:
[AGENTS.md](../../AGENTS.md) and the [runbook](../../docs/runbook.md).

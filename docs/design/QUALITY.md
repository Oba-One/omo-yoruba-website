# Quality gates

All chosen by the owner. Wire them in Phase 0, keep them green every phase.
Package: `packages/lint` holds the custom checks and shared config; CI runs on
GitHub Actions; hooks via lefthook.

## 1. Static checks

- **TypeScript strict** across all packages. `astro check` in `apps/web`.
  Generated `sanity.types.ts` committed and checked for drift in CI
  (`bun typegen && git diff --exit-code`).
- **Formatter and linter**: Biome (fast, Bun-friendly) for TS, JSON, CSS, plus
  `eslint-plugin-astro` only if Biome cannot cover `.astro` templates at the
  time of setup (verify with the `research` skill; prefer one tool).
- **Em-dash lint** (`bun lint:dash`): fails on U+2014 (and U+2013 used as a
  dash) in `src/**`, `packages/**`, `docs/**`, `*.md`, story files, and
  comments. Allow-list: none. Same check runs as a Sanity validation rule on
  every string and text field, and as the `content-lint` Function warning on
  publish.
- **Yoruba diacritics lint** (`bun lint:yoruba`): `packages/lint/yoruba-terms.json`
  maps bare forms to correct forms: `Oja Balogun → Ọjà Balógun`, `Agbala Omode →
  Àgbàlá Ọmọde`, `Egbe Ibile → Ẹgbẹ́ Ìbílẹ̀`, `E kaabo → Ẹ káàbọ̀`, `E se → Ẹ ṣé`,
  `Omo Yoruba → Omo Yorùbá`, `Odun de → Odunde`, `aso oke → aṣọ òkè`, `adire →
  àdìrẹ` (in prose, not in CSS identifiers or file names), `gele → gèlè` (prose
  only), `Ife → Ifẹ̀`. Scans UI copy, stories, docs, and Sanity content via a GROQ
  query in CI. Exempt: URLs, file paths, CSS class names, code identifiers.
  Warning in Studio, error in repo.
- **Casing lint**: headings and button labels in fixtures and Sanity content
  are sentence case (warns on Title Case with more than two capitalised words,
  ignoring the glossary and proper nouns list).
- **Gold rule**: schema shape allows one `primaryAction` per page. A Playwright
  check counts `.oy-btn--primary` per viewport-height slice and fails if more
  than one is visible at once on any route at 1440 and 375.
- **Colour literal lint**: no hex or rgb literals in `packages/ui` or `apps/web`
  outside `@oy/tokens`. Tokens only.

## 2. Tests

- **Vitest** in `packages/ui`, `packages/content`, `packages/lint`, `apps/web`:
  `enquiry-kinds` spec (every kind has title, blurb, submit, ok, okBody,
  required fields with error phrases), Zod schemas built from it, GROQ query
  constants unique, cache tag derivation, preview cookie logic, lint word list.
  Storybook portable stories via `composeStories` (supported by
  `@storybook-astro/framework`) for render smoke tests.
- **Playwright** in `apps/web/e2e`, against the preview deployment in CI:
  - Every route renders, has one `h1`, nav current state correct, footer present.
  - Nav dropdown: hover, focus, Escape; mobile overlay: open, trap, close, focus
    return.
  - Each enquiry kind: open from a trigger, empty submit shows sentence errors
    and keeps values, valid submit shows "Ẹ ṣé! ✓" and the next-steps line,
    Escape closes, focus returns to the trigger. Actions are intercepted to
    avoid writing to Sanity in CI (or run against a `ci` dataset).
  - Give Dialog: opens from nav and `#give`; fallback appears when the embed
    is blocked.
  - Gallery: album page, `?photo=` deep link opens the lightbox, Back closes,
    arrows move, Escape returns focus.
  - Gala seats button has `target="_blank"` and `rel="noopener"`.
  - No dialog is open on load for any route (except `#give`).
- **Axe** via `@axe-core/playwright` on every route at 375 and 1440, in light
  and with each dialog open. Zero violations. Storybook `addon-a11y` on every
  story.
- **Contrast**: a Playwright helper samples computed colours of text nodes in
  each state (default, hover via `page.hover`, focus) and asserts AA. Gold on
  white is never used for text; the helper flags it.
- **Touch targets**: Playwright asserts every `a`, `button`, `input`, `summary`
  has a 44px minimum box at 375.
- **Chromatic**: runs on every PR from the Storybook build; baselines accepted
  by the owner. Viewports 375 and 1440. Modes: light, and the `OnDark` stories.

## 3. Performance and security

- **Lighthouse CI** (`@lhci/cli`) on every route at mobile and desktop presets
  against the Vercel preview URL. Budgets: performance 90+, accessibility 100,
  best practices 100, SEO 100. LCP under 2.5s on 4G, CLS under 0.05, total JS
  under 60KB gzipped on content pages (islands only where interaction exists).
- **CSP** enforced (`security.csp`). Report-only in preview for one phase, then
  enforce. Allow-list documented in `docs/runbook.md`.
- **Headers**: HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy` via Vercel config.
- **Fonts**: `font-display: swap`, preloaded, subset includes Latin Extended
  Additional (underdots) and combining marks. Test string renders with no
  tofu at every weight.
- **Images**: every image through `<Image>` or Sanity CDN with width, height,
  `loading="lazy"` below the fold, `decoding="async"`, AVIF or WebP.

## 4. Pre-commit (lefthook)

Parallel: Biome format and lint on staged files, `lint:dash`, `lint:yoruba`,
typecheck of touched packages, Vitest related to changed files. Pre-push:
full `bun check`. Commit messages: conventional, no em dashes.

## 5. CI (GitHub Actions)

`ci.yml` on PR: install (Bun, cached), `bun check` (typecheck, lint, unit),
`bun typegen` drift check, build web and Storybook, Chromatic, wait for Vercel
preview, Playwright with axe against preview, Lighthouse CI against preview.
`content-lint.yml` nightly: GROQ scan of production content for em dashes,
bare Yoruba terms, missing alt, unconfirmed credits; posts a summary to the
Pending view and, if configured, an email to the owner.

## 6. Manual gates (owner)

After Phase 1: Storybook renders `.astro` components with the design system
theme. After Phase 4: Visual Editing overlays work on the homepage from Studio
and cache purges within a minute of publish. Before launch: every Pending chip
is either filled or accepted as visible.

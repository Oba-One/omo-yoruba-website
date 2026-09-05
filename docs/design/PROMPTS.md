# Prompts, one per phase

Paste each into a fresh Claude Code session at the repo root. Each prompt
assumes the handoff folder is at `docs/design/` (copy this whole folder there in
Phase 0). Before Phase 0, run once on your machine:

```bash
claude plugins install mattpocock-skills
claude plugins install sanity            # Sanity agent toolkit, official marketplace
npx skills@latest add mattpocock/skills --skill=setup-pre-commit
npx skills@latest add mattpocock/skills --skill=git-guardrails-claude-code
```

Session rules that apply to every prompt (the agent will also find them in
`CLAUDE.md` after Phase 0): no em dashes anywhere; never invent content; `.astro`
components only, stop and ask before any pivot; run `/handoff` before ending a
session and save it to `docs/plans/handoff-<phase>.md`.

---

## Phase 0: bootstrap, agent docs, plan

> Read `docs/design/README.md` and all five companion docs in full. Skim
> `docs/design/design/08 Build Brief.md`. Do not open the prototypes yet.
>
> Run `/setup-matt-pocock-skills`: tracker is local files in `docs/tickets/`,
> docs in `docs/`, labels bug, content, design, infra, later.
>
> Then run `/wayfinder` against the ten phases in README section 6 and write the
> decision map to `docs/plans/wayfinder.md`. Where the map needs a decision from
> me, list it and stop; do not guess.
>
> Then bootstrap the repo per README section 5: Bun workspaces, `apps/web`
> (Astro 7 latest, `@astrojs/vercel`, `output: 'server'`, `astro:env` schema
> from README section 7, `security.csp` in report-only, PostHog wired behind
> `PUBLIC_POSTHOG_KEY`), `apps/storybook` (empty config for now),
> `packages/tokens`, `packages/ui`, `packages/content`, `packages/lint`. Node 22
> runtime, Bun for install and scripts. Verify each package version against its
> primary docs with the `research` skill before pinning; save findings in
> `docs/research/`.
>
> Write the agent docs exactly as `docs/design/AGENT-DOCS.md` specifies:
> `CLAUDE.md`, `CONTEXT.md`, ADRs 1 to 10 in `docs/adr/`, the seven repo skills
> in `.claude/skills/`, `.mcp.json` for Sanity, `docs/runbook.md` stub.
>
> Wire the quality gates from `docs/design/QUALITY.md` sections 1, 4 and 5: Biome,
> em-dash lint, Yoruba diacritics lint with the word list, colour literal lint,
> lefthook pre-commit, GitHub Actions `ci.yml`. Use `/tdd` for the two lint
> scripts.
>
> Generate a `wizard` for the steps only I can do: create the Sanity project and
> dataset and tokens, link Vercel and add env vars, create the Resend domain,
> PostHog project, Chromatic token. Save it as `scripts/setup-wizard.sh`.
>
> Run `/code-review` on the whole diff, commit, then stop. I will review the
> repo shape, docs and the wayfinder map before Phase 1.

## Phase 1: tokens and the Storybook proof

> Read `CLAUDE.md`, `CONTEXT.md`, `docs/plans/wayfinder.md`, and
> `docs/design/COMPONENT-MAP.md`. Open `docs/design/design/01 Components.dc.html`
> and `docs/design/design/oy-components.css`, and the CSS under
> `docs/design/design/_ds/.../tokens/` and `css/`.
>
> Run `/to-tickets` for Phase 1 and work them with `/implement`.
>
> Port the design system CSS into `@oy/tokens`: tokens, base, components, then
> `oy-components.css` on top (it wins on conflict: 6px card radius, no hover
> lift, grain-dots). Ship a plain `fonts.css` for Source Serif 4 and Source Sans
> 3 with Noto fallbacks so Storybook can load faces without `astro:fonts`. Copy
> the pattern SVGs in.
>
> Stand up `apps/storybook` with `@storybook-astro/framework` and
> `@storybook/builder-vite`, stories discovered from `packages/ui/src/**`.
> Theme the manager exactly as the bottom of `COMPONENT-MAP.md` specifies and
> load `@oy/tokens` in the preview. Backgrounds: white, paper, indigo-900 with an
> `.oy-dark` decorator. Add `addon-a11y`.
>
> Build, with colocated stories and tests: `Kicker`, `Button` (all variants and
> states), `Divider`, `Pending`, `PatternBand`, `ImagePlaceholder`, `Logo`.
> Every story file has Default, each variant, Pending where it applies, OnDark.
> Render the diacritics test string in the Kicker and Button stories.
>
> Wire Chromatic in CI. Run `/code-review`, commit, and **stop**. Tell me plainly
> whether `.astro` components hold up in this Storybook framework, what is
> stubbed, and anything that needed a workaround. Do not pivot to any other
> component format without my answer.

## Phase 2: content model

> Read `CLAUDE.md`, `CONTEXT.md`, `docs/design/CONTENT-MODEL.md` in full, and
> `docs/design/design/19 Mock Content Register.dc.html`. Open
> `docs/design/design/Enquiry Modal.dc.html` and read the `FORMS` object.
>
> Run `/grill-with-docs` on the content model first: challenge the shared
> objects, the singleton list, the Pending rule, and the enquiry document shape
> against how I will actually edit. Update `CONTEXT.md` and add ADRs as
> decisions land. Then `/to-tickets` and `/implement`.
>
> Build in `@oy/content`: every object, singleton and document type from the
> CONTENT-MODEL doc with `defineType`; validation rules (no em dash, diacritics
> warning, sentence case warning, alt required); `enquiry-kinds.ts` as the one
> spec that will drive schema, Zod, markup and stories; Studio structure per
> section 5 including the Pending view; Presentation tool config with locations
> for every route; TypeGen wired with `bun typegen` and a drift check in CI.
>
> Embed the Studio in `apps/web` at `/admin` with `@sanity/astro`. Add
> `/api/preview/enable` and `/api/preview/disable`, and `/api/revalidate` for
> the webhook (cache purge can be a stub until Phase 4).
>
> Write `packages/content/scripts/seed.ts` per CONTENT-MODEL section 6:
> confirmed facts only, photographs from `docs/design/design/images/w2/` with
> captions from the register and `creditConfirmed: false`, deterministic ids,
> idempotent. Run it against the development dataset.
>
> Write the two Sanity Functions: `enquiry-notify` (create on `enquiry`, send via
> Resend to the routing address for that kind from `siteSettings.contacts`,
> patch `notifiedAt`) and `content-lint` (warn on publish). Use `/tdd` on the
> pure parts.
>
> `/code-review`, commit, stop. Show me the Studio running and the Pending view.

## Phase 3: site chrome and the forms seam

> Read `CLAUDE.md`, `CONTEXT.md`, `docs/design/ROUTES-AND-INTERACTIONS.md`
> sections 2 and 3, `COMPONENT-MAP.md` "Page structure" and "Forms and dialogs".
> Open `Site Nav.dc.html`, `Site Footer.dc.html`, `Enquiry Modal.dc.html`,
> `Give Dialog.dc.html` in `docs/design/design/`.
>
> `/to-tickets`, then `/implement`. Build in `@oy/ui` with stories and tests:
> `SiteNav` (dropdown, mobile overlay, current state), `SiteFooter`,
> `NewsletterForm`, `Field`, `EnquiryCard`, `EnquiryModal` (one shell, eight
> field sets from `enquiry-kinds.ts`, five states, dialog on desktop and bottom
> sheet under 720px, focus trap, Escape, focus return), `GiveDialog` (Zeffy
> embed as a server island with the 4s fallback).
>
> In `apps/web`: `SiteLayout.astro` mounting nav, footer, both dialogs,
> `<ClientRouter>` cross-fade at 380ms honouring reduced motion, the gold
> progress bar, PostHog events from ROUTES section 2. Astro Actions for the
> eight enquiry kinds and the newsletter: Zod from the spec, write to Sanity
> with the write token, return the success copy; forms work without JS first.
> `#give` opens the Give Dialog on load.
>
> Playwright: every form's five states, focus management, no dialog open on
> load. Axe on the layout with each dialog open. Confirm an enquiry produces a
> Sanity document and an email end to end.
>
> `/code-review`, commit, stop.

## Phase 4: homepage, Visual Editing, caching

> Read `CLAUDE.md`, `CONTEXT.md`, ROUTES sections 1, 4 and 5 for the homepage,
> and open `docs/design/design/02 Homepage.dc.html`. This is the fidelity bar.
>
> `/to-tickets`, `/implement`. Build the remaining homepage components in
> `@oy/ui` (`Hero`, `EventBand`, `StatStrip`, `ProgramCard`, `PullQuote`,
> `NewsCard`, `PhotoTile`, `DoorCard`, `PathRow`) with stories, then compose `/`
> in `apps/web` from Sanity with `defineQuery`. Every layout option from ROUTES
> section 5 for the homepage is read from the `homepage` singleton and has a
> page-section story.
>
> Wire Visual Editing: stega on the loader, `<SanityVisualEditing />`, draft
> cookie, Presentation tool opening `/` with click-to-edit on every field.
> Wire route caching with `Astro.cache`, the Vercel cache provider, cache tags
> per document type, and the `/api/revalidate` purge. Prove publish-to-purge in
> under a minute on a Vercel preview.
>
> Playwright and axe on `/` at 375 and 1440. Lighthouse against the preview;
> hit the budgets in QUALITY section 3. `/code-review`, commit, stop. I will
> check Visual Editing and the cache myself.

## Phase 5: event pages

> Read `CLAUDE.md`, `CONTEXT.md`, ROUTES for `/odunde` and `/gala`, and open
> `08 Odunde Festival.dc.html`, `09 End-of-Year Gala.dc.html`,
> `Photo Carousel.dc.html`. `/to-tickets`, `/implement`.
>
> Build `PageHeader` (slim and photo band), `GlanceStrip`, `ZoneCard` with the
> four layouts, `ScheduleRow`, `TakePartBand` (rows, label styles, accent per
> way in, reorderable), `TicketTierCard` (buy-now and enquiry), `PartnerRow`,
> `PhotoCarousel`, `Handoff`. Then the two routes, every layout option, Pending
> chips for every empty field (dates, prices, venue, zones three and four).
> Gala seats open Eventbrite in a new tab; tables open the `table` enquiry.
> Both pages close with the same take-part band reordered.
>
> Playwright, axe, Lighthouse on both. `/code-review`, commit, stop.

## Phase 6: programs

> Read ROUTES for `/programs`, `/programs/yoruba-lessons`,
> `/programs/cultural-collective`; open `10`, `11`, `12` in
> `docs/design/design/`. `/to-tickets`, `/implement`.
>
> Build `YearStrip`, `PersonCard` (portrait, no portrait, compact), `Accordion`,
> `ContactBlock`. Then the three routes. Lessons: one teacher, online, write to
> enrol, no terms or venue. Collective: green scope only here, member-led label,
> status lines and events hideable. Every program page closes with enrol,
> volunteer, give.
>
> Playwright, axe, Lighthouse. `/code-review`, commit, stop.

## Phase 7: conversion and trust

> Read ROUTES for `/get-involved`, `/impact`, `/our-story`, `/donate`; open
> `13`, `14`, `15`, `16`. `/to-tickets`, `/implement`.
>
> Build `OutcomeCard` (figure with source, or plain statement), `Timeline`,
> `ListRow`. Then the four routes. Impact: every figure carries a source line or
> says it is not yet measured; governance block reads from `governanceDoc`.
> Our Story: timeline hideable, bios short or full, portraits optional. Donate:
> one gold "Give now" opening the Give Dialog, partner and sponsor doors, other
> ways to give. Every page that makes a claim links to Impact; every page that
> shows a face links to Our Story.
>
> Playwright, axe, Lighthouse. `/code-review`, commit, stop.

## Phase 8: gallery

> Read ROUTES for `/gallery` and `/gallery/[album]`; open `18 Photo Gallery.dc.html`.
> `/to-tickets`, `/implement`.
>
> Build `AlbumTile` (captions always or hover, density) and `Lightbox`
> (`<dialog>`, arrows, swipe, Escape, `?photo=` deep link with `pushState`, Back
> closes, focus return, caption and credit). Then the two routes, the `soon`
> state, credits and consent copy from `gallerySettings`.
>
> Playwright covers the deep link and history. Axe with the lightbox open.
> `/code-review`, commit, stop.

## Phase 9: hardening

> Read `docs/design/QUALITY.md` in full and `docs/runbook.md`. Run
> `/improve-codebase-architecture` first and bring me the candidates before
> changing anything.
>
> Then: Lighthouse budgets on every route at both presets; axe clean everywhere;
> the contrast and 44px target helpers in Playwright; the gold rule check; CSP
> from report-only to enforce with the allow-list documented; security headers;
> 404 page; sitemap and robots; OG images; redirects from the list I supply in
> `docs/redirects.md`. Accept Chromatic baselines with me. Nightly
> `content-lint.yml`.
>
> `/code-review`, commit, stop.

## Phase 10: content operations

> Read `CONTENT-MODEL.md` section 7 and the `oy-content-ops` skill. Write
> `docs/content-ops.md` for editors who are not developers: add a news post, an
> event edition via a Content Release, an album, a person; clear a Pending item;
> what never to do. Then, with me in the session, use the Sanity MCP to add one
> real news post, one album and one person from my instructions, and confirm
> each appears on the site after purge. Update `CLAUDE.md`, `CONTEXT.md` and the
> ADRs so they describe the system as built. Run `/handoff`.

---

## When a phase stalls

- A library does not behave as documented: `diagnosing-bugs`, then `research`
  against primary docs, then tell me. Do not swap libraries.
- A prototype and a doc disagree: `oy-components.css` beats `_ds/`; the Build
  Brief's polish passes beat the wireframes; this handoff beats the design
  system readme. Say which you followed.
- Content is missing: render Pending, add it to the Studio Pending view, move on.
- A design question the prototypes do not answer: build a throwaway with
  `prototype`, show me, wait.

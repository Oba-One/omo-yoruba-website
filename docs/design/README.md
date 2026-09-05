# Handoff: omoyorubaofsocal.org on Astro 7 + Sanity

Build brief for a coding agent (Claude Code) bootstrapping the production repo for
**Omo Yorùbá of Southern California**, a 501(c)(3) founded 1997 in Los Angeles.
Written 4 September 2026. Every decision below was confirmed with the owner unless
marked "open".

Read this file first, then the five companion docs, then the design files in `design/`.

| File | What it holds |
| --- | --- |
| `README.md` | Decisions, stack, repo shape, build order, done criteria, the first prompt |
| `ROUTES-AND-INTERACTIONS.md` | Every route, every form and modal, money handoffs, tweak-to-CMS mapping |
| `CONTENT-MODEL.md` | Sanity schema map, placeholder pattern, seeding rules, content ops with AI |
| `COMPONENT-MAP.md` | Component inventory: source file, Astro path, props, states, story |
| `AGENT-DOCS.md` | The repo's own CLAUDE.md, CONTEXT.md, skills, ADRs, and MCP config to write |
| `QUALITY.md` | Lints, tests, CI, Lighthouse, pre-commit |
| `PROMPTS.md` | One paste-ready Claude Code prompt per phase, plus stall rules |
| `design/` | The design references (HTML prototypes, design system, CSS, photos) |

## 1. What this is

Eleven designed pages plus site chrome, a component library, and a content
register, all built as HTML prototypes at high fidelity. The job is to recreate
them in a real codebase: **Astro 7** front end, **Sanity** content, **Storybook**
component library, deployed on **Vercel**, with agent documentation good enough
that future sessions can add pages and content without re-learning the system.

The site's three jobs, in order: prove legitimacy and impact to grant reviewers in
under two minutes; make joining obvious; run vendor, sponsor and ticket funnels for
the Odunde Festival (June, Leimert Park) and the End-of-Year Gala (Nov/Dec).

## 2. About the design files

The files in `design/` are **design references built in HTML**, not production
code. They show intended look and behaviour. Recreate them in Astro using the
patterns this brief sets. Three layers exist, and they differ in how directly
they port:

1. `design/_ds/.../tokens/*.css`, `css/base.css`, `css/components.css`,
   `design/oy-components.css`: **real CSS**. Port these nearly verbatim into the
   tokens package and component styles. `oy-components.css` overrides the design
   system in places (card radius 6px, no hover lift, grain-dots card texture);
   where they conflict, `oy-components.css` wins.
2. `design/*.dc.html`: the pages and shared parts, written in a template dialect
   (`{{ holes }}`, `<sc-if>`, `<sc-for>`, `<dc-import>`, inline styles). Read the
   markup, class names, copy, and inline layout styles. Ignore the runtime
   (`support.js`) and the `<script data-dc-script>` logic except as a description
   of states and behaviour.
3. `design/_ds/.../_ds_bundle.js`: the design system's React components. Read for
   props and markup shape only. Do not ship React; components are `.astro`.

**Fidelity: high.** Match the prototypes pixel-for-pixel at 375px and 1440px,
including hover, focus, error and success states.

## 3. Decisions (confirmed)

| Area | Decision |
| --- | --- |
| Framework | Astro 7 (stable since June 2026). Node 22+. Use the latest 7.x. |
| Hosting | Vercel, `@astrojs/vercel` adapter, domain managed in Vercel |
| Rendering | `output: 'server'` with route caching (`Astro.cache`, stable in 7) and the Vercel CDN cache provider. Visual Editing needs SSR; caching keeps it cheap. |
| CMS | Sanity, Studio v5 **embedded at `/admin`** via `@sanity/astro` `studioBasePath` |
| Editing | Presentation tool + Visual Editing (stega, click-to-edit, draft mode via cookie) |
| Components | **All `.astro`**. Storybook via `@storybook-astro/framework`. Stories colocated with component code. |
| Storybook pivot policy | If the Astro framework blocks a component, **stop and ask the owner** before any pivot (no silent move to islands). |
| Forms | Astro Actions write **enquiry documents into Sanity**, then a **Sanity Function** fires on create and sends email via **Resend** |
| Seeding | Seed **only confirmed facts** and the real photographs. Every pending value stays empty and the site renders a named placeholder. |
| Repo | **Bun workspaces monorepo** (`apps/*`, `packages/*`). Bun for install and scripts; Node 22 runtime for Astro and Vercel builds. |
| Agent | Claude Code. Matt Pocock's skills via the official plugin. Issue tracker: **local files**. |
| Analytics | PostHog (`posthog-js`), loaded client-side, no cookie banner needed for US nonprofit unless owner says otherwise |
| Quality | Vitest, Playwright, Storybook + Chromatic, axe, Lighthouse CI, Yoruba diacritics lint, em-dash lint, pre-commit hooks |
| Editors | Owner (technical, works with AI) plus org members adding images, news, events periodically |

### Decisions inherited from the design work (binding)

These override the design system readme where they conflict:

- **"Odunde" is one word** in all display text (decision 1 Sep 2026). The design
  system readme still says "Odun De". The nav shows it with marks: "Ọdúndé Festival".
- Cards: **6px** radius, paper ground, indigo hairline, 8px aṣọ òkè top edge,
  grain-dots texture (`data-card="grain-dots"` on the page root). Not 14px.
- **No hover lift anywhere.** Buttons darken or fill and settle 1.5% on press.
  Cards change border colour. Photos never zoom.
- Nav: Events dropdown (Ọdúndé Festival, End-of-Year Gala), Programs, Get
  Involved, Impact, Our Story, gold Donate button. Contact lives in the footer only.
  Flattened to a full-screen overlay under 760px.
- Logo exists now: `design/images/logo-mark.png` (Ifẹ̀ bronze head, 40px in nav)
  plus the wordmark in Source Serif on two lines; second line hides under 1060px.
- **Every Donate button opens the Give Dialog**, which wraps Zeffy's embed. If the
  embed fails, the dialog offers Contact and a mailing address. `#give` in the URL
  opens it on load.
- **Every form opens the Enquiry Modal** (dialog on desktop, bottom sheet under
  720px) from a card that first explains what it asks. Eight field sets: sponsor,
  performer, table, member, volunteer, enrol, vendor, contact.
- Yoruba Language Lessons (not "School"): one teacher, live online, times and
  fees agreed with her directly. No terms, no Saturdays, no venue.
- Gallery: album mosaic, no filters, opening an album opens the viewer, credits
  per album.
- Page 17 News & Events is wireframed but **not built**. Posting cadence decides
  feed vs list; build the schema now, the page later.

### Non-negotiables from the design system

- Full diacritics on every Yoruba word: Ọjà Balógun, Àgbàlá Ọmọde, Ẹgbẹ́ Ìbílẹ̀,
  Ẹ káàbọ̀, Ẹ ṣé. Type must render the test string cleanly at every size:
  "Ẹ káàbọ̀ sí Ọjà Balógun, Àgbàlá Ọmọde àti Ẹgbẹ́ Ìbílẹ̀. Odún dé! Ẹ ṣeun."
- Indigo carries 60 to 70 percent of visual weight. Gold `#E8A13A` is for actions
  and celebration only, one gold primary action per screen view, never body text on
  light. Terracotta `#B4552D` warms kickers and festival moments. Green `#2E7D5B`
  stays inside Cultural Collective content.
- Pattern is texture, never costume: àdìrẹ dot fields, aṣọ òkè stripes, ayo dot
  rows, all low opacity. Never kente, never Adinkra.
- The elder test: WCAG AA, 17px minimum body, 44px minimum touch targets.
- No em dashes anywhere (UI copy, code comments, docs). No emoji. Glyphs are
  limited to • → ✓ ×. Sentence case for headings and buttons; kickers and path
  chips are the only uppercase text.
- Success on every owned form opens with "Ẹ ṣé! ✓" then a plain sentence saying
  what happens next. Errors are sentences naming the field, never colour alone,
  and never clear what was typed. Every form shows a human fallback beside it.
- Nothing opens on load: no entry pop-up, no scroll-triggered newsletter, no exit
  intent. (`#give` is the one URL-driven exception.)
- Type: Source Serif 4 (headings 600/700), Source Sans 3 (body 400/600/700),
  fallback through Noto Serif / Noto Sans (guaranteed diacritics), then Georgia /
  system-ui. Hero 44 to 64px, H2 32 to 40, H3 20 to 24, body 17 to 18, kicker 12px
  uppercase 0.15em tracking bold. Line-height 1.15 headings, 1.6 body.
- Spacing on an 8px grid, section padding 72 to 96px desktop and 48px mobile,
  content width 1100px.

## 4. Stack detail

### Astro 7 features to use

- `output: 'server'` + `@astrojs/vercel`. Route caching (`Astro.cache`) on every
  public page with `s-maxage` and stale-while-revalidate; a Sanity webhook hits a
  purge endpoint on publish. Studio, preview, and action routes are uncached.
- **Live content collections** (stable in 6, use in 7) with a Sanity loader for
  documents queried per request: news, events, albums, people. Page singletons can
  use a plain `loadQuery` helper from `@sanity/astro`.
- **Astro Actions** (`astro:actions`) for the eight enquiry forms and the
  newsletter, with Zod input schemas generated from the same field specs the
  Enquiry Modal uses. Actions validate, write the Sanity document, and return
  the success copy. Forms work without JS (progressive enhancement), then enhance.
- **Fonts API** (`astro:fonts`) for Source Serif 4 and Source Sans 3 with the Noto
  fallbacks and `font-display: swap`. Storybook stubs this module; the tokens
  package must also ship a plain `fonts.css` so stories render the real faces.
- **CSP** (`security.csp`) on. Allow-list Sanity CDN, Zeffy, Eventbrite, PostHog,
  Google Fonts if used. Nonce or hash inline scripts.
- **`astro:env`** schema for every environment variable (list in section 7).
- **Server islands** for the Give Dialog's Zeffy embed and anything that must not
  block the cached HTML.
- `<ClientRouter>` for the modest cross-fade between pages (380ms, honours
  `prefers-reduced-motion`). No other page-level motion.
- `<Image>` with Sanity's CDN as a remote pattern; use `@sanity/image-url` for
  hotspot and crop. Square image containers in cards, fixed aspect ratios everywhere.
- Astro 7 detects coding agents and can run the dev server in the background with
  structured JSON logs. Use it: the agent should never leave `astro dev` in the
  foreground of its shell.
- Sätteri is the default Markdown pipeline. We have no remark plugins; do not add
  `remark` unless a real need appears.

### Sanity

- Studio v5, embedded at `/admin` with `@sanity/astro`. Structure tool with
  singletons pinned at the top, then Events, Programs, People, News, Gallery,
  Enquiries, Settings.
- **TypeGen** (GA) runs in the content package: `sanity schema extract` then
  `sanity typegen generate`. Every GROQ query uses `defineQuery` with a unique
  name. `client.fetch` returns typed results.
- **Presentation tool** with `previewUrl` pointing at the Vercel deployment,
  document location resolvers for every page type, and `/api/preview/enable` and
  `/api/preview/disable` routes that set the draft cookie. `<SanityVisualEditing />`
  reloads on mutation (Astro has no Live Content API equivalent; a reload is the
  documented pattern).
- **Sanity Functions** (Blueprints) in the content package: `enquiry-notify`
  triggers on `enquiry` document create and sends a Resend email to the routing
  address for that enquiry kind, then patches `notifiedAt`. A second function,
  `content-lint`, warns on publish when a string field contains an em dash or a
  known Yoruba term without its marks (same word list as the repo lint).
- **Content Releases** for seasonal content: "Odunde 2027", "Gala 2026". Editors
  stage the date, schedule, zones and tiers in a release and publish on one day.
- **Agent Actions** (experimental, AI credits): optional, owner-triggered only.
  Two candidates: draft alt text for uploaded photos; suggest a Yoruba kicker
  translation for a new news post. Never auto-run on publish.
- **MCP**: `.mcp.json` in the repo root pointing Claude Code at
  `https://mcp.sanity.io` (OAuth). Install the Sanity agent-toolkit plugin from
  the official marketplace. This is how the owner will add news, events and
  photos by conversation.
- Validation rules in schema: required alt text on every image, no em dash in any
  string, diacritics warning on Yoruba fields, one gold primary action per page
  (enforced by schema shape, not validation: a page has one `primaryAction`).

### Storybook

- `@storybook-astro/framework` with `@storybook/builder-vite`. Stories live next
  to components: `Button.astro`, `Button.stories.ts`, `Button.test.ts`.
- **Storybook adopts the design system.** Manager theme via `@storybook/theming`
  `create()`: brand title "Omo Yorùbá components", indigo-700 app bar, paper
  content background, gold-500 accent, Source Sans 3 UI font, Source Serif 4 for
  headings in docs. Preview loads `packages/tokens` CSS and the font files;
  `docs` pages use the design system's own heading and body styles. Backgrounds
  addon offers white, paper, indigo-900 (with `.oy-dark` decorator).
- Stories cover every variant and state listed in `COMPONENT-MAP.md`: default,
  hover (via `parameters.pseudo`), focus, error, success, empty, with and without
  photo, dark scope. Each story's `play` function exercises keyboard behaviour
  where it exists (menu, modal, accordion, lightbox).
- Known limits of the framework: `astro:assets` and `astro:fonts` are stubbed in
  stories. Components accept `ImageMetadata | string` for images so a story can
  pass a URL. If a component cannot render in Storybook after a reasonable
  attempt, **stop and ask**.
- Storybook builds to a second Vercel project (`apps/storybook` output) so the
  owner can visit it. Chromatic runs on PRs.

## 5. Repo shape

Bun workspaces. Package names under the `@oy/` scope.

```
omoyoruba-site/
  apps/
    web/                    Astro 7 site + embedded Studio at /admin
      src/pages/            routes (see ROUTES-AND-INTERACTIONS.md)
      src/layouts/          SiteLayout.astro (nav, footer, dialogs, analytics)
      src/actions/          enquiry.ts, newsletter.ts
      src/lib/sanity/       client, loadQuery, live loaders, image builder, preview
      src/content.config.ts live collections
      astro.config.ts       vercel adapter, sanity integration, fonts, csp, cache
      sanity.config.ts      Studio config (imports schema from @oy/content)
    storybook/              .storybook/ config + theme; stories are discovered
                            from packages/ui via glob; builds static output
  packages/
    tokens/                 colors.css, typography.css, spacing.css, patterns.css,
                            themes.css, fonts.css, base.css, plus the ported
                            components.css and oy-components.css, and the
                            pattern SVGs from design/images/patterns
    ui/                     .astro components, colocated *.stories.ts and *.test.ts,
                            grouped: core/ cards/ bands/ forms/ media/ navigation/
                            content/ page/ (see COMPONENT-MAP.md)
    content/                Sanity schema (defineType), structure, GROQ queries
                            (defineQuery), sanity.types.ts (generated), seed script,
                            functions/ (Blueprints), releases notes
    lint/                   yoruba-terms.json, em-dash and diacritics checkers,
                            shared oxlint/biome config, lefthook config
  docs/                     ADRs, plans, tickets (local files tracker), content ops
  .claude/                  skills/ (repo-local), settings
  .mcp.json                 Sanity MCP server
  CLAUDE.md  CONTEXT.md  README.md
  bunfig.toml  package.json (workspaces)  turbo.json (optional, only if builds
                            get slow)
```

Rules that keep the shape honest:

- `apps/web` imports components from `@oy/ui` and styles from `@oy/tokens`. It
  owns pages, layouts, data loading and actions. It owns **no** component styling.
- `packages/ui` owns every visual component and its stories. It imports nothing
  from `apps/web`. It may import types from `@oy/content` (generated).
- `packages/content` owns the content model and is the only place GROQ lives.
- If a page needs a new visual treatment, it goes into `@oy/ui` first, with a
  story, then the page uses it. Same rule the design work followed.

## 6. Build order

Ten phases, each a tracer bullet that ends deployable. Use Matt Pocock's
`/wayfinder` to lay this out as decision tickets, then `/to-tickets` per phase,
`/implement` per ticket, `/code-review` before every commit. Phase 0 and Phase 1
each end with a **stop-and-ask checkpoint** for the owner.

**Phase 0, bootstrap and agent docs.** Bun workspace, packages scaffolded, Astro 7
`apps/web` with Vercel adapter and `output: 'server'`, `astro:env` schema,
CSP on, CI on GitHub Actions (typecheck, lint, test, build, Lighthouse), Vercel
project linked, PostHog wired. Install Matt's plugin, run
`/setup-matt-pocock-skills` (local files, docs in `docs/`). Write `CLAUDE.md`,
`CONTEXT.md`, the ADRs and repo skills listed in `AGENT-DOCS.md`. Lints from
`QUALITY.md` running in pre-commit. Checkpoint: owner reviews repo shape and docs.

**Phase 1, tokens and Storybook proof.** Port the CSS into `@oy/tokens`. Stand up
Storybook with the design system theme. Build Kicker, Button (primary, secondary,
quiet, small; hover, focus, pressed, disabled), Divider (aṣọ òkè), ImagePlaceholder,
Pending chip. Stories, tests, Chromatic. **Checkpoint: does `.astro` in Storybook
hold up?** If anything blocked, report and wait.

**Phase 2, content model.** Schema in `@oy/content` per `CONTENT-MODEL.md`.
Studio at `/admin` with structure, singletons, releases. TypeGen wired. Seed
script uploads the photographs with captions and credits (marked "to confirm")
and writes the confirmed facts only. Pending dashboard in Studio. Validation
rules. `enquiry-notify` and `content-lint` functions deployed.

**Phase 3, site chrome and the forms seam.** SiteLayout, SiteNav (dropdown,
mobile overlay, current-page state), SiteFooter (newsletter, trust line,
socials), Give Dialog (server island around Zeffy embed, fallback), Enquiry Modal
shell with all eight field sets driven by one spec, Astro Actions writing
`enquiry` documents, email arriving via Resend. Focus trap, Escape, focus return,
bottom sheet under 720px. Playwright covers each form's five states.

**Phase 4, homepage.** `02 Homepage.dc.html` end to end from Sanity, with
Visual Editing working in Presentation, route caching and webhook purge proven.
Every tweak prop becomes a Studio option (`ROUTES-AND-INTERACTIONS.md` section 5).

**Phase 5, event pages.** Odunde (page header photo band, at-a-glance, zones
mosaic, schedule, plan your visit, take-part band, past years carousel, partners)
and Gala (running order, tiers, sponsor levels, honourees, past galas). These
prove the shared components.

**Phase 6, programs.** Programs hub (cards, inline Kids & STEM and Cultural
Exchange, year strip), Yoruba Language Lessons, Cultural Collective (green scope).

**Phase 7, conversion and trust.** Get Involved (doors, hometown associations,
human fallback), Impact (stat strip, outcomes, governance, funders), Our Story
(founding, timeline, board, staff, reach us), Donate (Give now, larger gifts,
what your gift does, other ways, tax line).

**Phase 8, gallery.** Album mosaic, album pages, deep-linkable lightbox
(`?photo=` in the URL, history-aware), credits and consent copy, `state: soon`
variant for empty gallery.

**Phase 9, hardening.** Lighthouse budgets met on every route at 375 and 1440,
axe clean, contrast audit of every state, CSP report-only then enforce, 404
page, sitemap, robots, OG images, redirects from the old site (owner supplies
old URLs). Playwright full run. Chromatic baselines accepted.

**Phase 10, content operations.** `docs/content-ops.md`: how to add a news post,
an event, an album, a person; how to run a seasonal release; how to use the
Sanity MCP from Claude Code to do all of that by conversation; what "pending"
means and how to clear it. Walk the owner through it once.

News & Events (page 17) is a later phase once posting cadence is known. Schema
ships in Phase 2 so posts can be authored before the page exists.

## 7. Environment variables (`astro:env` schema)

Client, public: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`,
`PUBLIC_SITE_URL`, `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`,
`PUBLIC_ZEFFY_EMBED_URL`, `PUBLIC_EVENTBRITE_URL` (may be empty until supplied).

Server, secret: `SANITY_API_READ_TOKEN` (Viewer, for stega and drafts),
`SANITY_API_WRITE_TOKEN` (Editor, scoped to `enquiry` and `subscriber` writes,
used only by actions), `SANITY_PREVIEW_SECRET`, `SANITY_WEBHOOK_SECRET`,
`RESEND_API_KEY` (lives in the Sanity Function env, not in Astro).

## 8. Done means

- Every route in `ROUTES-AND-INTERACTIONS.md` renders from Sanity, matches its
  prototype block for block at 375px and 1440px, and shows a named placeholder
  wherever the client still owes content.
- Every component in `COMPONENT-MAP.md` exists once in `@oy/ui` with a colocated
  story covering its variants and states, and Storybook is deployed and themed.
- Visual Editing works from Studio for every page type; route caching serves
  cached HTML to the public and purges on publish.
- All eight enquiry kinds create a Sanity document and an email within a minute;
  the newsletter form does the same into `subscriber`.
- Lighthouse: performance 90+, accessibility 100, best practices 100 on every
  route. Axe clean. AA contrast in every state. 44px targets everywhere.
- Lints pass: no em dash, no bare Yoruba term, no gold body text, one gold
  primary action per page (checked by the schema shape).
- `CLAUDE.md`, `CONTEXT.md`, ADRs, and repo skills exist and describe the real
  system, so a fresh session can add a page from a wireframe alone.
- The owner can add a news post, an event and an album from Claude Code via the
  Sanity MCP without opening code.

## 9. Open questions to raise with the owner (do not decide silently)

1. Newsletter provider. The design stores subscribers; nothing sends. Sanity
   `subscriber` docs plus a later export is the default until a provider is named.
2. Real EIN, mailing address, phone, and the routing email per enquiry kind.
   Until supplied, the routing address is one owner inbox and the site shows
   "XX-XXXXXXX" and placeholders.
3. Zeffy embed URL and Eventbrite event URL.
4. Whether Gala tables are an enquiry (current design) or a purchase.
5. The two unnamed festival zones (current design shows four zones, one removed).
6. Whether the Gala gives awards; if not, hide the honourees block by default.
7. Timeline on Our Story: designed and hideable, default shown; owner to confirm.
8. News cadence: decides feed vs list for page 17.
9. Photo credits: Red Carpet Media (Odunde 2026, assumed), members' phones (Gala
   2025), archive (summer camp, year unknown). All marked "to confirm" in seed.
10. Old site URLs for redirects.
11. Storybook hosting: separate Vercel project (default) or a path under the site.
12. Any GitHub org or naming preference for the repo.

## 10. Prompt to open the first Claude Code session

`PROMPTS.md` has one prompt per phase. The short form of Phase 0, after
`claude plugins install mattpocock-skills` and installing the Sanity plugin from
the marketplace:

> Read `design_handoff_astro_sanity/README.md` and its five companion docs in
> full, then skim `design/08 Build Brief.md` and open `design/01 Components.dc.html`,
> `design/02 Homepage.dc.html` and `design/oy-components.css`. This is a
> greenfield Bun-workspaces monorepo for an Astro 7 + Sanity site on Vercel with
> Storybook via `@storybook-astro/framework`. Run `/setup-matt-pocock-skills` with
> local files as the tracker and `docs/` for docs. Then run `/wayfinder` against
> the ten phases in README section 6 and write the decision map to `docs/`. Stop
> after Phase 0 and again after Phase 1 for my review, and stop before any pivot
> away from `.astro` components in Storybook. Follow every non-negotiable in
> README section 3 and every rule in `QUALITY.md`. No em dashes anywhere.

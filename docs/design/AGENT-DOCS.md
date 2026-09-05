# Agent documentation to write into the repo

The repo must be as easy for a future agent session to work in as for the owner.
Phase 0 writes these files; every later phase keeps them true. Follow Matt
Pocock's `writing-for-agents` skill for tone and structure: short, operative,
pointers over prose, no em dashes.

## 1. Matt Pocock's skills

Install once: `claude plugins install mattpocock-skills` (official marketplace,
auto-updates). Do not also install via `npx skills add` or every skill appears
twice. Then in the repo run `/setup-matt-pocock-skills`: issue tracker **local
files** (tickets under `docs/tickets/`), docs under `docs/`, triage labels
`bug`, `content`, `design`, `infra`, `later`.

Skills that fit this repo and when to reach for them:

| Skill | Use it for |
| --- | --- |
| `/wayfinder` | Planning the whole build (larger than one session) as decision tickets. Run once at the start against README section 6. |
| `/grill-with-docs` | Before any phase with real ambiguity (forms seam, caching, Storybook theming). Builds `CONTEXT.md` vocabulary and ADRs as it goes. |
| `/to-tickets` | Break each phase into tracer-bullet tickets with blocking edges. |
| `/implement` | Build a ticket, driving `/tdd` at the agreed seams and `/code-review` before commit. |
| `tdd` (model-invoked) | Actions, GROQ query helpers, lint scripts, enquiry spec, cache purge, preview routes. Red-green-refactor. |
| `code-review` (model-invoked) | Every diff: standards axis (this repo's rules in `CLAUDE.md`) and spec axis (the ticket). |
| `codebase-design` (model-invoked) | Deep modules: the `enquiry-kinds` spec, the Sanity data layer, the lint package. |
| `diagnosing-bugs` (model-invoked) | Visual Editing not overlaying, cache not purging, Storybook not rendering a component. |
| `domain-modeling` (model-invoked) | Keep `CONTEXT.md` sharp as the content model settles. |
| `prototype` (model-invoked) | Only for a design question the prototypes do not answer (e.g. lightbox swipe feel). Throwaway. |
| `research` (model-invoked) | Verifying a library API against primary docs before using it (Astro 7 cache provider, storybook-astro limits, Sanity Functions). Writes a cited `docs/research/*.md`. |
| `wizard` (model-invoked) | Steps only the owner can do: create the Sanity project and tokens, link Vercel, add env vars, set up Resend domain, PostHog project, Chromatic token, Sanity webhook. Generate one wizard for Phase 0. |
| `/improve-codebase-architecture` | Every few phases. |
| `/handoff` | End of every session. |
| `setup-pre-commit` (misc, install with `npx skills@latest add mattpocock/skills --skill=setup-pre-commit`) | Phase 0 hooks. Misc skills are not in the plugin, so this one does not duplicate. |
| `git-guardrails-claude-code` (misc, same install route) | Blocks destructive git. |

Skip: `triage` (single owner, local files), `teach`, `to-questionnaire` (use the
open-questions list instead), `resolving-merge-conflicts` (fine to keep, rarely
needed), everything in `in-progress/`.

## 2. Sanity agent toolkit

Install the Sanity plugin from the official Claude Code marketplace (MCP server,
skills, commands). Add `.mcp.json`:

```json
{
  "mcpServers": {
    "sanity": { "type": "http", "url": "https://mcp.sanity.io" }
  }
}
```

OAuth on first use. The MCP server fetches Sanity's current agent rules on
demand, so do not copy Sanity best-practice docs into the repo; point at the
skill instead. Repo-local `oy-content-ops` holds only what is specific to this
site.

## 3. `CLAUDE.md` (repo root)

Keep it under 150 lines. Pointers, not essays. Contents:

- One paragraph: what the site is, who edits it, the three jobs.
- Stack line: Astro 7 server output on Vercel, Sanity Studio v5 at `/admin`,
  Storybook via `@storybook-astro/framework`, Bun workspaces, Node 22.
- Commands: `bun install`, `bun dev` (web + studio), `bun storybook`,
  `bun test`, `bun e2e`, `bun lint`, `bun typegen`, `bun seed`, `bun check`
  (typecheck + lint + test), `bun build`.
- Where things live (the tree from README section 5, one line each).
- The rules that lint cannot catch, verbatim from README section 3
  "Non-negotiables" and "Decisions inherited from the design work".
- Component rule: new visual treatment goes into `@oy/ui` with a story first;
  pages arrange library parts and own no component styling.
- Content rule: never invent content; empty renders Pending; use the Sanity MCP
  for content, the schema for shape.
- Storybook rule: `.astro` only; if blocked, stop and ask the owner.
- Pointers: `CONTEXT.md` for vocabulary, `docs/adr/` for decisions,
  `docs/design/` for the handoff and prototypes, `.claude/skills/` for the
  repo's own skills, `docs/content-ops.md` for editors.
- No em dashes anywhere in this repo (prose, comments, UI copy).

## 4. `CONTEXT.md` (shared language)

Seed with these terms and let `domain-modeling` sharpen them:

- **Odunde**: the June festival at Leimert Park. One word in display text since
  1 Sep 2026 (overrides the design system's "Odun De"). With marks in the nav:
  Ọdúndé. Single-word lowercase `odunde` in URLs and files.
- **Gala**: the End-of-Year Gala, Nov/Dec. Seats go to Eventbrite; tables are
  an enquiry.
- **Zone**: one of the festival's areas. Named zones: Ọjà Balógun (the market),
  Àgbàlá Ọmọde (the children's yard). Two unnamed.
- **Lessons**: Yoruba Language Lessons (never "School"). One teacher, online,
  write to enrol.
- **Collective**: the Yoruba Cultural Collective. Solar Hub and Green Goods are
  its two initiatives. Green colour lives only here.
- **Take-part band**: the closing rows on nine pages (vendor, sponsor,
  performer, volunteer, table, give), reordered per page.
- **Door**: one of the four Get Involved entry points (member, volunteer,
  partner, give). Renders as a card or a path row.
- **Glance strip**: the at-a-glance facts under a page header.
- **Enquiry**: any owned form submission. Eight kinds plus newsletter. Becomes
  an `enquiry` document, then an email.
- **Handoff**: a money step we do not own (Zeffy, Eventbrite, hand invoice).
- **Give Dialog**: the dialog every Donate button opens; wraps Zeffy.
- **Pending**: an empty required-for-launch field; renders a named chip on the
  site and a row in the Studio Pending view.
- **Confirmed fact**: content the client has supplied (list in CONTENT-MODEL
  section 1). Everything else is pending.
- **Layout option**: a Studio field mirroring a design tweak prop.
- **Elder test**: readable by an elder on a phone in sunlight. AA, 17px, 44px.
- **Dark scope**: `.oy-dark` wrapper that flips headings, links, focus ring.
- **Grain-dots**: the chosen card texture (`data-card="grain-dots"`).
- **Kicker**: Yoruba • English uppercase label above a heading.

## 5. ADRs (`docs/adr/`, format from Matt's `domain-modeling/ADR-FORMAT.md`)

Write these in Phase 0 and 1; add more as decisions land.

1. Astro 7 server output on Vercel with route caching, not static builds
   (Visual Editing needs SSR; caching keeps cost and speed of static).
2. All components as `.astro`; Storybook through `@storybook-astro/framework`;
   pivot only with owner approval.
3. Bun workspaces monorepo with `@oy/ui`, `@oy/tokens`, `@oy/content`, `@oy/lint`.
4. Enquiries are Sanity documents plus a Sanity Function that emails via Resend
   (no third-party form service; the inbox lives with the content).
5. Seed confirmed facts only; empty fields render Pending (no placeholder flags).
6. Tweak props become Studio layout options with the same names.
7. One `enquiry-kinds.ts` spec drives schema, action validation, markup and
   stories.
8. Storybook adopts the design system theme and is deployed for the owner.
9. Odunde as one word (records the 1 Sep 2026 decision and the design system
   conflict).
10. Lints for voice (em dash, diacritics) run in pre-commit, CI, and as Sanity
    validation, from one shared word list in `@oy/lint`.

## 6. Repo-local skills (`.claude/skills/<name>/SKILL.md`)

Model-invoked unless stated. Each under 80 lines, with pointers to files.

- **`oy-design-system`**: the non-negotiables, colour roles, type scale, spacing,
  shape, motion, pattern rules, dark scope, theme variants; pointer to
  `@oy/tokens` and `docs/design/`. Trigger: any styling work.
- **`oy-component`**: how to add or change a component: folder layout, `.oy-*`
  naming, props conventions, image prop union, Pending treatment, story
  requirements (Default, variants, Pending, OnDark, play), test, Chromatic,
  update `COMPONENT-MAP` in `docs/design/`. Trigger: new or changed UI.
- **`oy-page`**: how to build a page from a wireframe: read the block list,
  compose from `@oy/ui`, load with `defineQuery`, layout options, Visual Editing
  `data-sanity` attributes via stega, cache tags, Playwright smoke, Lighthouse.
  Trigger: new route.
- **`oy-content-model`**: schema conventions (objects in section 2 of
  CONTENT-MODEL), validation rules, TypeGen workflow, Pending view registration,
  Presentation locations, webhook tags. Trigger: schema change.
- **`oy-content-ops`**: the recipes in CONTENT-MODEL section 7, using the Sanity
  MCP. Trigger: the owner asks to add or change content.
- **`oy-voice`**: copy rules: warm, short, we/our and you/yours, Yoruba leads
  and English supports, sentence case, glyph set, no em dashes, success and
  error copy patterns, the framing lines. Includes the Yoruba glossary with
  correct marks. Trigger: writing any copy or alt text.
- **`oy-release`** (user-invoked, `/oy-release`): seasonal event release
  checklist (Content Release, event doc, tiers or zones, schedule, glance,
  homepage season, publish, verify cache purge).

## 7. `docs/` layout

```
docs/
  adr/                     ADRs above plus new ones
  tickets/                 local files tracker (from setup skill)
  plans/                   wayfinder map, phase plans
  research/                cited findings from the research skill
  design/                  this handoff folder, copied in whole
  content-ops.md           editor-facing guide (Phase 10)
  runbook.md               env vars, deploy, webhook, preview, rollback, purge
```

## 8. Things the agent must ask rather than decide

The list in README section 9, plus: any new dependency beyond the stack named
here; any change to the content model that removes a field; any pivot from
`.astro` components; any copy that states a fact not in the confirmed list;
any third-party script beyond Sanity, Zeffy, Eventbrite, PostHog, fonts.

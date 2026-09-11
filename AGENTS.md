# Omo Yorùbá of Southern California: agent guide

The website of Omo Yorùbá of Southern California, a 501(c)(3) founded in 1997 in Los
Angeles. Edited by the owner (technical, works with AI) and by org members who add
photos, news and events. Three jobs, in order: prove legitimacy and impact to grant
reviewers in under two minutes; make joining obvious; run the vendor, sponsor and ticket
funnels for the Odunde Festival (June, Leimert Park) and the End-of-Year Gala (November
or December).

This file is the tool-neutral contract for every coding agent (Claude Code, Codex, Cursor,
Copilot). `CLAUDE.md` imports it and adds the Claude Code entry points (ADR 0012).

Stack: Astro 7 with `output: 'server'` on Vercel and route caching; Sanity Studio v6 embedded
at `/admin` (ADR 0017); Storybook via `@storybook-astro/framework`; Bun workspaces; Node 22 runtime.

## Commands

| Command | Does |
| --- | --- |
| `bun install` | installs every workspace and the git hooks (lefthook) |
| `bun dev` | Astro dev server for `packages/web`; run it in the background, never in the foreground |
| `bun storybook` | Storybook (Phase 1) |
| `bun run test` | Vitest in every package that has a `vitest.config.ts` (`bun test` is Bun's own runner) |
| `bun e2e` | Playwright (Phase 3) |
| `bun lint` | Biome, then the em dash, Yoruba diacritics and colour literal checks (`.lintignore` lists the exemptions) |
| `bun typegen` | Sanity TypeGen: extracts `packages/content/schema.json`, generates `sanity.types.ts` (CI job `TypeGen drift` checks both) |
| `bun seed` | seeds the `development` dataset with the confirmed facts and photographs (`-- --dry-run`, `-- --replace`); needs an Editor token |
| `bun run --filter @oy/content sanity -- <args>` | the Sanity CLI with `packages/web/.env` loaded (`documents`, `datasets`, `functions test`) |
| `bun check` | typecheck, lint, unit tests, toolchain pins; pre-push and CI run this |
| `bun run build` | production build of `packages/web` (`bun build` is Bun's bundler) |

Node 22 and Bun 1.4 must be active: `.mise.toml`, `.node-version` and `packageManager` pin
them (run `mise trust` once, then `mise install`).

## Where things live

Every workspace lives under `packages/`, apps and libraries alike, modelled on the
green-goods repo (ADR 0003). The handoff's `apps/` split is not used.

- `packages/web`: pages, layouts, actions, Sanity loading, `astro.config.ts`, the Studio mount.
- `packages/tokens`: every colour, type, spacing, pattern and font. Tokens only.
- `packages/ui`: every visual component (`.astro`) with its story and test; `.storybook/` config and theme.
- `packages/content`: the content model, structure, Pending registry, enquiry spec, GROQ, generated types, seed, the two Sanity Functions (`functions/`); `sanity.blueprint.ts` at the root declares them.
- `packages/lint`: em dash, Yoruba diacritics and colour literal checks; `yoruba-terms.json`.
- `docs/design`: the design handoff (brief, specs, prototypes). Read-only reference.
- `docs/adr`, `docs/plans`, `docs/tickets`, `docs/research`, `docs/runbook.md`.
- `.claude/skills`: this repo's own skills; `.agents/skills` is a symlink to it for other tools.
- `.mcp.json`: the Sanity MCP server for Claude Code (Codex: add it to `~/.codex/config.toml`).
- `.github`: CI (`ci.yml`), the weekly audit, Dependabot for action pins, the PR template.
- `sanity.blueprint.ts`: the Blueprint manifest for the Sanity Functions (kept at the root next to `bun.lock`).

## Rules that lint cannot catch

From `docs/design/README.md` section 3; that file is the source when in doubt.

- "Odunde" is one word in all display text (decision of 1 September 2026). The design
  system readme still spells it as two words; ignore that. The nav shows it with marks:
  "Ọdúndé Festival". Lowercase `odunde` in URLs and file names.
- Cards: 6px radius, paper ground, indigo hairline, 8px aṣọ òkè top edge, grain-dots
  texture (`data-card="grain-dots"` on the page root). Not 14px.
- No hover lift anywhere. Buttons darken or fill and settle 1.5% on press. Cards change
  border colour. Photos never zoom.
- Nav: Events dropdown (Ọdúndé Festival, End-of-Year Gala), Programs, Get Involved,
  Impact, Our Story, gold Donate button. Contact lives in the footer only. Full-screen
  overlay under 760px. Logo mark 40px plus the two-line wordmark; line two hides under 1060px.
- Every Donate button opens the Give Dialog (Zeffy embed, fallback to Contact and the
  mailing address). `#give` in the URL opens it on load.
- Every form opens the Enquiry Modal (dialog on desktop, bottom sheet under 720px) from a
  card that first explains what it asks. Eight kinds: sponsor, performer, table, member,
  volunteer, enrol, vendor, contact.
- Yoruba Language Lessons (never "School"): one teacher, live online, times and fees agreed
  with her directly. No terms, no Saturdays, no venue.
- Gallery: album mosaic, no filters, opening an album opens the viewer, credits per album.
- News & Events (page 17) is wireframed but not built; schema ships, page waits for cadence.
- Full diacritics on every Yoruba word. The type must render the test string cleanly at
  every size: "Ẹ káàbọ̀ sí Ọjà Balógun, Àgbàlá Ọmọde àti Ẹgbẹ́ Ìbílẹ̀. Odún dé! Ẹ ṣeun."
- Indigo carries 60 to 70 percent of visual weight. Gold is for actions and celebration
  only, one gold primary action per screen view, never body text on light. Terracotta warms
  kickers and festival moments. Green stays inside Cultural Collective content.
- Pattern is texture, never costume: àdìrẹ dot fields, aṣọ òkè stripes, ayo dot rows, all
  low opacity. Never kente, never Adinkra.
- The elder test: WCAG AA, 17px minimum body, 44px minimum touch targets.
- No em dashes anywhere (UI copy, code comments, docs). No emoji. Glyphs are limited to
  • → ✓ ×. Sentence case for headings and buttons; kickers and path chips are the only
  uppercase text.
- Success on every owned form opens with "Ẹ ṣé! ✓" then a plain sentence saying what
  happens next. Errors are sentences naming the field, never colour alone, and never clear
  what was typed. Every form shows a human fallback beside it.
- Nothing opens on load: no entry pop-up, no scroll-triggered newsletter, no exit intent.
  `#give` is the one URL-driven exception.
- Type: Source Serif 4 (headings 600 and 700), Source Sans 3 (body 400, 600, 700), fallback
  through Noto Serif and Noto Sans, then Georgia and system-ui. Hero 44 to 64px, H2 32 to 40,
  H3 20 to 24, body 17 to 18, kicker 12px uppercase 0.15em tracking bold. Line-height 1.15
  headings, 1.6 body.
- Spacing on an 8px grid, section padding 72 to 96px desktop and 48px mobile, content
  width 1100px.

## Working rules

- Components: a new visual treatment goes into `@oy/ui` first, with a story; pages arrange
  library parts and own no component styling. Colours come from `@oy/tokens` only.
- Content: never invent content (no dates, prices, figures, names, quotes). Empty renders
  Pending, and every required-for-launch field is registered in `packages/content/src/pending.ts`.
  Use the Sanity MCP for content and the schema for shape.
- Storybook: `.astro` components only. If the framework blocks a component, stop and ask
  the owner before any pivot. Same for anything in `docs/design/AGENT-DOCS.md` section 8.
- Conflicts: `oy-components.css` beats `_ds/`; the Build Brief's polish passes beat the
  wireframes; the handoff beats the design system readme. Say which you followed.
- Sessions: review the diff with the code-review skill before every commit; conventional
  commit messages; write a handoff before ending and save it to
  `docs/plans/handoff-<phase>.md`. In Claude Code these are `/code-review` and `/handoff`
  from the Matt Pocock plugin; other tools get the same skills with
  `npx skills add mattpocock/skills`.
- No em dashes anywhere in this repo: prose, comments, UI copy, commit messages.

## Agent skills

### Issue tracker

Local Markdown files under `docs/tickets/`, labels bug, content, design, infra, later.
See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` at the root and `docs/adr/`. See `docs/agents/domain.md`.

## Pointers

- `.claude/skills/`: this repo's skills `oy-design-system`, `oy-component`, `oy-page`,
  `oy-content-model`, `oy-content-ops`, `oy-voice` (model-invoked) and `oy-release`
  (user-invoked), plus the third-party `git-guardrails-claude-code` (Claude Code only).

- `CONTEXT.md`: vocabulary. `docs/adr/`: decisions. `docs/plans/wayfinder.md`: the map
  and the owner's open decisions. `docs/research/`: verified library facts.
- `docs/design/`: the handoff. `README.md` there is the brief; `PROMPTS.md` has one prompt
  per phase and the stall rules.
- `docs/runbook.md`: env vars, deploy, preview, webhook, rollback, purge, CSP.
- `docs/content-ops.md`: editor guide (Phase 10).

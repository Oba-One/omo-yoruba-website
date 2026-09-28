---
name: oy-content-model
description: Conventions for changing the Sanity schema in @oy/content. Use for a new or changed type, field, validation rule, the Pending registry and the To do, Presentation locations, TypeGen, or webhook cache tags.
---

# Changing the content model

Spec: `docs/design/CONTENT-MODEL.md`, amended by ADR 0013 to ADR 0017 (the deltas are listed in
`packages/content/README.md`). Sanity facts come from the Sanity MCP server (`.mcp.json`), the
`sanity` plugin skills and `docs/research/phase-2-*.md`; do not copy them here.

## Conventions

- Every type is `defineType` with `defineField`; every page query is `defineQuery` with a unique
  exported constant name in `packages/content/src/queries/` (from Phase 4). GROQ lives only in
  `packages/content` and the root Blueprint manifest: page queries, the structure and Pending
  filters, the Presentation resolvers, the seed and the functions. Nothing in `packages/web` or
  `packages/ui` writes GROQ.
- Reuse the shared objects before adding a field: `bilingual`, `cta`, `oyImage`, `seo`, `fact`,
  `sourcedFigure`, `scheduleItem`, `faqItem`, `contactRole`, `pageHeader`, `blockContent`, and
  the `layoutOption` helper.
- Placement rule (ADR 0013): a fact that changes per edition goes on `event`; a thing shown on
  more than one page is a document; a thing one page owns is inline on that page.
- Page singletons go through `definePage` in `src/schema/singletons/page.ts`: header, content,
  one `primaryAction`, `secondaryActions[]`, `layout` (one field per tweak prop, same name and
  options as the prototype, first option as initial value), `seo`.
- Kickers are `bilingual` (`en` required, `yo` optional). Zone names are bilingual with marks.
- `oyImage` always: hotspot image, `alt` required, `caption`, `credit`, `creditNote`,
  `creditConfirmed`; albums carry the credit for every photo.
- Portable Text is `blockContent`: normal, h3, blockquote; strong, em, link; `pullQuote` only.
- Enquiries: change `src/enquiry-kinds.ts`, never the `enquiry` type by hand; the objects, the
  Zod schemas, the Inbox lists and the notify email all derive from it (ADR 0015, ADR 0016).
- Removing a field is an owner decision (`docs/design/AGENT-DOCS.md` section 8). A removed field
  goes into `RETIRED_FIELDS` (`scripts/seed-data.ts`): the seed and the `retired-fields` migration
  unset it. A value that must move first names its migration in `MOVED_FIELDS`, and that migration
  lives in `scripts/migrations/` with a test that applying it to the seed leaves nothing to do
  (runbook, Migrations). Stored content never moves by hand.
- An input kept for later but hidden from everyone is named in `src/hidden-inputs.ts`, which the
  content-lint function skips (with the inputs an event's kind hides, `src/edition-fields.ts`), so
  the wording to check never names it; `studio-words.test.ts` fails on a fixed `hidden: true` the
  module does not name.
- Option lists hold only values a page reads (ADR 0042): a value no page shows is removed with a
  migration, not kept as a choice that does nothing.

## Validation

Every string and text field takes `voice.text` from `src/validation/rules.ts`; headings, titles
and button labels take `voice.heading`; `blockContent` takes `voice.blocks`. Required variants:
`voice.requiredText`, `voice.requiredHeading`. The checks reuse `@oy/lint` (em dash error, marks
warning, sentence case warning) and import the word lists as JSON; never copy a list.

## Pending registry and the To do

A required-for-launch field gets an entry in `PENDING` in `src/pending.ts` (type, fields, the
register's Where and What wording) in the same change; `pending.test.ts` fails on a field the
schema does not define. A document type the site needs before launch gets a `PRESENCE` entry
with its minimum. The site renders `<Pending what={pendingWhat(type, field)} />`.

The Studio's To do (`src/studio/todo.ts`) groups the rows by the page their Where names: the
words before its first comma must be one of the page labels in `REGISTER_PAGES` (`todo.test.ts`
fails otherwise), and site settings rows go under Organization details. A row for an item of a page's
own list keeps the item's type and names the list (`list: { page, field }`), so the site asks for its chip
as before and the To do asks the page. A row bound to an edition
says which one it asks about (`edition: 'next'` or `'past'`): an event row asks the edition itself,
a ticket tier or sponsor level row the documents that name it in `event` (`everyEdition` when a
document naming none shows every year), so the To do counts only what the page shows.

## Presentation and routes

`src/routes.ts` maps every public route to the types it reads. A type reaching a new page is
added there once: the Presentation locations (`src/studio/presentation.ts`), `cacheTagsFor` and
the webhook purge follow. Every document type needs a `locations` entry and every route a
`mainDocuments` entry (`presentation.test.ts` checks both).

## TypeGen

After any schema or query change: `bun typegen`, commit `packages/content/schema.json` and
`packages/content/src/sanity.types.ts`. The CI job `TypeGen drift` fails on a difference.
Validation, Pending and locations are checked in the Studio: open `/admin` and confirm the new
field warns, lists and locates.

<!-- shared-engineering:begin -->
## Semantic changes

When schema or query work changes meaning, identity, edition selection, Pending
behavior, or enquiry rules, follow `docs/agents/domain.md` and use the shared
`domain-driven-design` skill. Establish the affected rule and an example before
changing its representation. Preserve the existing canonical sources and generation
steps above; a new DDD model must not become a competing content schema.
<!-- shared-engineering:end -->

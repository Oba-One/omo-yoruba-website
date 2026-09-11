---
name: oy-content-model
description: Conventions for changing the Sanity schema in @oy/content. Use for a new or changed type, field, validation rule, the Pending view, Presentation locations, TypeGen, or webhook cache tags.
---

# Changing the content model

Spec: `docs/design/CONTENT-MODEL.md`, amended by ADR 0013 to ADR 0017 (the deltas are listed in
`packages/content/README.md`). Sanity facts come from the Sanity MCP server (`.mcp.json`), the
`sanity` plugin skills and `docs/research/phase-2-*.md`; do not copy them here.

## Conventions

- Every type is `defineType` with `defineField`; every query is `defineQuery` with a unique
  exported constant name. GROQ lives only in `packages/content/src/queries/` (from Phase 4) and
  in the Studio structure.
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
- Removing a field is an owner decision (`docs/design/AGENT-DOCS.md` section 8).

## Validation

Every string and text field takes `voice.text` from `src/validation/rules.ts`; headings, titles
and button labels take `voice.heading`; `blockContent` takes `voice.blocks`. Required variants:
`voice.requiredText`, `voice.requiredHeading`. The checks reuse `@oy/lint` (em dash error, marks
warning, sentence case warning) and import the word lists as JSON; never copy a list.

## Pending view

A required-for-launch field gets an entry in `PENDING` in `src/pending.ts` (type, fields, the
register's Where and What wording) in the same change; `pending.test.ts` fails on a field the
schema does not define. A document type the site needs before launch gets a `PRESENCE` entry
with its minimum. The site renders `<Pending what={pendingWhat(type, field)} />`.

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

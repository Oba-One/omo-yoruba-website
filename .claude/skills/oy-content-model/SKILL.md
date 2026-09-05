---
name: oy-content-model
description: Conventions for changing the Sanity schema in @oy/content. Use for a new or changed type, field, validation rule, the Pending view, Presentation locations, TypeGen, or webhook cache tags.
---

# Changing the content model

Spec: `docs/design/CONTENT-MODEL.md` (principles in section 1, shared objects in section 2,
singletons and documents in sections 3 and 4, structure in section 5). Sanity facts come from
the Sanity MCP server (`.mcp.json`) and the `sanity` plugin skills; do not copy them here.

## Conventions

- Every type is `defineType` with `defineField`; every query is `defineQuery` with a unique
  exported constant name. GROQ lives only in `packages/content/src/queries/`.
- Reuse the shared objects before adding a field: `bilingual`, `cta`, `oyImage`,
  `layoutOption`, `seo`, `fact`, `sourcedFigure`, `scheduleItem`, `faqItem`, `contactRole`.
- Kickers are `{ yo, en }`, never a mixed string. Zone names are bilingual with marks.
- Page singletons carry `seo`, `layout` (one field per tweak prop, same name as the
  prototype) and one `primaryAction`; secondary actions are an array.
- `oyImage` always: hotspot image, `alt` required, `caption`, `credit`, `creditConfirmed`.
- Portable Text is minimal: normal, h3, blockquote; strong, em, link; `pullQuote` only.
- Removing a field is an owner decision (`docs/design/AGENT-DOCS.md` section 8).

## Validation

On every string and text field: no em dash (error), a Yoruba term from
`packages/lint/yoruba-terms.json` without its marks (warning), headings and button labels in
sentence case (warning). `alt` required (error). Import the word list, never copy it.

## Pending view

A required-for-launch field that may be empty is listed in the Pending structure list with a
GROQ `!defined(field)` query and a one-line description of what is missing, mirroring
`docs/design/design/19 Mock Content Register.dc.html`. Add the entry in the same change as
the field.

## Presentation

Every singleton and document type has a location resolver and `mainDocuments` entry for its
route(s) so click-to-edit works from `/admin`.

## TypeGen and cache tags

- After any schema or query change: `bun typegen`, commit `sanity.types.ts`. CI fails on
  drift.
- Cache tags are the document type name; the webhook posts `_type` and slug to
  `/api/revalidate`, which purges the routes that read that type. Add the type to the
  purge map when a new type reaches a page.
- Validation, Pending and locations are checked in the Studio: open `/admin` and confirm
  the new field warns, lists and locates.

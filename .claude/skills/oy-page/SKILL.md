---
name: oy-page
description: How to build or change a route in packages/web from its wireframe. Use for a new page, a page section, loading a page from Sanity, layout options, Visual Editing on a route, cache tags, or a page-level Playwright or Lighthouse check.
---

# Building a page

Sources, in order: the route's row in `docs/design/ROUTES-AND-INTERACTIONS.md` section 1,
its block list in section 4, its layout options in section 5, its rail in
`docs/design/design/06 Site Wireframes.dc.html`, then the page prototype named in the row.
Copy comes from the prototype and the Studio, never from memory.

## Steps

1. Read the block list. Every block maps to a component in `@oy/ui`; if one is missing,
   build it first with the `oy-component` skill.
2. Load with `defineQuery` in `packages/content/src/queries/` (the only place GROQ lives),
   one composed query per page read through `loadQuery` (singletons and lists alike: a live
   loader never sees the perspective cookie, wayfinder ticket 20). Typed results come from
   `sanity.types.ts`; run `bun typegen` after a schema or query change.
3. Compose in `packages/web/src/pages/<route>.astro` inside `SiteLayout`. The page arranges
   library parts and owns layout and copy only: no component styling in `packages/web`.
4. Read every layout option from the page singleton's `layout` object (same names as the
   tweak table) and pass it down. Add a page-section story per option.
5. Pending: any required-for-launch field that is empty renders `<Pending what="..." />`.
   Register the field in the Studio Pending view (see `oy-content-model`).
6. Visual Editing: stega is on in the loader in draft mode, so text carries its edit link;
   images and option containers take an edit attribute (`dataAttribute` in
   `packages/web/src/lib/sanity/`) rendered in draft mode only; the route's Presentation
   location comes from the route map in `@oy/content`.
7. Caching: `cachePage(Astro, route, { preview })` from `packages/web/src/lib/cache.ts` sets
   the day and week and one type tag per document type the route reads; `/api/revalidate`
   purges by type. The middleware switches the cache off for draft mode, the preview host and
   anything but a GET (ADR 0021).
8. One gold primary action per screen view: the page singleton's `primaryAction` is the
   only gold button; secondary actions render as outline buttons.
9. Handoffs: link to Impact when the page makes a claim, to Our Story when it shows a face;
   close with the take-part band or the program trio where the block list says so.
10. Check: `bun check`; Playwright smoke (renders, one `h1`, nav current state, footer,
    no dialog open on load); axe at 375 and 1440; Lighthouse against the preview against the
    budgets in `docs/design/QUALITY.md` section 3.

## Never

Invent copy, dates, prices or names; add a section the wireframe does not have; restyle a
library part locally; open anything on load except `#give`.

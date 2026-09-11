# 05: The thirteen page singletons with layout options

Labels: content
Status: resolved
Blocked by: 03

**What to build:** `siteSettings` and the twelve page singletons (`gallerySettings` renamed
`galleryPage`) as documents with `seo`, one `primaryAction`, `secondaryActions[]`, a `layout`
object holding every tweak prop from ROUTES section 5 with the prototype's names and options, and
the fields CONTENT-MODEL section 3 lists minus the per-edition facts that moved to `event` and the
duplicates that became references (ADR 0013). Each is a fixed document in the Studio: no create,
no delete, no duplicate.

- [x] Every singleton type is registered and pinned in the structure with a fixed id
- [x] Every `layout` option has the prototype's name and options, first option as initial value
- [x] `siteSettings.contacts[]` carries the eight roles with name, email, phone and response line

## Comments

11 September 2026. Built through `definePage` in `src/schema/singletons/page.ts`: header, content
fields, one `primaryAction` with `secondaryActions`, a `layout` object and `seo`, in Studio groups. The
homepage keeps its actions inside `hero`; the news page has no actions. The Studio pinning, the
create and delete guards and the routing contacts check land with the structure in ticket 07.

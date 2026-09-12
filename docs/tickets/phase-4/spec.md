# Phase 4 spec: the homepage, Visual Editing and route caching

Written 12 September 2026 from the Phase 4 prompt (`docs/design/PROMPTS.md`), ROUTES sections 1,
4 and 5, `docs/design/design/02 Homepage.dc.html` (the fidelity bar) and the grill on the homepage
seam. The owner was not in the session, so every question below carries the recommended answer
as the decision; the handoff lists them under "Decisions made without the owner".

## The design tree, answered

**Q1. How does draft mode bypass the cache?** Per request: the perspective cookie the Presentation
tool sets makes `loadQuery` read drafts with stega, and the same request calls `Astro.cache.set(false)`
so its HTML carries no CDN headers and is never stored. A separate preview host is not needed for
safety (a draft response is never cached), only for the editor's own experience if the CDN serves
the public copy to a request carrying a cookie; `docs/research/phase-4-astro-cache-and-vercel-provider.md`
records what Vercel does and the ADR records the choice.

**Q2. Which tags, and how does the purge reach the provider?** A public page tags its response with
`type:<t>` for every document type that reaches its route (`tagsForRoute` in `@oy/content/routes`,
derived from the same map as the Presentation locations); the Vercel provider adds its own path tag.
`/api/revalidate` turns the webhook's `{_type, slug}` into `cacheTagsFor(type, slug)`, rewrites each
`route:` tag into Astro's path tag and calls `context.cache.invalidate({ tags })`, which the provider
forwards to `invalidateByTag` from `@vercel/functions` (a dependency of `@astrojs/vercel`, nothing to add).

**Q3. What does the Presentation tool open, and how does the overlay refresh?** `/` resolves to the
`homepage` singleton (`mainDocuments`), every homepage type lists `/` in its locations, and the layout
mounts `VisualEditing` from `@sanity/astro/visual-editing` when the cookie is set. A mutation reloads
the page (the documented default); the overlay is outside the persisted dialogs, so a cross-fade
navigation mounts it fresh with the new page.

**Q4. What does `season: auto` pick?** An explicit `leadEvent` reference wins. `gala` or `odunde` picks
the nearest upcoming edition of that kind, or the newest edition of that kind when none is dated.
`auto` picks the nearest dated upcoming festival or gala; when no edition is dated it follows the
calendar: January to June the festival leads, July to December the gala. Past editions never lead.
The rule is a pure function with tests (`leadEvent` in `@oy/content`).

**Q5. How do the seven options reach the page?** The page reads `homepage.layout` and fills the schema
defaults for empty values. `season` picks the event band; `highlight` sets `data-highlight` on the
body (the highlighted program card moves first with the gold ring; the hero shows the singleton's one
primary action, so the prototype's three switching hero buttons collapse into that field);
`gallery` sets the mosaic's tile count; `involved` renders door cards or path rows; `newsletter`
places the band before the footer and empties the footer's block; `pattern` and `motion` set
`data-pattern` and `data-motion` on the body, which the ported CSS already reads.

**Q6. How do the eight EnquiryCards give way?** The home page composes the real blocks; the forms seam
now opens from the real doors (member and partner cards or rows), the footer (volunteer, contact,
donate) and the nav (donate). The Playwright enquiry spec opens each kind from a real trigger where
the page has one and from the `?enquiry=<kind>` opener where it has none, and the axe and targets
specs use the member door.

## Further decisions

- Copy the prototype carries but the schema had no field for gets a field and a seed value: the hero
  blessing line (`hero.blessing`, bilingual), the voices intro (`voicesIntro`) and the proverb under
  the voices (`voicesProverb`, bilingual), and a `program.action` so a card's quiet link is content (no action, no link).
  Section kickers and headings stay page copy in `packages/web`.
- Program and door photographs the prototype shows are seeded from the register (the Lessons and
  Kids & STEM cards, the member and partner doors); the Collective and Cultural Exchange cards render
  the placeholder, as the prototype's interim note asks.
- News cards carry no link until the News page exists (wayfinder ticket 08); the block is built.
- The stat strip shows four figures without source lines on the homepage; the Impact page adds them.
- Every image on the site is a Sanity CDN URL with a srcset built by `@oy/content/images` from the
  asset reference, never from a URL string in the response, so stega never lands in `src`.
- `loadQuery` keeps stega off the keys the site branches on (`kind`, `enquiryKind`, the layout
  values, `context`, `network`) through the client's stega filter; the page cleans nothing by hand.
- Cache: `maxAge` one day, `swr` seven days (ROUTES section 1); preview, Studio, API and action
  routes, non-GET requests and a form error re-render never set headers.
- Lighthouse CI: researched and configured in `docs/research/phase-4-lighthouse-ci.md`; the package
  is not installed until the owner says yes.

## Revised after the design review, 12 September 2026

The owner asked for full alignment with `02 Homepage.dc.html`; ADR 0023 records what changed and
what stays different because a rule outranks the prototype. In short: three program cards, the
highlight swapping the hero's gold button for the program's action, news oldest first with Read
more on the tagged page, the prototype's placeholder slots for the voices, `hero.emphasis` and
`stat.shortLabel`, the prototype's photo framing as hotspots and the Collective's interim
photograph. The answers above on the highlight's single button, the four cards, the linkless news
cards and the Collective placeholder are superseded.

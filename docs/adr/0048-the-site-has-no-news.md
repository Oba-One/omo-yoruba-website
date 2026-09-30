# The site has no news

Decided on 30 September 2026 by the owner: the organization will not publish news posts. This closes D22, which had
held the News page back until a cadence was known (ADR 0042: no News page before launch).

- The `newsPost` and `newsPage` types leave the schema, and the Studio's News posts list and the administrators'
  News & Events page go with them. So do the `/news` routes in the route map, their cache tags and Presentation
  locations, the content-lint function's two types and the Blueprint filter's.
- The homepage's "News & events" section goes: it showed the three newest posts, the three the design handoff
  carried over from the old homepage (July to November 2026). The event band ("Coming up next") and the newsletter
  signup keep a visitor up to date. The homepage's `newsIntro` joins `RETIRED_FIELDS`, and the `NewsCard`
  component, its stories and its fixtures are deleted.
- The three posts and the News page document are deleted by the new `retired-types` migration, which deletes every
  document of a type in `RETIRED_TYPES` with the content-lint function's report on it. It runs after the merge, on
  the owner's word, as every migration does (runbook, Migrations).

## Considered options

- **Keep the section, fed by upcoming events:** the event band above it already leads with the next edition, and
  the Collective's page lists its own events.
- **Keep the types hidden for later:** a type no one writes still costs a sidebar entry, a query, a Pending row and
  tests. A News page can come back through its own decision.

## Consequences

- The homepage reads its sections in this order: the hero, the headline figures, the event band, programs, member
  voices, the year in the life, raise your hand.
- Amends ADR 0042 (no News page for administrators to keep) and AGENTS.md's rule on page 17. The design handoff's
  News wireframe (page 17) and its homepage news block stay in `docs/design` as the record of the brief.
- After the merge: run `retired-types` (and `retired-fields`, for `newsIntro`) with the owner, then deploy the schema
  again from `/admin` and the CLI.

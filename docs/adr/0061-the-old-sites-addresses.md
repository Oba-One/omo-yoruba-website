# The old site's addresses land on their successors

Accepted 21 November 2026. The owner confirmed the targets `docs/redirects.md` proposed on 9 October
("Yes, as proposed"; open-work D18).

## Decision

- **Every old address with a successor answers 301 to it.** 56 addresses, read from the old site's own
  sitemaps (its pages, the events index and its views, its events, posts, categories and tags), each to
  the page `docs/redirects.md` names. The map is `packages/web/src/lib/redirects.ts`; every target is a
  page this site serves.
- **The middleware answers them, not Astro's `redirects`.** The old site wrote every path with a trailing
  slash. Astro drops that slash from a redirect's path, and the Vercel adapter then matches the path
  exactly, so `/about-us/` would never have met its rule (the build also warned that the two spellings
  collide). The middleware matches with or without the slash and in any case, as WordPress did, for GET
  and HEAD, before anything renders. A redirect on a preview or `vercel.app` host carries that host's
  `noindex` too.
- **What `docs/redirects.md` leaves to the 404 page stays there:** plugin pages, the forum, the theme's
  demos, author archives and the old media library. `/donate/` needs no rule: it is this site's own Donate
  page.
- **One target differs from the October proposal:** the 2019 post on Cultural Exchange lands on Kids & STEM's section
  of the Programs page (`/programs#kids`), since Cultural Exchange is off that page (ADR 0056).

## Consequences

- The rules take effect for old links only once `omoyorubaofsocal.org` points at this site. That name is not
  in the owner's hands yet, and its mailbox (`info@omoyorubaofsocal.org`, the general inbox and the Zelle
  address) must keep working when it moves: pointing the website at Vercel leaves its mail records alone.
- Until then the rules catch an old path typed on this domain.
- An old address answers from the function, not the CDN's routing table, which costs one function call per
  old link followed: few, and falling.

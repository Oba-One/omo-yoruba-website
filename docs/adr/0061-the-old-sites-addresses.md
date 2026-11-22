# The old site's addresses land on their successors

Accepted 21 November 2026. The owner confirmed the targets `docs/redirects.md` proposed on 9 October
("Yes, as proposed"; open-work D18).

## Decision

- **Every old address with a successor answers 301 to it.** 56 addresses, read from the old site's own
  sitemaps (its pages, the events index and its views, its events, posts, categories and tags), each to
  the page `docs/redirects.md` names. The map is `packages/web/src/lib/redirects.ts`; every target is a
  page this site serves.
- **Vercel's own routes answer them on Vercel, and the middleware everywhere else; not Astro's
  `redirects`.** The old site wrote every path with a trailing slash. Astro drops that slash from a
  redirect's path, and the Vercel adapter then matches the path exactly, so `/about-us/` would never have
  met its rule (the build also warned that the two spellings collide). A build step
  (`oy:old-site-addresses` in `astro.config.ts`) writes one route per address into Vercel's Build Output,
  ahead of the adapter's routes, matching with or without the slash and in any case, as WordPress did, for
  GET and HEAD. The middleware answers the same map, with the same matching, under `astro dev` and the
  Playwright server.
- **Amended 21 November 2026, after the first deploy.** The first version answered from the middleware
  alone, and production answered every old address with an empty 404: the adapter sends a path with no page
  to the function through a catch-all route that sets status 404, and Vercel applies that status over the
  function's 301. CI's Playwright jobs run Astro's own server, which has no such route, so they passed. The
  build step now fails the build if that catch-all is missing, since the routes' place depends on it. A
  redirect on a `vercel.app` host no longer carries `noindex`: a 301 has nothing to index, and the page it
  lands on carries the header.
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
- An old address answers from Vercel's routing table, with no function call.
- The Playwright specs prove the map and the middleware, not Vercel's routes; the unit tests check that the
  routes match exactly the paths the middleware matches, and a deploy is checked by asking the live site for
  an old address (runbook, The old site's addresses).

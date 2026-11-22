# Search and sharing: canonical links, link previews, the sitemap and the hosts search leaves out

Proposed 21 November 2026, for the owner's confirmation at the merge. The owner asked for the launch
work after the Pending notes: "share previews, sitemap, robots and canonical links", and keeping search
off the duplicate `vercel.app` address. Open-work D17 held what the sitemap lists, what each page shares
and a photo address's canonical link; ADR 0037 left the last to this record.

## Decision

- **One public origin.** `SITE_ORIGIN` in `@oy/content/routes` is `https://www.omoyorubasocal.org`, the
  host that serves the site: the bare name only redirects to it (open-work D2). Every page names its
  address there, whatever host answered. `PUBLIC_SITE_URL` still feeds Astro's `site` and nothing else,
  and in production it names the bare name (runbook), so the canonical links do not read it.
- **Canonical links.** Every page names its own path on that origin without a query, so a page asked
  with `?enquiry=` and a photo address (`?photo=`) name the page itself, and a photo address its album
  page. A page answering an error (the 404 page, a form's 400 re-render) names none.
- **Link previews.** Every page drawn in the site layout (all but the member guide, which is `noindex`)
  carries Open Graph tags (type, site name, title, description, address,
  image with its size and alt text) and `twitter:card` `summary_large_image`. The picture is the page's
  own photograph where it has one: the homepage's hero, the Odunde and Gala headers, an album's cover or
  else its first photograph. Each is cropped around its focus point to the 1200 by 630 shape, at 1200 wide
  or the photograph's own width when narrower, and served as a JPEG, since an app's crawler may not read
  WebP or AVIF. Every other page shares `public/share.jpg`, a copy of
  the homepage's hero photograph at that size, with the hero's alt text. A held gallery (ADR 0043) shares
  no album photograph. `seo.ogImage` stays hidden and unread: no member can set it yet.
- **The sitemap.** `/sitemap.xml` lists the eleven pages and the page of every album the gallery lists
  (a slug and a photograph), none while the gallery holds them. It never lists a photo address, `/admin`,
  `/api`, the 404 page or the member guide. It reads Sanity on each request and is never cached; a failed
  read answers 503 with `Retry-After`, so a crawler comes back.
- **robots.txt** keeps search off `/admin` and `/api/` and names the sitemap.
- **The hosts search leaves out.** Every `*.vercel.app` address (the project's, each deployment's) answers
  `X-Robots-Tag: noindex, nofollow`, as the preview host already did, and is never cached, so that header
  never rides a cached copy the public host could serve. The canonical links name the public host either
  way, which is what consolidates any copy a search engine already holds.

## Consequences

- A page's preview follows its photograph when the owner replaces it in the Studio. The default
  picture is a file: replacing the homepage's hero leaves it as it is, and a photograph withdrawn from
  the site must be removed from `public/share.jpg` too.
- The khaki host is slower, since nothing it answers is cached. The webhook it receives and the Studio
  it serves are unaffected.
- A merge of this record is a production deploy (`.agents/merge-policy.json`, critical tier).
- What is left of open-work D17 and E10: share images chosen per page by members (`seo.ogImage`), the
  redirects from the old site (D18), and the security headers and an enforced CSP (D13).

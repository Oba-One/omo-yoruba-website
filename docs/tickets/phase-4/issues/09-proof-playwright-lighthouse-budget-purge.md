# 09: Proof: Playwright, Lighthouse, the JS budget and publish-to-purge

Labels: infra
Status: resolved
Blocked by: 08

**What to build:** the homepage specs (blocks present, one h1, the doors open the modal, nothing open
on load, axe clean at 375 and 1440); Lighthouse against the Vercel preview with the budgets in
QUALITY section 3 or, if the preview is protected, the reason and a local measurement; the gzipped
client JavaScript of `/` measured against the 60 KB budget (wayfinder ticket 15); a publish in the
development dataset followed by a signed `/api/revalidate` call and the page updated.

- [x] Results recorded in the ticket comments and the handoff with the numbers
- [x] Wayfinder tickets 15, 20 and 21 resolved with the findings

## Comments

12 September 2026. Playwright: 54 pass and 6 skip by design across the two projects (the Phase 3
suite with the forms seam opened from the real doors, plus `home.spec.ts`: the blocks in the
prototype's order, one h1, nothing open on load, the first door gold and opening the modal, axe
clean at 375 and 1440). Every `vercel.app` host of the project, the production alias included,
sits behind Vercel Authentication (Deployment Protection "all except custom domains"), the share
link the Vercel tools mint still lands on the Vercel login, and the custom domain serves `main`,
so the Vercel preview could not be measured or purged from this session; the proofs ran on the
built output instead, served locally by a scratch server around the Vercel function
(`.vercel/output`), which is production-like for everything but the CDN.

Cache: the public homepage answers `Vercel-CDN-Cache-Control: public, max-age=86400,
stale-while-revalidate=604800` and `Vercel-Cache-Tag: type:siteSettings,type:homepage,type:event,
type:program,type:testimonial,type:newsPost,type:stat,type:door,astro-path:/`; with the
perspective cookie the same request carries neither header, the overlay island, stega in the
text and thirteen `data-sanity` attributes; `/admin`, `/api/preview/enable` (401), an unsigned
`/api/revalidate` (401), a HEAD and a POST carry no cache headers. Publish to purge: a patch of
`hero.sub` in `development` through the Editor token, a webhook body signed with the local
secret, `/api/revalidate` answering `{purged: true, paths: ["/"]}` for `homepage` and
`{purged: false}` with a note for `enquiry`, the page showing the new line on the next request,
and the patch reverted the same way. What the CDN does with the purge (STALE once, then HIT)
stays unproved until the custom domain serves Phase 4; the webhook (wayfinder ticket 25) needs
that domain too.

Lighthouse on the built output through Chrome DevTools (the `@lhci/cli` package waits for the
owner's yes; `packages/web/lighthouserc.cjs` holds the budgets): accessibility 100, SEO 100 and
best practices 96 at both presets, the four points lost to the report-only CSP's inline style
reports, which Phase 9 settles (ADR 0011); performance from the DevTools trace, mobile on Slow
4G with a 4x CPU slowdown, LCP 714 ms (472 ms of it the uncompressed local function's TTFB) and
CLS 0.00; desktop LCP 863 ms and CLS 0.02. On the way the audit found that a page importing the
`astro:actions` server module inherits the Studio's stylesheets (24 KB gzipped) and that the
`@oy/content` root and the layout defaults reached the schema and the `sanity` package; the
layout now reads the form outcome from locals and the paths from `action-paths.ts`, the layout
options and the API version live in plain modules, and the homepage loads one stylesheet.

JavaScript budget (wayfinder ticket 15): 15 KB gzipped on the homepage against 60 KB; PostHog
alone would add 89 KB after load when the key is set (Phase 9 decides).
